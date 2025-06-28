import { useState, useEffect } from 'react'
import { User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { userService, type UserAccount } from '../services/UserService'
import { useLeetCodeAuth } from '../contexts/LeetCodeAuthContext'

const UserProfile = () => {
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, userData } = useLeetCodeAuth()

  // Load user account from UserService
  useEffect(() => {
    const account = userService.getCurrentAccount()
    setUserAccount(account)
  }, [])

  // Listen for account changes
  useEffect(() => {
    const handleStorageChange = () => {
      const account = userService.getCurrentAccount()
      setUserAccount(account)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('settingsUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('settingsUpdated', handleStorageChange)
    }
  }, [])

  const goToSettings = () => {
    setIsDropdownOpen(false)
    navigate('/settings')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const displayName = userAccount?.displayName || 'Guest User'
  const email = userAccount?.email || ''
  const leetcodeUsername = isAuthenticated && userData ? userData.profile.username : ''

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium">
          {userAccount?.avatar ? (
            <img 
              src={userAccount.avatar} 
              alt={displayName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : displayName !== 'Guest User' ? (
            getInitials(displayName)
          ) : (
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {displayName}
          </p>
          {leetcodeUsername && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              @{leetcodeUsername}
            </p>
          )}
        </div>
      </button>

      {/* Dropdown Menu - Responsive */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500 rounded-full flex items-center justify-center text-white text-base sm:text-lg font-medium overflow-hidden">
                {userAccount?.avatar ? (
                  <img 
                    src={userAccount.avatar} 
                    alt={displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : displayName !== 'Guest User' ? (
                  getInitials(displayName)
                ) : (
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                  {displayName}
                </p>
                {email && (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {email}
                  </p>
                )}
                {leetcodeUsername && (
                  <p className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 truncate">
                    LeetCode: @{leetcodeUsername}
                  </p>
                )}
                {isAuthenticated && userData && (
                  <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400">
                    {userData.progress.totalSolved} problems solved
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-1.5 sm:p-2">
            <button
              onClick={goToSettings}
              className="w-full flex items-center space-x-2 sm:space-x-3 px-2.5 sm:px-3 py-2 text-left text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Account Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  )
}

export default UserProfile
