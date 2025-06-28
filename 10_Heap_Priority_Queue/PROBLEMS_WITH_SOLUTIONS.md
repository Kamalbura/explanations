# 📚 Heap & Priority Queue: Problem Set

## 🎯 **PRACTICE PROBLEMS BY DIFFICULTY**

### **🟢 EASY PROBLEMS (Foundation Building)**

#### **Problem 1: Kth Largest Element in Array**
```cpp
// LeetCode 215: Kth Largest Element in an Array
int findKthLargest(vector<int>& nums, int k) {
    // Use min heap of size k to keep k largest elements
    priority_queue<int, vector<int>, greater<int>> minHeap;
    
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) {
            minHeap.pop(); // Remove smallest from heap
        }
    }
    
    return minHeap.top(); // Kth largest element
}

// Time: O(n log k), Space: O(k)
// Pattern: Top-K with Min Heap
// Why min heap? We want to keep k largest, so remove smallest when size > k
```

#### **Problem 2: Last Stone Weight**
```cpp
// LeetCode 1046: Last Stone Weight
int lastStoneWeight(vector<int>& stones) {
    // Max heap to always get heaviest stones
    priority_queue<int> maxHeap(stones.begin(), stones.end());
    
    while (maxHeap.size() > 1) {
        int first = maxHeap.top(); maxHeap.pop();
        int second = maxHeap.top(); maxHeap.pop();
        
        if (first != second) {
            maxHeap.push(first - second);
        }
    }
    
    return maxHeap.empty() ? 0 : maxHeap.top();
}

// Time: O(n log n), Space: O(n)
// Pattern: Simulation with Max Heap
```

#### **Problem 3: Kth Smallest Element in BST**
```cpp
// LeetCode 230: Kth Smallest Element in a BST
int kthSmallest(TreeNode* root, int k) {
    // Max heap of size k to keep k smallest elements
    priority_queue<int> maxHeap;
    
    function<void(TreeNode*)> inorder = [&](TreeNode* node) {
        if (!node) return;
        
        maxHeap.push(node->val);
        if (maxHeap.size() > k) {
            maxHeap.pop(); // Remove largest
        }
        
        inorder(node->left);
        inorder(node->right);
    };
    
    inorder(root);
    return maxHeap.top();
}

// Alternative: Inorder traversal (more efficient for BST)
int kthSmallestOptimal(TreeNode* root, int k) {
    int count = 0, result = 0;
    
    function<void(TreeNode*)> inorder = [&](TreeNode* node) {
        if (!node || count >= k) return;
        
        inorder(node->left);
        
        if (++count == k) {
            result = node->val;
            return;
        }
        
        inorder(node->right);
    };
    
    inorder(root);
    return result;
}

// Time: O(n) worst case, O(k) average for BST inorder
// Pattern: Top-K in Tree + Inorder optimization
```

---

### **🟡 MEDIUM PROBLEMS (Core Patterns)**

#### **Problem 4: Top K Frequent Elements**
```cpp
// LeetCode 347: Top K Frequent Elements
vector<int> topKFrequent(vector<int>& nums, int k) {
    // Step 1: Count frequencies
    unordered_map<int, int> freq;
    for (int num : nums) {
        freq[num]++;
    }
    
    // Step 2: Min heap to keep top k frequent
    auto compare = [](const pair<int, int>& a, const pair<int, int>& b) {
        return a.second > b.second; // Min heap by frequency
    };
    priority_queue<pair<int, int>, vector<pair<int, int>>, decltype(compare)> pq(compare);
    
    for (auto& [num, count] : freq) {
        pq.push({num, count});
        if (pq.size() > k) {
            pq.pop();
        }
    }
    
    // Step 3: Extract result
    vector<int> result;
    while (!pq.empty()) {
        result.push_back(pq.top().first);
        pq.pop();
    }
    
    return result;
}

// Time: O(n log k), Space: O(n + k)
// Pattern: Frequency Count + Top-K
```

#### **Problem 5: Find Median from Data Stream**
```cpp
// LeetCode 295: Find Median from Data Stream
class MedianFinder {
private:
    priority_queue<int> maxHeap; // Left half (smaller elements)
    priority_queue<int, vector<int>, greater<int>> minHeap; // Right half (larger elements)
    
public:
    void addNum(int num) {
        // Add to appropriate heap
        if (maxHeap.empty() || num <= maxHeap.top()) {
            maxHeap.push(num);
        } else {
            minHeap.push(num);
        }
        
        // Balance heaps (size difference ≤ 1)
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

// Time: O(log n) for addNum, O(1) for findMedian
// Space: O(n)
// Pattern: Two Heaps for Dynamic Median
```

#### **Problem 6: Meeting Rooms II**
```cpp
// LeetCode 253: Meeting Rooms II
int minMeetingRooms(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    
    // Sort by start time
    sort(intervals.begin(), intervals.end());
    
    // Min heap to track end times of active meetings
    priority_queue<int, vector<int>, greater<int>> pq;
    
    for (auto& interval : intervals) {
        int start = interval[0], end = interval[1];
        
        // If earliest meeting has ended, reuse room
        if (!pq.empty() && pq.top() <= start) {
            pq.pop();
        }
        
        // Schedule current meeting
        pq.push(end);
    }
    
    return pq.size(); // Number of rooms needed
}

// Time: O(n log n), Space: O(n)
// Pattern: Interval Scheduling with Min Heap
```

#### **Problem 7: Ugly Number II**
```cpp
// LeetCode 264: Ugly Number II
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
// Pattern: Sequence Generation with Min Heap
```

---

### **🔴 HARD PROBLEMS (Advanced Techniques)**

#### **Problem 8: Merge K Sorted Lists**
```cpp
// LeetCode 23: Merge k Sorted Lists
struct ListNodeComparator {
    bool operator()(ListNode* a, ListNode* b) {
        return a->val > b->val; // Min heap
    }
};

ListNode* mergeKLists(vector<ListNode*>& lists) {
    priority_queue<ListNode*, vector<ListNode*>, ListNodeComparator> pq;
    
    // Add first node of each non-empty list
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

// Time: O(n log k) where n = total nodes, k = number of lists
// Space: O(k) for heap
// Pattern: Merge K Sorted with Min Heap
```

#### **Problem 9: Sliding Window Maximum**
```cpp
// LeetCode 239: Sliding Window Maximum (Heap Solution)
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    priority_queue<pair<int, int>> pq; // {value, index}
    vector<int> result;
    
    for (int i = 0; i < nums.size(); i++) {
        // Add current element
        pq.push({nums[i], i});
        
        // Remove elements outside window (lazy deletion)
        while (!pq.empty() && pq.top().second <= i - k) {
            pq.pop();
        }
        
        // Add to result if window is complete
        if (i >= k - 1) {
            result.push_back(pq.top().first);
        }
    }
    
    return result;
}

// Time: O(n log k), Space: O(k)
// Pattern: Sliding Window with Lazy Deletion
// Note: Deque solution is O(n) but heap is more intuitive
```

#### **Problem 10: Task Scheduler**
```cpp
// LeetCode 621: Task Scheduler
int leastInterval(vector<char>& tasks, int n) {
    // Count frequency of each task
    unordered_map<char, int> freq;
    for (char task : tasks) {
        freq[task]++;
    }
    
    // Max heap by frequency
    priority_queue<int> pq;
    for (auto& [task, count] : freq) {
        pq.push(count);
    }
    
    int time = 0;
    queue<pair<int, int>> cooldown; // {count, available_time}
    
    while (!pq.empty() || !cooldown.empty()) {
        time++;
        
        // Add back tasks that finished cooling down
        if (!cooldown.empty() && cooldown.front().second == time) {
            pq.push(cooldown.front().first);
            cooldown.pop();
        }
        
        // Execute most frequent available task
        if (!pq.empty()) {
            int count = pq.top();
            pq.pop();
            
            if (count > 1) {
                cooldown.push({count - 1, time + n + 1});
            }
        }
    }
    
    return time;
}

// Time: O(n), Space: O(1) - at most 26 different tasks
// Pattern: Greedy Scheduling with Heap + Queue
```

---

## 🎯 **PRACTICE SCHEDULE (4 Hours)**

### **Hour 1: Foundation (Easy Problems)**
- ✅ Kth Largest Element (15 min)
- ✅ Last Stone Weight (15 min)  
- ✅ Kth Smallest in BST (15 min)
- ✅ Practice custom comparators (15 min)

### **Hour 2: Core Patterns (Medium Problems Part 1)**
- ✅ Top K Frequent Elements (20 min)
- ✅ Find Median from Data Stream (25 min)
- ✅ Meeting Rooms II (15 min)

### **Hour 3: Sequence & Generation (Medium Problems Part 2)**
- ✅ Ugly Number II (20 min)
- ✅ Practice heap building techniques (20 min)
- ✅ Review two-heap pattern (20 min)

### **Hour 4: Advanced Applications (Hard Problems)**
- ✅ Merge K Sorted Lists (20 min)
- ✅ Sliding Window Maximum (20 min)
- ✅ Task Scheduler (20 min)

---

## 💡 **KEY INSIGHTS & PATTERNS**

### **Insight 1: Heap Size Strategy**
```cpp
// For kth largest → Min heap of size k
// For kth smallest → Max heap of size k
// For top k by frequency → Min heap of size k (by frequency)
```

### **Insight 2: Two Heaps Pattern**
```cpp
// Perfect for median, percentile problems
// MaxHeap (left) + MinHeap (right)
// Maintain: |maxHeap.size() - minHeap.size()| ≤ 1
```

### **Insight 3: Lazy Deletion**
```cpp
// When you can't remove specific elements from heap
// Store additional info (like index) and validate on access
while (!pq.empty() && isOutdated(pq.top())) {
    pq.pop();
}
```

### **Insight 4: Custom Comparators**
```cpp
// Remember: return true means first argument has LOWER priority
// For min heap: return a > b (larger values have lower priority)
// For max heap: return a < b (smaller values have lower priority)
```

---

## 🏆 **MASTERY GOALS**

After completing this iteration, you should be able to:

1. **Recognize Top-K patterns** and choose correct heap type
2. **Implement two-heap pattern** for median/percentile problems
3. **Use custom comparators** for complex objects
4. **Apply lazy deletion** for sliding window problems
5. **Solve interval scheduling** problems with heaps
6. **Handle graph algorithms** (Dijkstra) with priority queues
7. **Optimize space** by maintaining heap of appropriate size

---

**💡 Pro Tip**: Heap problems often have **multiple solution approaches**. Consider the trade-offs between time complexity, space usage, and implementation simplicity!

**🚀 Master heap patterns and you'll have powerful tools for priority-based optimization!**
