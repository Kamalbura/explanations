import type { TheoryContent } from '../App'
import { LocalFileService, type TopicContent } from './LocalFileService'

// Service to load markdown files from your explanations directory
export class ContentService {
  
  static async loadTheoryContent(): Promise<TheoryContent[]> {
    try {
      // Load from your actual topic directories
      const topics = await LocalFileService.loadAllTopics()
      
      // Convert TopicContent to TheoryContent format for app compatibility
      return topics.map(topic => ({
        id: topic.id,
        title: topic.title,
        category: topic.category,
        filePath: topic.theoryFile || `${topic.id}/THEORY_COMPLETE.md`,
        content: topic.theoryContent,
        readingTime: topic.readingTime,
        isRead: topic.isRead
      }))
    } catch (error) {
      console.error('Error loading theory content:', error)
      return []
    }
  }

  /**
   * Get problems content for all topics
   */
  static async loadProblemCollections(): Promise<TopicContent[]> {
    try {
      return await LocalFileService.loadAllTopics()
    } catch (error) {
      console.error('Error loading problems content:', error)
      return []
    }
  }

  /**
   * Get local progress from localStorage
   */
  static getLocalProgress() {
    try {
      const progress = localStorage.getItem('dsa-progress')
      return progress ? JSON.parse(progress) : {}
    } catch (error) {
      console.error('Error loading local progress:', error)
      return {}
    }
  }

  /**
   * Save progress to localStorage
   */
  static saveLocalProgress(progress: any) {
    try {
      localStorage.setItem('dsa-progress', JSON.stringify(progress))
    } catch (error) {
      console.error('Error saving local progress:', error)
    }
  }

  /**
   * Get study plan based on your 20-day bootcamp
   */
  static async getStudyPlan() {
    const topics = LocalFileService.getAvailableTopics()
    
    // Create a 20-day study plan based on your topics
    const plan = {
      totalDays: 20,
      currentDay: 1,
      topics: topics.map((topic, index) => ({
        ...topic,
        day: Math.floor(index / 0.5) + 1, // 2 topics every 2 days roughly
        status: 'not-started',
        estimatedHours: 4
      }))
    }
    
    return plan
  }

  /**
   * Get available categories
   */
  static getAvailableCategories(): string[] {
    const topics = LocalFileService.getAvailableTopics()
    return Array.from(new Set(topics.map(topic => topic.category)))
  }
}