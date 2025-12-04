'use client'
import React from 'react'
import { useApp } from '../../../../context/AppContext'

const SuperAdminDashboard = () => {
  const { employees, tasks } = useApp()
  
  // Calculate stats
  const totalEmployees = employees?.length || 248
  const activeToday = Math.round(totalEmployees * 0.944) || 234
  const onLeave = totalEmployees - activeToday || 14
  const newThisMonth = 8
  
  // Recent activity data
  const recentActivities = [
    { name: 'Sarah Johnson', action: 'submitted leave request', time: '2 hours ago' },
    { name: 'Michael Chen', action: 'updated profile information', time: '5 hours ago' },
    { name: 'Emily Davis', action: 'completed task assignment', time: '1 day ago' },
    { name: 'David Wilson', action: 'submitted leave request', time: '2 days ago' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees Card */}
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Employees</h3>
            <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">{totalEmployees}</p>
          <p className="text-sm text-green-600 font-medium">+12%</p>
        </div>

        {/* Active Today Card */}
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Today</h3>
            <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">{activeToday}</p>
          <p className="text-sm text-green-600 font-medium">94.4%</p>
        </div>

        {/* On Leave Card */}
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">On Leave</h3>
            <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">{onLeave}</p>
          <p className="text-sm text-green-600 font-medium">5.6%</p>
        </div>

        {/* New This Month Card */}
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">New This Month</h3>
            <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">{newThisMonth}</p>
          <p className="text-sm text-green-600 font-medium">+3.2%</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-400 text-lg">•</span>
              <div className="flex-1">
                <p className="text-gray-800">
                  <span className="font-semibold text-purple-600">{activity.name}</span>{' '}
                  {activity.action}
                </p>
                <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
