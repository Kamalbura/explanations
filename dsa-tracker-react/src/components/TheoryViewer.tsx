import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BookOpen, Clock, CheckCircle, ArrowLeft, ArrowRight, Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { ContentService } from '../services/ContentService'
import FileExplorer from './FileExplorer'
import type { TheoryContent } from '../App'

const TheoryViewer = () => {
  const [theoryFiles, setTheoryFiles] = useState<TheoryContent[]>([])
  const [selectedFile, setSelectedFile] = useState<TheoryContent | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'topics' | 'files'>('topics')
  const [selectedFilePath, setSelectedFilePath] = useState<string>('')
  const [fileContent, setFileContent] = useState<string>('')
  const [loadingFile, setLoadingFile] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Load theory files using ContentService
  useEffect(() => {
    const loadContent = async () => {
      try {
        const files = await ContentService.loadTheoryContent()
        setTheoryFiles(files)
        
        // Select first file if available
        if (files.length > 0) {
          setSelectedFile(files[0])
        }
      } catch (error) {
        console.error('Failed to load theory content:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  const filteredFiles = theoryFiles.filter(file =>
    file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileSelect = async (filePath: string) => {
    setLoadingFile(true)
    setSelectedFilePath(filePath)
    setSelectedFile(null) // Clear topic-based selection
    
    try {
      const response = await fetch(`/api/content/${encodeURIComponent(filePath)}`)
      if (response.ok) {
        const data = await response.json()
        setFileContent(data.content || '')
      } else {
        setFileContent('Failed to load file content')
      }
    } catch (error) {
      console.error('Error loading file:', error)
      setFileContent('Error loading file content')
    } finally {
      setLoadingFile(false)
    }
  }

  const markAsRead = (fileId: string) => {
    setTheoryFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, isRead: true } : file
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] space-x-6">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-12' : 'w-80'} card h-fit max-h-full overflow-hidden flex flex-col transition-all duration-300`}>
        <div className="bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            {!isSidebarCollapsed && (
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Theory & Concepts
              </h2>
            )}
            
            <div className="flex items-center space-x-2 ml-auto">
              {/* Search Icon/Bar */}
              {!isSidebarCollapsed && (
                <div className="flex items-center">
                  {!isSearchOpen ? (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="relative flex-1 max-w-xs">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onBlur={() => {
                          if (!searchTerm) setIsSearchOpen(false)
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              )}
              
              {/* Collapse/Expand Button */}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          {/* View Mode Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('topics')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'topics'
                  ? 'bg-white dark:bg-gray-600 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Topics
            </button>
            <button
              onClick={() => setViewMode('files')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'files'
                  ? 'bg-white dark:bg-gray-600 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Files
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        {!isSidebarCollapsed && (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Content based on view mode */}
          {viewMode === 'topics' ? (
            /* File List */
            <div className="p-4 space-y-2">
              {filteredFiles.map(file => (
                <button
                  key={file.id}
                  onClick={() => {
                    setSelectedFile(file)
                    setSelectedFilePath('')
                    setFileContent('')
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    selectedFile?.id === file.id && !selectedFilePath
                      ? 'bg-primary-50 border-l-4 border-primary-500 dark:bg-primary-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {file.title}
                    </h3>
                    {file.isRead && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{file.category}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{file.readingTime}m</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* File Explorer */
            <div className="p-4">
              <FileExplorer 
                onFileSelect={handleFileSelect}
                selectedFile={selectedFilePath}
              />
            </div>
          )}
        </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 card">
        {(selectedFile || selectedFilePath) ? (
          <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedFile ? selectedFile.title : selectedFilePath.split('/').pop()?.replace('.md', '') || 'Document'}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {selectedFile && (
                      <>
                        <span className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{selectedFile.category}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{selectedFile.readingTime} min read</span>
                        </span>
                      </>
                    )}
                    {selectedFilePath && (
                      <span className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{selectedFilePath}</span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {selectedFile && !selectedFile.isRead && (
                    <button
                      onClick={() => markAsRead(selectedFile.id)}
                      className="btn-secondary text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button className="btn-primary text-sm">
                    Practice Problems
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {loadingFile ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({ children, className }) => {
                      const isInline = !className
                      if (isInline) {
                        return (
                          <code className="px-1.5 py-0.5 text-sm bg-gray-100 dark:bg-gray-800 rounded">
                            {children}
                          </code>
                        )
                      }
                      return (
                        <pre className="code-block">
                          <code>{children}</code>
                        </pre>
                      )
                    },
                  }}
                >
                  {selectedFile ? selectedFile.content : fileContent}
                </ReactMarkdown>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500">
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Topic</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500">
                <span>Next Topic</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {viewMode === 'topics' ? 'Select a topic to get started' : 'Select a file to read'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {viewMode === 'topics' 
                  ? 'Choose from the topics on the left to begin learning.'
                  : 'Browse through your explanation files and select any .md file to read.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TheoryViewer;
