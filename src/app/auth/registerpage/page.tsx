'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin' as 'admin' | 'employee'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      })

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        let errorMessage = 'Registration failed'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (data.success) {
        setSuccess('Registration successful! Redirecting to login...')
        setTimeout(() => {
          router.push('/auth/loginpage')
        }, 2000)
      } else {
        throw new Error(data.message || 'Registration failed')
      }
    } catch (err: any) {
      // More specific error messages
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to server. Please make sure the backend server is running on http://localhost:5000')
      } else {
        setError(err.message || 'Registration failed. Please try again.')
      }
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
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-white/70">Sign up for HR Management System</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              >
                <option value="admin" className="bg-slate-900">Admin</option>
                <option value="employee" className="bg-slate-900">Employee</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-purple-400 rounded-xl bg-transparent text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-3 rounded-xl text-sm">
                {success}
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
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>📝</span>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/70">
              Already have an account?{' '}
              <Link href="/auth/loginpage" className="text-purple-300 hover:text-purple-200 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

