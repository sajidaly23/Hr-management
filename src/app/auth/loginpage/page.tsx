'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../../context/AppContext'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useApp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const text = await response.text()
      let data
      try {
        data = text ? JSON.parse(text) : {}
      } catch (parseError) {
        console.error('Non-JSON response from /auth/login:', text)
        throw new Error('Server returned an invalid response')
      }

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password')
      }

      // Store token and user data
      if (data.success && data.data) {
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        
        // Update context - this will set the currentUser state
        login(email, password)
        
        // Determine redirect path based on role
        const role = data.data.user.role
        let redirectPath = '/empolyee/dishboard' // default
        
        if (role === 'super_admin') {
          redirectPath = '/superadmin/dashboard'
        } else if (role === 'admin') {
          redirectPath = '/addmin/dishboardpage'
        }
        
        // Use window.location for more reliable redirect
        window.location.href = redirectPath
      } else {
        throw new Error('Login failed: Invalid response from server')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-4">
        <div className="glass-effect card-shadow rounded-3xl p-8">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">
              HR
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/70">Sign in to your HR Management account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-purple-600 border-purple-400 rounded focus:ring-purple-500 bg-transparent" />
                <span className="ml-2 text-sm text-white/70">Remember me</span>
              </label>
              <a href="#" className="text-sm text-purple-300 hover:text-purple-200 font-medium">
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>🔐</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/70">
              Don't have an account?{' '}
              <Link href="/auth/registerpage" className="text-purple-300 hover:text-purple-200 font-medium">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

