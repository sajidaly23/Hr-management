'use client'
import React, { useEffect, useRef } from 'react'

interface ActionPopupProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  position?: 'left' | 'right' | 'center'
}

const ActionPopup: React.FC<ActionPopupProps> = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete,
  position = 'right'
}) => {
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div 
        ref={popupRef}
        className={`absolute ${positionClasses[position]} mt-2 z-50 min-w-[200px] animate-fade-in`}
      >
        <div className="glass-effect rounded-xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 px-4 py-3 border-b border-white/20">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-center">
              Actions
            </h3>
          </div>
          
          {/* Actions List */}
          <div className="py-2">
            {/* Edit Option */}
            <button
              onClick={() => {
                onEdit()
                onClose()
              }}
              className="w-full px-4 py-3 flex items-center space-x-3 text-white hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Edit</span>
            </button>
            
            {/* Divider */}
            <div className="h-px bg-white/10 my-1" />
            
            {/* Delete Option */}
            <button
              onClick={() => {
                onDelete()
                onClose()
              }}
              className="w-full px-4 py-3 flex items-center space-x-3 text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <span className="text-sm font-medium">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ActionPopup

