import type { TheoryContent } from '../App'
import { LocalFileService } from './LocalFileService'

// Service to load markdown files from the explanations directory
export class ContentService {
  
  static async loadTheoryContent(): Promise<TheoryContent[]> {
    // Use LocalFileService to load content from your existing directory structure
    return await LocalFileService.loadTheoryContent()
  }

  static async loadProblemCollections() {
    return await LocalFileService.loadProblemCollections()
  }

  static getLocalProgress() {
    return LocalFileService.getLocalProgress()
  }

  static saveLocalProgress(progress: any) {
    LocalFileService.saveLocalProgress(progress)
  }

  static async getStudyPlan() {
    return await LocalFileService.getStudyPlan()
  }
}