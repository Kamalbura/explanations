# 🌳 TREE ALGORITHMS - ESSENTIAL PROBLEMS & SOLUTIONS

## 🎯 **COMPLETE PROBLEM COVERAGE**

**Total Problems:** 15 Essential Tree Problems  
**Difficulty Distribution:** 5 Easy, 5 Medium, 5 Hard  
**Coverage:** All major tree patterns and algorithms  
**Language:** C++ with optimal solutions

---

## 📊 **TIER 1: FUNDAMENTAL TREE OPERATIONS (Easy)**

### **Problem 1: Maximum Depth of Binary Tree**
**LeetCode:** #104 | **Difficulty:** Easy | **Pattern:** Tree DFS

#### **Problem Statement:**
Given the root of a binary tree, return its maximum depth.

#### **Approach 1: Recursive DFS**
```cpp
class Solution {
public:
    int maxDepth(TreeNode* root) {
        // Base case: empty tree has depth 0
        if (!root) return 0;
        
        // Recursive case: 1 + max of left and right subtree depths
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};

// Time: O(n) - visit each node once
// Space: O(h) - recursion stack depth, where h is height
```

#### **Approach 2: Iterative BFS**
```cpp
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        
        queue<TreeNode*> q;
        q.push(root);
        int depth = 0;
        
        while (!q.empty()) {
            int levelSize = q.size();
            depth++;
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
        }
        
        return depth;
    }
};

// Time: O(n) - visit each node once
// Space: O(w) - queue size, where w is maximum width
```

**Key Learning:** Tree depth problems use either DFS (recursive) or BFS (level-by-level).

---

### **Problem 2: Invert Binary Tree**
**LeetCode:** #226 | **Difficulty:** Easy | **Pattern:** Tree Transformation

#### **Problem Statement:**
Given the root of a binary tree, invert it, and return its root.

#### **Solution:**
```cpp
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        // Base case: empty tree
        if (!root) return nullptr;
        
        // Swap left and right children
        TreeNode* temp = root->left;
        root->left = invertTree(root->right);
        root->right = invertTree(temp);
        
        return root;
    }
};

// Time: O(n) - visit each node once
// Space: O(h) - recursion depth
```

**Key Learning:** Tree transformation often involves swapping/modifying children recursively.

---

### **Problem 3: Same Tree**
**LeetCode:** #100 | **Difficulty:** Easy | **Pattern:** Tree Comparison

#### **Problem Statement:**
Given two binary trees, determine if they are the same.

#### **Solution:**
```cpp
class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        // Both null
        if (!p && !q) return true;
        
        // One null, one not null
        if (!p || !q) return false;
        
        // Both not null: check value and recurse
        return (p->val == q->val) && 
               isSameTree(p->left, q->left) && 
               isSameTree(p->right, q->right);
    }
};

// Time: O(min(m,n)) - where m,n are sizes of trees
// Space: O(min(m,n)) - recursion depth
```

**Key Learning:** Tree comparison requires checking structure and values simultaneously.

---

### **Problem 4: Symmetric Tree**
**LeetCode:** #101 | **Difficulty:** Easy | **Pattern:** Tree Symmetry

#### **Problem Statement:**
Given the root of a binary tree, check whether it is a mirror of itself.

#### **Solution:**
```cpp
class Solution {
public:
    bool isSymmetric(TreeNode* root) {
        if (!root) return true;
        return isMirror(root->left, root->right);
    }
    
private:
    bool isMirror(TreeNode* left, TreeNode* right) {
        // Both null
        if (!left && !right) return true;
        
        // One null, one not null
        if (!left || !right) return false;
        
        // Both not null: check value and cross-compare
        return (left->val == right->val) &&
               isMirror(left->left, right->right) &&
               isMirror(left->right, right->left);
    }
};

// Time: O(n) - visit each node once
// Space: O(h) - recursion depth
```

**Key Learning:** Symmetry requires comparing left subtree of one with right subtree of other.

---

### **Problem 5: Binary Tree Level Order Traversal**
**LeetCode:** #102 | **Difficulty:** Medium | **Pattern:** BFS Level Order

#### **Problem Statement:**
Given the root of a binary tree, return the level order traversal of its nodes' values.

#### **Solution:**
```cpp
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> result;
        if (!root) return result;
        
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            int levelSize = q.size();
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

// Time: O(n) - visit each node once
// Space: O(w) - maximum width of tree
```

**Key Learning:** Level order traversal uses BFS with level size tracking.

---

## 📊 **TIER 2: BST & CONSTRUCTION PROBLEMS (Medium)**

### **Problem 6: Validate Binary Search Tree**
**LeetCode:** #98 | **Difficulty:** Medium | **Pattern:** BST Validation

#### **Problem Statement:**
Given the root of a binary tree, determine if it is a valid binary search tree.

#### **Approach 1: Bounds Checking**
```cpp
class Solution {
public:
    bool isValidBST(TreeNode* root) {
        return validate(root, LONG_MIN, LONG_MAX);
    }
    
private:
    bool validate(TreeNode* root, long minVal, long maxVal) {
        if (!root) return true;
        
        // Check if current node violates BST property
        if (root->val <= minVal || root->val >= maxVal) {
            return false;
        }
        
        // Check left subtree with updated upper bound
        // Check right subtree with updated lower bound
        return validate(root->left, minVal, root->val) &&
               validate(root->right, root->val, maxVal);
    }
};

// Time: O(n) - visit each node once
// Space: O(h) - recursion depth
```

#### **Approach 2: Inorder Traversal**
```cpp
class Solution {
public:
    bool isValidBST(TreeNode* root) {
        TreeNode* prev = nullptr;
        return inorder(root, prev);
    }
    
private:
    bool inorder(TreeNode* root, TreeNode*& prev) {
        if (!root) return true;
        
        if (!inorder(root->left, prev)) return false;
        
        if (prev && prev->val >= root->val) return false;
        prev = root;
        
        return inorder(root->right, prev);
    }
};
```

**Key Learning:** BST validation can use bounds checking or inorder traversal properties.

---

### **Problem 7: Construct Binary Tree from Preorder and Inorder Traversal**
**LeetCode:** #105 | **Difficulty:** Medium | **Pattern:** Tree Construction

#### **Problem Statement:**
Given two integer arrays preorder and inorder, construct and return the binary tree.

#### **Solution:**
```cpp
class Solution {
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        // Create hashmap for O(1) inorder index lookup
        unordered_map<int, int> inMap;
        for (int i = 0; i < inorder.size(); i++) {
            inMap[inorder[i]] = i;
        }
        
        int preIndex = 0;
        return build(preorder, preIndex, 0, inorder.size() - 1, inMap);
    }
    
private:
    TreeNode* build(vector<int>& preorder, int& preIndex, 
                   int inStart, int inEnd, 
                   unordered_map<int, int>& inMap) {
        if (inStart > inEnd) return nullptr;
        
        // Root is always next element in preorder
        int rootVal = preorder[preIndex++];
        TreeNode* root = new TreeNode(rootVal);
        
        // Find root position in inorder
        int rootIndex = inMap[rootVal];
        
        // Build left subtree first (preorder: root, left, right)
        root->left = build(preorder, preIndex, inStart, rootIndex - 1, inMap);
        root->right = build(preorder, preIndex, rootIndex + 1, inEnd, inMap);
        
        return root;
    }
};

// Time: O(n) - visit each node once
// Space: O(n) - hashmap + recursion stack
```

**Key Learning:** Tree construction uses divide-and-conquer with traversal properties.

---

### **Problem 8: Lowest Common Ancestor of a Binary Tree**
**LeetCode:** #236 | **Difficulty:** Medium | **Pattern:** LCA

#### **Problem Statement:**
Given a binary tree, find the lowest common ancestor (LCA) of two given nodes.

#### **Solution:**
```cpp
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        // Base case: reached null or found one of the target nodes
        if (!root || root == p || root == q) {
            return root;
        }
        
        // Search in left and right subtrees
        TreeNode* left = lowestCommonAncestor(root->left, p, q);
        TreeNode* right = lowestCommonAncestor(root->right, p, q);
        
        // If both subtrees return non-null, current node is LCA
        if (left && right) return root;
        
        // Otherwise, LCA is in the non-null subtree
        return left ? left : right;
    }
};

// Time: O(n) - worst case visit all nodes
// Space: O(h) - recursion depth
```

**Key Learning:** LCA algorithms use post-order traversal to bubble up findings.

---

### **Problem 9: Binary Tree Right Side View**
**LeetCode:** #199 | **Difficulty:** Medium | **Pattern:** Tree Traversal

#### **Problem Statement:**
Given the root of a binary tree, return the values of the nodes you can see ordered from top to bottom when looking from the right side.

#### **Approach 1: Level Order (BFS)**
```cpp
class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        vector<int> result;
        if (!root) return result;
        
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            int levelSize = q.size();
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                
                // Last node in this level is rightmost
                if (i == levelSize - 1) {
                    result.push_back(node->val);
                }
                
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
        }
        
        return result;
    }
};
```

#### **Approach 2: DFS (Right-first)**
```cpp
class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        vector<int> result;
        dfs(root, 0, result);
        return result;
    }
    
private:
    void dfs(TreeNode* root, int level, vector<int>& result) {
        if (!root) return;
        
        // First time visiting this level
        if (level == result.size()) {
            result.push_back(root->val);
        }
        
        // Visit right first to ensure rightmost node is seen first
        dfs(root->right, level + 1, result);
        dfs(root->left, level + 1, result);
    }
};

// Time: O(n) - visit each node once
// Space: O(h) - recursion depth
```

**Key Learning:** Right side view can use BFS (level-by-level) or DFS (right-first).

---

### **Problem 10: Path Sum II**
**LeetCode:** #113 | **Difficulty:** Medium | **Pattern:** Tree Paths

#### **Problem Statement:**
Given the root of a binary tree and an integer targetSum, return all root-to-leaf paths where the sum equals targetSum.

#### **Solution:**
```cpp
class Solution {
public:
    vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
        vector<vector<int>> result;
        vector<int> path;
        dfs(root, targetSum, path, result);
        return result;
    }
    
private:
    void dfs(TreeNode* root, int sum, vector<int>& path, vector<vector<int>>& result) {
        if (!root) return;
        
        // Add current node to path
        path.push_back(root->val);
        sum -= root->val;
        
        // Check if this is a leaf with target sum
        if (!root->left && !root->right && sum == 0) {
            result.push_back(path);
        }
        
        // Explore both subtrees
        dfs(root->left, sum, path, result);
        dfs(root->right, sum, path, result);
        
        // Backtrack: remove current node from path
        path.pop_back();
    }
};

// Time: O(n²) - worst case all paths, each of length n
// Space: O(h) - recursion depth + path storage
```

**Key Learning:** Path problems use DFS with backtracking to explore all possibilities.

---

## 📊 **TIER 3: ADVANCED TREE ALGORITHMS (Hard)**

### **Problem 11: Binary Tree Maximum Path Sum**
**LeetCode:** #124 | **Difficulty:** Hard | **Pattern:** Tree DP

#### **Problem Statement:**
Given the root of a binary tree, return the maximum path sum of any non-empty path.

#### **Solution:**
```cpp
class Solution {
public:
    int maxPathSum(TreeNode* root) {
        int maxSum = INT_MIN;
        maxPathHelper(root, maxSum);
        return maxSum;
    }
    
private:
    int maxPathHelper(TreeNode* root, int& maxSum) {
        if (!root) return 0;
        
        // Get maximum path sum from left and right subtrees
        // Use max(0, ...) to ignore negative paths
        int leftSum = max(0, maxPathHelper(root->left, maxSum));
        int rightSum = max(0, maxPathHelper(root->right, maxSum));
        
        // Maximum path through current node
        int currentMax = root->val + leftSum + rightSum;
        
        // Update global maximum
        maxSum = max(maxSum, currentMax);
        
        // Return maximum path starting from current node
        return root->val + max(leftSum, rightSum);
    }
};

// Time: O(n) - visit each node once
// Space: O(h) - recursion depth
```

**Key Learning:** Tree DP problems often track global optimum while returning local optimum.

---

### **Problem 12: Serialize and Deserialize Binary Tree**
**LeetCode:** #297 | **Difficulty:** Hard | **Pattern:** Tree Serialization

#### **Problem Statement:**
Design an algorithm to serialize and deserialize a binary tree.

#### **Solution:**
```cpp
class Codec {
public:
    // Encodes a tree to a single string.
    string serialize(TreeNode* root) {
        if (!root) return "#";
        
        return to_string(root->val) + "," + 
               serialize(root->left) + "," + 
               serialize(root->right);
    }

    // Decodes your encoded data to tree.
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
        
        if (val == "#") return nullptr;
        
        TreeNode* root = new TreeNode(stoi(val));
        root->left = buildTree(nodes);
        root->right = buildTree(nodes);
        
        return root;
    }
};

// Time: O(n) for both serialize and deserialize
// Space: O(n) for string storage and recursion
```

**Key Learning:** Serialization uses preorder traversal with null markers for reconstruction.

---

### **Problem 13: Binary Tree Cameras**
**LeetCode:** #968 | **Difficulty:** Hard | **Pattern:** Tree Greedy

#### **Problem Statement:**
Given a binary tree, install cameras on the tree nodes such that every node is monitored by at least one camera. Return the minimum number of cameras needed.

#### **Solution:**
```cpp
class Solution {
public:
    int minCameraCover(TreeNode* root) {
        int cameras = 0;
        // If root is uncovered, place camera there
        if (dfs(root, cameras) == 0) {
            cameras++;
        }
        return cameras;
    }
    
private:
    // Returns: 0 = uncovered, 1 = covered, 2 = has camera
    int dfs(TreeNode* root, int& cameras) {
        if (!root) return 1; // null nodes are considered covered
        
        int left = dfs(root->left, cameras);
        int right = dfs(root->right, cameras);
        
        // If any child is uncovered, place camera at current node
        if (left == 0 || right == 0) {
            cameras++;
            return 2;
        }
        
        // If any child has camera, current node is covered
        if (left == 2 || right == 2) {
            return 1;
        }
        
        // Both children are covered but no camera, so current is uncovered
        return 0;
    }
};

// Time: O(n) - visit each node once
// Space: O(h) - recursion depth
```

**Key Learning:** Tree greedy problems use post-order traversal to make optimal local decisions.

---

### **Problem 14: Recover Binary Search Tree**
**LeetCode:** #99 | **Difficulty:** Hard | **Pattern:** BST Recovery

#### **Problem Statement:**
Two nodes of a BST are swapped by mistake. Recover the tree without changing its structure.

#### **Solution:**
```cpp
class Solution {
public:
    void recoverTree(TreeNode* root) {
        TreeNode* first = nullptr;
        TreeNode* second = nullptr;
        TreeNode* prev = nullptr;
        
        inorder(root, first, second, prev);
        
        // Swap the values of the two incorrect nodes
        if (first && second) {
            swap(first->val, second->val);
        }
    }
    
private:
    void inorder(TreeNode* root, TreeNode*& first, TreeNode*& second, TreeNode*& prev) {
        if (!root) return;
        
        inorder(root->left, first, second, prev);
        
        // Check if current node violates BST property
        if (prev && prev->val > root->val) {
            if (!first) {
                first = prev;  // First violation
                second = root;
            } else {
                second = root; // Second violation
            }
        }
        prev = root;
        
        inorder(root->right, first, second, prev);
    }
};

// Time: O(n) - single inorder traversal
// Space: O(h) - recursion depth
```

**Key Learning:** BST recovery uses inorder traversal to detect violations in sorted order.

---

### **Problem 15: Vertical Order Traversal of Binary Tree**
**LeetCode:** #987 | **Difficulty:** Hard | **Pattern:** Tree Coordinates

#### **Problem Statement:**
Given the root of a binary tree, return the vertical order traversal of its nodes' values.

#### **Solution:**
```cpp
class Solution {
public:
    vector<vector<int>> verticalTraversal(TreeNode* root) {
        // Map: column -> row -> multiset of values
        map<int, map<int, multiset<int>>> columnMap;
        
        dfs(root, 0, 0, columnMap);
        
        vector<vector<int>> result;
        for (auto& [col, rowMap] : columnMap) {
            vector<int> column;
            for (auto& [row, values] : rowMap) {
                for (int val : values) {
                    column.push_back(val);
                }
            }
            result.push_back(column);
        }
        
        return result;
    }
    
private:
    void dfs(TreeNode* root, int row, int col, 
             map<int, map<int, multiset<int>>>& columnMap) {
        if (!root) return;
        
        columnMap[col][row].insert(root->val);
        
        dfs(root->left, row + 1, col - 1, columnMap);
        dfs(root->right, row + 1, col + 1, columnMap);
    }
};

// Time: O(n log n) - sorting within each position
// Space: O(n) - storage for all nodes
```

**Key Learning:** Coordinate-based tree problems use DFS with position tracking and sorting.

---

## 📊 **COMPLEXITY SUMMARY**

| Problem | Time | Space | Pattern | Key Technique |
|---------|------|-------|---------|---------------|
| Max Depth | O(n) | O(h) | Tree DFS | Recursive depth calculation |
| Invert Tree | O(n) | O(h) | Transformation | Recursive swapping |
| Same Tree | O(n) | O(h) | Comparison | Parallel traversal |
| Symmetric Tree | O(n) | O(h) | Symmetry | Cross comparison |
| Level Order | O(n) | O(w) | BFS | Queue with level tracking |
| Validate BST | O(n) | O(h) | BST | Bounds checking |
| Build Tree | O(n) | O(n) | Construction | Divide and conquer |
| LCA | O(n) | O(h) | Ancestry | Post-order bubble up |
| Right Side View | O(n) | O(h) | View | Right-first DFS |
| Path Sum II | O(n²) | O(h) | Paths | DFS + backtracking |
| Max Path Sum | O(n) | O(h) | Tree DP | Global vs local optimum |
| Serialize Tree | O(n) | O(n) | Serialization | Preorder with markers |
| Tree Cameras | O(n) | O(h) | Greedy | Post-order decisions |
| Recover BST | O(n) | O(h) | BST Recovery | Inorder violation detection |
| Vertical Order | O(n log n) | O(n) | Coordinates | Position tracking + sorting |

---

## 🎯 **PATTERN RECOGNITION GUIDE**

### **Problem Identification Framework:**

#### **Tree Traversal Problems → DFS/BFS**
- "Visit all nodes" → Use appropriate traversal
- "Level by level" → BFS with queue
- "Depth calculation" → DFS recursive

#### **BST Problems → Use BST Properties**
- "Search/Insert/Delete" → BST operations
- "Validate BST" → Bounds or inorder
- "Recover BST" → Inorder violation detection

#### **Path Problems → DFS + Backtracking**
- "Root to leaf paths" → DFS with path tracking
- "Path sum" → DFS with sum tracking
- "Maximum path" → Tree DP pattern

#### **Construction Problems → Divide & Conquer**
- "Build from traversals" → Use traversal properties
- "Serialize/Deserialize" → Preorder with markers

#### **Tree Properties → Specialized DFS**
- "Height/Depth" → Recursive calculation
- "Balance check" → Height with difference
- "LCA" → Post-order bubble up

---

## 🚀 **OPTIMIZATION STRATEGIES**

### **1. Space Optimization**
```cpp
// Use Morris traversal for O(1) space
// Use iterative approaches to avoid recursion stack
// Reuse existing tree structure when possible
```

### **2. Time Optimization**
```cpp
// Use hashmaps for O(1) lookups in construction
// Early termination in validation problems
// Memoization for overlapping subproblems
```

### **3. Implementation Tips**
```cpp
// Handle null cases first
// Use helper functions with additional parameters
// Consider both recursive and iterative solutions
// Test with edge cases (single node, null tree)
```

---

**🎯 TREE PROBLEMS MASTERY: 15 ESSENTIAL PATTERNS COMPLETE! 🌳**
