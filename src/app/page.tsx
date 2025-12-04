'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const HomePage = () => {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center px-4 glass-effect card-shadow rounded-3xl max-w-4xl mx-4">
        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-white font-bold text-5xl mx-auto mb-6 shadow-2xl">
          HR
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Welcome to HR System
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Streamline your workforce management with our comprehensive HR management platform
        </p>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => router.push('/auth/loginpage')}
            className="px-8 py-4 bg-white text-purple-600 rounded-xl hover:shadow-2xl transition-all duration-200 font-semibold text-lg flex items-center space-x-2"
          >
            <span>🚀</span>
            <span>Get Started</span>
          </button>
          <button
            onClick={() => router.push('/auth/loginpage')}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all duration-200 font-semibold text-lg"
          >
            Learn More
          </button>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-2">Employee Management</h3>
            <p className="text-white/80">Manage your workforce efficiently</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">Task Tracking</h3>
            <p className="text-white/80">Track and manage tasks seamlessly</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Analytics</h3>
            <p className="text-white/80">Get insights into your operations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
