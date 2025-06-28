import { Link } from 'react-router-dom'

interface ConnectionStatusProps {
  isAuthenticated: boolean
}

const ConnectionStatus = ({ isAuthenticated }: ConnectionStatusProps) => {
  if (isAuthenticated) return null

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-3 sm:p-4 rounded-lg shadow-sm">
      <div className="flex gap-2 sm:gap-3 items-start sm:items-center">
        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0 mt-0.5 sm:mt-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div className="text-yellow-700 dark:text-yellow-300 text-sm sm:text-base">
          <span className="block sm:inline">Connect your LeetCode account to see real progress data.</span>
          <Link 
            to="/leetcode/login" 
            className="inline-block mt-1 sm:ml-2 sm:mt-0 font-medium underline hover:no-underline transition-all duration-200 text-sm sm:text-base"
          >
            Connect now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ConnectionStatus
