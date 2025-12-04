'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../../context/AppContext'

const AdminProfilePage = () => {
  const router = useRouter()
  const { currentUser, employees, updateEmployee } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  
  const currentEmployee = currentUser 
    ? employees.find(e => e.email === currentUser.email)
    : null

  const [formData, setFormData] = useState({
    name: currentEmployee?.name || currentUser?.email?.split('@')[0] || '',
    email: currentUser?.email || '',
    phone: currentEmployee?.phone || '',
    department: currentEmployee?.department || '',
    position: currentEmployee?.position || '',
    address: currentEmployee?.address || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentEmployee) {
      updateEmployee(currentEmployee.id, {
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        address: formData.address
      })
      alert('Profile updated successfully!')
      setIsEditing(false)
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-white/70">View and manage your profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg">
                {getInitials(formData.name)}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{formData.name}</h2>
              <p className="text-white/70 mb-1">{formData.email}</p>
              <span className="inline-block px-3 py-1 text-sm font-medium text-purple-300 bg-purple-500/20 rounded-full mb-4">
                {currentUser?.role || 'Admin'}
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                    />
                  ) : (
                    <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white">{formData.name}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white/70">
                    {formData.email}
                  </div>
                  <p className="text-xs text-white/50 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white">{formData.phone || 'N/A'}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                      placeholder="Enter department"
                    />
                  ) : (
                    <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white">{formData.department || 'N/A'}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Position</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                      placeholder="Enter position"
                    />
                  ) : (
                    <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white">{formData.position || 'N/A'}</div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
                      placeholder="Enter address"
                    />
                  ) : (
                    <div className="px-4 py-3 glass-effect border border-white/10 rounded-xl text-white">{formData.address || 'N/A'}</div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 glass-effect border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfilePage

