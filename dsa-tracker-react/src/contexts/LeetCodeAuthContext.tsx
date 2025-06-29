import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { fetchLeetCodeUserData } from '../services/leetcode/leetcode-api';
import type { LeetCodeUserData } from '../services/leetcode/leetcode-api';
import userService from '../services/UserService';

interface LeetCodeAuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  userData: LeetCodeUserData | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
  refreshData: () => Promise<void>;
}

const LeetCodeAuthContext = createContext<LeetCodeAuthContextType | undefined>(undefined);

interface LeetCodeAuthProviderProps {
  children: ReactNode;
}

export const LeetCodeAuthProvider: React.FC<LeetCodeAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userData, setUserData] = useState<LeetCodeUserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if there's a saved session in localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('leetcode_username');
    if (savedUsername) {
      login(savedUsername).catch(e => {
        console.error('Failed to auto-login:', e);
      });
    }
  }, []);

  const login = async (leetcodeUsername: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {      
      console.log(`Attempting to login with username: "${leetcodeUsername}"`);
      let data;
      
      // Try with the exact username provided
      try {
        data = await fetchLeetCodeUserData(leetcodeUsername);
      } catch (firstError: any) {
        console.log("First attempt failed:", firstError.message);
        
        // Try alternate approaches if first attempt fails
        if (firstError.message?.includes('not found') || firstError.message?.includes('Could not find user')) {
          
          // Try with lowercase version if different
          if (leetcodeUsername !== leetcodeUsername.toLowerCase()) {
            console.log("Trying with lowercase username:", leetcodeUsername.toLowerCase());
            try {
              data = await fetchLeetCodeUserData(leetcodeUsername.toLowerCase());
            } catch (lowercaseError) {
              console.log("Lowercase attempt failed");
              throw firstError;
            }
          } else {
            throw firstError;
          }
        } else {
          throw firstError;
        }
      }
      
      setUserData(data);
      setUsername(leetcodeUsername);
      setIsAuthenticated(true);
      
      // Save to localStorage for persistence
      localStorage.setItem('leetcode_username', leetcodeUsername);
      
    } catch (err: any) {
      // Show the specific error message from the API if available
      setError(err.message || 'Failed to authenticate with LeetCode. Please check your username.');
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Clear LeetCode auth data
    setUserData(null);
    setUsername(null);
    setIsAuthenticated(false);
    localStorage.removeItem('leetcode_username');
    
    // Reset user account data to default guest user
    userService.resetAccount();
  };

  const refreshData = async (): Promise<void> => {
    if (!username) return;
    
    setIsLoading(true);
    try {
      const data = await fetchLeetCodeUserData(username);
      setUserData(data);
    } catch (err) {
      console.error('Failed to refresh LeetCode data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LeetCodeAuthContext.Provider
      value={{
        isAuthenticated,
        username,
        userData,
        isLoading,
        error,
        login,
        logout,
        refreshData
      }}
    >
      {children}
    </LeetCodeAuthContext.Provider>
  );
};

export const useLeetCodeAuth = (): LeetCodeAuthContextType => {
  const context = useContext(LeetCodeAuthContext);
  if (context === undefined) {
    throw new Error('useLeetCodeAuth must be used within a LeetCodeAuthProvider');
  }
  return context;
};
