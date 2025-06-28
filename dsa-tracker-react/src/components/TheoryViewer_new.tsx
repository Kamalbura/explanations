import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BookOpen, CheckCircle, ArrowLeft, ArrowRight, Search, X } from 'lucide-react'

const TheoryViewer = () => {
  const [allFiles, setAllFiles] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [fileContent, setFileContent] = useState('')
  const [loadingContent, setLoadingContent] = useState(false)

  // Load all files from all directories
  useEffect(() => {
    const loadAllFiles = async () => {
      try {
        // First, get all directories
        const dirResponse = await fetch('/api/files/')
        if (!dirResponse.ok) throw new Error('Failed to load directories')
        
        const dirData = await dirResponse.json()
        const directories = dirData.files.filter((item: any) => item.isDirectory)
        
        // Then load files from each directory
        const allFilesList: any[] = []
        
        for (const dir of directories) {
          try {
            const filesResponse = await fetch(`/api/files/${encodeURIComponent(dir.path)}`)
            if (filesResponse.ok) {
              const filesData = await filesResponse.json()
              const mdFiles = filesData.files
                .filter((file: any) => !file.isDirectory && file.name.endsWith('.md'))
                .map((file: any) => ({
                  ...file,
                  directory: dir.name,
                  fullPath: file.path,
                  displayName: `${dir.name}/${file.name}`,
                  category: dir.name.replace(/^\d+_/, '').replace(/_/g, ' ')
                }))
              
              allFilesList.push(...mdFiles)
            }
          } catch (error) {
            console.error(`Error loading files from ${dir.name}:`, error)
          }
        }
        
        setAllFiles(allFilesList)
        
        // Select first file if available
        if (allFilesList.length > 0) {
          const firstFile = allFilesList[0]
          setSelectedFile(firstFile)
          await loadFileContent(firstFile.fullPath)
        }
      } catch (error) {
        console.error('Failed to load files:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAllFiles()
  }, [])

  const loadFileContent = async (filePath: string) => {
    setLoadingContent(true)
    try {
      const response = await fetch(`/api/content/${encodeURIComponent(filePath)}`)
      if (response.ok) {
        const data = await response.json()
        setFileContent(data.content || '')
      } else {
        setFileContent('Failed to load file content')
      }
    } catch (error) {
      console.error('Error loading file content:', error)
      setFileContent('Error loading file content')
    } finally {
      setLoadingContent(false)
    }
  }

  const handleFileSelect = async (file: any) => {
    setSelectedFile(file)
    await loadFileContent(file.fullPath)
  }

  const filteredFiles = allFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.directory.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const markAsRead = (filePath: string) => {
    setAllFiles(prev => prev.map(file =>
      file.fullPath === filePath ? { ...file, isRead: true } : file
    ))
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setSearchTerm('')
    }
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
      <div className="w-80 card h-fit max-h-full overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Theory & Concepts
            </h2>
            
            {/* Search Toggle */}
            <button
              onClick={toggleSearch}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isSearchOpen ? (
                <X className="w-5 h-5 text-gray-500" />
              ) : (
                <Search className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* Search Input - Only show when search is open */}
          {isSearchOpen && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* File List */}
        <div className="mt-4 space-y-1">
          {filteredFiles.map(file => (
            <button
              key={file.fullPath}
              onClick={() => handleFileSelect(file)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                selectedFile?.fullPath === file.fullPath
                  ? 'bg-primary-50 border-l-4 border-primary-500 dark:bg-primary-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                  {file.name.replace('.md', '')}
                </h3>
                {file.isRead && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="truncate">{file.category}</span>
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  <span>{(file.size / 1024).toFixed(1)}KB</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 card">
        {selectedFile ? (
          <div className="h-full overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedFile.name.replace('.md', '')}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{selectedFile.category}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>📁 {selectedFile.directory}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>{(selectedFile.size / 1024).toFixed(1)}KB</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!selectedFile.isRead && (
                    <button
                      onClick={() => markAsRead(selectedFile.fullPath)}
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
            {loadingContent ? (
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
                  {fileContent}
                </ReactMarkdown>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500">
                <ArrowLeft className="w-4 h-4" />
                <span>Previous File</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500">
                <span>Next File</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a file to get started
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose from the files on the left to begin reading.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TheoryViewer
