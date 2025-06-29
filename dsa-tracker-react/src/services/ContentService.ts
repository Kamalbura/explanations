import type { TheoryContent } from '../App'
import { LocalFileService, type TopicContent } from './LocalFileService'
import { LeetCodeService } from './LeetCodeService'

// Base API URL for content server
const API_BASE_URL = 'http://localhost:3001/api';

// Service to load markdown files from your explanations directory
export class ContentService {
  
  /**
   * Load all theory content from the content server
   */
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
   * Get directory contents directly from the content server
   */
  static async getDirectoryContents(dirPath: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${dirPath}`);
      if (!response.ok) {
        throw new Error(`Failed to load directory: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.files;
    } catch (error) {
      console.error(`Error loading directory contents: ${dirPath}`, error);
      return [];
    }
  }
  
  /**
   * Get file content directly from the content server
   */
  static async getFileContent(filePath: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${filePath}`);
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error(`Error loading file content: ${filePath}`, error);
      return '';
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
    const topics = await LocalFileService.getAvailableTopics()
    
    // Create a 20-day study plan based on your topics
    const plan = {
      totalDays: 20,
      currentDay: 1,
      topics: topics.map((topic: { id: string, title: string, category: string }, index: number) => ({
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
  static async getAvailableCategories(): Promise<string[]> {
    const topics = await LocalFileService.getAvailableTopics()
    return Array.from(new Set(topics.map((topic: { id: string, title: string, category: string }) => topic.category)))
  }
  
  /**
   * Navigate between related topics
   * This is useful for previous/next navigation
   */
  static async getNavigationLinks(currentFilePath: string): Promise<{previous?: TheoryContent, next?: TheoryContent}> {
    try {
      const allContent = await this.loadTheoryContent();
      const currentIndex = allContent.findIndex(item => item.filePath === currentFilePath);
      
      if (currentIndex === -1) {
        return {};
      }
      
      return {
        previous: currentIndex > 0 ? allContent[currentIndex - 1] : undefined,
        next: currentIndex < allContent.length - 1 ? allContent[currentIndex + 1] : undefined
      };
    } catch (error) {
      console.error('Error getting navigation links:', error);
      return {};
    }
  }
  
  /**
   * Get LeetCode problems associated with a specific DSA topic
   */
  static async getLeetCodeProblemsForTopic(topic: string): Promise<any[]> {
    try {
      // Try to map our DSA topics to LeetCode tags
      const tagMappings: Record<string, string[]> = {
        'two pointers': ['two-pointers', 'two-pointer'],
        'sliding window': ['sliding-window'],
        'binary search': ['binary-search'],
        'dynamic programming': ['dynamic-programming'],
        'greedy algorithms': ['greedy'],
        'backtracking': ['backtracking'],
        'graph algorithms': ['graph', 'depth-first-search', 'breadth-first-search'],
        'tree algorithms': ['tree', 'binary-tree', 'binary-search-tree', 'depth-first-search'],
        'stack queue': ['stack', 'queue', 'monotonic-stack'],
        'heap priority queue': ['heap', 'priority-queue']
      };
      
      const topicLower = topic.toLowerCase();
      const matchedTags = tagMappings[topicLower] || [topicLower];
      
      // Use the LeetCodeService to get problems for these tags
      const problems = [];
      for (const tag of matchedTags) {
        try {
          // Use our LeetCodeService if it's been imported and initialized
          if (typeof LeetCodeService !== 'undefined') {
            const tagProblems = await LeetCodeService.getProblemsByTag(tag, 20);
            problems.push(...tagProblems);
          } else {
            // Fallback to our own cached data if needed
            const response = await fetch(`${API_BASE_URL}/leetcode/problems/bytag/${tag}`);
            if (response.ok) {
              const data = await response.json();
              problems.push(...data);
            }
          }
        } catch (tagError) {
          console.warn(`Error fetching problems for tag ${tag}:`, tagError);
          continue; // Try next tag if one fails
        }
      }
      
      // Remove duplicates
      const uniqueProblems = Array.from(new Map(problems.map((p: any) => [p.titleSlug, p])).values());
      return uniqueProblems;
    } catch (error) {
      console.error(`Error fetching LeetCode problems for topic ${topic}:`, error);
      return [];
    }
  }
}

