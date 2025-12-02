'use client'

interface ProgressBarProps {
  percentage: number
  label?: string
  showPercentage?: boolean
  className?: string
  color?: 'blue' | 'green' | 'purple' | 'yellow'
}

export default function ProgressBar({
  percentage,
  label,
  showPercentage = true,
  className = '',
  color = 'blue'
}: ProgressBarProps) {
  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    green: 'bg-gradient-to-r from-green-500 to-emerald-500',
    purple: 'bg-gradient-to-r from-purple-500 to-violet-500',
    yellow: 'bg-gradient-to-r from-yellow-500 to-amber-500'
  }

  const clampedPercentage = Math.min(100, Math.max(0, percentage))

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900">
              {clampedPercentage}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`${colorClasses[color]} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${clampedPercentage}%` }}
        ></div>
      </div>
    </div>
  )
}

