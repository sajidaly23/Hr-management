'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../../context/AppContext'

interface Department {
  id: string
  name: string
  departmentHead: string
  employees: number
  budget: string
  color: string
}

const DepartmentsPage = () => {
  const router = useRouter()
  const { employees } = useApp()

  const departments: Department[] = [
    {
      id: '1',
      name: 'UIUX DESGINER',
      departmentHead: 'Sarah Johnson',
      employees: 85,
      budget: '$2.4M',
      color: 'blue'
    },
    {
      id: '2',
      name: 'Product',
      departmentHead: 'Michael Chen',
      employees: 32,
      budget: '$1.2M',
      color: 'purple'
    },
    {
      id: '3',
      name: 'Marketing',
      departmentHead: 'Emily Davis',
      employees: 45,
      budget: '$1.8M',
      color: 'pink'
    },
    {
      id: '4',
      name: 'BOOK KEEPING',
      departmentHead: 'James Wilson',
      employees: 52,
      budget: '$1.5M',
      color: 'green'
    },
    {
      id: '5',
      name: 'HR',
      departmentHead: 'Lisa Anderson',
      employees: 18,
      budget: '$800K',
      color: 'orange'
    },
    {
      id: '6',
      name: 'GRAPHIC Design',
      departmentHead: 'David Brown',
      employees: 16,
      budget: '$600K',
      color: 'indigo'
    },
    {
      id: '7',
      name: 'Web Developer',
      departmentHead: 'Alex Martinez',
      employees: 28,
      budget: '$1.0M',
      color: 'blue'
    },
    {
      id: '8',
      name: 'UI/UX Designer',
      departmentHead: 'Sophia Lee',
      employees: 22,
      budget: '$950K',
      color: 'purple'
    },
    {
      id: '9',
      name: 'Finance',
      departmentHead: 'Robert Taylor',
      employees: 15,
      budget: '$700K',
      color: 'green'
    }
  ]

  // Calculate summary stats
  const totalDepartments = departments.length
  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0)

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; progress: string } } = {
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-500',
        progress: 'bg-blue-500'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-500',
        progress: 'bg-purple-500'
      },
      pink: {
        bg: 'bg-pink-500',
        text: 'text-pink-500',
        progress: 'bg-pink-500'
      },
      green: {
        bg: 'bg-green-500',
        text: 'text-green-500',
        progress: 'bg-green-500'
      },
      orange: {
        bg: 'bg-orange-500',
        text: 'text-orange-500',
        progress: 'bg-orange-500'
      },
      indigo: {
        bg: 'bg-indigo-500',
        text: 'text-indigo-500',
        progress: 'bg-indigo-500'
      }
    }
    return colors[color] || colors.blue
  }

  // Navigate to a dedicated department details page
  const handleViewDetails = (departmentId: string) => {
    router.push(`/addmin/departments/${departmentId}`)
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Departments</p>
              <p className="text-3xl font-bold text-gray-900">{totalDepartments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 card-shadow border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <div className="glass-effect rounded-2xl card-shadow border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Department Head</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Employees</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Budget</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department, index) => {
                const colorClasses = getColorClasses(department.color)
                return (
                  <tr
                    key={department.id}
                    className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                      index % 2 === 0 ? 'bg-white/2' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${colorClasses.bg} rounded-lg flex items-center justify-center`}>
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                        <span className="font-semibold text-white">{department.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/90">{department.departmentHead}</td>
                    <td className="px-6 py-4 text-white/90">{department.employees}</td>
                    <td className="px-6 py-4 text-white/90 font-medium">{department.budget}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewDetails(department.id)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DepartmentsPage
