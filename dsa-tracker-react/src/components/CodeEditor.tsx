import { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { Play, Save, Download, Upload, RotateCcw, Settings } from 'lucide-react'

const CodeEditor = () => {
  const [language, setLanguage] = useState('python')
  const [theme, setTheme] = useState('vs-dark')
  const [fontSize, setFontSize] = useState(14)
  const [selectedProblem, setSelectedProblem] = useState('two-sum')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const editorRef = useRef<any>(null)

  const [code, setCode] = useState(`# Two Sum Problem
# Given an array of integers nums and an integer target, 
# return indices of the two numbers such that they add up to target.

def two_sum(nums, target):
    """
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    
    return []

# Test cases
if __name__ == "__main__":
    # Test case 1
    nums1 = [2, 7, 11, 15]
    target1 = 9
    result1 = two_sum(nums1, target1)
    print(f"Input: {nums1}, Target: {target1}")
    print(f"Output: {result1}")
    print(f"Expected: [0, 1]")
    print()
    
    # Test case 2
    nums2 = [3, 2, 4]
    target2 = 6
    result2 = two_sum(nums2, target2)
    print(f"Input: {nums2}, Target: {target2}")
    print(f"Output: {result2}")
    print(f"Expected: [1, 2]")`)

  const problems = [
    { id: 'two-sum', title: 'Two Sum', difficulty: 'easy' },
    { id: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'easy' },
    { id: 'binary-tree-inorder', title: 'Binary Tree Inorder Traversal', difficulty: 'easy' },
    { id: 'merge-intervals', title: 'Merge Intervals', difficulty: 'medium' },
    { id: 'word-ladder', title: 'Word Ladder', difficulty: 'hard' },
  ]

  const languages = [
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚡' },
    { id: 'go', name: 'Go', icon: '🔵' },
  ]

  const themes = [
    { id: 'vs-dark', name: 'Dark' },
    { id: 'vs-light', name: 'Light' },
    { id: 'hc-black', name: 'High Contrast Dark' },
  ]

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput('Running code...\n')
    
    // Simulate code execution
    setTimeout(() => {
      setOutput(`Input: [2, 7, 11, 15], Target: 9
Output: [0, 1]
Expected: [0, 1]

Input: [3, 2, 4], Target: 6
Output: [1, 2]
Expected: [1, 2]

✅ All test cases passed!
⏱️ Execution time: 0.23ms
🔢 Time complexity: O(n)
💾 Space complexity: O(n)`)
      setIsRunning(false)
    }, 2000)
  }

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedProblem}.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'cpp'}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetCode = () => {
    setCode(`# ${problems.find(p => p.id === selectedProblem)?.title}
# TODO: Implement solution

def solution():
    pass

# Test cases
if __name__ == "__main__":
    pass`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'hard':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Code Editor</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Practice coding problems with instant feedback
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedProblem}
            onChange={(e) => setSelectedProblem(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            {problems.map(problem => (
              <option key={problem.id} value={problem.id}>
                {problem.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Problem Info */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {problems.find(p => p.id === selectedProblem)?.title}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              getDifficultyColor(problems.find(p => p.id === selectedProblem)?.difficulty || 'easy')
            }`}>
              {problems.find(p => p.id === selectedProblem)?.difficulty}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="btn-primary flex items-center space-x-2"
            >
              <Play size={16} />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>
            <button onClick={saveCode} className="btn-secondary flex items-center space-x-2">
              <Save size={16} />
              <span>Save</span>
            </button>
            <button onClick={resetCode} className="btn-secondary flex items-center space-x-2">
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor and Output */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Code Editor</h3>
            
            <div className="flex items-center space-x-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>
                    {lang.icon} {lang.name}
                  </option>
                ))}
              </select>
              
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {themes.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              
              <input
                type="range"
                min="12"
                max="20"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-16"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {fontSize}px
              </span>
            </div>
          </div>
          
          <div className="h-96">
            <Editor
              height="100%"
              language={language}
              theme={theme}
              value={code}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              options={{
                fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Output</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <Settings size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
            {output || (
              <div className="text-gray-400">
                Click "Run Code" to see output here...
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>💡 Tip: Use Ctrl+Enter to run code quickly</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                Copy Output
              </button>
              <button className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel - Test Cases */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Test Cases</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Test Case 1</span>
              <span className="text-xs text-green-600 dark:text-green-400">✅ Passed</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <div>Input: [2, 7, 11, 15], target = 9</div>
              <div>Expected: [0, 1]</div>
              <div>Output: [0, 1]</div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Test Case 2</span>
              <span className="text-xs text-green-600 dark:text-green-400">✅ Passed</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <div>Input: [3, 2, 4], target = 6</div>
              <div>Expected: [1, 2]</div>
              <div>Output: [1, 2]</div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Test Case 3</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">⏳ Not run</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <div>Input: [3, 3], target = 6</div>
              <div>Expected: [0, 1]</div>
              <div>Output: -</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeEditor
