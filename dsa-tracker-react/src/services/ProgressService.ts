import * as XLSX from 'xlsx'

export interface StudyProgress {
  id: string
  title: string
  category: string
  filePath: string
  isCompleted: boolean
  completedAt?: string
  timeSpent: number // in minutes
  lastStudied?: string
  difficulty: 'easy' | 'medium' | 'hard'
  notes?: string
}

export interface StudySession {
  id: string
  materialId: string
  startTime: string
  endTime: string
  duration: number // in minutes
  date: string
}

export interface ProgressStats {
  totalMaterials: number
  completedMaterials: number
  totalTimeSpent: number
  currentStreak: number
  lastStudyDate?: string
  categoriesProgress: Record<string, { completed: number; total: number }>
}

class ProgressService {
  private STORAGE_KEY = 'dsa_study_progress'
  private SESSIONS_KEY = 'dsa_study_sessions'
  private SETTINGS_KEY = 'dsa_progress_settings'

  // Initialize default study materials
  private defaultMaterials: Omit<StudyProgress, 'isCompleted' | 'timeSpent'>[] = [
    // Two Pointers
    { id: '01_two_pointers_theory', title: 'Two Pointers Theory', category: '01_Two_Pointers', filePath: '01_Two_Pointers/THEORY_COMPLETE.md', difficulty: 'easy' },
    { id: '01_two_pointers_problems', title: 'Two Pointers Problems', category: '01_Two_Pointers', filePath: '01_Two_Pointers/PROBLEMS_SOLUTIONS.md', difficulty: 'medium' },
    
    // Sliding Window
    { id: '02_sliding_window_theory', title: 'Sliding Window Theory', category: '02_Sliding_Window', filePath: '02_Sliding_Window/THEORY_COMPLETE.md', difficulty: 'easy' },
    
    // Binary Search
    { id: '03_binary_search_theory', title: 'Binary Search Theory', category: '03_Binary_Search', filePath: '03_Binary_Search/THEORY_COMPLETE.md', difficulty: 'medium' },
    { id: '03_binary_search_problems', title: 'Binary Search Problems', category: '03_Binary_Search', filePath: '03_Binary_Search/PROBLEMS_SOLUTIONS.md', difficulty: 'medium' },
    { id: '03_binary_search_templates', title: 'Binary Search Templates', category: '03_Binary_Search', filePath: '03_Binary_Search/TEMPLATE_LIBRARY.md', difficulty: 'hard' },
    
    // Dynamic Programming
    { id: '04_dp_theory', title: 'Dynamic Programming Theory', category: '04_Dynamic_Programming', filePath: '04_Dynamic_Programming/THEORY_COMPLETE.md', difficulty: 'hard' },
    
    // Greedy Algorithms
    { id: '05_greedy_theory', title: 'Greedy Algorithms Theory', category: '05_Greedy_Algorithms', filePath: '05_Greedy_Algorithms/PRACTICE_SCHEDULE.md', difficulty: 'medium' },
    { id: '05_greedy_problems', title: 'Greedy Problems', category: '05_Greedy_Algorithms', filePath: '05_Greedy_Algorithms/PROBLEMS_SOLUTIONS.md', difficulty: 'medium' },
    
    // Backtracking
    { id: '06_backtracking_theory', title: 'Backtracking Theory', category: '06_Backtracking', filePath: '06_Backtracking/THEORY_COMPLETE.md', difficulty: 'hard' },
    { id: '06_backtracking_problems', title: 'Backtracking Problems', category: '06_Backtracking', filePath: '06_Backtracking/PROBLEMS_SOLUTIONS.md', difficulty: 'hard' },
    { id: '06_backtracking_templates', title: 'Backtracking Templates', category: '06_Backtracking', filePath: '06_Backtracking/TEMPLATE_LIBRARY.md', difficulty: 'hard' },
    
    // Graph Algorithms
    { id: '07_graph_theory', title: 'Graph Algorithms Theory', category: '07_Graph_Algorithms', filePath: '07_Graph_Algorithms/THEORY_COMPLETE.md', difficulty: 'hard' },
    { id: '07_graph_problems', title: 'Graph Problems', category: '07_Graph_Algorithms', filePath: '07_Graph_Algorithms/PROBLEMS_SOLUTIONS.md', difficulty: 'hard' },
    { id: '07_graph_templates', title: 'Graph Templates', category: '07_Graph_Algorithms', filePath: '07_Graph_Algorithms/TEMPLATE_LIBRARY.md', difficulty: 'hard' },
    
    // Tree Algorithms
    { id: '08_tree_theory', title: 'Tree Algorithms Theory', category: '08_Tree_Algorithms', filePath: '08_Tree_Algorithms/THEORY_COMPLETE.md', difficulty: 'medium' },
    { id: '08_tree_problems', title: 'Tree Problems', category: '08_Tree_Algorithms', filePath: '08_Tree_Algorithms/PROBLEMS_SOLUTIONS.md', difficulty: 'medium' },
    { id: '08_tree_templates', title: 'Tree Templates', category: '08_Tree_Algorithms', filePath: '08_Tree_Algorithms/TEMPLATE_LIBRARY.md', difficulty: 'hard' },
    
    // Stack & Queue
    { id: '09_stack_queue_theory', title: 'Stack & Queue Theory', category: '09_Stack_Queue', filePath: '09_Stack_Queue/THEORY_COMPLETE.md', difficulty: 'easy' },
    { id: '09_stack_queue_problems', title: 'Stack & Queue Problems', category: '09_Stack_Queue', filePath: '09_Stack_Queue/PROBLEMS_WITH_SOLUTIONS.md', difficulty: 'medium' },
    
    // Heap & Priority Queue
    { id: '10_heap_theory', title: 'Heap & Priority Queue Theory', category: '10_Heap_Priority_Queue', filePath: '10_Heap_Priority_Queue/THEORY_COMPLETE.md', difficulty: 'medium' },
    { id: '10_heap_problems', title: 'Heap Problems', category: '10_Heap_Priority_Queue', filePath: '10_Heap_Priority_Queue/PROBLEMS_WITH_SOLUTIONS.md', difficulty: 'hard' },
  ]

  // Get all progress data
  getProgress(): StudyProgress[] {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    
    // Initialize with default materials
    const initialProgress: StudyProgress[] = this.defaultMaterials.map(material => ({
      ...material,
      isCompleted: false,
      timeSpent: 0
    }))
    
    this.saveProgress(initialProgress)
    return initialProgress
  }

  // Save progress data
  saveProgress(progress: StudyProgress[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress))
  }

  // Mark material as completed
  markAsCompleted(materialId: string, notes?: string): void {
    const progress = this.getProgress()
    const materialIndex = progress.findIndex(p => p.id === materialId)
    
    if (materialIndex !== -1) {
      progress[materialIndex].isCompleted = true
      progress[materialIndex].completedAt = new Date().toISOString()
      progress[materialIndex].lastStudied = new Date().toISOString()
      if (notes) progress[materialIndex].notes = notes
      
      this.saveProgress(progress)
    }
  }

  // Mark material as incomplete
  markAsIncomplete(materialId: string): void {
    const progress = this.getProgress()
    const materialIndex = progress.findIndex(p => p.id === materialId)
    
    if (materialIndex !== -1) {
      progress[materialIndex].isCompleted = false
      progress[materialIndex].completedAt = undefined
      
      this.saveProgress(progress)
    }
  }

  // Start study session
  startStudySession(materialId: string): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session: StudySession = {
      id: sessionId,
      materialId,
      startTime: new Date().toISOString(),
      endTime: '',
      duration: 0,
      date: new Date().toISOString().split('T')[0]
    }
    
    const sessions = this.getSessions()
    sessions.push(session)
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions))
    
    return sessionId
  }

  // End study session
  endStudySession(sessionId: string): void {
    const sessions = this.getSessions()
    const sessionIndex = sessions.findIndex(s => s.id === sessionId)
    
    if (sessionIndex !== -1) {
      const session = sessions[sessionIndex]
      const endTime = new Date()
      const startTime = new Date(session.startTime)
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)) // in minutes
      
      sessions[sessionIndex].endTime = endTime.toISOString()
      sessions[sessionIndex].duration = duration
      
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions))
      
      // Update material time spent
      this.addTimeSpent(session.materialId, duration)
    }
  }

  // Add time spent to a material
  addTimeSpent(materialId: string, minutes: number): void {
    const progress = this.getProgress()
    const materialIndex = progress.findIndex(p => p.id === materialId)
    
    if (materialIndex !== -1) {
      progress[materialIndex].timeSpent += minutes
      progress[materialIndex].lastStudied = new Date().toISOString()
      
      this.saveProgress(progress)
    }
  }

  // Get study sessions
  getSessions(): StudySession[] {
    const stored = localStorage.getItem(this.SESSIONS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  // Get progress statistics
  getStats(): ProgressStats {
    const progress = this.getProgress()
    const sessions = this.getSessions()
    
    const totalMaterials = progress.length
    const completedMaterials = progress.filter(p => p.isCompleted).length
    const totalTimeSpent = progress.reduce((total, p) => total + p.timeSpent, 0)
    
    // Calculate categories progress
    const categoriesProgress: Record<string, { completed: number; total: number }> = {}
    progress.forEach(p => {
      if (!categoriesProgress[p.category]) {
        categoriesProgress[p.category] = { completed: 0, total: 0 }
      }
      categoriesProgress[p.category].total++
      if (p.isCompleted) {
        categoriesProgress[p.category].completed++
      }
    })
    
    // Calculate current streak
    const currentStreak = this.calculateStreak()
    
    // Get last study date
    const lastStudyDate = progress
      .filter(p => p.lastStudied)
      .sort((a, b) => new Date(b.lastStudied!).getTime() - new Date(a.lastStudied!).getTime())[0]?.lastStudied
    
    return {
      totalMaterials,
      completedMaterials,
      totalTimeSpent,
      currentStreak,
      lastStudyDate,
      categoriesProgress
    }
  }

  // Calculate study streak
  private calculateStreak(): number {
    const sessions = this.getSessions()
    if (sessions.length === 0) return 0
    
    // Group sessions by date
    const sessionsByDate = sessions.reduce((acc, session) => {
      const date = session.date
      if (!acc[date]) acc[date] = []
      acc[date].push(session)
      return acc
    }, {} as Record<string, StudySession[]>)
    
    // Get sorted dates
    const dates = Object.keys(sessionsByDate).sort().reverse()
    
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
    
    for (const date of dates) {
      const daysDiff = Math.floor((new Date(today).getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  // Reset all progress
  resetProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem(this.SESSIONS_KEY)
    localStorage.removeItem(this.SETTINGS_KEY)
    
    // Reinitialize with default materials
    this.getProgress()
  }

  // Export progress to Excel
  exportToExcel(): void {
    const progress = this.getProgress()
    const sessions = this.getSessions()
    const stats = this.getStats()
    
    // Prepare progress data
    const progressData = progress.map(p => ({
      'Material ID': p.id,
      'Title': p.title,
      'Category': p.category,
      'File Path': p.filePath,
      'Difficulty': p.difficulty,
      'Completed': p.isCompleted ? 'Yes' : 'No',
      'Completed At': p.completedAt ? new Date(p.completedAt).toLocaleString() : '',
      'Time Spent (minutes)': p.timeSpent,
      'Last Studied': p.lastStudied ? new Date(p.lastStudied).toLocaleString() : '',
      'Notes': p.notes || ''
    }))
    
    // Prepare sessions data
    const sessionsData = sessions.map(s => ({
      'Session ID': s.id,
      'Material ID': s.materialId,
      'Date': s.date,
      'Start Time': new Date(s.startTime).toLocaleString(),
      'End Time': s.endTime ? new Date(s.endTime).toLocaleString() : '',
      'Duration (minutes)': s.duration
    }))
    
    // Prepare summary data
    const summaryData = [
      { 'Metric': 'Total Materials', 'Value': stats.totalMaterials },
      { 'Metric': 'Completed Materials', 'Value': stats.completedMaterials },
      { 'Metric': 'Completion Percentage', 'Value': `${((stats.completedMaterials / stats.totalMaterials) * 100).toFixed(1)}%` },
      { 'Metric': 'Total Time Spent (hours)', 'Value': (stats.totalTimeSpent / 60).toFixed(1) },
      { 'Metric': 'Current Streak (days)', 'Value': stats.currentStreak },
      { 'Metric': 'Last Study Date', 'Value': stats.lastStudyDate ? new Date(stats.lastStudyDate).toLocaleDateString() : 'Never' }
    ]
    
    // Create workbook
    const workbook = XLSX.utils.book_new()
    
    // Add worksheets
    const progressSheet = XLSX.utils.json_to_sheet(progressData)
    const sessionsSheet = XLSX.utils.json_to_sheet(sessionsData)
    const summarySheet = XLSX.utils.json_to_sheet(summaryData)
    
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
    XLSX.utils.book_append_sheet(workbook, progressSheet, 'Progress')
    XLSX.utils.book_append_sheet(workbook, sessionsSheet, 'Sessions')
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `DSA_Study_Progress_${timestamp}.xlsx`
    
    // Save file
    XLSX.writeFile(workbook, filename)
  }

  // Import progress from Excel (for future enhancement)
  async importFromExcel(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          
          // Read progress sheet
          const progressSheetName = workbook.SheetNames.find((name: string) => name.toLowerCase().includes('progress'))
          if (progressSheetName) {
            const progressSheet = workbook.Sheets[progressSheetName]
            const progressData = XLSX.utils.sheet_to_json(progressSheet)
            
            // Convert back to StudyProgress format
            const importedProgress: StudyProgress[] = progressData.map((row: any) => ({
              id: row['Material ID'],
              title: row['Title'],
              category: row['Category'],
              filePath: row['File Path'],
              difficulty: row['Difficulty'],
              isCompleted: row['Completed'] === 'Yes',
              completedAt: row['Completed At'] ? new Date(row['Completed At']).toISOString() : undefined,
              timeSpent: row['Time Spent (minutes)'] || 0,
              lastStudied: row['Last Studied'] ? new Date(row['Last Studied']).toISOString() : undefined,
              notes: row['Notes'] || undefined
            }))
            
            this.saveProgress(importedProgress)
          }
          
          resolve()
        } catch (error) {
          reject(error)
        }
      }
      reader.readAsBinaryString(file)
    })
  }

  // Get material by ID
  getMaterial(materialId: string): StudyProgress | undefined {
    const progress = this.getProgress()
    return progress.find(p => p.id === materialId)
  }

  // Get materials by category
  getMaterialsByCategory(category: string): StudyProgress[] {
    const progress = this.getProgress()
    return progress.filter(p => p.category === category)
  }

  // Get recent study activity
  getRecentActivity(days: number = 7): StudySession[] {
    const sessions = this.getSessions()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return sessions
      .filter(s => new Date(s.startTime) >= cutoffDate)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  }
}

export const progressService = new ProgressService()
