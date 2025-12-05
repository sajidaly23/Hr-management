/**
 * Task API utility functions
 * Handles all API calls related to tasks
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export interface TaskUpdateStatusRequest {
  task_id: string
  employee_id: string
  new_status: 'pending' | 'in_progress' | 'completed'
}

export interface CreateTaskRequest {
  title: string
  description?: string
  priority: 'High' | 'Medium' | 'Low'
  dueDate: string
  assignedTo: string
  project?: string
  createdBy?: string
}

/**
 * Get all tasks
 */
export async function getTasks(assignedTo?: string, status?: string) {
  const params = new URLSearchParams()
  if (assignedTo) params.append('assignedTo', assignedTo)
  if (status) params.append('status', status)

  const response = await fetch(`${API_URL}/tasks?${params.toString()}`)
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch tasks')
  }
  
  return data.data
}

/**
 * Create a new task
 */
export async function createTask(taskData: CreateTaskRequest) {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify(taskData)
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create task')
  }
  
  return data.data
}

/**
 * Update task status
 */
export async function updateTaskStatus(request: TaskUpdateStatusRequest) {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${API_URL}/tasks/update-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify(request)
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update task status')
  }
  
  return data.data
}

/**
 * Update a task
 */
export async function updateTask(taskId: string, taskData: Partial<CreateTaskRequest>) {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify(taskData)
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update task')
  }
  
  return data.data
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string) {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete task')
  }
  
  return data
}

