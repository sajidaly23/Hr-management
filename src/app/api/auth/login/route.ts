import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'
import { connectDB } from '../../../../lib/db'
import { User } from '../../../../models/User'

export const runtime = 'nodejs'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

function signToken(user: { id: string; email: string; role: string }): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions)
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { email, password } = body || {}

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account is deactivated' },
        { status: 403 }
      )
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role })

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: user.toSafeObject()
      }
    })
  } catch (err: any) {
    console.error('Login error', err)
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error'
    
    if (err.name === 'MongooseServerSelectionError' || err.message?.includes('ECONNREFUSED')) {
      errorMessage = 'Database connection failed. Please check your MongoDB configuration in .env.local'
      console.error('MongoDB connection error - is MongoDB running or is MONGODB_URI correct?')
    } else if (err.message) {
      errorMessage = err.message
    }
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
}


