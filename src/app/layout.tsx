'use client'
import './globals.css';
import React from 'react'
import Navbar from '../components/navebar'
import Sidebar from '../components/sidebar'
import { usePathname, useRouter } from 'next/navigation'
import { AppProvider, useApp } from '../context/AppContext'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useApp()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const isAuthPage = pathname?.includes('/auth')
  const isHomePage = pathname === '/'
  const isDashboardPage = pathname?.includes('/addmin/dishboardpage')
  const isEmployeesPage = pathname?.includes('/addmin/empolyeepage')
  const isEmployeeRegisterPage = pathname?.includes('/addmin/empolyeeregisterpage')
  const isLeaveManagementPage = pathname?.includes('/addmin/leavemanagement')
  const isDepartmentsPage = pathname?.includes('/addmin/departments')
  const isSuperAdminDashboard = pathname === '/superadmin/dashboard'
  const isGeneralDashboard = pathname === '/dashboard'

  // Redirect to login if not authenticated and trying to access protected pages
  React.useEffect(() => {
    // Check if user has token in localStorage (might be authenticated but context not updated yet)
    const hasToken = typeof window !== 'undefined' && localStorage.getItem('token')
    const hasUser = typeof window !== 'undefined' && localStorage.getItem('user')
    
    // Don't redirect if we have token/user in localStorage (user is authenticated)
    if (!isAuthPage && !isHomePage && !isAuthenticated && !hasToken && !hasUser) {
      router.push('/auth/loginpage')
    }
  }, [isAuthenticated, isAuthPage, isHomePage, router])

  // Close sidebar when route changes on mobile
  React.useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Don't show sidebar/navbar on auth pages or home page
  if (isAuthPage || isHomePage) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  // Use sidebar layout for all admin pages
  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <LayoutContent>{children}</LayoutContent>
        </AppProvider>
      </body>
    </html>
  )
}
