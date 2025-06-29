export interface UserAccount {
  id: string
  username: string
  displayName: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
  }
}

export interface UpdateAccountRequest {
  displayName?: string
  email?: string
  avatar?: string
  preferences?: Partial<UserAccount['preferences']>
}

class UserService {
  private readonly STORAGE_KEY = 'dsa-tracker-user-account'

  // Mock user data for development
  private defaultUser: UserAccount = {
    id: 'user_default',
    username: 'guest',
    displayName: 'Guest User',
    email: 'user@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC'
    }
  }

  // Initialize user account (loads from localStorage or creates default)
  initializeAccount(): UserAccount {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) {
      try {
        const account = JSON.parse(stored)
        // Ensure the account has all required fields
        return { ...this.defaultUser, ...account }
      } catch (error) {
        console.error('Error parsing stored account:', error)
      }
    }
    
    // Create default account and save it
    this.saveAccountToStorage(this.defaultUser)
    return this.defaultUser
  }

  // Get current user account
  getCurrentAccount(): UserAccount {
    return this.initializeAccount()
  }
  
  // Reset account to default (used during logout)
  resetAccount(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    // Dispatch an event to notify components of the change
    window.dispatchEvent(new Event('accountReset'))
  }

  // Update account information
  async updateAccount(updates: UpdateAccountRequest): Promise<UserAccount> {
    try {
      // In a real app, this would make an API call
      // const response = await fetch(`${this.API_BASE_URL}/user/update`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${this.getAuthToken()}`
      //   },
      //   body: JSON.stringify(updates)
      // })

      // For now, simulate API call with localStorage
      const currentAccount = this.getCurrentAccount()
      const updatedAccount: UserAccount = {
        ...currentAccount,
        ...updates,
        updatedAt: new Date().toISOString(),
        preferences: {
          ...currentAccount.preferences,
          ...updates.preferences
        }
      }

      this.saveAccountToStorage(updatedAccount)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return updatedAccount
    } catch (error) {
      console.error('Error updating account:', error)
      throw new Error('Failed to update account. Please try again.')
    }
  }

  // Change username (this would require backend validation)
  async changeUsername(newUsername: string): Promise<boolean> {
    try {
      // In a real app, this would validate username availability
      // const response = await fetch(`${this.API_BASE_URL}/user/check-username`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username: newUsername })
      // })

      // Mock validation - check if username is not empty and has valid format
      if (!newUsername || newUsername.length < 3) {
        throw new Error('Username must be at least 3 characters long')
      }

      if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
        throw new Error('Username can only contain letters, numbers, and underscores')
      }

      // Simulate username availability check
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // For demo, assume username is available if it's different from current
      const currentAccount = this.getCurrentAccount()
      if (newUsername === currentAccount.username) {
        throw new Error('This is already your current username')
      }

      // Update username
      const updatedAccount = {
        ...currentAccount,
        username: newUsername,
        updatedAt: new Date().toISOString()
      }

      this.saveAccountToStorage(updatedAccount)
      return true
    } catch (error) {
      console.error('Error changing username:', error)
      throw error
    }
  }

  // Upload avatar (mock implementation)
  async uploadAvatar(file: File): Promise<string> {
    try {
      // In a real app, this would upload to a file storage service
      // const formData = new FormData()
      // formData.append('avatar', file)
      // const response = await fetch(`${this.API_BASE_URL}/user/avatar`, {
      //   method: 'POST',
      //   body: formData
      // })

      // Mock implementation - convert to base64 for local storage
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
          resolve(base64)
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw new Error('Failed to upload avatar. Please try again.')
    }
  }

  // Delete account (with confirmation)
  async deleteAccount(password: string): Promise<boolean> {
    try {
      // In a real app, this would verify password and delete account
      if (!password) {
        throw new Error('Password is required to delete account')
      }

      // Mock password verification
      await new Promise(resolve => setTimeout(resolve, 500))

      // Clear local storage
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem('dsa-tracker-settings')
      localStorage.removeItem('dsa-tracker-progress')
      
      return true
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }

  // Export account data
  exportAccountData(): string {
    const account = this.getCurrentAccount()
    const settings = localStorage.getItem('dsa-tracker-settings')
    const progress = localStorage.getItem('dsa-tracker-progress')
    
    const exportData = {
      account,
      settings: settings ? JSON.parse(settings) : null,
      progress: progress ? JSON.parse(progress) : null,
      exportDate: new Date().toISOString()
    }

    return JSON.stringify(exportData, null, 2)
  }

  // Import account data
  async importAccountData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.account) {
        this.saveAccountToStorage(data.account)
      }
      
      if (data.settings) {
        localStorage.setItem('dsa-tracker-settings', JSON.stringify(data.settings))
      }
      
      if (data.progress) {
        localStorage.setItem('dsa-tracker-progress', JSON.stringify(data.progress))
      }
      
      return true
    } catch (error) {
      console.error('Error importing account data:', error)
      throw new Error('Invalid account data format')
    }
  }

  // Private helper methods
  private saveAccountToStorage(account: UserAccount): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(account))
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Generate avatar URL from initials
  generateAvatarUrl(name: string): string {
    const initials = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2)
    
    // Using a placeholder avatar service
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=128&background=6366f1&color=ffffff`
  }
}

const userService = new UserService()
export default userService
