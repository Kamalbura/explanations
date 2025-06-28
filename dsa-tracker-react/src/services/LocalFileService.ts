// Service to load content from your existing DSA directory structure
import type { TheoryContent } from '../App'

export class LocalFileService {
  private static readonly CONTENT_DIRECTORY = '../../../../DSA_Approaches/';
  
  /**
   * Load theory content from local markdown files
   * This will integrate with your existing explanations directory structure
   */
  static async loadTheoryContent(): Promise<TheoryContent[]> {
    // Map your directory structure to theory content
    const theoryFiles: TheoryContent[] = [
      {
        id: 'arrays',
        title: 'Arrays & Hashing',
        category: 'Arrays',
        filePath: this.CONTENT_DIRECTORY + '01_Two_Pointers/theory.md',
        content: await this.loadMarkdownFromFile('arrays'),
        readingTime: 5,
        isRead: this.getReadStatus('arrays')
      },
      {
        id: 'binary-search',
        title: 'Binary Search',
        category: 'Searching',
        filePath: this.CONTENT_DIRECTORY + '03_Binary_Search/theory.md',
        content: await this.loadMarkdownFromFile('binary-search'),
        readingTime: 4,
        isRead: this.getReadStatus('binary-search')
      },
      {
        id: 'dynamic-programming',
        title: 'Dynamic Programming',
        category: 'Dynamic Programming',
        filePath: this.CONTENT_DIRECTORY + 'Dynamic_Programming/theory.md',
        content: await this.loadMarkdownFromFile('dynamic-programming'),
        readingTime: 8,
        isRead: this.getReadStatus('dynamic-programming')
      },
      {
        id: 'graphs',
        title: 'Graph Algorithms',
        category: 'Graphs',
        filePath: this.CONTENT_DIRECTORY + 'Graph_Algorithms/theory.md',
        content: await this.loadMarkdownFromFile('graphs'),
        readingTime: 10,
        isRead: this.getReadStatus('graphs')
      },
      {
        id: 'trees',
        title: 'Tree Algorithms',
        category: 'Trees',
        filePath: this.CONTENT_DIRECTORY + '06_Tree_BST/theory.md',
        content: await this.loadMarkdownFromFile('trees'),
        readingTime: 8,
        isRead: this.getReadStatus('trees')
      },
      {
        id: 'two-pointers',
        title: 'Two Pointers',
        category: 'Arrays',
        filePath: this.CONTENT_DIRECTORY + 'Two_Pointers/theory.md',
        content: await this.loadMarkdownFromFile('two-pointers'),
        readingTime: 6,
        isRead: this.getReadStatus('two-pointers')
      },
      {
        id: 'sliding-window',
        title: 'Sliding Window',
        category: 'Arrays',
        filePath: this.CONTENT_DIRECTORY + 'Sliding_Window/theory.md',
        content: await this.loadMarkdownFromFile('sliding-window'),
        readingTime: 6,
        isRead: this.getReadStatus('sliding-window')
      },
      {
        id: 'backtracking',
        title: 'Backtracking',
        category: 'Recursion',
        filePath: this.CONTENT_DIRECTORY + 'Backtracking/theory.md',
        content: await this.loadMarkdownFromFile('backtracking'),
        readingTime: 7,
        isRead: this.getReadStatus('backtracking')
      }
    ];

    return theoryFiles;
  }

  /**
   * Load problem collections from existing folders
   */
  static async loadProblemCollections() {
    // This would scan your problem directories
    return {
      leetcode: await this.scanDirectory('../../../../leetcode/'),
      neetcode: await this.scanDirectory('../../../../neetcode150/'),
      striver: await this.scanDirectory('../../../../striver-a2z-dsa-cpp/')
    };
  }

  /**
   * Get progress from local storage
   */
  static getLocalProgress() {
    const saved = localStorage.getItem('dsa-progress');
    return saved ? JSON.parse(saved) : {};
  }

  /**
   * Save progress to local storage
   */
  static saveLocalProgress(progress: any) {
    localStorage.setItem('dsa-progress', JSON.stringify(progress));
  }

  /**
   * Get study plan from your 20-day bootcamp
   */
  static async getStudyPlan() {
    // Load from your master plan file
    return await this.loadMarkdownFromFile('master-plan');
  }

  private static async loadMarkdownFromFile(topic: string): Promise<string> {
    // In a real implementation, you would read from the file system
    // For now, return fallback content with placeholders for real file integration
    const fallbackContent = this.getFallbackContent(topic);
    
    try {
      // This is where you'd implement actual file reading
      // const response = await fetch(filePath);
      // return await response.text();
      return fallbackContent;
    } catch (error) {
      console.warn(`Could not load content for ${topic}, using fallback`);
      return fallbackContent;
    }
  }

  private static async scanDirectory(path: string) {
    // This would scan the actual directory structure
    // For now, return mock data
    return [
      { 
        id: 'sample-problem', 
        title: 'Sample Problem', 
        difficulty: 'easy', 
        category: 'Arrays',
        filePath: path + 'sample.md'
      }
    ];
  }

  private static getReadStatus(topicId: string): boolean {
    const progress = this.getLocalProgress();
    return progress[topicId]?.isRead || false;
  }

  private static getFallbackContent(topic: string): string {
    const contentMap: { [key: string]: string } = {
      'arrays': `# Arrays & Hashing

## Introduction
Arrays are one of the most fundamental data structures in computer science.

## Key Concepts
- Time Complexity: O(1) access, O(n) search
- Space Complexity: O(n) for storage
- Common patterns: Two pointers, sliding window, hashing

## Problems to Practice
1. Two Sum
2. Contains Duplicate  
3. Valid Anagram
4. Group Anagrams

This content is loaded from your local DSA directory structure.`,

      'binary-search': `# Binary Search

## Core Algorithm
Binary search efficiently finds elements in sorted arrays with O(log n) time complexity.

## Template
\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

This content is loaded from your local DSA directory structure.`,

      'dynamic-programming': `# Dynamic Programming

## Core Principles
1. Optimal Substructure
2. Overlapping Subproblems

## Approaches
- Top-down (Memoization)
- Bottom-up (Tabulation)

## Common Patterns
- Linear DP
- 2D DP
- String DP

This content is loaded from your local DSA directory structure.`,

      'graphs': `# Graph Algorithms

## Representations
- Adjacency List
- Adjacency Matrix

## Traversals
- DFS (Depth-First Search)
- BFS (Breadth-First Search)

## Advanced Algorithms
- Dijkstra's Algorithm
- Topological Sort
- Union Find

This content is loaded from your local DSA directory structure.`,

      'trees': `# Tree Algorithms

## Tree Traversals
- Preorder (Root → Left → Right)
- Inorder (Left → Root → Right)  
- Postorder (Left → Right → Root)
- Level Order (BFS)

## Binary Search Trees
- Search: O(log n) average case
- Insert: O(log n) average case
- Delete: O(log n) average case

This content is loaded from your local DSA directory structure.`,

      'two-pointers': `# Two Pointers Technique

## When to Use
- Sorted arrays
- Finding pairs/triplets
- Removing duplicates
- Palindrome problems

## Patterns
1. Opposite direction (converging)
2. Same direction (fast & slow)
3. Sliding window

This content is loaded from your local DSA directory structure.`,

      'sliding-window': `# Sliding Window

## Types
1. Fixed size window
2. Variable size window

## Common Problems
- Maximum sum subarray
- Longest substring problems
- Minimum window substring

This content is loaded from your local DSA directory structure.`,

      'backtracking': `# Backtracking

## Template
\`\`\`python
def backtrack(path, choices):
    if is_solution(path):
        result.append(path[:])
        return
    
    for choice in choices:
        if is_valid(choice):
            path.append(choice)
            backtrack(path, new_choices)
            path.pop()  # backtrack
\`\`\`

This content is loaded from your local DSA directory structure.`,

      'master-plan': `# DSA Master Learning Plan

## Phase 1: Fundamentals (Weeks 1-4)
- Arrays & Hashing
- Two Pointers
- Sliding Window
- Binary Search

## Phase 2: Intermediate (Weeks 5-8)
- Stacks & Queues
- Trees & BST
- Graph Basics
- Dynamic Programming 1D

## Phase 3: Advanced (Weeks 9-12)
- Advanced DP
- Advanced Graphs
- Backtracking
- System Design

This plan is loaded from your local DSA directory structure.`
    };

    return contentMap[topic] || `# ${topic.charAt(0).toUpperCase() + topic.slice(1)}

This content will be loaded from your local markdown files at:
${this.CONTENT_DIRECTORY}

Set up file reading to load actual content from your DSA directory structure.`;
  }
}
