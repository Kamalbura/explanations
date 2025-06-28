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
  Edit,
  Heart,
  X,
  Github,
  Linkedin,
  Instagram
} from 'lucide-react'

interface NavigationProps {
  isOpen: boolean
  isCollapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

const Navigation = ({ isOpen, isCollapsed = false, onCollapse }: NavigationProps) => {
  const location = useLocation()
  const [showDeveloperModal, setShowDeveloperModal] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    if (onCollapse) {
      onCollapse(!isCollapsed)
    }
  }

  // Close developer modal
  const closeDeveloperModal = () => {
    setShowDeveloperModal(false)
  }

  // Handle ESC key to close developer modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showDeveloperModal) {
        closeDeveloperModal()
      }
    }

    if (showDeveloperModal) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showDeveloperModal])

  // Handle click outside modal to close
  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeDeveloperModal()
    }
  }

  // Auto-close sidebar after 0.75s of not touching it
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    if (!isCollapsed && onCollapse) {
      timeoutRef.current = setTimeout(() => {
        onCollapse(true)
      }, 750) // 0.75 seconds
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <>
      <aside
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] 
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          z-40 transition-all duration-200 ease-out
          ${isCollapsed ? 'w-12 sm:w-16 shadow-sm' : 'w-56 sm:w-64 shadow-lg'}`}
      >
        {/* Toggle Button - Hidden on mobile when collapsed */}
        <div className={`absolute -right-3 top-6 z-50 ${isCollapsed ? 'hidden sm:block' : 'block'}`}>
          <button
            onClick={toggleCollapse}
            className="w-5 h-5 sm:w-6 sm:h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <ChevronRight 
              size={10} 
              className={`sm:w-3 sm:h-3 transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
            />
          </button>
        </div>
        <div className={`${isCollapsed ? 'p-1 sm:p-2' : 'p-4 sm:p-6'} h-full overflow-y-auto flex flex-col`}>
          <nav className="space-y-1 sm:space-y-2 flex-1">
            {menuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === '/' && location.pathname === '/dashboard')
              const Icon = item.icon

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center p-2 sm:p-3 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className={`flex items-center ${isCollapsed ? '' : 'space-x-2 sm:space-x-3'}`}>
                    <Icon size={isCollapsed ? 16 : 18} className="sm:w-5 sm:h-5" />
                    {!isCollapsed && (
                      <span className="font-medium text-sm sm:text-base truncate">{item.name}</span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <ChevronRight
                      size={14}
                      className={`sm:w-4 sm:h-4 transition-transform flex-shrink-0 ${isActive ? 'rotate-90' : 'group-hover:translate-x-1'}`}
                    />
                  )}

                  {/* Tooltip for collapsed state - Only on larger screens */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none hidden sm:block">
                      {item.name}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Simple Heart Button at Bottom */}
          <div className={`mt-auto border-t border-gray-200 dark:border-gray-700 pt-2 sm:pt-4`}>
            <button
              onClick={() => setShowDeveloperModal(true)}
              className={`w-full flex items-center justify-center p-2 sm:p-3 rounded-lg transition-all duration-200 group
                text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:scale-105`}
              title={isCollapsed ? "Made with ❤️ by Kamal Bura (Click to learn more)" : "Made with ❤️ (Click to learn more)"}
            >
              <Heart 
                size={isCollapsed ? 14 : 16} 
                className="sm:w-5 sm:h-5 transition-all duration-200" 
                fill="currentColor"
              />
              {!isCollapsed && (
                <span className="ml-2 text-xs sm:text-sm font-medium">Made with ❤️</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Developer Modal - Clean & Minimal & Responsive */}
      {showDeveloperModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xs sm:max-w-sm w-full mx-2 sm:mx-4 border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 relative">
              <button
                onClick={closeDeveloperModal}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Close (ESC)"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px] text-gray-500 dark:text-gray-400" />
              </button>
              
              <div className="text-center">
                <Heart size={20} fill="currentColor" className="sm:w-6 sm:h-6 text-red-500 mx-auto mb-2 sm:mb-3" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Made with patience
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">by Kamal Bura</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {/* Social Links - Simple & Clean & Responsive */}
              <div className="space-y-2 sm:space-y-3">
                <a
                  href="https://github.com/kamalbura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Github size={16} className="sm:w-[18px] sm:h-[18px] text-gray-700 dark:text-gray-300" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</span>
                  <ExternalLink size={12} className="sm:w-[14px] sm:h-[14px] text-gray-400 ml-auto" />
                </a>

                <a
                  href="https://linkedin.com/in/kamal-bura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Linkedin size={16} className="sm:w-[18px] sm:h-[18px] text-gray-700 dark:text-gray-300" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</span>
                  <ExternalLink size={12} className="sm:w-[14px] sm:h-[14px] text-gray-400 ml-auto" />
                </a>

                <a
                  href="https://instagram.com/kamal.bura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Instagram size={16} className="sm:w-[18px] sm:h-[18px] text-gray-700 dark:text-gray-300" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Instagram</span>
                  <ExternalLink size={12} className="sm:w-[14px] sm:h-[14px] text-gray-400 ml-auto" />
                </a>
              </div>

              {/* Footer */}
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  DSA Mastery Hub • React + TypeScript
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navigation