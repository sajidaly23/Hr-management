import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../../../lib/db'
import { Task } from '../../../../models/Task'

/**
 * POST /api/tasks/update-status
 * Update task status
 * Body: { task_id, employee_id (email), new_status }
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { task_id, employee_id, new_status } = body

    // Validation
    if (!task_id || !employee_id || !new_status) {
      return NextResponse.json(
        { success: false, message: 'task_id, employee_id, and new_status are required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed']
    if (!validStatuses.includes(new_status)) {
      return NextResponse.json(
        { success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Find task
    const task = await Task.findById(task_id)
    if (!task) {
      return NextResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      )
    }

    // Verify employee is assigned to this task
    if (task.assignedTo !== employee_id) {
      return NextResponse.json(
        { success: false, message: 'You are not assigned to this task' },
        { status: 403 }
      )
    }

    // Update status
    task.status = new_status
    await task.save()

    return NextResponse.json({
      success: true,
      data: task.toSafeObject(),
      message: 'Task status updated successfully'
    })
  } catch (err: any) {
    console.error('Error updating task status:', err)
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to update task status' },
      { status: 500 }
    )
  }
}

