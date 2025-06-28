interface ProgressBarProps {
  percentage: number
  color?: string
  height?: string
  className?: string
}

const ProgressBar = ({ 
  percentage, 
  color = 'bg-blue-600 dark:bg-blue-500', 
  height = 'h-2',
  className = ''
}: ProgressBarProps) => {
  return (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${height} ${className}`}>
      <div 
        className={`h-full ${color} rounded-full transition-all duration-300 ease-out`}
        style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
      />
    </div>
  )
}

export default ProgressBar
