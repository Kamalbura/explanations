# 📚 Stack & Queue + Monotonic Stack: Problem Set

## 🎯 **PRACTICE PROBLEMS BY DIFFICULTY**

### **🟢 EASY PROBLEMS (Foundation Building)**

#### **Problem 1: Valid Parentheses**
```cpp
// LeetCode 20: Valid Parentheses
// Given string of brackets, determine if valid

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

// Time: O(n), Space: O(n)
// Pattern: Basic Stack - LIFO for nested structures
```

#### **Problem 2: Implement Queue using Stacks**
```cpp
// LeetCode 232: Implement Queue using Stacks
class MyQueue {
private:
    stack<int> inStack, outStack;
    
    void transfer() {
        while (!inStack.empty()) {
            outStack.push(inStack.top());
            inStack.pop();
        }
    }
    
public:
    void push(int x) {
        inStack.push(x);
    }
    
    int pop() {
        if (outStack.empty()) transfer();
        int front = outStack.top();
        outStack.pop();
        return front;
    }
    
    int peek() {
        if (outStack.empty()) transfer();
        return outStack.top();
    }
    
    bool empty() {
        return inStack.empty() && outStack.empty();
    }
};

// Amortized O(1) for all operations
// Pattern: Two stacks simulate queue behavior
```

#### **Problem 3: Binary Tree Level Order Traversal**
```cpp
// LeetCode 102: Binary Tree Level Order Traversal
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

// Time: O(n), Space: O(w) where w is max width
// Pattern: Queue BFS for level-by-level processing
```

#### **Problem 4: Remove All Adjacent Duplicates**
```cpp
// LeetCode 1047: Remove All Adjacent Duplicates In String
string removeDuplicates(string s) {
    stack<char> st;
    
    for (char c : s) {
        if (!st.empty() && st.top() == c) {
            st.pop(); // Remove duplicate
        } else {
            st.push(c);
        }
    }
    
    // Build result string
    string result = "";
    while (!st.empty()) {
        result = st.top() + result;
        st.pop();
    }
    
    return result;
}

// Time: O(n), Space: O(n)
// Pattern: Stack for removal of adjacent elements
```

---

### **🟡 MEDIUM PROBLEMS (Core Patterns)**

#### **Problem 5: Daily Temperatures**
```cpp
// LeetCode 739: Daily Temperatures
// Find how many days until warmer temperature

vector<int> dailyTemperatures(vector<int>& temperatures) {
    vector<int> result(temperatures.size(), 0);
    stack<int> st; // Store indices
    
    for (int i = 0; i < temperatures.size(); i++) {
        // Pop all days with cooler temperatures
        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
            int prevDay = st.top();
            st.pop();
            result[prevDay] = i - prevDay;
        }
        st.push(i);
    }
    
    return result;
}

// Time: O(n), Space: O(n)
// Pattern: Monotonic Stack (decreasing) for next greater element
```

#### **Problem 6: Next Greater Element I**
```cpp
// LeetCode 496: Next Greater Element I
vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
    unordered_map<int, int> nextGreater;
    stack<int> st;
    
    // Build next greater map for nums2
    for (int num : nums2) {
        while (!st.empty() && st.top() < num) {
            nextGreater[st.top()] = num;
            st.pop();
        }
        st.push(num);
    }
    
    // Build result for nums1
    vector<int> result;
    for (int num : nums1) {
        result.push_back(nextGreater.count(num) ? nextGreater[num] : -1);
    }
    
    return result;
}

// Time: O(n + m), Space: O(n)
// Pattern: Monotonic Stack + HashMap for lookup
```

#### **Problem 7: Binary Tree Zigzag Level Order**
```cpp
// LeetCode 103: Binary Tree Zigzag Level Order Traversal
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

// Time: O(n), Space: O(w)
// Pattern: Queue BFS + direction control
```

#### **Problem 8: Evaluate Reverse Polish Notation**
```cpp
// LeetCode 150: Evaluate Reverse Polish Notation
int evalRPN(vector<string>& tokens) {
    stack<int> st;
    
    for (string& token : tokens) {
        if (token == "+" || token == "-" || token == "*" || token == "/") {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            
            if (token == "+") st.push(a + b);
            else if (token == "-") st.push(a - b);
            else if (token == "*") st.push(a * b);
            else if (token == "/") st.push(a / b);
        } else {
            st.push(stoi(token));
        }
    }
    
    return st.top();
}

// Time: O(n), Space: O(n)
// Pattern: Stack for expression evaluation
```

---

### **🔴 HARD PROBLEMS (Advanced Techniques)**

#### **Problem 9: Largest Rectangle in Histogram**
```cpp
// LeetCode 84: Largest Rectangle in Histogram
int largestRectangleArea(vector<int>& heights) {
    stack<int> st;
    int maxArea = 0;
    
    for (int i = 0; i <= heights.size(); i++) {
        int currHeight = (i == heights.size()) ? 0 : heights[i];
        
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
// Pattern: Monotonic Stack for finding boundaries
```

#### **Problem 10: Sliding Window Maximum**
```cpp
// LeetCode 239: Sliding Window Maximum
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq; // Store indices
    vector<int> result;
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove elements outside window
        while (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }
        
        // Maintain decreasing order (remove smaller elements)
        while (!dq.empty() && nums[dq.back()] <= nums[i]) {
            dq.pop_back();
        }
        
        dq.push_back(i);
        
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }
    
    return result;
}

// Time: O(n), Space: O(k)
// Pattern: Monotonic Deque for sliding window extremes
```

#### **Problem 11: Basic Calculator**
```cpp
// LeetCode 224: Basic Calculator
int calculate(string s) {
    stack<int> st;
    int result = 0, number = 0, sign = 1;
    
    for (char c : s) {
        if (isdigit(c)) {
            number = number * 10 + (c - '0');
        } else if (c == '+') {
            result += sign * number;
            number = 0;
            sign = 1;
        } else if (c == '-') {
            result += sign * number;
            number = 0;
            sign = -1;
        } else if (c == '(') {
            st.push(result);
            st.push(sign);
            result = 0;
            sign = 1;
        } else if (c == ')') {
            result += sign * number;
            number = 0;
            
            result *= st.top(); st.pop(); // sign
            result += st.top(); st.pop(); // result
        }
    }
    
    return result + sign * number;
}

// Time: O(n), Space: O(n)
// Pattern: Stack for nested expression evaluation
```

#### **Problem 12: Trapping Rain Water**
```cpp
// LeetCode 42: Trapping Rain Water
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
// Pattern: Monotonic Stack for calculating trapped areas
```

---

## 🎯 **PRACTICE SCHEDULE (4 Hours)**

### **Hour 1: Foundation (Easy Problems)**
- ✅ Valid Parentheses (15 min)
- ✅ Implement Queue using Stacks (15 min)
- ✅ Binary Tree Level Order (15 min)
- ✅ Remove Adjacent Duplicates (15 min)

### **Hour 2: Core Patterns (Medium Problems)**
- ✅ Daily Temperatures (20 min)
- ✅ Next Greater Element I (20 min)
- ✅ Binary Tree Zigzag (20 min)

### **Hour 3: Advanced Techniques (Hard Problems)**
- ✅ Largest Rectangle in Histogram (30 min)
- ✅ Sliding Window Maximum (30 min)

### **Hour 4: Expression & Complex Problems**
- ✅ Evaluate RPN (15 min)
- ✅ Basic Calculator (25 min)
- ✅ Trapping Rain Water (20 min)

---

## 🏆 **MASTERY GOALS**

After completing this iteration, you should be able to:

1. **Identify Stack/Queue patterns** in 30 seconds
2. **Choose correct monotonic direction** (increasing vs decreasing)
3. **Implement expression evaluation** without hesitation
4. **Handle sliding window extremes** with deque
5. **Solve histogram/trapping water** type problems
6. **Combine BFS with level processing** naturally

---

**💡 Pro Tip**: Stack and Queue problems often have **multiple valid approaches**. The key is choosing the most **efficient** one that leverages the LIFO/FIFO properties optimally!

**🚀 Master these patterns and you'll have powerful tools for optimization in your problem-solving arsenal!**
