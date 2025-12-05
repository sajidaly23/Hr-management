import React from 'react'

interface StatusBadgeProps {
  status: 'pending' | 'in_progress' | 'completed'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * StatusBadge Component
 * Displays task status with appropriate colors:
 * - Yellow = Pending
 * - Blue = In Progress
 * - Green = Completed
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-yellow-500/20',
          text: 'text-yellow-300',
          border: 'border-yellow-500/50',
          label: 'Pending',
          icon: '⏱'
        }
      case 'in_progress':
        return {
          bg: 'bg-blue-500/20',
          text: 'text-blue-300',
          border: 'border-blue-500/50',
          label: 'In Progress',
          icon: '🔄'
        }
      case 'completed':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-300',
          border: 'border-green-500/50',
          label: 'Completed',
          icon: '✅'
        }
      default:
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-300',
          border: 'border-gray-500/50',
          label: status,
          icon: '📋'
        }
    }
  }

  const config = getStatusConfig()
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-xs px-3 py-1.5',
    lg: 'text-sm px-4 py-2'
  }

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}

export default StatusBadge

