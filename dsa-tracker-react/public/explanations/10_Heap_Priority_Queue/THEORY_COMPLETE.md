# 🏔️ HEAP & PRIORITY QUEUE: COMPLETE MASTERY GUIDE

## 🧠 **CORE CONCEPT: EFFICIENT PRIORITY MANAGEMENT**

Heap and Priority Queue are about **maintaining order efficiently** while allowing dynamic insertions and deletions. They provide **O(log n) operations** for priority-based access, making them essential for optimization problems.

### **The Heap Mindset:**
```
Heap: Complete binary tree with ordering property
→ Max Heap: Parent ≥ Children (root = maximum)
→ Min Heap: Parent ≤ Children (root = minimum)
→ Key insight: Root always contains the extreme element

Priority Queue: Abstract data type implemented using heap
→ Perfect for: Top-K problems, scheduling, graph algorithms
→ Key insight: Always gives you the "most important" element first
```

---

## 📐 **MATHEMATICAL FOUNDATION**

### **Why Heap is Efficient:**
```
Array-based Complete Binary Tree:
→ Parent of index i: (i-1)/2
→ Left child of index i: 2*i + 1  
→ Right child of index i: 2*i + 2

Height of heap with n elements: floor(log₂(n))
→ Insert/Delete: O(log n) - bubble up/down the height
→ Find min/max: O(1) - always at root
→ Build heap: O(n) - not O(n log n)!

Space: O(n) - compact array representation
```

### **Heap vs Other Data Structures:**
```
Operation    | Array | BST   | Heap
-------------|-------|-------|-------
Find Min/Max | O(n)  | O(log n) | O(1)
Insert       | O(1)  | O(log n) | O(log n)
Delete Min/Max| O(n) | O(log n) | O(log n)
Build from array| O(n)| O(n log n)| O(n)
```

---

## 🎨 **PATTERN TYPES & TEMPLATES**

### **Pattern 1: Top-K Problems (Min/Max Heap)**
**Use Case**: Kth largest/smallest, top K frequent elements
```cpp
// Template: Kth Largest Element
int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap; // Min heap
    
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop(); // Remove smallest
        }
    }
    
    return minHeap.top(); // Kth largest
}
```

**Key Insight**: Use min heap of size k for kth largest, max heap for kth smallest

### **Pattern 2: Merge K Sorted (Min Heap with Custom Comparator)**
**Use Case**: Merge k sorted lists/arrays
```cpp
// Template: Merge K Sorted Lists
struct ListNodeComparator {
    bool operator()(ListNode* a, ListNode* b) {
        return a->val > b->val; // Min heap based on value
    }
};

ListNode* mergeKLists(vector<ListNode*>& lists) {
    priority_queue<ListNode*, vector<ListNode*>, ListNodeComparator> pq;
    
    // Add first node of each list
    for (ListNode* head : lists) {
        if (head) pq.push(head);
    }
    
    ListNode* dummy = new ListNode(0);
    ListNode* current = dummy;
    
    while (!pq.empty()) {
        ListNode* smallest = pq.top();
        pq.pop();
        
        current->next = smallest;
        current = current->next;
        
        if (smallest->next) {
            pq.push(smallest->next);
        }
    }
    
    return dummy->next;
}
```

### **Pattern 3: Sliding Window with Heap**
**Use Case**: Sliding window median, maximum in window
```cpp
// Template: Sliding Window Median
class MedianFinder {
private:
    priority_queue<int> maxHeap; // Left half (smaller elements)
    priority_queue<int, vector<int>, greater<int>> minHeap; // Right half
    
public:
    void addNum(int num) {
        if (maxHeap.empty() || num <= maxHeap.top()) {
            maxHeap.push(num);
        } else {
            minHeap.push(num);
        }
        
        // Balance heaps
        if (maxHeap.size() > minHeap.size() + 1) {
            minHeap.push(maxHeap.top());
            maxHeap.pop();
        } else if (minHeap.size() > maxHeap.size() + 1) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }
    
    double findMedian() {
        if (maxHeap.size() == minHeap.size()) {
            return (maxHeap.top() + minHeap.top()) / 2.0;
        } else {
            return maxHeap.size() > minHeap.size() ? 
                   maxHeap.top() : minHeap.top();
        }
    }
};
```

### **Pattern 4: Graph Algorithms (Dijkstra's)**
**Use Case**: Shortest path, minimum spanning tree
```cpp
// Template: Dijkstra's Shortest Path
vector<int> dijkstra(vector<vector<pair<int, int>>>& graph, int start) {
    int n = graph.size();
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    
    dist[start] = 0;
    pq.push({0, start}); // {distance, node}
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        
        if (d > dist[u]) continue; // Skip if outdated
        
        for (auto [v, weight] : graph[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    
    return dist;
}
```

---

## 🔍 **PROBLEM RECOGNITION PATTERNS**

### **Pattern Recognition Table:**
| **Problem Statement** | **Pattern** | **Heap Type** |
|----------------------|-------------|---------------|
| "Kth largest/smallest element" | Top-K | Min/Max Heap |
| "Top K frequent elements" | Frequency Count + Top-K | Min Heap |
| "Merge K sorted arrays/lists" | Merge K Sorted | Min Heap |
| "Find median in stream" | Two Heaps | Max + Min Heap |
| "Sliding window maximum" | Window + Priority | Max Heap |
| "Shortest path in graph" | Graph Algorithm | Min Heap (Dijkstra) |
| "Meeting rooms/intervals" | Interval Scheduling | Min Heap |
| "Task scheduling" | Greedy + Priority | Custom Heap |

---

## 💻 **IMPLEMENTATION EXAMPLES**

### **Example 1: Top K Frequent Elements**
```cpp
// LeetCode 347: Top K Frequent Elements
vector<int> topKFrequent(vector<int>& nums, int k) {
    // Step 1: Count frequencies
    unordered_map<int, int> freq;
    for (int num : nums) {
        freq[num]++;
    }
    
    // Step 2: Use min heap to keep top k
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    
    for (auto& [num, count] : freq) {
        pq.push({count, num});
        if (pq.size() > k) {
            pq.pop();
        }
    }
    
    // Step 3: Extract result
    vector<int> result;
    while (!pq.empty()) {
        result.push_back(pq.top().second);
        pq.pop();
    }
    
    return result;
}

// Time: O(n log k), Space: O(n + k)
// Key insight: Min heap of size k keeps k most frequent elements
```

### **Example 2: Meeting Rooms II**
```cpp
// LeetCode 253: Meeting Rooms II
// Find minimum number of meeting rooms required

int minMeetingRooms(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    
    // Sort by start time
    sort(intervals.begin(), intervals.end());
    
    // Min heap to track end times of ongoing meetings
    priority_queue<int, vector<int>, greater<int>> pq;
    
    for (auto& interval : intervals) {
        int start = interval[0], end = interval[1];
        
        // If earliest ending meeting has ended, reuse room
        if (!pq.empty() && pq.top() <= start) {
            pq.pop();
        }
        
        // Add current meeting's end time
        pq.push(end);
    }
    
    return pq.size(); // Number of rooms needed
}

// Time: O(n log n), Space: O(n)
// Key insight: Track when rooms become available
```

### **Example 3: Ugly Number II**
```cpp
// LeetCode 264: Ugly Number II
// Find nth ugly number (only factors 2, 3, 5)

int nthUglyNumber(int n) {
    priority_queue<long, vector<long>, greater<long>> pq;
    unordered_set<long> seen;
    
    pq.push(1);
    seen.insert(1);
    
    long ugly = 1;
    for (int i = 0; i < n; i++) {
        ugly = pq.top();
        pq.pop();
        
        // Generate next ugly numbers
        for (int factor : {2, 3, 5}) {
            long nextUgly = ugly * factor;
            if (seen.find(nextUgly) == seen.end()) {
                pq.push(nextUgly);
                seen.insert(nextUgly);
            }
        }
    }
    
    return ugly;
}

// Time: O(n log n), Space: O(n)
// Pattern: Generate sequence using min heap
```

---

## 🧩 **ADVANCED TECHNIQUES**

### **Technique 1: Custom Comparators**
```cpp
// For complex objects, define custom comparison
struct Task {
    int priority, deadline, duration;
};

struct TaskComparator {
    bool operator()(const Task& a, const Task& b) {
        // Higher priority first (max heap behavior)
        if (a.priority != b.priority) 
            return a.priority < b.priority;
        // Earlier deadline first for same priority
        return a.deadline > b.deadline;
    }
};

priority_queue<Task, vector<Task>, TaskComparator> pq;
```

### **Technique 2: Two Heaps Pattern**
```cpp
// For problems requiring both min and max access
class DualHeapStructure {
private:
    priority_queue<int> maxHeap; // Left half
    priority_queue<int, vector<int>, greater<int>> minHeap; // Right half
    
public:
    void balance() {
        if (maxHeap.size() > minHeap.size() + 1) {
            minHeap.push(maxHeap.top());
            maxHeap.pop();
        } else if (minHeap.size() > maxHeap.size() + 1) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }
    
    void addNumber(int num) {
        if (maxHeap.empty() || num <= maxHeap.top()) {
            maxHeap.push(num);
        } else {
            minHeap.push(num);
        }
        balance();
    }
};
```

### **Technique 3: Lazy Deletion in Heap**
```cpp
// For sliding window problems where you can't directly remove
class SlidingWindowMaximum {
private:
    priority_queue<pair<int, int>> pq; // {value, index}
    int windowStart = 0;
    
public:
    int getMax() {
        // Remove outdated elements lazily
        while (!pq.empty() && pq.top().second < windowStart) {
            pq.pop();
        }
        return pq.empty() ? -1 : pq.top().first;
    }
    
    void slideWindow(int newValue, int newIndex) {
        pq.push({newValue, newIndex});
        windowStart++;
    }
};
```

---

## ⚡ **OPTIMIZATION STRATEGIES**

### **Strategy 1: Choose Right Heap Size**
```cpp
// For top-k problems, maintain heap of size k (not n)
// For kth largest: min heap of size k
// For kth smallest: max heap of size k
```

### **Strategy 2: Build Heap Optimally**
```cpp
// Building heap from array: O(n) using heapify
// Better than n insertions: O(n log n)
priority_queue<int> pq(nums.begin(), nums.end()); // O(n)
```

### **Strategy 3: Use std::make_heap for Custom Control**
```cpp
vector<int> nums = {3, 1, 4, 1, 5};
make_heap(nums.begin(), nums.end()); // O(n) max heap

// Custom operations
push_heap(nums.begin(), nums.end()); // After push_back
pop_heap(nums.begin(), nums.end());  // Before pop_back
```

---

## 🎯 **PROBLEM-SOLVING FRAMEWORK**

### **Step 1: Pattern Recognition (30 seconds)**
- Top-k problem? → Heap of size k
- Merge multiple sorted? → Min heap with pointers
- Find median? → Two heaps
- Shortest path? → Dijkstra with min heap
- Interval scheduling? → Min heap for end times
- Stream processing? → Heap for running extremes

### **Step 2: Choose Heap Type (30 seconds)**
```cpp
// For kth largest → Min heap (keep k largest)
priority_queue<int, vector<int>, greater<int>> minHeap;

// For kth smallest → Max heap (keep k smallest)  
priority_queue<int> maxHeap;

// For custom objects → Custom comparator
priority_queue<Object, vector<Object>, CustomComparator> pq;
```

### **Step 3: Implementation (10-15 minutes)**
1. Determine what to store in heap (values, indices, objects)
2. Choose appropriate heap type and comparator
3. Handle the main algorithm logic
4. Extract results in correct order

---

## 🔧 **COMMON PITFALLS & SOLUTIONS**

### **Pitfall 1: Wrong Heap Type for Top-K**
```cpp
// ❌ Wrong: Max heap for kth largest (keeps k smallest)
priority_queue<int> maxHeap; // This gives smallest when size > k

// ✅ Correct: Min heap for kth largest (keeps k largest)
priority_queue<int, vector<int>, greater<int>> minHeap;
```

### **Pitfall 2: Comparator Confusion**
```cpp
// ❌ Wrong: Confused about operator direction
struct Compare {
    bool operator()(int a, int b) {
        return a > b; // This creates MIN heap, not max!
    }
};

// ✅ Correct: Remember the meaning
// return a > b → MIN heap (smaller elements have higher priority)
// return a < b → MAX heap (larger elements have higher priority)
```

### **Pitfall 3: Not Handling Empty Heap**
```cpp
// ❌ Wrong: No empty check
int top = pq.top(); // Undefined behavior if empty!
pq.pop();

// ✅ Correct: Always check before access
if (!pq.empty()) {
    int top = pq.top();
    pq.pop();
}
```

---

## 📊 **COMPLEXITY ANALYSIS**

### **Time Complexity Patterns:**
- **Insert/Delete**: O(log n) - bubble up/down tree height
- **Find Min/Max**: O(1) - always at root
- **Build Heap**: O(n) - heapify is more efficient than n insertions
- **Top-K Problems**: O(n log k) - process n elements, maintain heap of size k

### **Space Complexity:**
- **Basic Heap**: O(n) for n elements
- **Top-K Heap**: O(k) - only store k elements
- **Two Heaps**: O(n) - split elements between two heaps

---

## 🏆 **MASTERY CHECKLIST**

You've mastered Heap/Priority Queue when you can:

- [ ] **Identify the pattern** from problem description in 30 seconds
- [ ] **Choose correct heap type** (min vs max) for top-k problems immediately
- [ ] **Write custom comparators** for complex objects without bugs
- [ ] **Implement two-heap pattern** for median problems
- [ ] **Optimize with lazy deletion** for sliding window problems
- [ ] **Apply to graph algorithms** (Dijkstra, MST)
- [ ] **Handle edge cases** (empty heap, single element)

---

## 🚀 **INTERVIEW SUCCESS TIPS**

1. **Start with Brute Force**: Explain O(n²) or O(n log n) sorting solution
2. **Identify Optimization**: "Can we use a heap to maintain order efficiently?"
3. **Choose Heap Type**: "For kth largest, I'll use a min heap of size k"
4. **Explain Comparator**: "My comparator ensures the heap property is..."
5. **Walk Through Operations**: Show how heap state changes with operations
6. **Analyze Complexity**: "Each operation is O(log k), total is O(n log k)"
7. **Test Edge Cases**: Empty input, k=1, k=n, duplicate elements

---

**💡 Key Insight**: Heaps excel when you need **dynamic access to extremes**. They maintain partial order efficiently, giving you the best element in O(1) while allowing O(log n) updates!

**🎯 Master Heap patterns and you'll solve priority-based problems with confidence and efficiency!**
