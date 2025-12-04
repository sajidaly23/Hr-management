import React from 'react'

interface EmployeeCardProps {
  name: string
  email: string
}

const EmployeeCard = ({ name, email }: EmployeeCardProps) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
  
  return (
    <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200 hover:shadow-md group">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-200">
          {initials}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg mb-1">{name}</h3>
          <p className="text-sm text-gray-500 flex items-center">
            <span className="mr-2">📧</span>
            {email}
          </p>
        </div>
        <div className="text-gray-400 group-hover:text-purple-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default EmployeeCard
