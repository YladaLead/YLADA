'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Info, X, Copy, Link2, QrCode, FileText } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  link?: string
  icon?: 'link' | 'qr' | 'form' | 'script'
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const iconColors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
}

const bgColors = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  warning: 'bg-yellow-50 border-yellow-200',
  info: 'bg-blue-50 border-blue-200',
}

const actionIcons = {
  link: Link2,
  qr: QrCode,
  form: FileText,
  script: Copy,
}

export function ToastComponent({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const Icon = icons[toast.type]
  const ActionIcon = toast.icon ? actionIcons[toast.icon] : null

  useEffect(() => {
    // Animação de entrada
    setIsVisible(true)

    // Auto-fechar após duração
    const duration = toast.duration || 4000
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(toast.id), 300) // Aguardar animação de saída
    }, duration)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(toast.id), 300)
  }

  // Truncar link para exibição
  const truncateLink = (link: string, maxLength: number = 50) => {
    if (link.length <= maxLength) return link
    return link.substring(0, maxLength - 3) + '...'
  }

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}
        ${bgColors[toast.type]}
        border rounded-lg shadow-lg p-4 min-w-[320px] max-w-[420px]
        backdrop-blur-sm
      `}
    >
      <div className="flex items-start gap-3">
        {/* Ícone principal */}
        <div className={`flex-shrink-0 ${iconColors[toast.type]}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {ActionIcon && (
                  <ActionIcon className={`w-4 h-4 ${iconColors[toast.type]}`} />
                )}
                <h4 className="font-semibold text-sm text-gray-900">
                  {toast.title}
                </h4>
              </div>
              {toast.message && (
                <p className="text-xs text-gray-600 mt-1">
                  {toast.message}
                </p>
              )}
              {toast.link && (
                <div className="mt-2 p-2 bg-white/60 rounded border border-gray-200">
                  <p className="text-xs text-gray-700 font-mono break-all">
                    {truncateLink(toast.link)}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastComponent toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  )
}










