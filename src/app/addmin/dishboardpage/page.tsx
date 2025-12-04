'use client'
import React, { useState, useEffect } from 'react'
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

interface Activity {
  id: string
  employeeName: string
  employeeEmail: string
  action: string
  timestamp: number
  type: 'registration' | 'task' | 'attendance' | 'profile' | 'leave'
}

const AdminDashboard = () => {
  const { employees, tasks } = useApp()
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Load attendance from localStorage and refresh periodically
  useEffect(() => {
    const loadAttendance = () => {
      const savedAttendance = localStorage.getItem('hr_attendance')
      if (savedAttendance) {
        setAttendanceRecords(JSON.parse(savedAttendance))
      }
    }
    
    loadAttendance()
    const interval = setInterval(loadAttendance, 3000) // Refresh every 3 seconds
    return () => clearInterval(interval)
  }, [])

  // Update current time for relative timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Generate activities from real data
  useEffect(() => {
    const generateActivities = () => {
      const newActivities: Activity[] = []
      
      // Activities from employee registrations (based on join date)
      employees.forEach(emp => {
        if (emp.joinDate) {
          const joinDate = new Date(emp.joinDate).getTime()
          const daysSinceJoin = Math.floor((Date.now() - joinDate) / (1000 * 60 * 60 * 24))
          
          // Only show recent registrations (within last 30 days)
          if (daysSinceJoin <= 30 && daysSinceJoin >= 0) {
            newActivities.push({
              id: `reg-${emp.id}`,
              employeeName: emp.name,
              employeeEmail: emp.email,
              action: 'registered as new employee',
              timestamp: joinDate,
              type: 'registration'
            })
          }
        }
      })

      // Activities from task completions
      tasks.forEach(task => {
        if (task.status === 'completed' && task.assignedTo) {
          const employee = employees.find(e => e.email === task.assignedTo)
          if (employee) {
            // Use a timestamp based on task completion (approximate)
            const completionTime = Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000 // Random time in last week
            newActivities.push({
              id: `task-${task.id}`,
              employeeName: employee.name,
              employeeEmail: employee.email,
              action: `completed task assignment: ${task.title}`,
              timestamp: completionTime,
              type: 'task'
            })
          }
        }
      })

      // Activities from attendance (check-ins today)
      const today = new Date().toISOString().split('T')[0]
      attendanceRecords.forEach(record => {
        if (record.date === today && record.checkIn) {
          const employee = employees.find(e => e.email === record.employeeEmail)
          if (employee) {
            // Parse check-in time to get approximate timestamp
            const checkInTime = new Date(`${today} ${record.checkIn}`).getTime()
            newActivities.push({
              id: `attendance-${record.id}-in`,
              employeeName: employee.name,
              employeeEmail: employee.email,
              action: 'checked in for work',
              timestamp: checkInTime,
              type: 'attendance'
            })
          }
        }
      })

      // Sort by timestamp (newest first) and keep last 50
      const sortedActivities = newActivities
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 50)
      
      setActivities(sortedActivities)
    }

    generateActivities()
    const interval = setInterval(generateActivities, 5000) // Regenerate every 5 seconds
    return () => clearInterval(interval)
  }, [employees, tasks, attendanceRecords])

  // Calculate real-time statistics
  const totalEmployees = employees.filter(e => e.role === 'Employee').length
  
  // Get today's attendance
  const today = new Date().toISOString().split('T')[0]
  const activeToday = attendanceRecords.filter(r => r.date === today && r.checkIn).length
  const activeTodayPercentage = totalEmployees > 0 ? ((activeToday / totalEmployees) * 100).toFixed(1) : '0'
  const onLeave = totalEmployees - activeToday
  const onLeavePercentage = totalEmployees > 0 ? ((onLeave / totalEmployees) * 100).toFixed(1) : '0'
  
  // Calculate new employees this month
  const currentMonthStart = new Date().toISOString().slice(0, 7) + '-01'
  const newThisMonth = employees.filter(e => {
    if (!e.joinDate) return false
    return e.joinDate >= currentMonthStart
  }).length
  
  // Calculate previous month for comparison
  const prevMonth = new Date()
  prevMonth.setMonth(prevMonth.getMonth() - 1)
  const prevMonthStart = prevMonth.toISOString().slice(0, 7) + '-01'
  const prevMonthEnd = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).toISOString().split('T')[0]
  const prevMonthEmployees = employees.filter(e => {
    if (!e.joinDate) return false
    return e.joinDate >= prevMonthStart && e.joinDate <= prevMonthEnd
  }).length
  
  const employeeGrowth = prevMonthEmployees > 0 
    ? (((totalEmployees - prevMonthEmployees) / prevMonthEmployees) * 100).toFixed(1)
    : totalEmployees > 0 ? '100' : '0'
  
  const newEmployeeGrowth = prevMonthEmployees > 0
    ? (((newThisMonth - prevMonthEmployees) / prevMonthEmployees) * 100).toFixed(1)
    : newThisMonth > 0 ? '100' : '0'

  // Function to get relative time
  const getRelativeTime = (timestamp: number): string => {
    const now = currentTime
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    } else {
      return 'Just now'
    }
  }

  // Get recent activities (last 10)
  const recentActivities = activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)

  return (
    <RouteProtection allowedRoles={['admin', 'Admin', 'super_admin', 'SuperAdmin']}>
      <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees Card */}
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/70">Total Employees</h3>
            <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{totalEmployees}</p>
          <p className="text-sm text-green-400 font-medium">+{employeeGrowth}%</p>
        </div>

        {/* Active Today Card */}
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/70">Active Today</h3>
            <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{activeToday}</p>
          <p className="text-sm text-green-400 font-medium">{activeTodayPercentage}%</p>
        </div>

        {/* On Leave Card */}
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/70">On Leave</h3>
            <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{onLeave}</p>
          <p className="text-sm text-red-400 font-medium">{onLeavePercentage}%</p>
        </div>

        {/* New This Month Card */}
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/70">New This Month</h3>
            <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{newThisMonth}</p>
          <p className="text-sm text-green-400 font-medium">+{newEmployeeGrowth}%</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div 
                key={activity.id} 
                className={`flex items-start space-x-3 pb-4 ${
                  index < recentActivities.length - 1 ? 'border-b border-white/10' : ''
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-white/90">
                    <span className="text-purple-400 font-semibold">{activity.employeeName}</span>
                    {' '}
                    <span className="text-white/70">{activity.action}</span>
                  </p>
                  <p className="text-xs text-white/50 mt-1">{getRelativeTime(activity.timestamp)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/60 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
      </div>
    </RouteProtection>
  )
}

export default AdminDashboard
