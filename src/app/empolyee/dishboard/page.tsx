'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../../context/AppContext'
import RouteProtection from '../../../components/RouteProtection'

interface AttendanceRecord {
  id: string
  employeeId: string
  employeeEmail: string
  employeeName: string
  date: string
  checkIn: string | null
  checkOut: string | null
  status: 'present' | 'absent' | 'late'
  workingHours: number | null
}

const EmployeeDashboard = () => {
  const router = useRouter()
  const { tasks, currentUser, employees } = useApp()
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [todayAttendance, setTodayAttendance] = useState<{ checkIn: string | null; checkOut: string | null }>({
    checkIn: null,
    checkOut: null
  })
  
  // Load attendance from localStorage
  useEffect(() => {
    const savedAttendance = localStorage.getItem('hr_attendance')
    if (savedAttendance) {
      setAttendanceRecords(JSON.parse(savedAttendance))
    }
  }, [])

  // Get today's attendance for current user
  useEffect(() => {
    if (currentUser) {
      const today = new Date().toISOString().split('T')[0]
      const todayRecord = attendanceRecords.find(
        record => record.employeeEmail === currentUser.email && record.date === today
      )
      if (todayRecord) {
        setTodayAttendance({
          checkIn: todayRecord.checkIn,
          checkOut: todayRecord.checkOut
        })
      } else {
        setTodayAttendance({ checkIn: null, checkOut: null })
      }
    }
  }, [attendanceRecords, currentUser])
  
  // Get current employee data
  const currentEmployee = currentUser 
    ? employees.find(e => e.email === currentUser.email)
    : null
  
  const myTasks = currentUser 
    ? tasks.filter(t => t.assignedTo === currentUser.email)
    : []
  
  // Get current month attendance stats
  const currentMonth = new Date().toISOString().slice(0, 7)
  const myAttendanceRecords = attendanceRecords.filter(record => {
    if (record.employeeEmail !== currentUser?.email) return false
    return record.date.startsWith(currentMonth)
  })

  const stats = {
    totalTasks: myTasks.length,
    completedTasks: myTasks.filter(t => t.status === 'completed').length,
    pendingTasks: myTasks.filter(t => t.status === 'pending').length,
    performance: myTasks.length > 0 
      ? Math.round((myTasks.filter(t => t.status === 'completed').length / myTasks.length) * 100)
      : 0,
    presentDays: myAttendanceRecords.filter(r => r.status === 'present').length,
    lateDays: myAttendanceRecords.filter(r => r.status === 'late').length,
    totalWorkingHours: myAttendanceRecords.reduce((sum, r) => sum + (r.workingHours || 0), 0)
  }

  return (
    <RouteProtection allowedRoles={['employee', 'Employee']}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {currentEmployee?.name || currentUser?.email?.split('@')[0] || 'Employee'}!
        </h1>
        <p className="text-white/70">
          {currentEmployee?.department && currentEmployee?.position 
            ? `${currentEmployee.position} • ${currentEmployee.department}`
            : "Here's your overview"}
        </p>
      </div>

      {/* Employee Info Card */}
      {currentEmployee && (
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {currentEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{currentEmployee.name}</h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-white/70">
                  <span>{currentEmployee.position || 'Employee'}</span>
                  <span>•</span>
                  <span>{currentEmployee.department || 'N/A'}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    currentEmployee.status === 'Active' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {currentEmployee.status}
                  </span>
                </div>
                <p className="text-sm text-white/60 mt-1">{currentEmployee.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">Employee ID</p>
              <p className="text-lg font-semibold text-white">{currentEmployee.id}</p>
              {currentEmployee.joinDate && (
                <>
                  <p className="text-sm text-white/70 mt-2">Join Date</p>
                  <p className="text-sm font-medium text-white">
                    {new Date(currentEmployee.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Today's Attendance Status */}
      <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Today's Attendance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 glass-effect border border-white/10 rounded-xl">
            <div>
              <p className="text-sm text-white/70 mb-1">Check In</p>
              <p className="text-2xl font-bold text-white">{todayAttendance.checkIn || 'Not checked in'}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              todayAttendance.checkIn ? 'bg-green-500/20' : 'bg-gray-500/20'
            }`}>
              <span className="text-2xl">{todayAttendance.checkIn ? '✓' : '○'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 glass-effect border border-white/10 rounded-xl">
            <div>
              <p className="text-sm text-white/70 mb-1">Check Out</p>
              <p className="text-2xl font-bold text-white">{todayAttendance.checkOut || 'Not checked out'}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              todayAttendance.checkOut ? 'bg-red-500/20' : 'bg-gray-500/20'
            }`}>
              <span className="text-2xl">{todayAttendance.checkOut ? '✓' : '○'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-white">{stats.totalTasks}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Completed Tasks</p>
              <p className="text-3xl font-bold text-green-400">{stats.completedTasks}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Present Days</p>
              <p className="text-3xl font-bold text-blue-400">{stats.presentDays}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Working Hours</p>
              <p className="text-3xl font-bold text-purple-400">{stats.totalWorkingHours.toFixed(1)}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏱</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/empolyee/taskpage')}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-left flex items-center space-x-3"
            >
              <span>📋</span>
              <span>View My Tasks</span>
            </button>
            <button 
              onClick={() => router.push('/empolyee/attendance')}
              className="w-full px-4 py-3 glass-effect border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all duration-200 text-left flex items-center space-x-3"
            >
              <span>⏰</span>
              <span>Check In/Out</span>
            </button>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Tasks</h2>
          <div className="space-y-4">
            {myTasks.slice(0, 3).length > 0 ? (
              myTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-3 glass-effect border border-white/10 rounded-xl">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    task.status === 'completed' 
                      ? 'bg-green-500/30 text-green-300' 
                      : 'bg-orange-500/30 text-orange-300'
                  }`}>
                    <span>{task.status === 'completed' ? '✓' : '📋'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{task.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'High' 
                          ? 'bg-red-500/20 text-red-300' 
                          : task.priority === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-white/60">Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/60 text-center py-4">No tasks assigned yet</p>
            )}
          </div>
        </div>
      </div>
      </div>
    </RouteProtection>
  )
}

export default EmployeeDashboard

