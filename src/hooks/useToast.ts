'use client'

import { useState, useCallback } from 'react'
import { Toast, ToastType } from '@/components/ui/Toast'

let toastIdCounter = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((
    type: ToastType,
    title: string,
    options?: {
      message?: string
      link?: string
      icon?: 'link' | 'qr' | 'form' | 'script'
      duration?: number
    }
  ) => {
    const id = `toast-${++toastIdCounter}-${Date.now()}`
    const newToast: Toast = {
      id,
      type,
      title,
      message: options?.message,
      link: options?.link,
      icon: options?.icon,
      duration: options?.duration,
    }

    setToasts((prev) => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showSuccess = useCallback((
    title: string,
    options?: {
      message?: string
      link?: string
      icon?: 'link' | 'qr' | 'form' | 'script'
      duration?: number
    }
  ) => {
    showToast('success', title, options)
  }, [showToast])

  const showError = useCallback((
    title: string,
    options?: {
      message?: string
      link?: string
      duration?: number
    }
  ) => {
    showToast('error', title, options)
  }, [showToast])

  const showWarning = useCallback((
    title: string,
    options?: {
      message?: string
      link?: string
      duration?: number
    }
  ) => {
    showToast('warning', title, options)
  }, [showToast])

  const showInfo = useCallback((
    title: string,
    options?: {
      message?: string
      link?: string
      duration?: number
    }
  ) => {
    showToast('info', title, options)
  }, [showToast])

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
  }
}










