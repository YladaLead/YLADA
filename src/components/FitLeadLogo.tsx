'use client'

interface FitLeadLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function FitLeadLogo({ size = 'md', showText = true, className = '' }: FitLeadLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }
  
  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent"></div>
        </div>
        
        {/* Letter F */}
        <div className={`text-white font-bold ${textSizes[size]} relative z-10`}>
          F
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1 right-1 w-1 h-1 bg-white/40 rounded-full"></div>
        <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/40 rounded-full"></div>
      </div>
      
      {/* Text */}
      {showText && (
        <div>
          <h1 className={`font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent ${
            size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl'
          }`}>
            FitLead
          </h1>
          <p className={`text-gray-500 font-medium ${
            size === 'sm' ? 'text-xs' : 'text-xs'
          }`}>
            Powered by YLADA
          </p>
        </div>
      )}
    </div>
  )
}
