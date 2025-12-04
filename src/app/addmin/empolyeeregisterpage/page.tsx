'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useApp } from '../../../context/AppContext'

const RegisterEmployee = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const employeeId = searchParams.get('id')
  const { addEmployee, updateEmployee, getEmployee, employees } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    location: '',
    startDate: ''
  })

  // Get all available departments (from departments page, employee registration, and existing employees)
  const allAvailableDepartments = [
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
    'Product',
    'Design',
    'UIUX DESGINER',
    'BOOK KEEPING',
    'GRAPHIC Design',
    'Web Developer',
    'UI/UX Designer'
  ]

  // Get unique departments from employees (in case there are departments not in the predefined list)
  const employeeDepartments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)))
  
  // Combine all departments and remove duplicates, then sort alphabetically
  const allDepartments = Array.from(new Set([...allAvailableDepartments, ...employeeDepartments])).sort()

  useEffect(() => {
    if (employeeId) {
      const employee = getEmployee(employeeId)
      if (employee) {
        setIsEditing(true)
        const nameParts = employee.name.split(' ')
        
        // Format date from YYYY-MM-DD to MM/DD/YYYY
        let formattedDate = ''
        if (employee.joinDate) {
          const date = new Date(employee.joinDate)
          if (!isNaN(date.getTime())) {
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const year = date.getFullYear()
            formattedDate = `${month}/${day}/${year}`
          }
        }
        
        setFormData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: employee.email,
          phone: employee.phone || '',
          role: employee.position || employee.role, // Use position (job title) for role field
          department: employee.department,
          location: employee.address || '',
          startDate: formattedDate
        })
      }
    }
  }, [employeeId, getEmployee])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleClose = () => {
    router.push('/addmin/empolyeepage')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert MM/DD/YYYY to YYYY-MM-DD
    let formattedDate = formData.startDate
    if (formData.startDate.includes('/')) {
      const parts = formData.startDate.split('/')
      if (parts.length === 3) {
        const [month, day, year] = parts
        formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
    }
    
    if (isEditing && employeeId) {
      updateEmployee(employeeId, {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        role: 'Employee' as 'Employee' | 'Admin', // Default to Employee, can be changed separately
        department: formData.department,
        address: formData.location,
        joinDate: formattedDate,
        position: formData.role // Role field maps to position (job title)
      })
      alert('Employee updated successfully!')
    } else {
      // Check if email already exists
      const existingEmployee = employees.find(emp => emp.email === formData.email)
      if (existingEmployee) {
        alert('An employee with this email already exists!')
        return
      }
      
      addEmployee({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        role: 'Employee' as 'Employee' | 'Admin', // Default to Employee
        department: formData.department,
        address: formData.location,
        joinDate: formattedDate || new Date().toISOString().split('T')[0],
        position: formData.role, // Role field maps to position (job title)
        status: 'Active'
      })
      alert('Employee added successfully!')
    }
    
    router.push('/addmin/empolyeepage')
  }


  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow MM/DD/YYYY format
    let formatted = value.replace(/\D/g, '')
    if (formatted.length >= 2) {
      formatted = formatted.slice(0, 2) + '/' + formatted.slice(2)
    }
    if (formatted.length >= 5) {
      formatted = formatted.slice(0, 5) + '/' + formatted.slice(5, 9)
    }
    setFormData({
      ...formData,
      startDate: formatted
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl card-shadow w-full max-w-2xl relative border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-purple-400 rounded-lg bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-purple-400 rounded-lg bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-purple-400 rounded-lg bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-purple-400 rounded-lg bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>

            {/* Role (Job Title/Position) */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Enter job role/title"
                required
                className="w-full px-4 py-3 border border-purple-400 rounded-lg bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-purple-400 rounded-lg bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none appearance-none pr-10"
                >
                  <option value="" className="bg-slate-900">Select Department</option>
                  {allDepartments.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900">
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-purple-400 rounded-lg bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="startDate"
                value={formData.startDate}
                onChange={handleDateChange}
                placeholder="mm/dd/yyyy"
                required
                maxLength={10}
                className="w-full px-4 py-3 border border-purple-400 rounded-lg bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 glass-effect border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
            >
              {isEditing ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterEmployee

