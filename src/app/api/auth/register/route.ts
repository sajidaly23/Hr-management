import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt, { SignOptions } from 'jsonwebtoken'
import { connectDB } from '../../../../lib/db'
import { User, UserRole } from '../../../../models/User'

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
    const { name, email, password, role } = body || {}

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Decide role
    let userRole: UserRole = 'employee'
    if (role === 'super_admin') {
      const existingSuperAdmin = await User.findOne({ role: 'super_admin' })
      if (!existingSuperAdmin) {
        userRole = 'super_admin'
      }
    } else if (role === 'admin' || role === 'employee') {
      userRole = role
    }

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: userRole
    })

    const token = signToken({ id: user.id, email: user.email, role: user.role })

    return NextResponse.json(
      {
        success: true,
        data: {
          token,
          user: user.toSafeObject()
        }
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('Register error', err)
    
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


