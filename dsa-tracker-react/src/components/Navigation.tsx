import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
  Home,
  BookOpen,
  Code,
  Target,
  BarChart3,
  Calendar,
  Settings,
  ChevronRight,
  ExternalLink,
  Edit
} from 'lucide-react'

interface NavigationProps {
  isOpen: boolean
  isCollapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

const Navigation = ({ isOpen, isCollapsed = false, onCollapse }: NavigationProps) => {
  const location = useLocation()
  const [isHovered, setIsHovered] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Problem Browser', path: '/problems', icon: Code },
    { name: 'Theory & Concepts', path: '/theory', icon: BookOpen },
    { name: 'Study Plan', path: '/study-plan', icon: Target },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Performance Comparison', path: '/comparison', icon: ChevronRight },
    { name: 'Calendar & Events', path: '/calendar', icon: Calendar },
    { name: 'Code Editor', path: '/code-editor', icon: Edit },
    { name: 'LeetCode Dashboard', path: '/leetcode', icon: ExternalLink },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setIsHovered(true)
    if (isCollapsed && onCollapse) {
      onCollapse(false)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (!isCollapsed && onCollapse) {
      hoverTimeoutRef.current = setTimeout(() => {
        onCollapse(true)
      }, 150) // Much faster, more professional - 150ms delay
    }
  }

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] 
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        z-40 transition-all duration-200 ease-out
        ${isCollapsed ? 'w-16 shadow-sm' : 'w-64 shadow-lg'}
        ${isHovered && isCollapsed ? 'shadow-xl' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`${isCollapsed ? 'p-2' : 'p-6'} h-full overflow-y-auto`}>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === '/' && location.pathname === '/dashboard')
            const Icon = item.icon

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                  <Icon size={20} />
                  {!isCollapsed && <span className="font-medium">{item.name}</span>}
                </div>
                {!isCollapsed && (
                  <ChevronRight
                    size={16}
                    className={`transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-1'}`}
                  />
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default Navigation