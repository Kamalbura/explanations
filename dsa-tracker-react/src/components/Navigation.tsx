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

interface NavigationProps {
  isOpen: boolean
}

const Navigation = ({ isOpen }: NavigationProps) => {
  const location = useLocation()

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
      </div>
    </aside>
  )
}

export default Navigation
