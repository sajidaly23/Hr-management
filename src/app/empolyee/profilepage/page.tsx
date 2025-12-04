'use client'
import React, { useState, useEffect } from 'react'
import { useApp } from '../../../context/AppContext'
import RouteProtection from '../../../components/RouteProtection'

const ProfilePage = () => {
  const { currentUser, employees, updateEmployee } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    role: 'Employee' as 'Employee' | 'Admin',
    department: '',
    position: '',
    phone: '',
    address: '',
    joinDate: ''
  })

  useEffect(() => {
    if (currentUser) {
      const emp = employees.find(e => e.email === currentUser.email)
      if (emp) {
        setEmployee({
          name: emp.name,
          email: emp.email,
          role: emp.role,
          department: emp.department,
          position: emp.position,
          phone: emp.phone,
          address: emp.address,
          joinDate: emp.joinDate
        })
      } else {
        // Fallback if employee is not yet in the local employees list
        const nameFromEmail = currentUser.email.split('@')[0]
        setEmployee(prev => ({
          ...prev,
          name: nameFromEmail,
          email: currentUser.email,
          role: 'Employee',
          department: prev.department || '',
          position: prev.position || '',
          phone: prev.phone || '',
          address: prev.address || '',
          joinDate: prev.joinDate || new Date().toISOString().split('T')[0]
        }))
      }
    }
  }, [currentUser, employees])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    if (currentUser) {
      const emp = employees.find(e => e.email === currentUser.email)
      if (emp) {
        updateEmployee(emp.id, employee)
        setIsEditing(false)
        alert('Profile updated successfully!')
      }
    }
  }

  const initials = employee.name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <RouteProtection allowedRoles={['employee', 'Employee']}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-white/70">Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <div className="glass-effect rounded-2xl p-8 card-shadow border border-white/10">
          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-white/10">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {initials}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">{employee.name}</h2>
                <p className="text-white/70 mb-2">{employee.position}</p>
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <span className="flex items-center space-x-1">
                    <span>📧</span>
                    <span>{employee.email}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>📞</span>
                    <span>{employee.phone}</span>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isEditing
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg'
                  : 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:shadow-lg'
              }`}
            >
              {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
            </button>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={employee.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                />
              ) : (
                <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white">
                  {employee.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={employee.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                />
              ) : (
                <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white">
                  {employee.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Role</label>
              <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white">
                {employee.role}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={employee.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                />
              ) : (
                <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white">
                  {employee.department}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Position</label>
              {isEditing ? (
                <input
                  type="text"
                  name="position"
                  value={employee.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                />
              ) : (
                <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white">
                  {employee.position}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={employee.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                />
              ) : (
                <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white">
                  {employee.phone}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-2">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={employee.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                />
              ) : (
                <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white">
                  {employee.address}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Join Date</label>
              <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white">
                {employee.joinDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteProtection>
  )
}

export default ProfilePage


