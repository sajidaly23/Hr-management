'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../context/AppContext'

const DashboardPage = () => {
  const router = useRouter()
  const { currentUser, isAuthenticated } = useApp()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/loginpage')
      return
    }

    // Redirect based on role
    const role = currentUser?.role
    if (role === 'SuperAdmin') {
      router.push('/superadmin/dashboard')
    } else if (role === 'Admin') {
      router.push('/addmin/dishboardpage')
    } else {
      router.push('/empolyee/dishboard')
    }
  }, [currentUser, isAuthenticated, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}

export default DashboardPage


