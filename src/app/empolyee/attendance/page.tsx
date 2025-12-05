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

const EmployeeAttendancePage = () => {
  const { currentUser, employees } = useApp()
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [todayAttendance, setTodayAttendance] = useState<{ checkIn: string | null; checkOut: string | null }>({
    checkIn: null,
    checkOut: null
  })
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7))

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

  // Save attendance to localStorage
  useEffect(() => {
    localStorage.setItem('hr_attendance', JSON.stringify(attendanceRecords))
  }, [attendanceRecords])

  const handleCheckIn = () => {
    if (!currentUser) {
      alert('Please log in to check in!')
      return
    }

    const now = new Date()
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    const dateString = now.toISOString().split('T')[0]
    
    // Try to find employee in employees array
    let employee = employees.find(e => e.email === currentUser.email)
    let employeeId = employee?.id || Date.now().toString()
    let employeeName = employee?.name || currentUser.email.split('@')[0] // Use email username as fallback
    
    // If employee not found, try to get name from localStorage user data
    if (!employee) {
      try {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          if (userData.name) {
            employeeName = userData.name
          }
          if (userData.id) {
            employeeId = userData.id
          }
        }
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }

    // Check if already checked in today
    const existingRecord = attendanceRecords.find(
      record => record.employeeEmail === currentUser.email && record.date === dateString
    )

    if (existingRecord && existingRecord.checkIn) {
      alert('You have already checked in today!')
      return
    }

    // Determine if late (after 9:00 AM)
    const checkInHour = now.getHours()
    const checkInMinute = now.getMinutes()
    const isLate = checkInHour > 9 || (checkInHour === 9 && checkInMinute > 0)
    const status = isLate ? 'late' : 'present'

    const newRecord: AttendanceRecord = {
      id: existingRecord?.id || Date.now().toString(),
      employeeId: employeeId,
      employeeEmail: currentUser.email,
      employeeName: employeeName,
      date: dateString,
      checkIn: timeString,
      checkOut: existingRecord?.checkOut || null,
      status: status,
      workingHours: null
    }

    if (existingRecord) {
      setAttendanceRecords(attendanceRecords.map(record => 
        record.id === existingRecord.id ? newRecord : record
      ))
    } else {
      setAttendanceRecords([...attendanceRecords, newRecord])
    }

    setTodayAttendance({ checkIn: timeString, checkOut: todayAttendance.checkOut })
    alert(`Checked in at ${timeString}${isLate ? ' (Late)' : ''}`)
  }

  const handleCheckOut = () => {
    if (!currentUser) {
      alert('Please log in to check out!')
      return
    }

    const now = new Date()
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    const dateString = now.toISOString().split('T')[0]

    const existingRecord = attendanceRecords.find(
      record => record.employeeEmail === currentUser.email && record.date === dateString
    )

    if (!existingRecord || !existingRecord.checkIn) {
      alert('Please check in first!')
      return
    }

    if (existingRecord.checkOut) {
      alert('You have already checked out today!')
      return
    }

    // Calculate working hours - parse the check-in time properly
    // The checkIn time is in format like "09:30 AM" or "09:30:00 AM"
    try {
      const checkInTimeStr = existingRecord.checkIn.trim()
      const timeMatch = checkInTimeStr.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)/i)
      
      if (!timeMatch) {
        throw new Error('Invalid time format')
      }
      
      let checkInHours = parseInt(timeMatch[1], 10)
      const checkInMinutes = parseInt(timeMatch[2], 10)
      const period = timeMatch[3].toUpperCase()
      
      // Convert to 24-hour format
      if (period === 'PM' && checkInHours !== 12) {
        checkInHours += 12
      } else if (period === 'AM' && checkInHours === 12) {
        checkInHours = 0
      }
      
      const checkInTime = new Date(`${dateString}T${String(checkInHours).padStart(2, '0')}:${String(checkInMinutes).padStart(2, '0')}:00`)
      const checkOutTime = now
      const diffMs = checkOutTime.getTime() - checkInTime.getTime()
      
      if (diffMs < 0) {
        alert('Error: Check-out time cannot be before check-in time!')
        return
      }
      
      const diffHours = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10

      const updatedRecord: AttendanceRecord = {
        ...existingRecord,
        checkOut: timeString,
        workingHours: diffHours
      }

      setAttendanceRecords(attendanceRecords.map(record => 
        record.id === existingRecord.id ? updatedRecord : record
      ))

      setTodayAttendance({ checkIn: todayAttendance.checkIn, checkOut: timeString })
      alert(`Checked out at ${timeString}. Working hours: ${diffHours} hours`)
    } catch (error) {
      console.error('Error calculating working hours:', error)
      // Fallback: just update checkout without calculating hours
      const updatedRecord: AttendanceRecord = {
        ...existingRecord,
        checkOut: timeString,
        workingHours: null
      }

      setAttendanceRecords(attendanceRecords.map(record => 
        record.id === existingRecord.id ? updatedRecord : record
      ))

      setTodayAttendance({ checkIn: todayAttendance.checkIn, checkOut: timeString })
      alert(`Checked out at ${timeString}`)
    }
  }

  // Get current user's attendance records for selected month
  const myAttendanceRecords = attendanceRecords
    .filter(record => {
      if (record.employeeEmail !== currentUser?.email) return false
      return record.date.startsWith(selectedMonth)
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Calculate statistics for current month
  const monthStats = {
    present: myAttendanceRecords.filter(r => r.status === 'present').length,
    late: myAttendanceRecords.filter(r => r.status === 'late').length,
    totalWorkingHours: myAttendanceRecords.reduce((sum, r) => sum + (r.workingHours || 0), 0),
    totalDays: myAttendanceRecords.length
  }

  const getStatusColor = (status: string) => {
    if (status === 'present') return 'bg-green-500/20 text-green-300 border-green-500/50'
    if (status === 'late') return 'bg-orange-500/20 text-orange-300 border-orange-500/50'
    return 'bg-red-500/20 text-red-300 border-red-500/50'
  }

  return (
    <RouteProtection allowedRoles={['employee', 'Employee']}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Attendance</h1>
          <p className="text-white/70">Track your check-in and check-out times</p>
        </div>

        {/* Check In/Out Section */}
        <div className="glass-effect rounded-2xl p-8 card-shadow border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Today's Attendance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Check In Card */}
            <div className="glass-effect rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-white/70 mb-1">Check In Time</p>
                  <p className="text-3xl font-bold text-white">{todayAttendance.checkIn || 'Not checked in'}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={handleCheckIn}
                disabled={!!todayAttendance.checkIn}
                className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  todayAttendance.checkIn
                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-600/50'
                    : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {todayAttendance.checkIn ? '✓ Already Checked In' : 'Check In'}
              </button>
            </div>

            {/* Check Out Card */}
            <div className="glass-effect rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-white/70 mb-1">Check Out Time</p>
                  <p className="text-3xl font-bold text-white">{todayAttendance.checkOut || 'Not checked out'}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <button
                onClick={handleCheckOut}
                disabled={!todayAttendance.checkIn || !!todayAttendance.checkOut}
                className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  !todayAttendance.checkIn || todayAttendance.checkOut
                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-600/50'
                    : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {todayAttendance.checkOut ? '✓ Already Checked Out' : 'Check Out'}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 mb-1">Present Days</p>
                <p className="text-3xl font-bold text-green-400">{monthStats.present}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 mb-1">Late Days</p>
                <p className="text-3xl font-bold text-orange-400">{monthStats.late}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 mb-1">Total Hours</p>
                <p className="text-3xl font-bold text-purple-400">{monthStats.totalWorkingHours.toFixed(1)}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏱</span>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 mb-1">Total Days</p>
                <p className="text-3xl font-bold text-blue-400">{monthStats.totalDays}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Attendance History</h2>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Select Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Check In</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Check Out</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Working Hours</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {myAttendanceRecords.length > 0 ? (
                  myAttendanceRecords.map((record, index) => (
                    <tr
                      key={record.id}
                      className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                        index % 2 === 0 ? 'bg-white/2' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-white/90">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-4 py-3 text-white/90">{record.checkIn || '-'}</td>
                      <td className="px-4 py-3 text-white/90">{record.checkOut || '-'}</td>
                      <td className="px-4 py-3 text-white/90">
                        {record.workingHours ? `${record.workingHours} hrs` : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-white/70">
                      No attendance records found for the selected month
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RouteProtection>
  )
}

export default EmployeeAttendancePage

