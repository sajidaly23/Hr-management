'use client'
import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useApp } from '../../../../context/AppContext'

interface Department {
  id: string
  name: string
  departmentHead: string
  employees: number
  budget: string
  color: string
}

const DepartmentDetailsPage = () => {
  const router = useRouter()
  const params = useParams()
  const { employees, tasks } = useApp()

  const departmentId = params.id as string

  const departments: Department[] = [
    {
      id: '1',
      name: 'UIUX DESGINER',
      departmentHead: 'Sarah Johnson',
      employees: 85,
      budget: '$2.4M',
      color: 'blue'
    },
    {
      id: '2',
      name: 'Product',
      departmentHead: 'Michael Chen',
      employees: 32,
      budget: '$1.2M',
      color: 'purple'
    },
    {
      id: '3',
      name: 'Marketing',
      departmentHead: 'Emily Davis',
      employees: 45,
      budget: '$1.8M',
      color: 'pink'
    },
    {
      id: '4',
      name: 'BOOK KEEPING',
      departmentHead: 'James Wilson',
      employees: 52,
      budget: '$1.5M',
      color: 'green'
    },
    {
      id: '5',
      name: 'HR',
      departmentHead: 'Lisa Anderson',
      employees: 18,
      budget: '$800K',
      color: 'orange'
    },
    {
      id: '6',
      name: 'GRAPHIC Design',
      departmentHead: 'David Brown',
      employees: 16,
      budget: '$600K',
      color: 'indigo'
    },
    {
      id: '7',
      name: 'Web Developer',
      departmentHead: 'Alex Martinez',
      employees: 28,
      budget: '$1.0M',
      color: 'blue'
    },
    {
      id: '8',
      name: 'UI/UX Designer',
      departmentHead: 'Sophia Lee',
      employees: 22,
      budget: '$950K',
      color: 'purple'
    },
    {
      id: '9',
      name: 'Finance',
      departmentHead: 'Robert Taylor',
      employees: 15,
      budget: '$700K',
      color: 'green'
    }
  ]

  const department = departments.find((d) => d.id === departmentId)

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; progress: string } } = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-400', progress: 'bg-blue-500' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-400', progress: 'bg-purple-500' },
      pink: { bg: 'bg-pink-500', text: 'text-pink-400', progress: 'bg-pink-500' },
      green: { bg: 'bg-green-500', text: 'text-green-400', progress: 'bg-green-500' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-400', progress: 'bg-orange-500' },
      indigo: { bg: 'bg-indigo-500', text: 'text-indigo-400', progress: 'bg-indigo-500' }
    }
    return colors[color] || colors.blue
  }

  if (!department) {
    return (
      <div className="space-y-6">
        <div className="glass-effect rounded-2xl p-8 card-shadow border border-white/10 text-center">
          <p className="text-white/70 text-lg mb-4">Department not found.</p>
          <button
            onClick={() => router.push('/addmin/departments')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
          >
            Back to Departments
          </button>
        </div>
      </div>
    )
  }

  const colorClasses = getColorClasses(department.color)

  const departmentEmployees = employees.filter((e) => e.department === department.name)

  const departmentTasks = tasks.filter((t) => {
    const emp = employees.find((e) => e.email === t.assignedTo)
    return emp?.department === department.name
  })

  const taskStats = {
    total: departmentTasks.length,
    completed: departmentTasks.filter((t) => t.status === 'completed').length,
    pending: departmentTasks.filter((t) => t.status === 'pending').length
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/addmin/departments')}
            className="mb-3 inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Departments</span>
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">{department.name}</h1>
          <p className="text-white/70">Detailed overview of this department and its team.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <p className="text-sm text-white/60 mb-1">Department Head</p>
          <p className="text-xl font-semibold text-white">{department.departmentHead}</p>
        </div>
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <p className="text-sm text-white/60 mb-1">Employees</p>
          <p className="text-3xl font-bold text-white">{departmentEmployees.length}</p>
        </div>
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <p className="text-sm text-white/60 mb-1">Budget</p>
          <p className="text-2xl font-bold text-white">{department.budget}</p>
        </div>
      </div>

      {/* Employees List */}
      <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Employees ({departmentEmployees.length})</h2>
        {departmentEmployees.length === 0 ? (
          <p className="text-white/60">There are no employees assigned to this department yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentEmployees.map((emp) => (
              <div
                key={emp.id}
                className="glass-effect rounded-xl p-4 border border-white/10 hover:border-purple-400/60 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(emp.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{emp.name}</p>
                    <p className="text-xs text-white/60 truncate">{emp.position || 'Employee'}</p>
                    <p className="text-xs text-white/50 truncate">{emp.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tasks List */}
      <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Department Tasks</h2>
            <p className="text-white/60 text-sm">Tasks associated with employees in this department.</p>
          </div>
          <div className="flex space-x-4 text-sm text-white/60">
            <span>Total: {taskStats.total}</span>
            <span>Pending: {taskStats.pending}</span>
            <span>Completed: {taskStats.completed}</span>
          </div>
        </div>
        {departmentTasks.length === 0 ? (
          <p className="text-white/60">No tasks found for this department.</p>
        ) : (
          <div className="space-y-3">
            {departmentTasks.map((task) => {
              const emp = employees.find((e) => e.email === task.assignedTo)
              return (
                <div
                  key={task.id}
                  className="glass-effect rounded-xl p-4 border border-white/10 hover:border-purple-400/60 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-white">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-white/70 mt-1">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/60">
                        <span>Assigned to: {emp?.name || task.assignedTo}</span>
                        <span
                          className={`px-2 py-1 rounded-full ${
                            task.priority === 'High'
                              ? 'bg-red-500/20 text-red-300'
                              : task.priority === 'Medium'
                              ? 'bg-yellow-500/20 text-yellow-200'
                              : 'bg-purple-500/20 text-purple-200'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full ${
                            task.status === 'completed'
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-orange-500/20 text-orange-300'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DepartmentDetailsPage


