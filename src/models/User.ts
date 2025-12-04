import mongoose, { Schema, Document, Model } from 'mongoose'

export type UserRole = 'super_admin' | 'admin' | 'employee'

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  toSafeObject: () => {
    id: string
    name: string
    email: string
    role: UserRole
    isActive: boolean
  }
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'employee'],
      default: 'employee'
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

UserSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    isActive: this.isActive
  }
}

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema)


