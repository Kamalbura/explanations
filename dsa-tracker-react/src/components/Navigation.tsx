import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  Code, 
  Target, 
  BarChart3, 
  Calendar,
  Settings,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { useLeetCodeAuth } from '../contexts/LeetCodeAuthContext'

interface NavigationProps {
  isOpen: boolean
}

const Navigation = ({ isOpen }: NavigationProps) => {
  const location = useLocation()
  const { isAuthenticated, userData } = useLeetCodeAuth()

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Problem Browser', path: '/problems', icon: Code },
    { name: 'Theory & Concepts', path: '/theory', icon: BookOpen },
    { name: 'Study Plan', path: '/study-plan', icon: Target },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Code Editor', path: '/code-editor', icon: Calendar },
    { name: 'LeetCode Dashboard', path: '/leetcode', icon: ExternalLink },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  if (!isOpen) return null

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </div>
                <ChevronRight 
                  size={16} 
                  className={`transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-1'}`} 
                />
              </Link>
            )
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Quick Stats
          </h3>
          {isAuthenticated && userData ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Problems Solved:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {userData.progress.totalSolved}/{userData.progress.totalQuestions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Easy:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {userData.progress.easySolved}/{userData.progress.easyTotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Medium:</span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">
                  {userData.progress.mediumSolved}/{userData.progress.mediumTotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Hard:</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {userData.progress.hardSolved}/{userData.progress.hardTotal}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Problems Solved:</span>
                <span className="font-medium text-green-600 dark:text-green-400">142/500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Study Streak:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">7 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Time Today:</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">2h 15m</span>
              </div>
              <Link 
                to="/leetcode/login" 
                className="mt-2 block text-center text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Connect LeetCode Account
              </Link>
            </div>
          )}
        </div>

        {/* Progress Ring */}
        <div className="mt-6 text-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="4"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - (isAuthenticated && userData ? userData.progress.totalSolved/userData.progress.totalQuestions : 0.284))}`}
                className="text-primary-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {isAuthenticated && userData
                  ? `${Math.round((userData.progress.totalSolved/userData.progress.totalQuestions) * 100)}%`
                  : '28%'
                }
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Overall Progress</p>
        </div>
      </div>
    </aside>
  )
}

export default Navigation
