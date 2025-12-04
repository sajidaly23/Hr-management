'use client'
import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  onMenuClick?: () => void
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { currentUser, employees, logout } = useApp()
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  
  const currentEmployee = currentUser 
    ? employees.find(e => e.email === currentUser.email)
    : null
  
  const userName = currentEmployee?.name || currentUser?.email?.split('@')[0] || 'Admin'
  const userEmail = currentUser?.email || 'admin@example.com'
  const userRole = currentUser?.role || 'Admin'
  const initials = currentEmployee?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || userName[0].toUpperCase()

  const handleLogout = () => {
    logout()
    router.push('/auth/loginpage')
    setShowProfileMenu(false)
  }

  return (
    <nav className="bg-gradient-to-r from-slate-950 via-slate-900 to-purple-900 border-b border-white/10 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex items-center justify-end flex-1">
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center justify-center rounded-lg hover:bg-white/10 transition-all duration-200 p-1"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-white/20">
              {initials}
            </div>
          </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowProfileMenu(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-64 glass-effect rounded-xl border border-white/10 shadow-xl z-20 overflow-hidden">
                  {/* Profile Header */}
                  <div className="px-4 py-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-semibold text-lg border-2 border-white/20">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{userName}</p>
                        <p className="text-xs text-white/60 truncate">{userEmail}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-purple-300 bg-purple-500/20 rounded-full">
                          {userRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false)
                        // Navigate to profile page based on user role
                        if (currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin') {
                          router.push('/addmin/profile')
                        } else {
                          router.push('/empolyee/profilepage')
                        }
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10 transition-colors duration-200 flex items-center space-x-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false)
                        // Navigate to settings page
                        if (currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin') {
                          router.push('/addmin/settings')
                        } else {
                          router.push('/empolyee/settings')
                        }
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10 transition-colors duration-200 flex items-center space-x-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </button>
                    <div className="border-t border-white/10 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200 flex items-center space-x-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
