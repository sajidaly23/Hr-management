'use client'
import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useApp } from '../context/AppContext'

interface RouteProtectionProps {
  children: React.ReactNode
  allowedRoles: ('admin' | 'employee' | 'super_admin' | 'Admin' | 'Employee' | 'SuperAdmin')[]
}

const RouteProtection: React.FC<RouteProtectionProps> = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated } = useApp()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/loginpage')
      return
    }

    if (currentUser) {
      const userRole = currentUser.role
      const normalizedRole = userRole === 'SuperAdmin' ? 'super_admin' : 
                            userRole === 'Admin' ? 'admin' : 
                            userRole === 'Employee' ? 'employee' : userRole.toLowerCase()
      
      const normalizedAllowedRoles = allowedRoles.map(role => 
        role === 'SuperAdmin' ? 'super_admin' : 
        role === 'Admin' ? 'admin' : 
        role === 'Employee' ? 'employee' : role.toLowerCase()
      )

      if (!normalizedAllowedRoles.includes(normalizedRole)) {
        // Redirect based on role
        if (normalizedRole === 'employee') {
          router.push('/empolyee/dishboard')
        } else if (normalizedRole === 'admin') {
          router.push('/addmin/dishboardpage')
        } else if (normalizedRole === 'super_admin') {
          router.push('/superadmin/dashboard')
        } else {
          router.push('/auth/loginpage')
        }
      }
    }
  }, [currentUser, isAuthenticated, allowedRoles, router, pathname])

  if (!isAuthenticated || !currentUser) {
    return null // Will redirect
  }

  const userRole = currentUser.role
  const normalizedRole = userRole === 'SuperAdmin' ? 'super_admin' : 
                        userRole === 'Admin' ? 'admin' : 
                        userRole === 'Employee' ? 'employee' : userRole.toLowerCase()
  
  const normalizedAllowedRoles = allowedRoles.map(role => 
    role === 'SuperAdmin' ? 'super_admin' : 
    role === 'Admin' ? 'admin' : 
    role === 'Employee' ? 'employee' : role.toLowerCase()
  )

  if (!normalizedAllowedRoles.includes(normalizedRole)) {
    return null // Will redirect
  }

  return <>{children}</>
}

export default RouteProtection

