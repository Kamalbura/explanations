import { useState, useEffect } from 'react'
import {
  Save,
  User,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Settings as SettingsIcon,
} from 'lucide-react'
import { LeetCodeService } from '../services/LeetCodeService'
import { useLeetCodeAuth } from '../contexts/LeetCodeAuthContext'
import userService, {
  type UserAccount,
} from '../services/UserService'

interface UserSettings {
  leetcodeUsername: string
  autoSync: boolean
  syncInterval: number // in minutes
  theme: 'light' | 'dark' | 'system'
  showDifficulty: boolean
  showTime: boolean
  showTags: boolean
}

const DEFAULT_SETTINGS: UserSettings = {
  leetcodeUsername: '',
  autoSync: true,
  syncInterval: 30,
  theme: 'system',
  showDifficulty: true,
  showTime: true,
  showTags: true,
}

const Settings = () => {
  // LeetCode Auth Context
  const { isAuthenticated, userData, login, logout, refreshData } = useLeetCodeAuth()

  // User Account State
  const [_userAccount, setUserAccount] = useState<UserAccount | null>(null)

  // Settings State
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [validating, setValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState<'none' | 'valid' | 'invalid'>('none')
  const [saving, setSaving] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  // Load settings and user account from localStorage on component mount
  useEffect(() => {
    const account = userService.getCurrentAccount()
    if (account) {
      setUserAccount(account)
    }

    const savedSettings = localStorage.getItem('dsa-tracker-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings((prev) => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }

    const lastSyncTime = localStorage.getItem('last-leetcode-sync')
    if (lastSyncTime) {
      setLastSync(new Date(lastSyncTime))
    }
  }, [])

  // Sync settings with LeetCode auth context
  useEffect(() => {
    if (settings.leetcodeUsername && !isAuthenticated) {
      login(settings.leetcodeUsername).catch(console.error)
    }
    if (isAuthenticated && userData) {
      setValidationStatus('valid')
    }
  }, [settings.leetcodeUsername, isAuthenticated, userData, login])

  // LeetCode Username Validation
  const validateUsername = async () => {
    if (!settings.leetcodeUsername.trim()) {
      setValidationStatus('none')
      return
    }
    setValidating(true)
    try {
      if (isAuthenticated && userData?.profile.username !== settings.leetcodeUsername) {
        await logout()
      }
      await login(settings.leetcodeUsername)
      setValidationStatus('valid')
      // Update settings in localStorage immediately
      const updatedSettings = { ...settings, leetcodeUsername: settings.leetcodeUsername }
      localStorage.setItem('dsa-tracker-settings', JSON.stringify(updatedSettings))
      alert(`Successfully connected to LeetCode account: ${settings.leetcodeUsername}`)
    } catch (error) {
      setValidationStatus('invalid')
      console.error('Validation error:', error)
    } finally {
      setValidating(false)
    }
  }

  // Manual sync with LeetCode
  const syncNow = async () => {
    if (!settings.leetcodeUsername || validationStatus !== 'valid') {
      alert('Please set and validate your LeetCode username first.')
      return
    }
    setSaving(true)
    try {
      if (isAuthenticated && settings.leetcodeUsername === userData?.profile.username) {
        await refreshData()
      } else {
        await login(settings.leetcodeUsername)
      }
      setLastSync(new Date())
      alert('Sync completed successfully!')
    } catch (error) {
      console.error('Error syncing:', error)
      alert('Error syncing with LeetCode. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Save settings
  const saveSettings = async () => {
    setSaving(true)
    try {
      localStorage.setItem('dsa-tracker-settings', JSON.stringify(settings))
      if (validationStatus === 'valid' && settings.leetcodeUsername) {
        const stats = await LeetCodeService.getUserStats(settings.leetcodeUsername)
        if (stats) {
          localStorage.setItem('leetcode-stats', JSON.stringify(stats))
          localStorage.setItem('last-leetcode-sync', new Date().toISOString())
          setLastSync(new Date())
        }
      }
      applyTheme(settings.theme)
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Apply theme
  const applyTheme = (theme: string) => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) root.classList.add('dark')
      else root.classList.remove('dark')
    }
  }

  const handleInputChange = (field: keyof UserSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
    if (field === 'leetcodeUsername') {
      setValidationStatus('none')
    }
  }

  const disconnectLeetCode = () => {
    // Call logout which will also reset the user account
    logout()
    
    // Update UI state
    setValidationStatus('none')
    setSettings(prev => ({ ...prev, leetcodeUsername: '' }))
    
    // Remove LeetCode-specific storage items
    localStorage.removeItem('leetcode-stats')
    localStorage.removeItem('leetcode-submissions')
    localStorage.removeItem('last-leetcode-sync')
    setLastSync(null)
    
    // Update user account state in this component
    setUserAccount(userService.getCurrentAccount())
    
    alert('Disconnected from LeetCode successfully!')
  }

  const getValidationIcon = () => {
    if (validating) return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
    if (validationStatus === 'valid') return <CheckCircle className="w-4 h-4 text-green-500" />
    if (validationStatus === 'invalid') return <AlertCircle className="w-4 h-4 text-red-500" />
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SettingsIcon className="w-8 h-8 text-primary-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure your DSA tracker preferences</p>
        </div>
      </div>

      {/* LeetCode Integration */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">LeetCode Integration</h2>
        
        {/* Connection Status */}
        {isAuthenticated && userData && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Connected to LeetCode
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Username: {userData.profile.username} | Solved: {userData.progress.totalSolved} problems
                  </p>
                </div>
              </div>
              <button
                onClick={disconnectLeetCode}
                className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 font-medium"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LeetCode Username
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={settings.leetcodeUsername}
                  onChange={(e) => handleInputChange('leetcodeUsername', e.target.value)}
                  placeholder="Enter your LeetCode username"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {getValidationIcon()}
                </div>
              </div>
              <button
                onClick={validateUsername}
                disabled={validating || !settings.leetcodeUsername.trim()}
                className="btn-secondary px-4 py-2 disabled:opacity-50"
              >
                {isAuthenticated && userData?.profile.username !== settings.leetcodeUsername 
                  ? 'Switch Account' 
                  : validationStatus === 'valid' 
                    ? 'Connected' 
                    : 'Validate'
                }
              </button>
            </div>
            {validationStatus === 'invalid' && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Username not found. Please check and try again.
              </p>
            )}
            {validationStatus === 'valid' && isAuthenticated && userData?.profile.username === settings.leetcodeUsername && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Username validated successfully!
              </p>
            )}
            {isAuthenticated && userData?.profile.username !== settings.leetcodeUsername && settings.leetcodeUsername.trim() && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                This username differs from your connected account ({userData?.profile.username}). Click "Switch Account" to connect to this username.
              </p>
            )}
          </div>

          {/* Auto Sync */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Sync</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically sync your progress with LeetCode
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSync}
              onChange={(e) => handleInputChange('autoSync', e.target.checked)}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* Sync Interval */}
          {settings.autoSync && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sync Interval (minutes)
              </label>
              <select
                value={settings.syncInterval}
                onChange={(e) => handleInputChange('syncInterval', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={180}>3 hours</option>
                <option value={360}>6 hours</option>
              </select>
            </div>
          )}

          {/* Manual Sync */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Manual Sync</p>
              {lastSync && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last synced: {lastSync.toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={syncNow}
              disabled={saving || validationStatus !== 'valid'}
              className="btn-primary px-4 py-2 disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Display Preferences */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Display Preferences</h2>
        <div className="space-y-4">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleInputChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          {/* Problem Display Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show in Problem Cards
            </label>
            <div className="space-y-2">
              {[
                { key: 'showDifficulty', label: 'Difficulty Badge' },
                { key: 'showTime', label: 'Time Spent' },
                { key: 'showTags', label: 'Problem Tags' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings[key as keyof UserSettings] as boolean}
                    onChange={(e) => handleInputChange(key as keyof UserSettings, e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="btn-primary px-6 py-3 flex items-center space-x-2"
        >
          <Save className={`w-4 h-4 ${saving ? 'animate-pulse' : ''}`} />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  )
}

export default Settings