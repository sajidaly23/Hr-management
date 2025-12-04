'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../../context/AppContext'
import type { Employee } from '../../../context/AppContext'
import RouteProtection from '../../../components/RouteProtection'
import ActionPopup from '../../../components/ActionPopup'

const EmployeesPage = () => {
  const router = useRouter()
  const { employees, deleteEmployee } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [showMenu, setShowMenu] = useState<string | null>(null)

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
  
  // Create departments list with "All Departments" at the top
  const departments = ['All Departments', ...allDepartments]

  // Get department counts
  const departmentCounts = departments
    .filter(dept => dept !== 'All Departments')
    .map(dept => ({
      name: dept,
      count: employees.filter(e => e.department === dept).length
    }))
    .sort((a, b) => b.count - a.count)

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = 
      selectedDepartment === 'All Departments' || 
      emp.department === selectedDepartment
    
    return matchesSearch && matchesDepartment
  })

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getStatusColor = (status: string) => {
    if (status === 'Active') return 'bg-green-500'
    if (status === 'Remote') return 'bg-purple-500'
    if (status === 'Leave') return 'bg-orange-500'
    return 'bg-gray-500'
  }

  // Extract location from address (simple parsing)
  const getLocation = (address: string) => {
    const parts = address.split(',')
    if (parts.length >= 2) {
      return `${parts[parts.length - 2].trim()}, ${parts[parts.length - 1].trim()}`
    }
    return address || 'N/A'
  }

  return (
    <RouteProtection allowedRoles={['admin', 'Admin', 'super_admin', 'SuperAdmin']}>
      <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Employees</h1>
        <p className="text-sm md:text-base text-white/70">Manage and filter employees by department</p>
        </div>
        <button
          onClick={() => router.push('/addmin/empolyeeregisterpage')}
          className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2 text-sm md:text-base"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="glass-effect rounded-2xl p-4 md:p-6 card-shadow border border-white/10 mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          {/* Search Input */}
          <div className="flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search employees by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
            />
          </div>

          {/* Department Filter */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 md:flex-shrink-0">
            <label className="text-sm font-medium text-white/70 whitespace-nowrap">Filter by Department:</label>
            <div className="relative flex-1 md:flex-initial">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full md:w-auto px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none appearance-none pr-10 md:min-w-[200px]"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-900">
                    {dept} {dept !== 'All Departments' && `(${employees.filter(e => e.department === dept).length})`}
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
        </div>

        {/* Active Filter Badge */}
        {selectedDepartment !== 'All Departments' && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 border border-purple-400/50 rounded-lg">
                <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-sm font-semibold text-purple-300">Active Filter:</span>
                <span className="text-sm font-bold text-white">{selectedDepartment}</span>
              </div>
              <button
                onClick={() => setSelectedDepartment('All Departments')}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear Filter</span>
              </button>
            </div>
            <p className="text-sm text-white/70">
              Showing <span className="font-semibold text-white">{filteredEmployees.length}</span> of{' '}
              <span className="font-semibold text-white">{employees.length}</span> employee(s)
            </p>
          </div>
        )}
      </div>

      {/* Employees Table */}
      <div className="glass-effect rounded-2xl card-shadow border border-white/10 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-white/10">
          <h2 className="text-xl md:text-2xl font-bold text-white">All Employees ({filteredEmployees.length})</h2>
          <p className="text-xs md:text-sm text-white/70 mt-1">Real-time data from registered employees</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Employee</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Position</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Department</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Email</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Phone</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Location</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Status</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-semibold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className={`hover:bg-white/5 transition-colors ${
                      index % 2 === 0 ? 'bg-white/2' : 'bg-transparent'
                    }`}
                  >
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm flex-shrink-0">
                          {getInitials(employee.name)}
                        </div>
                        <div>
                          <div className="text-xs md:text-sm font-medium text-white">{employee.name}</div>
                          <div className="text-xs text-white/70">ID: {employee.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className="text-xs md:text-sm text-white/90">{employee.position || 'Employee'}</span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      {employee.department ? (
                        <span className="inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-400/30">
                          {employee.department}
                        </span>
                      ) : (
                        <span className="text-xs md:text-sm text-white/50">N/A</span>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs md:text-sm text-white/90 truncate max-w-[120px] md:max-w-none">{employee.email}</span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-xs md:text-sm text-white/90">{employee.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs md:text-sm text-white/90 truncate max-w-[100px] md:max-w-none">{getLocation(employee.address)}</span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-xs font-medium text-white ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-center">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setShowMenu(showMenu === employee.id ? null : employee.id)}
                          className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        <ActionPopup
                          isOpen={showMenu === employee.id}
                          onClose={() => setShowMenu(null)}
                          onEdit={() => {
                            router.push(`/addmin/empolyeeregisterpage?id=${employee.id}`)
                          }}
                          onDelete={() => {
                            if (confirm('Are you sure you want to delete this employee?')) {
                              deleteEmployee(employee.id)
                            }
                          }}
                          position="right"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-white/70 text-lg">No employees found</p>
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

export default EmployeesPage
