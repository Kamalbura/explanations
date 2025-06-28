import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  color: string
  bgColor: string
}

const StatCard = ({ title, value, change, icon: Icon, color, bgColor }: StatCardProps) => {
  return (
    <div className="card p-3 sm:p-4 min-w-0 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate" title={title}>
            {title}
          </p>
          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate" title={value}>
            {value}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 truncate" title={change}>
            {change}
          </p>
        </div>
        <div className={`p-1.5 sm:p-2 rounded-lg ${bgColor}`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
        </div>
      </div>
    </div>
  )
}

export default StatCard
