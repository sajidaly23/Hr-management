'use client'
import React, { useState } from 'react'
import { useApp } from '../../../context/AppContext'

interface LeaveRequest {
  id: string
  employeeName: string
  department: string
  leaveType: string
  reason: string
  startDate: string
  endDate: string
  duration: number
  status: 'pending' | 'approved' | 'rejected'
}

const LeaveManagementPage = () => {
  const { employees } = useApp()
  const [activeFilter, setActiveFilter] = useState('All')
  
  // Mock leave requests data
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeName: 'Sarah Johnson',
      department: 'Engineering',
      leaveType: 'Vacation',
      reason: 'Family vacation',
      startDate: '30/11/2024',
      endDate: '04/12/2024',
      duration: 5,
      status: 'pending'
    },
    {
      id: '2',
      employeeName: 'Michael Chen',
      department: 'Product',
      leaveType: 'Sick Leave',
      reason: 'Medical appointment',
      startDate: '27/11/2024',
      endDate: '28/11/2024',
      duration: 2,
      status: 'approved'
    },
    {
      id: '3',
      employeeName: 'Emily Davis',
      department: 'Marketing',
      leaveType: 'Personal',
      reason: 'Personal matters',
      startDate: '09/12/2024',
      endDate: '11/12/2024',
      duration: 3,
      status: 'pending'
    },
    {
      id: '4',
      employeeName: 'David Wilson',
      department: 'Sales',
      leaveType: 'Vacation',
      reason: 'Holiday trip',
      startDate: '15/12/2024',
      endDate: '20/12/2024',
      duration: 5,
      status: 'rejected'
    },
    {
      id: '5',
      employeeName: 'Lisa Anderson',
      department: 'HR',
      leaveType: 'Sick Leave',
      reason: 'Health checkup',
      startDate: '01/12/2024',
      endDate: '01/12/2024',
      duration: 1,
      status: 'approved'
    }
  ])

  // Calculate summary stats
  const pendingCount = leaveRequests.filter(lr => lr.status === 'pending').length
  const approvedCount = leaveRequests.filter(lr => lr.status === 'approved').length
  const rejectedCount = leaveRequests.filter(lr => lr.status === 'rejected').length

  // Filter leave requests
  const filteredRequests = activeFilter === 'All' 
    ? leaveRequests 
    : leaveRequests.filter(lr => lr.status === activeFilter.toLowerCase())

  const handleApprove = (id: string) => {
    setLeaveRequests(leaveRequests.map(lr => 
      lr.id === id ? { ...lr, status: 'approved' } : lr
    ))
  }

  const handleReject = (id: string) => {
    setLeaveRequests(leaveRequests.map(lr => 
      lr.id === id ? { ...lr, status: 'rejected' } : lr
    ))
  }

  const getStatusColor = (status: string) => {
    if (status === 'pending') return 'bg-orange-500'
    if (status === 'approved') return 'bg-green-500'
    if (status === 'rejected') return 'bg-red-500'
    return 'bg-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Leave Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Pending</p>
              <p className="text-3xl font-bold text-red-500">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Approved</p>
              <p className="text-3xl font-bold text-green-500">{approvedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Rejected</p>
              <p className="text-3xl font-bold text-red-500">{rejectedCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        {['All', 'Pending', 'Approved', 'Rejected'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeFilter === filter
                ? 'bg-purple-600 text-white'
                : 'glass-effect text-gray-100 hover:bg-white/10 border border-purple-500/40'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Leave Request List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="glass-effect rounded-2xl p-6 card-shadow border border-white/10 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{request.employeeName}</h3>
                      <p className="text-sm text-gray-600">{request.department}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium text-white ${getStatusColor(request.status)} flex items-center space-x-2`}>
                      {request.status === 'pending' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {request.status === 'approved' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {request.status === 'rejected' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className="capitalize">{request.status}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Leave Type:</span>
                        <span className="font-medium text-gray-900">{request.leaveType}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Reason:</span>
                        <span className="font-medium text-gray-900">{request.reason}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium text-gray-900">{request.duration} days</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium text-gray-900">{request.startDate}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium text-gray-900">{request.endDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {request.status === 'pending' && (
                  <div className="flex flex-col space-y-2 ml-6">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-effect rounded-2xl p-12 text-center border border-white/10">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">No leave requests found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaveManagementPage
