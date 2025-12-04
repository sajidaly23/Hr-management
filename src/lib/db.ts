import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_management'

// Check if using placeholder URI
if (MONGODB_URI.includes('username:password') || MONGODB_URI.includes('cluster0.xxxxx')) {
  console.error('⚠️  ERROR: MongoDB URI is still using placeholder values!')
  console.error('Please update .env.local with your actual MongoDB Atlas connection string.')
  console.error('See MONGODB_SETUP.md for instructions.')
}

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local')
}

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => mongooseInstance)
  }

  cached.conn = await cached.promise
  return cached.conn
}


