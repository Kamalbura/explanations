# 🚀 STACK & QUEUE + MONOTONIC STACK: COMPLETE MASTERY GUIDE

## 🧠 **CORE CONCEPT: LIFO/FIFO + MONOTONIC OPTIMIZATION**

Stack and Queue are fundamental data structures that enable **optimal solutions** through strategic ordering. When combined with **Monotonic Stack/Queue**, they become powerful tools for **O(n) optimization** of traditionally O(n²) problems.

### **The Stack/Queue Mindset:**
```
Stack (LIFO): Last In, First Out
→ Perfect for: Nested structures, backtracking, undo operations
→ Key insight: Recent items are most relevant

Queue (FIFO): First In, First Out  
→ Perfect for: Level processing, BFS, scheduling
→ Key insight: Process in arrival order

Monotonic Stack: Stack with ordering constraint
→ Perfect for: Next greater/smaller element, histogram problems
→ Key insight: Maintain useful elements, discard redundant ones
```

---

## 📐 **MATHEMATICAL FOUNDATION**

### **Why Monotonic Stack Works:**
```
Brute Force: For each element, scan all previous/next → O(n²)
Monotonic Stack: Each element pushed/popped exactly once → O(n)

Example: Next Greater Element
Brute Force: For each arr[i], check arr[i+1], arr[i+2], ... → O(n²)
Monotonic Stack: Maintain decreasing stack, pop when found → O(n)

Mathematical Proof:
- Each element pushed exactly once: n pushes
- Each element popped at most once: ≤n pops
- Total operations: ≤2n → O(n)
```

---

## 🎨 **PATTERN TYPES & TEMPLATES**

### **Pattern 1: Basic Stack Operations**
**Use Case**: Parentheses validation, expression evaluation, backtracking
```cpp
// Template: Valid Parentheses
bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> pairs = {{')', '('}, {']', '['}, {'}', '{'}};
    
    for (char c : s) {
        if (pairs.count(c)) { // Closing bracket
            if (st.empty() || st.top() != pairs[c]) return false;
            st.pop();
        } else { // Opening bracket
            st.push(c);
        }
    }
    
    return st.empty();
}
```

### **Pattern 2: Monotonic Stack (Next Greater/Smaller)**
**Use Case**: Next greater element, temperature problems, histogram
```cpp
// Template: Next Greater Element
vector<int> nextGreaterElement(vector<int>& nums) {
    vector<int> result(nums.size(), -1);
    stack<int> st; // Store indices
    
    for (int i = 0; i < nums.size(); i++) {
        // Pop elements smaller than current
        while (!st.empty() && nums[st.top()] < nums[i]) {
            result[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    
    return result;
}
```

### **Pattern 3: Queue BFS/Level Processing**
**Use Case**: Tree level traversal, graph BFS, sliding window maximum
```cpp
// Template: Binary Tree Level Order
vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    
    vector<vector<int>> result;
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> level;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            level.push_back(node->val);
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        result.push_back(level);
    }
    
    return result;
}
```

### **Pattern 4: Monotonic Deque (Sliding Window Maximum)**
**Use Case**: Sliding window problems with min/max queries
```cpp
// Template: Sliding Window Maximum
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq; // Store indices
    vector<int> result;
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove elements outside window
        while (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }
        
        // Remove smaller elements (maintain decreasing order)
        while (!dq.empty() && nums[dq.back()] <= nums[i]) {
            dq.pop_back();
        }
        
        dq.push_back(i);
        
        // Add to result if window is complete
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }
    
    return result;
}
```

---

## 🔍 **PROBLEM RECOGNITION PATTERNS**

### **Pattern Recognition Table:**
| **Problem Statement** | **Pattern** | **Template** |
|----------------------|-------------|--------------|
| "Valid parentheses/brackets" | Basic Stack | Parentheses Template |
| "Next greater/smaller element" | Monotonic Stack | NGE Template |
| "Daily temperatures" | Monotonic Stack | Temperature Template |
| "Largest rectangle in histogram" | Monotonic Stack | Histogram Template |
| "Tree level order traversal" | Queue BFS | Level Order Template |
| "Sliding window maximum" | Monotonic Deque | Window Max Template |
| "Expression evaluation" | Stack | Calculator Template |
| "Backtracking problems" | Stack | DFS Template |

---

## 💻 **IMPLEMENTATION EXAMPLES**

### **Example 1: Daily Temperatures (Monotonic Stack)**
```cpp
// Problem: Find how many days until warmer temperature
vector<int> dailyTemperatures(vector<int>& temperatures) {
    vector<int> result(temperatures.size(), 0);
    stack<int> st; // Store indices of temperatures
    
    for (int i = 0; i < temperatures.size(); i++) {
        // While current temp is warmer than stack top
        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
            int prevIndex = st.top();
            st.pop();
            result[prevIndex] = i - prevIndex; // Days difference
        }
        st.push(i);
    }
    
    return result;
}

// Time: O(n), Space: O(n)
// Why it works: Each element pushed/popped exactly once
// Monotonic property: Stack maintains decreasing temperatures
```

### **Example 2: Largest Rectangle in Histogram (Monotonic Stack)**
```cpp
// Problem: Find largest rectangle area in histogram
int largestRectangleArea(vector<int>& heights) {
    stack<int> st; // Store indices
    int maxArea = 0;
    
    for (int i = 0; i <= heights.size(); i++) {
        int currHeight = (i == heights.size()) ? 0 : heights[i];
        
        // Pop heights greater than current
        while (!st.empty() && heights[st.top()] > currHeight) {
            int height = heights[st.top()];
            st.pop();
            
            int width = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, height * width);
        }
        
        st.push(i);
    }
    
    return maxArea;
}

// Time: O(n), Space: O(n)
// Key insight: For each bar, find left and right boundaries
// where height is smaller, then calculate area
```

### **Example 3: Binary Tree Zigzag Level Order (Queue + Direction)**
```cpp
// Problem: Level order but alternate directions
vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    if (!root) return {};
    
    vector<vector<int>> result;
    queue<TreeNode*> q;
    q.push(root);
    bool leftToRight = true;
    
    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> level(levelSize);
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            
            // Choose index based on direction
            int index = leftToRight ? i : levelSize - 1 - i;
            level[index] = node->val;
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        leftToRight = !leftToRight;
        result.push_back(level);
    }
    
    return result;
}

// Time: O(n), Space: O(w) where w is maximum width
// Technique: Use direction flag to control placement
```

---

## 🧩 **ADVANCED TECHNIQUES**

### **Technique 1: Stack for Expression Evaluation**
```cpp
// Problem: Basic Calculator
int calculate(string s) {
    stack<int> st;
    int result = 0, number = 0;
    char operation = '+';
    
    for (int i = 0; i < s.length(); i++) {
        char c = s[i];
        
        if (isdigit(c)) {
            number = number * 10 + (c - '0');
        }
        
        if (c == '+' || c == '-' || c == '*' || c == '/' || i == s.length() - 1) {
            if (operation == '+') {
                st.push(number);
            } else if (operation == '-') {
                st.push(-number);
            } else if (operation == '*') {
                st.push(st.top() * number);
                st.pop();
            } else if (operation == '/') {
                st.push(st.top() / number);
                st.pop();
            }
            
            operation = c;
            number = 0;
        }
    }
    
    while (!st.empty()) {
        result += st.top();
        st.pop();
    }
    
    return result;
}
```

### **Technique 2: Monotonic Stack for Trapping Rain Water**
```cpp
// Problem: Calculate trapped rainwater
int trap(vector<int>& height) {
    stack<int> st;
    int water = 0;
    
    for (int i = 0; i < height.size(); i++) {
        while (!st.empty() && height[i] > height[st.top()]) {
            int top = st.top();
            st.pop();
            
            if (st.empty()) break;
            
            int distance = i - st.top() - 1;
            int boundedHeight = min(height[i], height[st.top()]) - height[top];
            water += distance * boundedHeight;
        }
        st.push(i);
    }
    
    return water;
}

// Time: O(n), Space: O(n)
// Key insight: Water trapped = min(left_max, right_max) - current_height
```

---

## ⚡ **OPTIMIZATION STRATEGIES**

### **Strategy 1: Choose Right Data Structure**
```cpp
// For LIFO operations → Stack
// For FIFO operations → Queue  
// For both ends access → Deque
// For min/max queries → Priority Queue (Heap)

// Example: Use deque for sliding window problems
deque<int> dq; // Can push/pop from both ends efficiently
```

### **Strategy 2: Monotonic Property Selection**
```cpp
// Increasing stack: Pop when current > stack.top()
// Use for: Next smaller element, minimum in range

// Decreasing stack: Pop when current < stack.top()  
// Use for: Next greater element, maximum in range

// Choose based on what you need to find!
```

### **Strategy 3: Index vs Value Storage**
```cpp
// Store indices when you need:
// - Position information
// - To access original array
// - Distance calculations

// Store values when you need:
// - Simple comparisons
// - Memory optimization
// - Value-only operations
```

---

## 🎯 **PROBLEM-SOLVING FRAMEWORK**

### **Step 1: Pattern Recognition (30 seconds)**
- Nested structure? → Stack
- Level-by-level processing? → Queue
- Next greater/smaller? → Monotonic Stack
- Sliding window min/max? → Monotonic Deque
- Expression evaluation? → Stack
- Backtracking? → Stack (implicit via recursion)

### **Step 2: Choose Template (30 seconds)**
```cpp
// For validation problems
if (problem involves matching/nesting)
    use basic_stack_template;

// For optimization problems
if (problem involves next_greater/smaller)
    use monotonic_stack_template;

// For traversal problems  
if (problem involves level_order/BFS)
    use queue_bfs_template;

// For window problems
if (problem involves sliding_window_extremes)
    use monotonic_deque_template;
```

### **Step 3: Implementation (10-15 minutes)**
1. Initialize the appropriate data structure
2. Determine what to store (index vs value)
3. Write the main loop with proper conditions
4. Handle edge cases and final processing

---

## 🔧 **COMMON PITFALLS & SOLUTIONS**

### **Pitfall 1: Empty Stack/Queue Access**
```cpp
// ❌ Wrong: No empty check
while (condition) {
    stack.pop(); // Might be empty!
    auto top = stack.top(); // Undefined behavior!
}

// ✅ Correct: Always check before access
while (!stack.empty() && condition) {
    auto top = stack.top();
    stack.pop();
}
```

### **Pitfall 2: Wrong Monotonic Direction**
```cpp
// ❌ Wrong: For next greater, using increasing stack
while (!st.empty() && nums[st.top()] > nums[i]) { // Wrong comparison
    st.pop();
}

// ✅ Correct: For next greater, use decreasing stack
while (!st.empty() && nums[st.top()] < nums[i]) { // Correct comparison
    result[st.top()] = nums[i];
    st.pop();
}
```

### **Pitfall 3: Forgetting Remaining Elements**
```cpp
// ❌ Wrong: Not processing remaining stack elements
for (int i = 0; i < n; i++) {
    // Process elements...
}
// Stack might still have elements!

// ✅ Correct: Process remaining elements
for (int i = 0; i < n; i++) {
    // Main processing...
}
while (!st.empty()) {
    // Handle remaining elements
    result[st.top()] = -1; // Or appropriate default
    st.pop();
}
```

---

## 📊 **COMPLEXITY ANALYSIS**

### **Time Complexity Patterns:**
- **Basic Stack/Queue Operations**: O(1) per operation
- **Monotonic Stack**: O(n) total (each element pushed/popped once)
- **BFS/Level Order**: O(n) where n is number of nodes
- **Sliding Window with Deque**: O(n) amortized

### **Space Complexity:**
- **Stack/Queue**: O(n) in worst case (all elements stored)
- **Monotonic Stack**: O(n) worst case, often much less
- **BFS**: O(w) where w is maximum width of tree/graph

---

## 🏆 **MASTERY CHECKLIST**

You've mastered Stack/Queue + Monotonic when you can:

- [ ] **Identify the pattern** from problem description in 30 seconds
- [ ] **Choose correct data structure** (stack vs queue vs deque) immediately
- [ ] **Implement monotonic stack** without bugs on first try
- [ ] **Handle edge cases** (empty structures, remaining elements)
- [ ] **Optimize space/time** by choosing what to store (index vs value)
- [ ] **Combine with other techniques** (BFS + level processing)
- [ ] **Solve expression evaluation** problems confidently

---

## 🚀 **INTERVIEW SUCCESS TIPS**

1. **Start with Brute Force**: Explain O(n²) nested loop solution first
2. **Identify Optimization**: "Can we use a stack to track useful information?"
3. **Choose Data Structure**: Stack for LIFO, Queue for FIFO, Deque for both
4. **Explain Monotonic Property**: "We maintain increasing/decreasing order to..."
5. **Code Cleanly**: Always check empty before pop/top operations
6. **Test Edge Cases**: Empty input, single element, all same elements
7. **Walk Through Example**: Show how stack/queue state changes

---

**💡 Key Insight**: Stack and Queue aren't just data structures—they're **optimization tools** that can reduce O(n²) to O(n) by maintaining useful information and eliminating redundant work!

**🎯 Master Stack/Queue + Monotonic patterns and you'll solve optimization problems with elegance!**
