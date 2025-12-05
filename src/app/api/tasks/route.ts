import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../lib/db'
import { Task } from '../../../models/Task'

/**
 * GET /api/tasks
 * Get all tasks (with optional filtering)
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(req.url)
    const assignedTo = searchParams.get('assignedTo')
    const status = searchParams.get('status')
    
    // Build query
    const query: any = {}
    if (assignedTo) {
      query.assignedTo = assignedTo
    }
    if (status) {
      query.status = status
    }
    
    const tasks = await Task.find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: tasks.map(task => task.toSafeObject())
    })
  } catch (err: any) {
    console.error('Error fetching tasks:', err)
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tasks
 * Create a new task
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { title, description, priority, dueDate, assignedTo, project, createdBy } = body

    // Validation
    if (!title || !dueDate || !assignedTo) {
      return NextResponse.json(
        { success: false, message: 'Title, due date, and assignedTo are required' },
        { status: 400 }
      )
    }

    // Create task with status 'pending' by default
    const task = new Task({
      title,
      description,
      status: 'pending', // Always start as pending
      priority: priority || 'Medium',
      dueDate,
      assignedTo,
      project,
      createdBy
    })

    await task.save()

    return NextResponse.json({
      success: true,
      data: task.toSafeObject()
    }, { status: 201 })
  } catch (err: any) {
    console.error('Error creating task:', err)
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to create task' },
      { status: 500 }
    )
  }
}

