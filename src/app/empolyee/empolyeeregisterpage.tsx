import React, { useState } from 'react'

const RegisterEmployee = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Employee Registered: ${name} (${email})`)
    setName('')
    setEmail('')
  }

  return (
    <div className="max-w-md glass-effect p-6 rounded-xl card-shadow border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4">Register Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full border border-white/20 bg-transparent text-white p-2 rounded" 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full border border-white/20 bg-transparent text-white p-2 rounded" 
        />
        <button className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition-colors">Register</button>
      </form>
    </div>
  )
}

export default RegisterEmployee
