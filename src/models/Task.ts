import mongoose, { Schema, Document, Model } from 'mongoose'

export type TaskStatus = 'pending' | 'in_progress' | 'completed'
export type TaskPriority = 'High' | 'Medium' | 'Low'

export interface ITask extends Document {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  assignedTo: string // User email
  project?: string
  createdBy?: string // User email who created the task
  createdAt: Date
  updatedAt: Date
  toSafeObject: () => {
    id: string
    title: string
    description?: string
    status: TaskStatus
    priority: TaskPriority
    dueDate: string
    assignedTo: string
    project?: string
    createdBy?: string
    createdAt: Date
    updatedAt: Date
  }
}

const TaskSchema: Schema<ITask> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    dueDate: { type: String, required: true },
    assignedTo: { type: String, required: true }, // User email
    project: { type: String, trim: true },
    createdBy: { type: String } // User email who created the task
  },
  { timestamps: true }
)

TaskSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    title: this.title,
    description: this.description,
    status: this.status,
    priority: this.priority,
    dueDate: this.dueDate,
    assignedTo: this.assignedTo,
    project: this.project,
    createdBy: this.createdBy,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}

export const Task: Model<ITask> =
  (mongoose.models.Task as Model<ITask>) || mongoose.model<ITask>('Task', TaskSchema)

