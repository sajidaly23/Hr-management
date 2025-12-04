'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../context/AppContext'

const EmployeesList = () => {
  const { currentUser, employees } = useApp()
  const router = useRouter()
  
  // For employees, redirect to their profile page instead
  React.useEffect(() => {
    if (currentUser && currentUser.role === 'Employee') {
      router.push('/empolyee/profilepage')
    }
  }, [currentUser, router])

  // Only admins should see this page
  if (currentUser && currentUser.role === 'Employee') {
    return null // Will redirect
  }

  const activeEmployees = employees.filter(e => e.status === 'Active')

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Team Members</h1>
        <p className="text-white/70">View your colleagues and team members</p>
      </div>

      {/* Employees Grid */}
      <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">All Team Members</h2>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
            {activeEmployees.length} Members
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeEmployees.length > 0 ? (
            activeEmployees.map((e) => (
              <div key={e.id} className="glass-effect rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {e.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{e.name}</h3>
                    <p className="text-sm text-white/60">{e.email}</p>
                    <p className="text-xs text-purple-300 mt-1">{e.department}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-white/60 text-lg">No team members found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeesList

