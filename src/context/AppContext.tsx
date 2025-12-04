'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  phone: string
  address: string
  joinDate: string
  role: 'Employee' | 'Admin'
  status: 'Active' | 'Inactive'
}

export interface Task {
  id: string
  title: string
  status: 'pending' | 'completed'
  priority: 'High' | 'Medium' | 'Low'
  dueDate: string
  assignedTo?: string
  description?: string
  project?: string
}

interface AppContextType {
  // Employees
  employees: Employee[]
  addEmployee: (employee: Omit<Employee, 'id'>) => void
  updateEmployee: (id: string, employee: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  getEmployee: (id: string) => Employee | undefined
  
  // Tasks
  tasks: Task[]
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTasksByEmployee: (email: string) => Task[]
  
  // Auth
  currentUser: { email: string; role: 'Admin' | 'Employee' | 'SuperAdmin' } | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [currentUser, setCurrentUser] = useState<{ email: string; role: 'Admin' | 'Employee' | 'SuperAdmin' } | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser({
          email: user.email,
          role: user.role === 'super_admin' ? 'SuperAdmin' : user.role === 'admin' ? 'Admin' : 'Employee'
        })
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }

    // Keep local storage for backward compatibility, but prefer API
    const savedEmployees = localStorage.getItem('hr_employees')
    const savedTasks = localStorage.getItem('hr_tasks')

    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees))
    } else {
      // Initialize with default employees
      const defaultEmployees: Employee[] = [
        {
          id: '1',
          name: 'Ali Khan',
          email: 'ali@example.com',
          department: 'Engineering',
          position: 'Software Developer',
          phone: '+1 234 567 8900',
          address: '123 Main St, City, State 12345',
          joinDate: '2023-01-15',
          role: 'Employee',
          status: 'Active'
        },
        {
          id: '2',
          name: 'Sara Ahmed',
          email: 'sara@example.com',
          department: 'Marketing',
          position: 'Marketing Manager',
          phone: '+1 234 567 8901',
          address: '456 Oak Ave, City, State 12345',
          joinDate: '2023-02-20',
          role: 'Employee',
          status: 'Active'
        },
        {
          id: '3',
          name: 'Admin User',
          email: 'admin@example.com',
          department: 'Administration',
          position: 'System Administrator',
          phone: '+1 234 567 8902',
          address: '789 Admin Blvd, City, State 12345',
          joinDate: '2023-01-01',
          role: 'Admin',
          status: 'Active'
        }
      ]
      setEmployees(defaultEmployees)
      localStorage.setItem('hr_employees', JSON.stringify(defaultEmployees))
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Initialize with default tasks
      const defaultTasks: Task[] = [
        {
          id: '1',
          title: 'Complete quarterly report',
          status: 'pending',
          priority: 'High',
          dueDate: '2024-01-20',
          assignedTo: 'ali@example.com',
          description: 'Complete the quarterly financial report'
        },
        {
          id: '2',
          title: 'Update database schema',
          status: 'completed',
          priority: 'Medium',
          dueDate: '2024-01-15',
          assignedTo: 'ali@example.com',
          description: 'Update the database schema for new features'
        },
        {
          id: '3',
          title: 'Review code changes',
          status: 'pending',
          priority: 'Medium',
          dueDate: '2024-01-22',
          assignedTo: 'sara@example.com',
          description: 'Review pull requests and code changes'
        }
      ]
      setTasks(defaultTasks)
      localStorage.setItem('hr_tasks', JSON.stringify(defaultTasks))
    }

    // User is already loaded above
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem('hr_employees', JSON.stringify(employees))
    }
  }, [employees])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('hr_tasks', JSON.stringify(tasks))
    }
  }, [tasks])

  // Don't save currentUser to hr_currentUser anymore, use 'user' from API instead

  // Employee functions
  const addEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Date.now().toString(),
      joinDate: employeeData.joinDate || new Date().toISOString().split('T')[0]
    }
    setEmployees([...employees, newEmployee])
  }

  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, ...employeeData } : emp
    ))
  }

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id))
    // Also delete tasks assigned to this employee
    setTasks(tasks.filter(task => task.assignedTo !== employees.find(e => e.id === id)?.email))
  }

  const getEmployee = (id: string) => {
    return employees.find(emp => emp.id === id)
  }

  // Task functions
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString()
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...taskData } : task
    ))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const getTasksByEmployee = (email: string) => {
    return tasks.filter(task => task.assignedTo === email)
  }

  // Auth functions
  const login = (email: string, password: string): boolean => {
    // Check if user data exists in localStorage (set by login page)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        const userRole = user.role === 'super_admin' ? 'SuperAdmin' : user.role === 'admin' ? 'Admin' : 'Employee'
        setCurrentUser({
          email: user.email || email,
          role: userRole
        })
        return true
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
    // Fallback to local storage check
    const employee = employees.find(emp => emp.email === email)
    if (employee) {
      setCurrentUser({
        email: employee.email,
        role: employee.role === 'Admin' ? 'Admin' : 'Employee'
      })
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCurrentUser(null)
  }

  const value: AppContextType = {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksByEmployee,
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}


