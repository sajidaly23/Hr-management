'use client'
import React, { useState, useEffect } from 'react'
import { useApp } from '../../../context/AppContext'
import type { Task } from '../../../context/AppContext'
import ActionPopup from '../../../components/ActionPopup'
import StatusBadge from '../../../components/StatusBadge'
import { getTasks, createTask, updateTask as updateTaskApi, deleteTask as deleteTaskApi } from '../../../utils/taskApi'

const TaskManagementPage = () => {
  const { tasks, employees, addTask, updateTask, deleteTask, currentUser } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all')
  const [localTasks, setLocalTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    dueDate: '',
    assignedTo: ''
  })

  // Get unique departments from employees
  const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean))).sort()

  // Filter employees based on selected department
  const filteredEmployees = selectedDepartment
    ? employees.filter(emp => emp.department === selectedDepartment)
    : employees

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const department = e.target.value
    setSelectedDepartment(department)
    
    // If department changes and current assigned employee is not in filtered list, reset assignedTo
    if (department && formData.assignedTo) {
      const currentEmployee = employees.find(emp => emp.email === formData.assignedTo)
      if (currentEmployee && currentEmployee.department !== department) {
        setFormData({
          ...formData,
          assignedTo: ''
        })
      }
    } else if (!department) {
      // If "All Departments" is selected, keep the current assignment
      // No need to reset
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (editingTask) {
        // Update existing task via API
        await updateTaskApi(editingTask.id, {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate,
          assignedTo: formData.assignedTo
        })
        // Also update in context for immediate UI update
        updateTask(editingTask.id, {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate,
          assignedTo: formData.assignedTo
        })
      } else {
        // Create new task via API (always starts as 'pending')
        const newTask = await createTask({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate,
          assignedTo: formData.assignedTo,
          createdBy: currentUser?.email
        })
        // Also add to context for immediate UI update
        addTask({
          ...newTask,
          status: 'pending'
        })
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        assignedTo: ''
      })
      setSelectedDepartment('')
      setShowForm(false)
      setEditingTask(null)
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to save task'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    const assignedEmployee = employees.find(emp => emp.email === task.assignedTo)
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo || ''
    })
    // Set department filter to the assigned employee's department if exists
    if (assignedEmployee?.department) {
      setSelectedDepartment(assignedEmployee.department)
    } else {
      setSelectedDepartment('')
    }
    setShowForm(true)
  }

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskApi(taskId)
        // Also delete from context
        deleteTask(taskId)
      } catch (error: any) {
        alert(`Error: ${error.message || 'Failed to delete task'}`)
      }
    }
  }

  // Real-time polling for tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await getTasks()
        setLocalTasks(fetchedTasks)
        // Also update context for backward compatibility
        fetchedTasks.forEach((task: Task) => {
          const existingTask = tasks.find(t => t.id === task.id)
          if (!existingTask || JSON.stringify(existingTask) !== JSON.stringify(task)) {
            // Task changed, update context
            if (existingTask) {
              updateTask(task.id, task)
            } else {
              addTask(task)
            }
          }
        })
      } catch (error) {
        console.error('Error loading tasks:', error)
        // Fallback to context tasks
        setLocalTasks(tasks)
      }
    }

    // Load immediately
    loadTasks()
    
    // Poll every 3 seconds for real-time updates
    const interval = setInterval(loadTasks, 3000)
    
    return () => clearInterval(interval)
  }, [tasks, addTask, updateTask])

  // Use localTasks if available, otherwise fall back to context tasks
  const allTasks = localTasks.length > 0 ? localTasks : tasks

  const filteredTasks = filter === 'all' 
    ? allTasks 
    : allTasks.filter(t => t.status === filter)

  const getAssignedEmployeeName = (email: string) => {
    const employee = employees.find(e => e.email === email)
    return employee ? employee.name : email
  }

  // Calculate stats dynamically
  const stats = {
    total: allTasks.length,
    pending: allTasks.filter(t => t.status === 'pending').length,
    in_progress: allTasks.filter(t => t.status === 'in_progress').length,
    completed: allTasks.filter(t => t.status === 'completed').length
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Task Management</h1>
          <p className="text-white/70">Assign and manage tasks for employees</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingTask(null)
            if (!showForm) {
              setFormData({
                title: '',
                description: '',
                priority: 'Medium',
                dueDate: '',
                assignedTo: ''
              })
              setSelectedDepartment('')
            }
          }}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium flex items-center space-x-2"
        >
          <span>➕</span>
          <span>{showForm ? 'Cancel' : 'Assign New Task'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏱</span>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-blue-400">{stats.in_progress}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔄</span>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Assignment Form */}
      {showForm && (
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingTask ? 'Edit Task' : 'Assign New Task'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Task Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                placeholder="Enter task description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Department</label>
                <select
                  name="department"
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none appearance-none pr-10"
                >
                  <option value="" className="bg-slate-900">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Assign To *</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none appearance-none pr-10"
                >
                  <option value="" className="bg-slate-900">
                    {selectedDepartment ? `Select Employee from ${selectedDepartment}` : 'Select Employee'}
                  </option>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                    <option key={emp.id} value={emp.email} className="bg-slate-900">
                      {emp.name} ({emp.email})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled className="bg-slate-900">
                      No employees in selected department
                    </option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-white mb-2">Priority *</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none appearance-none pr-10"
                >
                  <option value="Low" className="bg-slate-900">Low</option>
                  <option value="Medium" className="bg-slate-900">Medium</option>
                  <option value="High" className="bg-slate-900">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : editingTask ? 'Update Task' : 'Assign Task'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingTask(null)
                  setFormData({
                    title: '',
                    description: '',
                    priority: 'Medium',
                    dueDate: '',
                    assignedTo: ''
                  })
                  setSelectedDepartment('')
                }}
                className="px-6 py-3 glass-effect border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
            filter === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white'
              : 'glass-effect text-white border border-white/10 hover:bg-white/10'
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
            filter === 'pending'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white'
              : 'glass-effect text-white border border-white/10 hover:bg-white/10'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
            filter === 'in_progress'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white'
              : 'glass-effect text-white border border-white/10 hover:bg-white/10'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
            filter === 'completed'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white'
              : 'glass-effect text-white border border-white/10 hover:bg-white/10'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Tasks List */}
      <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {filter === 'all' ? 'All Tasks' : 
             filter === 'pending' ? 'Pending Tasks' : 
             filter === 'in_progress' ? 'In Progress Tasks' : 
             'Completed Tasks'}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-white/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
        </div>
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="glass-effect rounded-xl p-4 border border-white/10 hover:border-purple-400/70 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        task.status === 'completed' 
                          ? 'bg-gradient-to-br from-green-500 to-green-600' 
                          : task.status === 'in_progress'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                      }`}>
                        {task.status === 'completed' ? (
                          <span className="text-white text-lg">✓</span>
                        ) : task.status === 'in_progress' ? (
                          <span className="text-white text-lg">🔄</span>
                        ) : (
                          <span className="text-white text-lg">⏱</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-white/70 mt-1">{task.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-3 ml-12">
                      <span className="text-sm text-white/70">
                        <span className="font-medium">Assigned to:</span> {task.assignedTo ? getAssignedEmployeeName(task.assignedTo) : 'Unassigned'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'High' ? 'bg-red-500/20 text-red-300' :
                        task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-200' :
                        'bg-purple-500/20 text-purple-200'
                      }`}>
                        {task.priority} Priority
                      </span>
                      <span className="text-xs text-white/70 flex items-center space-x-1">
                        <span>📅</span>
                        <span>Due: {task.dueDate}</span>
                      </span>
                      <StatusBadge status={task.status} size="sm" />
                    </div>
                  </div>
                  <div className="relative inline-block ml-4">
                    <button
                      onClick={() => setShowMenu(showMenu === task.id ? null : task.id)}
                      className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    <ActionPopup
                      isOpen={showMenu === task.id}
                      onClose={() => setShowMenu(null)}
                      onEdit={() => handleEdit(task)}
                      onDelete={() => handleDelete(task.id)}
                      position="right"
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-white/70 text-lg">No {filter === 'all' ? '' : filter} tasks found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskManagementPage

