'use client'
import React, { useState, useEffect } from 'react'
import TaskCard from '../../../../src/components/taskcard'
import { useApp } from '../../../../src/context/AppContext'
import type { Task } from '../../../../src/context/AppContext'
import RouteProtection from '../../../../src/components/RouteProtection'

const MyTasks = () => {
  const { tasks, updateTask, currentUser } = useApp()
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [localTasks, setLocalTasks] = useState<Task[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Load tasks from localStorage in real-time
  useEffect(() => {
    const loadTasks = () => {
      const savedTasks = localStorage.getItem('hr_tasks')
      if (savedTasks) {
        try {
          const parsedTasks: Task[] = JSON.parse(savedTasks)
          setLocalTasks(parsedTasks)
          setLastUpdate(new Date())
        } catch (e) {
          console.error('Error parsing tasks:', e)
        }
      } else if (tasks.length > 0) {
        // Fallback to context tasks if localStorage is empty
        setLocalTasks(tasks)
      }
    }

    // Load immediately
    loadTasks()
    
    // Refresh every 2 seconds for real-time updates
    const interval = setInterval(loadTasks, 2000)
    
    return () => clearInterval(interval)
  }, [tasks])

  // Use localTasks if available, otherwise fall back to context tasks
  const allTasks = localTasks.length > 0 ? localTasks : tasks

  // Get tasks assigned to current user (tasks assigned by admin)
  const myTasks = currentUser 
    ? allTasks.filter(t => t.assignedTo === currentUser.email)
    : []

  // Sort tasks: pending first, then by due date
  const sortedMyTasks = [...myTasks].sort((a, b) => {
    if (a.status === 'pending' && b.status === 'completed') return -1
    if (a.status === 'completed' && b.status === 'pending') return 1
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    return 0
  })

  const markCompleted = (taskId: string) => {
    // Update in context
    updateTask(taskId, { status: 'completed' })
    
    // Also update in localStorage for real-time sync
    const updatedTasks = allTasks.map(task => 
      task.id === taskId ? { ...task, status: 'completed' as const } : task
    )
    localStorage.setItem('hr_tasks', JSON.stringify(updatedTasks))
    setLocalTasks(updatedTasks)
  }

  // Get all unique projects from tasks
  const allProjects = Array.from(new Set(sortedMyTasks.map(t => t.project || 'No Project').filter(Boolean)))
  
  // Filter tasks by status
  const statusFilteredTasks = filter === 'all' 
    ? sortedMyTasks 
    : sortedMyTasks.filter(t => t.status === filter)
  
  // Filter tasks by project
  const filteredTasks = projectFilter === 'all'
    ? statusFilteredTasks
    : statusFilteredTasks.filter(t => (t.project || 'No Project') === projectFilter)

  // Group tasks by project
  const tasksByProject = filteredTasks.reduce((acc, task) => {
    const project = task.project || 'No Project'
    if (!acc[project]) {
      acc[project] = []
    }
    acc[project].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  // Calculate project statistics
  const projectStats = allProjects.map(project => {
    const projectTasks = sortedMyTasks.filter(t => (t.project || 'No Project') === project)
    return {
      name: project,
      total: projectTasks.length,
      completed: projectTasks.filter(t => t.status === 'completed').length,
      pending: projectTasks.filter(t => t.status === 'pending').length,
      progress: projectTasks.length > 0 
        ? Math.round((projectTasks.filter(t => t.status === 'completed').length / projectTasks.length) * 100)
        : 0
    }
  })

  const stats = {
    total: sortedMyTasks.length,
    completed: sortedMyTasks.filter(t => t.status === 'completed').length,
    pending: sortedMyTasks.filter(t => t.status === 'pending').length,
    projects: allProjects.length
  }

  return (
    <RouteProtection allowedRoles={['employee', 'Employee']}>
      <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Tasks</h1>
            <p className="text-white/70">Tasks assigned by admin • Updates in real-time</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-white/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <p className="text-sm text-white/70 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Pending</p>
              <p className="text-3xl font-bold text-orange-400">{stats.pending}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏱</span>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Projects</p>
              <p className="text-3xl font-bold text-blue-400">{stats.projects}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Statistics */}
      {projectStats.length > 0 && (
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Project Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectStats.map((project) => (
              <div key={project.name} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white flex items-center space-x-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>{project.name}</span>
                  </h3>
                  <span className="text-xs text-white/60">{project.progress}%</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Total</span>
                    <span className="text-white font-medium">{project.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400">Completed</span>
                    <span className="text-green-400 font-medium">{project.completed}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-orange-400">Pending</span>
                    <span className="text-orange-400 font-medium">{project.pending}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                : 'glass-effect text-white border border-white/10 hover:bg-white/10'
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
              filter === 'pending'
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                : 'glass-effect text-white border border-white/10 hover:bg-white/10'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                : 'glass-effect text-white border border-white/10 hover:bg-white/10'
            }`}
          >
            Completed
          </button>
        </div>
        
        {/* Project Filter */}
        {allProjects.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-white/70 font-medium">Filter by Project:</span>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-4 py-2 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none appearance-none pr-10"
            >
              <option value="all" className="bg-slate-900">All Projects</option>
              {allProjects.map((project) => (
                <option key={project} value={project} className="bg-slate-900">
                  {project}
                </option>
              ))}
            </select>
            {projectFilter !== 'all' && (
              <button
                onClick={() => setProjectFilter('all')}
                className="px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tasks List - Grouped by Project */}
      <div className="space-y-6">
        {Object.keys(tasksByProject).length > 0 ? (
          Object.entries(tasksByProject).map(([projectName, projectTasks]) => (
            <div key={projectName} className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{projectName}</h2>
                    <p className="text-sm text-white/60">
                      {projectTasks.length} task{projectTasks.length !== 1 ? 's' : ''} • {projectTasks.filter(t => t.status === 'completed').length} completed
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {projectTasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-200 group backdrop-blur-sm">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          t.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {t.status === 'completed' ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{t.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {t.status === 'pending' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                Pending
                              </span>
                            )}
                            {t.status === 'completed' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {t.description && (
                        <p className="text-sm text-slate-300 mt-3 ml-16">{t.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-3 ml-16">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                          t.priority === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          t.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                          'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {t.priority} Priority
                        </span>
                        <span className="text-xs text-slate-400 flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Due: {t.dueDate}</span>
                        </span>
                      </div>
                    </div>
                    {t.status === 'pending' && (
                      <button
                        onClick={() => markCompleted(t.id)}
                        className="ml-4 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all duration-200 font-medium flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Complete</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-white/60 text-lg">No {filter === 'all' ? '' : filter} tasks {projectFilter !== 'all' ? `in ${projectFilter}` : ''} assigned yet</p>
              <p className="text-white/50 text-sm mt-2">Tasks assigned by admin will appear here automatically</p>
            </div>
          </div>
        )}
      </div>
      </div>
    </RouteProtection>
  )
}

export default MyTasks

