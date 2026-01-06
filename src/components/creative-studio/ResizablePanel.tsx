'use client'

import { useState, useRef, useEffect } from 'react'
import { GripVertical } from 'lucide-react'

interface ResizablePanelProps {
  children: React.ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
}

export function ResizablePanel({ 
  children, 
  defaultWidth = 400, 
  minWidth = 300, 
  maxWidth = 800 
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, minWidth, maxWidth])

  return (
    <div 
      ref={panelRef}
      className="flex-shrink-0 flex flex-col gap-3 overflow-y-auto overflow-x-hidden pr-2 relative"
      style={{ width: `${width}px`, maxHeight: '100%' }}
    >
      {children}
      
      {/* Handle de redimensionamento */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1 bg-gray-300 hover:bg-purple-500 cursor-ew-resize transition-colors group"
        onMouseDown={(e) => {
          e.preventDefault()
          setIsResizing(true)
        }}
        style={{ zIndex: 10 }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-purple-600" />
        </div>
      </div>
    </div>
  )
}

