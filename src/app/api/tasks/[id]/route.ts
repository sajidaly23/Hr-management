import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../../lib/db'
import { Task } from '../../../../models/Task'

/**
 * PUT /api/tasks/[id]
 * Update a task
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const body = await req.json()
    const { id } = await params

    const task = await Task.findById(id)
    if (!task) {
      return NextResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      )
    }

    // Update allowed fields
    if (body.title) task.title = body.title
    if (body.description !== undefined) task.description = body.description
    if (body.priority) task.priority = body.priority
    if (body.dueDate) task.dueDate = body.dueDate
    if (body.assignedTo) task.assignedTo = body.assignedTo
    if (body.project !== undefined) task.project = body.project
    // Note: status should be updated via /api/tasks/update-status endpoint

    await task.save()

    return NextResponse.json({
      success: true,
      data: task.toSafeObject()
    })
  } catch (err: any) {
    console.error('Error updating task:', err)
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to update task' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/tasks/[id]
 * Delete a task
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    const task = await Task.findByIdAndDelete(id)
    if (!task) {
      return NextResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    })
  } catch (err: any) {
    console.error('Error deleting task:', err)
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to delete task' },
      { status: 500 }
    )
  }
}

