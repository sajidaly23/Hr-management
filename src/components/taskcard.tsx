import React from 'react'

interface TaskCardProps {
  title: string
  status: string
}

const TaskCard = ({ title, status }: TaskCardProps) => {
  const isCompleted = status === 'completed'
  
  return (
    <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-200 hover:shadow-lg group backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isCompleted 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
          }`}>
            {isCompleted ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <span className="font-medium text-white text-lg">{title}</span>
        </div>
        <span className={`px-4 py-2 rounded-lg font-medium text-sm ${
          isCompleted 
            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
            : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  )
}

export default TaskCard
