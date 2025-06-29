import { useState } from 'react';
import { useLeetCodeAuth } from '../contexts/LeetCodeAuthContext';

const LeetCodeLogin = () => {
  const [inputUsername, setInputUsername] = useState('');
  const { login, isLoading, error } = useLeetCodeAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      // Extract username from URL if user enters a full URL
      let username = inputUsername.trim();
      
      // Handle different URL formats
      if (username.includes('leetcode.com')) {
        // Handle full URL format - matches both leetcode.com/username and leetcode.com/u/username
        const urlMatch = username.match(/leetcode\.com\/(u\/)?([^/]+)\/?/);
        if (urlMatch && urlMatch[2]) {
          username = urlMatch[2];
        }
      }
      
      console.log("Attempting login with username:", username);
      await login(username);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Connect with LeetCode</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Enter your LeetCode username to sync your stats
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          {error.includes("not found") && (
            <div className="mt-2 text-sm">
              Make sure you're using your LeetCode username, not your email address.
              <br />
              You can find your username in your LeetCode profile URL: leetcode.com/u/<strong>username</strong>/
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="username" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            LeetCode Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="Enter your LeetCode username"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 
                      border border-gray-300 dark:border-gray-600 rounded-md 
                      shadow-sm focus:outline-none focus:ring-indigo-500 
                      focus:border-indigo-500 text-gray-900 dark:text-white"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent 
                     rounded-md shadow-sm text-sm font-medium text-white 
                     bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : (
              'Connect Account'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This will only access your public LeetCode profile information.
        </p>
      </div>
    </div>
  );
};

export default LeetCodeLogin;
