'use client'
import React, { useState, useEffect } from 'react'
import { useApp } from '../../../context/AppContext'

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

const AttendancePage = () => {
  const { currentUser, employees } = useApp()
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [filterEmployee, setFilterEmployee] = useState<string>('all')
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
      }
    }
  }, [attendanceRecords, currentUser])

  // Save attendance to localStorage
  useEffect(() => {
    if (attendanceRecords.length > 0) {
      localStorage.setItem('hr_attendance', JSON.stringify(attendanceRecords))
    }
  }, [attendanceRecords])

  const handleCheckIn = () => {
    if (!currentUser) return

    const now = new Date()
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    const dateString = now.toISOString().split('T')[0]
    
    const employee = employees.find(e => e.email === currentUser.email)
    if (!employee) return

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
      employeeId: employee.id,
      employeeEmail: currentUser.email,
      employeeName: employee.name,
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
    if (!currentUser) return

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

    // Calculate working hours
    const checkInTime = new Date(`${dateString} ${existingRecord.checkIn}`)
    const checkOutTime = now
    const diffMs = checkOutTime.getTime() - checkInTime.getTime()
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
  }

  // Filter attendance records
  const filteredRecords = attendanceRecords.filter(record => {
    const matchesDate = record.date === selectedDate
    const matchesEmployee = filterEmployee === 'all' || record.employeeEmail === filterEmployee
    return matchesDate && matchesEmployee
  })

  // Get statistics
  const todayStats = {
    present: attendanceRecords.filter(r => r.date === selectedDate && r.status === 'present').length,
    late: attendanceRecords.filter(r => r.date === selectedDate && r.status === 'late').length,
    absent: employees.length - attendanceRecords.filter(r => r.date === selectedDate && (r.status === 'present' || r.status === 'late')).length,
    checkedIn: attendanceRecords.filter(r => r.date === selectedDate && r.checkIn).length
  }

  const getStatusColor = (status: string) => {
    if (status === 'present') return 'bg-green-500'
    if (status === 'late') return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">Attendance Management</h1>
        <p className="text-white/70">Track employee check-in and check-out</p>
      </div>

      {/* Check In/Out Section */}
      <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Today's Attendance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <p className="text-sm text-white/70 mb-1">Check In</p>
              <p className="text-2xl font-bold text-white">{todayAttendance.checkIn || 'Not checked in'}</p>
            </div>
            <button
              onClick={handleCheckIn}
              disabled={!!todayAttendance.checkIn}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                todayAttendance.checkIn
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-lg'
              }`}
            >
              {todayAttendance.checkIn ? 'Checked In' : 'Check In'}
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <p className="text-sm text-white/70 mb-1">Check Out</p>
              <p className="text-2xl font-bold text-white">{todayAttendance.checkOut || 'Not checked out'}</p>
            </div>
            <button
              onClick={handleCheckOut}
              disabled={!todayAttendance.checkIn || !!todayAttendance.checkOut}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                !todayAttendance.checkIn || todayAttendance.checkOut
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-lg'
              }`}
            >
              {todayAttendance.checkOut ? 'Checked Out' : 'Check Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Present</p>
              <p className="text-3xl font-bold text-green-400">{todayStats.present}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Late</p>
              <p className="text-3xl font-bold text-orange-400">{todayStats.late}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Absent</p>
              <p className="text-3xl font-bold text-red-400">{todayStats.absent}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1">Checked In</p>
              <p className="text-3xl font-bold text-purple-400">{todayStats.checkedIn}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />

              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Attendance Table */}
      <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Attendance Records</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Employee</label>
              <select
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
                className="px-4 py-2 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none appearance-none pr-10 min-w-[200px]"
              >
                <option value="all" className="bg-slate-900">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.email} className="bg-slate-900">
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Check In</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Check Out</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Working Hours</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                      index % 2 === 0 ? 'bg-white/2' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-white/90">{record.employeeName}</td>
                    <td className="px-4 py-3 text-white/90">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-white/90">{record.checkIn || '-'}</td>
                    <td className="px-4 py-3 text-white/90">{record.checkOut || '-'}</td>
                    <td className="px-4 py-3 text-white/90">
                      {record.workingHours ? `${record.workingHours} hrs` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-white/70">
                    No attendance records found for the selected date
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AttendancePage


