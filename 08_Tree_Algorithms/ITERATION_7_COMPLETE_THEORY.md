# 🌳 ITERATION 7: TREE ALGORITHMS - COMPLETE MASTERY GUIDE

## 🎯 **CORE CONCEPT: HIERARCHICAL DATA STRUCTURES**

Trees are **hierarchical data structures** with nodes connected by edges, forming a **parent-child relationship**. Every tree problem involves **traversal, search, modification, or construction** of these hierarchical relationships.

### **The Tree Mindset:**
```
Linear Structures (Arrays, Lists): O(n) search
→ Tree Structures: O(log n) search (balanced)
→ Key: Recursive nature + Divide & Conquer
→ Master: DFS (deep exploration) vs BFS (level-wise)
```

---

## 📐 **MATHEMATICAL FOUNDATION**

### **Tree Properties:**
```
For a tree with n nodes:
- Exactly n-1 edges
- One unique path between any two nodes
- Height h: O(log n) best, O(n) worst
- Complete Binary Tree: 2^h - 1 ≤ n ≤ 2^(h+1) - 1
```

### **Complexity Comparison:**
| Operation | Array | BST (Balanced) | BST (Skewed) |
|-----------|-------|----------------|--------------|
| Search | O(n) | O(log n) | O(n) |
| Insert | O(1) | O(log n) | O(n) |
| Delete | O(n) | O(log n) | O(n) |
| Min/Max | O(n) | O(log n) | O(n) |

---

## 🎨 **TREE PATTERNS & TEMPLATES**

### **Pattern 1: DFS Traversal (3 Types)**
```cpp
// Template: Universal DFS
class TreeDFS {
public:
    // Preorder: Root → Left → Right (good for copying/serializing)
    void preorder(TreeNode* root, vector<int>& result) {
        if (!root) return;
        result.push_back(root->val);    // Process root first
        preorder(root->left, result);   // Then left subtree
        preorder(root->right, result);  // Finally right subtree
    }
    
    // Inorder: Left → Root → Right (gives sorted order in BST)
    void inorder(TreeNode* root, vector<int>& result) {
        if (!root) return;
        inorder(root->left, result);    // Process left subtree first
        result.push_back(root->val);    // Then root
        inorder(root->right, result);   // Finally right subtree
    }
    
    // Postorder: Left → Right → Root (good for deletion/calculation)
    void postorder(TreeNode* root, vector<int>& result) {
        if (!root) return;
        postorder(root->left, result);  // Process left subtree first
        postorder(root->right, result); // Then right subtree
        result.push_back(root->val);    // Finally root
    }
};

// Key Insight: Order determines when you "process" the current node
```

### **Pattern 2: BFS Level Order**
```cpp
// Template: Level-by-Level Processing
class TreeBFS {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> result;
        if (!root) return result;
        
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            int levelSize = q.size();  // Crucial: capture current level size
            vector<int> currentLevel;
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                currentLevel.push_back(node->val);
                
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            result.push_back(currentLevel);
        }
        return result;
    }
};

// Use Case: Problems involving "level", "depth", "width", or "layer"
```

### **Pattern 3: BST Operations**
```cpp
// Template: Binary Search Tree
class BSTOperations {
public:
    // BST Search: O(log n) average
    TreeNode* searchBST(TreeNode* root, int val) {
        if (!root || root->val == val) return root;
        
        return val < root->val ? searchBST(root->left, val) 
                              : searchBST(root->right, val);
    }
    
    // BST Insert: Maintain BST property
    TreeNode* insertIntoBST(TreeNode* root, int val) {
        if (!root) return new TreeNode(val);
        
        if (val < root->val) {
            root->left = insertIntoBST(root->left, val);
        } else {
            root->right = insertIntoBST(root->right, val);
        }
        return root;
    }
    
    // BST Validation: Use range technique
    bool isValidBST(TreeNode* root) {
        return validate(root, LONG_MIN, LONG_MAX);
    }
    
private:
    bool validate(TreeNode* node, long minVal, long maxVal) {
        if (!node) return true;
        
        if (node->val <= minVal || node->val >= maxVal) return false;
        
        return validate(node->left, minVal, node->val) && 
               validate(node->right, node->val, maxVal);
    }
};

// Key: BST property enables O(log n) operations
```

### **Pattern 4: Tree Construction**
```cpp
// Template: Build Tree from Traversals
class TreeConstruction {
public:
    // Build from Preorder + Inorder
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        unordered_map<int, int> inorderMap;
        for (int i = 0; i < inorder.size(); i++) {
            inorderMap[inorder[i]] = i;  // O(1) lookup optimization
        }
        
        int preIndex = 0;
        return buildHelper(preorder, 0, inorder.size() - 1, preIndex, inorderMap);
    }
    
private:
    TreeNode* buildHelper(vector<int>& preorder, int inStart, int inEnd, 
                         int& preIndex, unordered_map<int, int>& inMap) {
        if (inStart > inEnd) return nullptr;
        
        int rootVal = preorder[preIndex++];  // Next in preorder is root
        TreeNode* root = new TreeNode(rootVal);
        
        int inIndex = inMap[rootVal];  // Find root position in inorder
        
        // Build left first (preorder property)
        root->left = buildHelper(preorder, inStart, inIndex - 1, preIndex, inMap);
        root->right = buildHelper(preorder, inIndex + 1, inEnd, preIndex, inMap);
        
        return root;
    }
};

// Key: Preorder gives root, Inorder gives left/right split
```

### **Pattern 5: Path Problems**
```cpp
// Template: Tree Path Algorithms
class TreePaths {
public:
    // Path Sum II: All root-to-leaf paths with target sum
    vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
        vector<vector<int>> result;
        vector<int> path;
        dfs(root, targetSum, path, result);
        return result;
    }
    
private:
    void dfs(TreeNode* node, int target, vector<int>& path, 
             vector<vector<int>>& result) {
        if (!node) return;
        
        path.push_back(node->val);  // Add to current path
        
        // Check if leaf node with target sum
        if (!node->left && !node->right && target == node->val) {
            result.push_back(path);
        }
        
        dfs(node->left, target - node->val, path, result);
        dfs(node->right, target - node->val, path, result);
        
        path.pop_back();  // Backtrack: crucial for correctness
    }
    
public:
    // Maximum Path Sum: Advanced tree DP
    int maxPathSum(TreeNode* root) {
        int maxSum = INT_MIN;
        helper(root, maxSum);
        return maxSum;
    }
    
private:
    int helper(TreeNode* node, int& maxSum) {
        if (!node) return 0;
        
        // Get max contribution from left and right
        int left = max(0, helper(node->left, maxSum));   // Ignore negative
        int right = max(0, helper(node->right, maxSum));
        
        // Update global max (path through current node)
        maxSum = max(maxSum, node->val + left + right);
        
        // Return max contribution upward (can't use both children)
        return node->val + max(left, right);
    }
};

// Key: Distinguish between "path through node" vs "contribution upward"
```

### **Pattern 6: Tree Modification**
```cpp
// Template: Tree Structure Changes
class TreeModification {
public:
    // Invert Binary Tree
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        
        swap(root->left, root->right);  // Swap children
        invertTree(root->left);         // Recursively invert subtrees
        invertTree(root->right);
        
        return root;
    }
    
    // Serialize Tree (Preorder with nulls)
    string serialize(TreeNode* root) {
        if (!root) return "null,";
        
        return to_string(root->val) + "," + 
               serialize(root->left) + 
               serialize(root->right);
    }
    
    // Deserialize Tree
    TreeNode* deserialize(string data) {
        queue<string> nodes;
        stringstream ss(data);
        string item;
        
        while (getline(ss, item, ',')) {
            nodes.push(item);
        }
        
        return buildTree(nodes);
    }
    
private:
    TreeNode* buildTree(queue<string>& nodes) {
        string val = nodes.front();
        nodes.pop();
        
        if (val == "null") return nullptr;
        
        TreeNode* root = new TreeNode(stoi(val));
        root->left = buildTree(nodes);
        root->right = buildTree(nodes);
        
        return root;
    }
};

// Key: Preorder with null markers ensures unambiguous reconstruction
```

---

## 🧩 **ADVANCED TECHNIQUES**

### **Technique 1: Morris Traversal (O(1) Space)**
```cpp
// Space-optimized inorder traversal
vector<int> inorderMorris(TreeNode* root) {
    vector<int> result;
    TreeNode* curr = root;
    
    while (curr) {
        if (!curr->left) {
            result.push_back(curr->val);  // Process node
            curr = curr->right;           // Move to right
        } else {
            // Find inorder predecessor
            TreeNode* pred = curr->left;
            while (pred->right && pred->right != curr) {
                pred = pred->right;
            }
            
            if (!pred->right) {
                pred->right = curr;  // Create threaded link
                curr = curr->left;   // Go left
            } else {
                pred->right = nullptr;        // Remove thread
                result.push_back(curr->val);  // Process node
                curr = curr->right;           // Go right
            }
        }
    }
    return result;
}

// Benefit: O(1) space instead of O(h) recursion stack
```

### **Technique 2: Iterative Traversals**
```cpp
// Iterative implementations to avoid recursion
class IterativeTraversals {
public:
    // Iterative Preorder
    vector<int> preorderIterative(TreeNode* root) {
        vector<int> result;
        if (!root) return result;
        
        stack<TreeNode*> st;
        st.push(root);
        
        while (!st.empty()) {
            TreeNode* node = st.top();
            st.pop();
            result.push_back(node->val);
            
            // Push right first, then left (stack is LIFO)
            if (node->right) st.push(node->right);
            if (node->left) st.push(node->left);
        }
        return result;
    }
    
    // Iterative Inorder
    vector<int> inorderIterative(TreeNode* root) {
        vector<int> result;
        stack<TreeNode*> st;
        TreeNode* curr = root;
        
        while (curr || !st.empty()) {
            // Go to leftmost node
            while (curr) {
                st.push(curr);
                curr = curr->left;
            }
            
            // Process node
            curr = st.top();
            st.pop();
            result.push_back(curr->val);
            
            // Go to right subtree
            curr = curr->right;
        }
        return result;
    }
};

// Use Case: Very deep trees to avoid stack overflow
```

### **Technique 3: Tree DP Patterns**
```cpp
// Dynamic programming on trees
class TreeDP {
public:
    // House Robber III: Can't rob adjacent nodes
    int rob(TreeNode* root) {
        auto result = robHelper(root);
        return max(result.first, result.second);
    }
    
private:
    // Returns {rob_this_node, dont_rob_this_node}
    pair<int, int> robHelper(TreeNode* node) {
        if (!node) return {0, 0};
        
        auto left = robHelper(node->left);
        auto right = robHelper(node->right);
        
        // If rob this node, can't rob children
        int robThis = node->val + left.second + right.second;
        
        // If don't rob this node, take max of children
        int dontRobThis = max(left.first, left.second) + 
                          max(right.first, right.second);
        
        return {robThis, dontRobThis};
    }
    
public:
    // Tree Diameter: Longest path between any two nodes
    int diameterOfBinaryTree(TreeNode* root) {
        int diameter = 0;
        height(root, diameter);
        return diameter;
    }
    
private:
    int height(TreeNode* node, int& diameter) {
        if (!node) return 0;
        
        int leftHeight = height(node->left, diameter);
        int rightHeight = height(node->right, diameter);
        
        // Update diameter (path through current node)
        diameter = max(diameter, leftHeight + rightHeight);
        
        // Return height of current subtree
        return 1 + max(leftHeight, rightHeight);
    }
};

// Key: Combine local computation with global state tracking
```

---

## 🔍 **PROBLEM RECOGNITION GUIDE**

### **Recognition Keywords:**
| **Keywords** | **Pattern** | **Approach** |
|-------------|-------------|--------------|
| "traversal", "visit all" | DFS/BFS | Choose based on order needed |
| "level", "depth", "width" | BFS | Level-order traversal |
| "BST", "sorted", "search" | BST Properties | Use ordering for optimization |
| "path", "sum", "distance" | Path Problems | DFS with backtracking |
| "construct", "build" | Tree Construction | Use traversal properties |
| "serialize", "clone" | Tree Encoding | Preorder with markers |
| "ancestor", "parent" | LCA Problems | Bottom-up or binary lifting |

### **Problem Type Identification:**
```cpp
if (involves("level", "layer", "breadth")) {
    return BFS_PATTERN;
} else if (involves("BST", "sorted", "binary_search")) {
    return BST_PATTERN;
} else if (involves("path", "sum", "distance")) {
    return PATH_PATTERN;
} else if (involves("construct", "build", "traversal")) {
    return CONSTRUCTION_PATTERN;
} else {
    return GENERAL_DFS_PATTERN;
}
```

---

## 💻 **COMPLETE IMPLEMENTATIONS**

### **Example 1: Binary Tree Inorder Traversal (3 Ways)**
```cpp
class Solution {
public:
    // Method 1: Recursive (most intuitive)
    vector<int> inorderTraversal_Recursive(TreeNode* root) {
        vector<int> result;
        inorder(root, result);
        return result;
    }
    
private:
    void inorder(TreeNode* root, vector<int>& result) {
        if (!root) return;
        inorder(root->left, result);
        result.push_back(root->val);
        inorder(root->right, result);
    }
    
public:
    // Method 2: Iterative with Stack
    vector<int> inorderTraversal_Iterative(TreeNode* root) {
        vector<int> result;
        stack<TreeNode*> st;
        TreeNode* curr = root;
        
        while (curr || !st.empty()) {
            while (curr) {
                st.push(curr);
                curr = curr->left;
            }
            curr = st.top(); st.pop();
            result.push_back(curr->val);
            curr = curr->right;
        }
        return result;
    }
    
    // Method 3: Morris Traversal (O(1) space)
    vector<int> inorderTraversal_Morris(TreeNode* root) {
        vector<int> result;
        TreeNode* curr = root;
        
        while (curr) {
            if (!curr->left) {
                result.push_back(curr->val);
                curr = curr->right;
            } else {
                TreeNode* pred = curr->left;
                while (pred->right && pred->right != curr) {
                    pred = pred->right;
                }
                
                if (!pred->right) {
                    pred->right = curr;
                    curr = curr->left;
                } else {
                    pred->right = nullptr;
                    result.push_back(curr->val);
                    curr = curr->right;
                }
            }
        }
        return result;
    }
};

// Complexity: Recursive O(n)/O(h), Iterative O(n)/O(h), Morris O(n)/O(1)
```

### **Example 2: Validate Binary Search Tree**
```cpp
class Solution {
public:
    bool isValidBST(TreeNode* root) {
        return validate(root, LONG_MIN, LONG_MAX);
    }
    
private:
    bool validate(TreeNode* node, long minVal, long maxVal) {
        if (!node) return true;
        
        // Current node must be within range
        if (node->val <= minVal || node->val >= maxVal) {
            return false;
        }
        
        // Left subtree: all values < node->val
        // Right subtree: all values > node->val
        return validate(node->left, minVal, node->val) && 
               validate(node->right, node->val, maxVal);
    }
};

// Time: O(n), Space: O(h)
// Key: Range validation is more efficient than inorder checking
```

### **Example 3: Binary Tree Level Order Traversal**
```cpp
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> result;
        if (!root) return result;
        
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            int levelSize = q.size();  // Crucial: capture level size
            vector<int> currentLevel;
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                currentLevel.push_back(node->val);
                
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            result.push_back(currentLevel);
        }
        return result;
    }
};

// Time: O(n), Space: O(w) where w is maximum width
// Key: Level size tracking enables proper 2D structure
```

---

## ⚡ **OPTIMIZATION STRATEGIES**

### **Strategy 1: Space Optimization**
```cpp
// From O(h) recursion to O(1) iterative
// Use Morris traversal for inorder
// Use iterative with stack for pre/post order
// Prefer BFS for level-order problems

// Example: Space-optimized depth calculation
int maxDepth(TreeNode* root) {
    if (!root) return 0;
    
    queue<TreeNode*> q;
    q.push(root);
    int depth = 0;
    
    while (!q.empty()) {
        depth++;
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return depth;
}
```

### **Strategy 2: Time Optimization**
```cpp
// Use hashmaps for O(1) lookups in construction
// Leverage BST properties for O(log n) operations
// Early termination in search problems

// Example: Optimized tree construction
unordered_map<int, int> inorderMap;  // Build once, use many times
for (int i = 0; i < inorder.size(); i++) {
    inorderMap[inorder[i]] = i;
}
// Now O(1) lookup instead of O(n) search
```

---

## 🎯 **PROBLEM-SOLVING FRAMEWORK**

### **Step 1: Problem Type Recognition (30 seconds)**
```cpp
// Quick identification
if (mentions("level", "breadth", "layer")) return BFS;
if (mentions("BST", "sorted")) return BST_OPERATIONS;
if (mentions("path", "sum")) return DFS_WITH_STATE;
if (mentions("construct", "build")) return TREE_CONSTRUCTION;
```

### **Step 2: Choose Traversal Method (1 minute)**
```cpp
// Decision tree
if (need_level_info) use_BFS();
else if (need_postorder_computation) use_DFS_postorder();
else if (need_preorder_construction) use_DFS_preorder();
else use_DFS_inorder();
```

### **Step 3: Implementation Strategy (2 minutes)**
```cpp
// Template selection
if (space_critical) consider_Morris_or_iterative();
if (very_deep_tree) use_iterative_to_avoid_stack_overflow();
if (simple_problem) use_recursive_for_clarity();
```

---

## 🔧 **COMMON PITFALLS & SOLUTIONS**

### **Pitfall 1: Wrong Base Case**
```cpp
// ❌ Wrong: Forgetting null check
int height(TreeNode* root) {
    return 1 + max(height(root->left), height(root->right)); // Crash!
}

// ✅ Correct: Always handle null
int height(TreeNode* root) {
    if (!root) return 0;  // Base case first
    return 1 + max(height(root->left), height(root->right));
}
```

### **Pitfall 2: Forgetting to Backtrack**
```cpp
// ❌ Wrong: Path state persists
void findPaths(TreeNode* node, vector<int>& path) {
    path.push_back(node->val);
    findPaths(node->left, path);
    findPaths(node->right, path);
    // Missing: path.pop_back();
}

// ✅ Correct: Clean up state
void findPaths(TreeNode* node, vector<int>& path) {
    path.push_back(node->val);
    findPaths(node->left, path);
    findPaths(node->right, path);
    path.pop_back();  // Crucial: backtrack
}
```

### **Pitfall 3: Wrong Level Processing**
```cpp
// ❌ Wrong: Mixing levels
while (!q.empty()) {
    TreeNode* node = q.front(); q.pop();
    // Process each node individually - levels get mixed
}

// ✅ Correct: Process level by level
while (!q.empty()) {
    int levelSize = q.size();  // Capture current level size
    for (int i = 0; i < levelSize; i++) {
        TreeNode* node = q.front(); q.pop();
        // Process nodes at same level together
    }
}
```

---

## 📊 **COMPLEXITY ANALYSIS**

### **Tree Operations Complexity:**
- **DFS Traversal**: Time O(n), Space O(h) where h is height
- **BFS Traversal**: Time O(n), Space O(w) where w is max width
- **BST Search**: Time O(log n) average, O(n) worst, Space O(1)
- **Tree Construction**: Time O(n), Space O(n) for hashmap + O(h) recursion
- **Path Problems**: Time O(n), Space O(h) for recursion + O(n) for paths

### **Space Optimization:**
- **Morris Traversal**: Reduces space from O(h) to O(1)
- **Iterative**: Reduces recursion stack but still O(h) for explicit stack
- **Bottom-up DP**: Computes in single pass without extra space

---

## 🏆 **MASTERY CHECKLIST**

You've mastered Tree Algorithms when you can:

- [ ] **Write any traversal** (recursive/iterative) in 3 minutes
- [ ] **Identify optimal approach** from problem description in 30 seconds
- [ ] **Handle edge cases** (null nodes, single node, skewed trees)
- [ ] **Optimize space** using Morris or iterative when beneficial
- [ ] **Solve BST problems** using ordering properties
- [ ] **Debug tree algorithms** by tracing execution
- [ ] **Choose right data structure** (when to use trees vs other structures)

---

## 🚀 **INTERVIEW SUCCESS TIPS**

1. **Start with Base Case**: "For tree problems, I always handle null nodes first"
2. **Explain Traversal Choice**: "I'm using BFS because we need level information"
3. **Handle Edge Cases**: "Let me consider single node and empty tree cases"
4. **Space Optimization**: "If space is critical, I can use Morris traversal"
5. **BST Leverage**: "Since it's a BST, I can use the ordering property"
6. **Backtracking Awareness**: "I need to clean up the path state after recursion"

**Sample Interview Flow:**
```
Interviewer: "Find all root-to-leaf paths with sum k"
You: "This is a path problem, so I'll use DFS with backtracking.
     I'll maintain a current path and remove nodes as I backtrack.
     Base case: when I reach a leaf, check if sum equals k."
```

---

**🌳 Master these tree patterns and you'll solve any hierarchical data structure problem with confidence!**

**Next Focus**: Graph algorithms build on tree concepts - trees are just connected acyclic graphs!
