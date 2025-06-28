# 🌳 TREE ALGORITHMS - TEMPLATE LIBRARY

## 🎯 **MASTER TEMPLATE COLLECTION**

**Total Templates:** 6 Core Algorithm Templates + Advanced Optimizations  
**Language:** C++ with optimal implementations  
**Usage:** Copy-paste ready for any tree problem  
**Coverage:** All major tree algorithm patterns

---

## 🔄 **TEMPLATE 1: TREE TRAVERSAL MASTER FRAMEWORK**

### **Complete Traversal Template**
```cpp
class TreeTraversal {
public:
    // DFS Traversals
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        inorderHelper(root, result);
        return result;
    }
    
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> result;
        preorderHelper(root, result);
        return result;
    }
    
    vector<int> postorderTraversal(TreeNode* root) {
        vector<int> result;
        postorderHelper(root, result);
        return result;
    }
    
    // BFS Level Order
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
    
private:
    void inorderHelper(TreeNode* root, vector<int>& result) {
        if (!root) return;
        inorderHelper(root->left, result);
        result.push_back(root->val);
        inorderHelper(root->right, result);
    }
    
    void preorderHelper(TreeNode* root, vector<int>& result) {
        if (!root) return;
        result.push_back(root->val);
        preorderHelper(root->left, result);
        preorderHelper(root->right, result);
    }
    
    void postorderHelper(TreeNode* root, vector<int>& result) {
        if (!root) return;
        postorderHelper(root->left, result);
        postorderHelper(root->right, result);
        result.push_back(root->val);
    }
};

// Usage: Copy appropriate traversal method for any tree problem
// Time: O(n) for all traversals
// Space: O(h) for recursion stack, O(w) for BFS queue
```

### **Iterative Traversal Templates**
```cpp
class IterativeTraversal {
public:
    vector<int> inorderIterative(TreeNode* root) {
        vector<int> result;
        stack<TreeNode*> st;
        TreeNode* current = root;
        
        while (current || !st.empty()) {
            while (current) {
                st.push(current);
                current = current->left;
            }
            current = st.top(); st.pop();
            result.push_back(current->val);
            current = current->right;
        }
        
        return result;
    }
    
    vector<int> preorderIterative(TreeNode* root) {
        vector<int> result;
        if (!root) return result;
        
        stack<TreeNode*> st;
        st.push(root);
        
        while (!st.empty()) {
            TreeNode* node = st.top(); st.pop();
            result.push_back(node->val);
            
            if (node->right) st.push(node->right);
            if (node->left) st.push(node->left);
        }
        
        return result;
    }
    
    vector<int> postorderIterative(TreeNode* root) {
        vector<int> result;
        if (!root) return result;
        
        stack<TreeNode*> st;
        TreeNode* lastVisited = nullptr;
        
        while (root || !st.empty()) {
            if (root) {
                st.push(root);
                root = root->left;
            } else {
                TreeNode* peekNode = st.top();
                if (peekNode->right && lastVisited != peekNode->right) {
                    root = peekNode->right;
                } else {
                    result.push_back(peekNode->val);
                    lastVisited = st.top(); st.pop();
                }
            }
        }
        
        return result;
    }
};
```

---

## 🔍 **TEMPLATE 2: BST OPERATIONS FRAMEWORK**

### **Complete BST Template**
```cpp
class BSTOperations {
public:
    // Search in BST
    TreeNode* searchBST(TreeNode* root, int val) {
        if (!root || root->val == val) return root;
        
        return val < root->val ? 
               searchBST(root->left, val) : 
               searchBST(root->right, val);
    }
    
    // Insert into BST
    TreeNode* insertIntoBST(TreeNode* root, int val) {
        if (!root) return new TreeNode(val);
        
        if (val < root->val) {
            root->left = insertIntoBST(root->left, val);
        } else {
            root->right = insertIntoBST(root->right, val);
        }
        
        return root;
    }
    
    // Delete from BST
    TreeNode* deleteNode(TreeNode* root, int key) {
        if (!root) return root;
        
        if (key < root->val) {
            root->left = deleteNode(root->left, key);
        } else if (key > root->val) {
            root->right = deleteNode(root->right, key);
        } else {
            // Node to delete found
            if (!root->left) return root->right;
            if (!root->right) return root->left;
            
            // Node has both children - find inorder successor
            TreeNode* minRight = findMin(root->right);
            root->val = minRight->val;
            root->right = deleteNode(root->right, minRight->val);
        }
        
        return root;
    }
    
    // Validate BST
    bool isValidBST(TreeNode* root) {
        return validate(root, LONG_MIN, LONG_MAX);
    }
    
    // Kth smallest element
    int kthSmallest(TreeNode* root, int k) {
        int result = 0;
        inorderKth(root, k, result);
        return result;
    }
    
private:
    TreeNode* findMin(TreeNode* root) {
        while (root->left) root = root->left;
        return root;
    }
    
    bool validate(TreeNode* root, long minVal, long maxVal) {
        if (!root) return true;
        
        if (root->val <= minVal || root->val >= maxVal) return false;
        
        return validate(root->left, minVal, root->val) &&
               validate(root->right, root->val, maxVal);
    }
    
    void inorderKth(TreeNode* root, int& k, int& result) {
        if (!root) return;
        
        inorderKth(root->left, k, result);
        if (--k == 0) {
            result = root->val;
            return;
        }
        inorderKth(root->right, k, result);
    }
};

// Usage: Use for any BST-related problem
// Time: O(log n) average for search/insert/delete, O(n) worst case
// Space: O(h) for recursion stack
```

---

## 🏗️ **TEMPLATE 3: TREE CONSTRUCTION FRAMEWORK**

### **Tree Building Master Template**
```cpp
class TreeConstruction {
public:
    // Build from preorder and inorder
    TreeNode* buildTreePreIn(vector<int>& preorder, vector<int>& inorder) {
        unordered_map<int, int> inMap;
        for (int i = 0; i < inorder.size(); i++) {
            inMap[inorder[i]] = i;
        }
        
        int preIndex = 0;
        return buildPreIn(preorder, preIndex, 0, inorder.size() - 1, inMap);
    }
    
    // Build from inorder and postorder
    TreeNode* buildTreeInPost(vector<int>& inorder, vector<int>& postorder) {
        unordered_map<int, int> inMap;
        for (int i = 0; i < inorder.size(); i++) {
            inMap[inorder[i]] = i;
        }
        
        int postIndex = postorder.size() - 1;
        return buildInPost(inorder, postorder, postIndex, 0, inorder.size() - 1, inMap);
    }
    
    // Build BST from preorder
    TreeNode* bstFromPreorder(vector<int>& preorder) {
        int index = 0;
        return buildBST(preorder, index, INT_MIN, INT_MAX);
    }
    
    // Build tree from string (serialize/deserialize)
    string serialize(TreeNode* root) {
        if (!root) return "#";
        return to_string(root->val) + "," + 
               serialize(root->left) + "," + 
               serialize(root->right);
    }
    
    TreeNode* deserialize(string data) {
        queue<string> nodes;
        stringstream ss(data);
        string item;
        
        while (getline(ss, item, ',')) {
            nodes.push(item);
        }
        
        return buildFromSerial(nodes);
    }
    
private:
    TreeNode* buildPreIn(vector<int>& preorder, int& preIndex, 
                        int inStart, int inEnd, 
                        unordered_map<int, int>& inMap) {
        if (inStart > inEnd) return nullptr;
        
        int rootVal = preorder[preIndex++];
        TreeNode* root = new TreeNode(rootVal);
        int inRoot = inMap[rootVal];
        
        root->left = buildPreIn(preorder, preIndex, inStart, inRoot - 1, inMap);
        root->right = buildPreIn(preorder, preIndex, inRoot + 1, inEnd, inMap);
        
        return root;
    }
    
    TreeNode* buildInPost(vector<int>& inorder, vector<int>& postorder,
                         int& postIndex, int inStart, int inEnd,
                         unordered_map<int, int>& inMap) {
        if (inStart > inEnd) return nullptr;
        
        int rootVal = postorder[postIndex--];
        TreeNode* root = new TreeNode(rootVal);
        int inRoot = inMap[rootVal];
        
        root->right = buildInPost(inorder, postorder, postIndex, inRoot + 1, inEnd, inMap);
        root->left = buildInPost(inorder, postorder, postIndex, inStart, inRoot - 1, inMap);
        
        return root;
    }
    
    TreeNode* buildBST(vector<int>& preorder, int& index, int minVal, int maxVal) {
        if (index >= preorder.size()) return nullptr;
        
        int val = preorder[index];
        if (val < minVal || val > maxVal) return nullptr;
        
        index++;
        TreeNode* root = new TreeNode(val);
        root->left = buildBST(preorder, index, minVal, val);
        root->right = buildBST(preorder, index, val, maxVal);
        
        return root;
    }
    
    TreeNode* buildFromSerial(queue<string>& nodes) {
        string val = nodes.front(); nodes.pop();
        if (val == "#") return nullptr;
        
        TreeNode* root = new TreeNode(stoi(val));
        root->left = buildFromSerial(nodes);
        root->right = buildFromSerial(nodes);
        return root;
    }
};

// Usage: Use for tree construction problems
// Time: O(n) for most construction algorithms
// Space: O(n) for hashmap and recursion
```

---

## 🛤️ **TEMPLATE 4: TREE PATH ALGORITHMS FRAMEWORK**

### **Path Finding Master Template**
```cpp
class TreePathAlgorithms {
public:
    // All root-to-leaf paths
    vector<string> binaryTreePaths(TreeNode* root) {
        vector<string> result;
        if (root) dfsPath(root, "", result);
        return result;
    }
    
    // Path sum - check if exists
    bool hasPathSum(TreeNode* root, int targetSum) {
        if (!root) return false;
        
        if (!root->left && !root->right) {
            return targetSum == root->val;
        }
        
        return hasPathSum(root->left, targetSum - root->val) ||
               hasPathSum(root->right, targetSum - root->val);
    }
    
    // Path sum II - all paths with target sum
    vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
        vector<vector<int>> result;
        vector<int> path;
        dfsPathSum(root, targetSum, path, result);
        return result;
    }
    
    // Maximum path sum (any node to any node)
    int maxPathSum(TreeNode* root) {
        int maxSum = INT_MIN;
        maxPathHelper(root, maxSum);
        return maxSum;
    }
    
    // Path sum III - paths not necessarily from root
    int pathSumIII(TreeNode* root, long targetSum) {
        if (!root) return 0;
        
        return pathFromNode(root, targetSum) +
               pathSumIII(root->left, targetSum) +
               pathSumIII(root->right, targetSum);
    }
    
    // Longest univalue path
    int longestUnivaluePath(TreeNode* root) {
        int longest = 0;
        univalueHelper(root, longest);
        return longest;
    }
    
private:
    void dfsPath(TreeNode* root, string path, vector<string>& result) {
        if (!root->left && !root->right) {
            result.push_back(path + to_string(root->val));
            return;
        }
        
        if (root->left) {
            dfsPath(root->left, path + to_string(root->val) + "->", result);
        }
        if (root->right) {
            dfsPath(root->right, path + to_string(root->val) + "->", result);
        }
    }
    
    void dfsPathSum(TreeNode* root, int sum, vector<int>& path, vector<vector<int>>& result) {
        if (!root) return;
        
        path.push_back(root->val);
        sum -= root->val;
        
        if (!root->left && !root->right && sum == 0) {
            result.push_back(path);
        }
        
        dfsPathSum(root->left, sum, path, result);
        dfsPathSum(root->right, sum, path, result);
        
        path.pop_back(); // Backtrack
    }
    
    int maxPathHelper(TreeNode* root, int& maxSum) {
        if (!root) return 0;
        
        int leftSum = max(0, maxPathHelper(root->left, maxSum));
        int rightSum = max(0, maxPathHelper(root->right, maxSum));
        
        int currentMax = root->val + leftSum + rightSum;
        maxSum = max(maxSum, currentMax);
        
        return root->val + max(leftSum, rightSum);
    }
    
    int pathFromNode(TreeNode* root, long targetSum) {
        if (!root) return 0;
        
        int count = 0;
        if (root->val == targetSum) count++;
        
        count += pathFromNode(root->left, targetSum - root->val);
        count += pathFromNode(root->right, targetSum - root->val);
        
        return count;
    }
    
    int univalueHelper(TreeNode* root, int& longest) {
        if (!root) return 0;
        
        int left = univalueHelper(root->left, longest);
        int right = univalueHelper(root->right, longest);
        
        int leftPath = (root->left && root->left->val == root->val) ? left + 1 : 0;
        int rightPath = (root->right && root->right->val == root->val) ? right + 1 : 0;
        
        longest = max(longest, leftPath + rightPath);
        
        return max(leftPath, rightPath);
    }
};

// Usage: Use for any path-related tree problem
// Time: O(n) for most path algorithms, O(n²) for pathSumIII
// Space: O(h) for recursion stack
```

---

## 🔍 **TEMPLATE 5: TREE PROPERTY ALGORITHMS FRAMEWORK**

### **Tree Analysis Master Template**
```cpp
class TreeProperties {
public:
    // Tree height/depth
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
    
    int minDepth(TreeNode* root) {
        if (!root) return 0;
        if (!root->left) return 1 + minDepth(root->right);
        if (!root->right) return 1 + minDepth(root->left);
        return 1 + min(minDepth(root->left), minDepth(root->right));
    }
    
    // Check if balanced
    bool isBalanced(TreeNode* root) {
        return checkHeight(root) != -1;
    }
    
    // Tree diameter
    int diameterOfBinaryTree(TreeNode* root) {
        int diameter = 0;
        heightForDiameter(root, diameter);
        return diameter;
    }
    
    // Count nodes
    int countNodes(TreeNode* root) {
        if (!root) return 0;
        return 1 + countNodes(root->left) + countNodes(root->right);
    }
    
    // Count leaf nodes
    int countLeaves(TreeNode* root) {
        if (!root) return 0;
        if (!root->left && !root->right) return 1;
        return countLeaves(root->left) + countLeaves(root->right);
    }
    
    // Sum of all nodes
    int sumOfNodes(TreeNode* root) {
        if (!root) return 0;
        return root->val + sumOfNodes(root->left) + sumOfNodes(root->right);
    }
    
    // Check if same tree
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (!p && !q) return true;
        if (!p || !q) return false;
        return (p->val == q->val) && 
               isSameTree(p->left, q->left) && 
               isSameTree(p->right, q->right);
    }
    
    // Check if symmetric
    bool isSymmetric(TreeNode* root) {
        if (!root) return true;
        return isMirror(root->left, root->right);
    }
    
    // Check if subtree
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        if (!root) return false;
        if (isSameTree(root, subRoot)) return true;
        return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);
    }
    
private:
    int checkHeight(TreeNode* root) {
        if (!root) return 0;
        
        int leftHeight = checkHeight(root->left);
        if (leftHeight == -1) return -1;
        
        int rightHeight = checkHeight(root->right);
        if (rightHeight == -1) return -1;
        
        if (abs(leftHeight - rightHeight) > 1) return -1;
        
        return 1 + max(leftHeight, rightHeight);
    }
    
    int heightForDiameter(TreeNode* root, int& diameter) {
        if (!root) return 0;
        
        int leftHeight = heightForDiameter(root->left, diameter);
        int rightHeight = heightForDiameter(root->right, diameter);
        
        diameter = max(diameter, leftHeight + rightHeight);
        
        return 1 + max(leftHeight, rightHeight);
    }
    
    bool isMirror(TreeNode* left, TreeNode* right) {
        if (!left && !right) return true;
        if (!left || !right) return false;
        return (left->val == right->val) &&
               isMirror(left->left, right->right) &&
               isMirror(left->right, right->left);
    }
};

// Usage: Use for tree property analysis problems
// Time: O(n) for most property checks
// Space: O(h) for recursion stack
```

---

## 🎯 **TEMPLATE 6: LOWEST COMMON ANCESTOR FRAMEWORK**

### **LCA Master Template**
```cpp
class LCAAlgorithms {
public:
    // LCA in binary tree
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root || root == p || root == q) return root;
        
        TreeNode* left = lowestCommonAncestor(root->left, p, q);
        TreeNode* right = lowestCommonAncestor(root->right, p, q);
        
        if (left && right) return root;
        return left ? left : right;
    }
    
    // LCA in BST (optimized)
    TreeNode* lowestCommonAncestorBST(TreeNode* root, TreeNode* p, TreeNode* q) {
        while (root) {
            if (p->val < root->val && q->val < root->val) {
                root = root->left;
            } else if (p->val > root->val && q->val > root->val) {
                root = root->right;
            } else {
                return root;
            }
        }
        return nullptr;
    }
    
    // Distance between two nodes
    int findDistance(TreeNode* root, int p, int q) {
        TreeNode* lca = findLCA(root, p, q);
        return getDistance(lca, p) + getDistance(lca, q);
    }
    
    // All nodes at distance K from target
    vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {
        vector<int> result;
        dfsDistanceK(root, target, k, result);
        return result;
    }
    
private:
    TreeNode* findLCA(TreeNode* root, int p, int q) {
        if (!root) return nullptr;
        if (root->val == p || root->val == q) return root;
        
        TreeNode* left = findLCA(root->left, p, q);
        TreeNode* right = findLCA(root->right, p, q);
        
        if (left && right) return root;
        return left ? left : right;
    }
    
    int getDistance(TreeNode* root, int target) {
        if (!root) return -1;
        if (root->val == target) return 0;
        
        int left = getDistance(root->left, target);
        int right = getDistance(root->right, target);
        
        if (left == -1 && right == -1) return -1;
        return 1 + max(left, right);
    }
    
    int dfsDistanceK(TreeNode* root, TreeNode* target, int k, vector<int>& result) {
        if (!root) return -1;
        
        if (root == target) {
            collectAtDistance(root, k, result);
            return 0;
        }
        
        int leftDist = dfsDistanceK(root->left, target, k, result);
        int rightDist = dfsDistanceK(root->right, target, k, result);
        
        if (leftDist != -1) {
            if (leftDist + 1 == k) {
                result.push_back(root->val);
            } else {
                collectAtDistance(root->right, k - leftDist - 2, result);
            }
            return leftDist + 1;
        }
        
        if (rightDist != -1) {
            if (rightDist + 1 == k) {
                result.push_back(root->val);
            } else {
                collectAtDistance(root->left, k - rightDist - 2, result);
            }
            return rightDist + 1;
        }
        
        return -1;
    }
    
    void collectAtDistance(TreeNode* root, int k, vector<int>& result) {
        if (!root || k < 0) return;
        if (k == 0) {
            result.push_back(root->val);
            return;
        }
        
        collectAtDistance(root->left, k - 1, result);
        collectAtDistance(root->right, k - 1, result);
    }
};

// Usage: Use for LCA and distance-related problems
// Time: O(n) for binary tree LCA, O(log n) for BST LCA
// Space: O(h) for recursion stack
```

---

## 🚀 **ADVANCED OPTIMIZATION TEMPLATES**

### **Morris Traversal (O(1) Space)**
```cpp
class MorrisTraversal {
public:
    vector<int> inorderMorris(TreeNode* root) {
        vector<int> result;
        TreeNode* current = root;
        
        while (current) {
            if (!current->left) {
                result.push_back(current->val);
                current = current->right;
            } else {
                TreeNode* predecessor = current->left;
                while (predecessor->right && predecessor->right != current) {
                    predecessor = predecessor->right;
                }
                
                if (!predecessor->right) {
                    predecessor->right = current;
                    current = current->left;
                } else {
                    predecessor->right = nullptr;
                    result.push_back(current->val);
                    current = current->right;
                }
            }
        }
        
        return result;
    }
};

// Usage: Use when O(1) space is required
// Time: O(n), Space: O(1)
```

### **Tree Iterator Template**
```cpp
class BSTIterator {
private:
    stack<TreeNode*> st;
    
    void pushAll(TreeNode* node) {
        while (node) {
            st.push(node);
            node = node->left;
        }
    }
    
public:
    BSTIterator(TreeNode* root) {
        pushAll(root);
    }
    
    int next() {
        TreeNode* temp = st.top(); st.pop();
        pushAll(temp->right);
        return temp->val;
    }
    
    bool hasNext() {
        return !st.empty();
    }
};

// Usage: Use for iterator-based tree traversal
// Time: O(1) amortized for next(), Space: O(h)
```

---

## 🎯 **TEMPLATE SELECTION GUIDE**

### **Quick Selection Table:**
| Problem Type | Template | Key Feature |
|-------------|----------|-------------|
| Tree traversal | Template 1 | All 4 traversal methods |
| BST operations | Template 2 | Search/Insert/Delete/Validate |
| Tree construction | Template 3 | Build from traversals/arrays |
| Path problems | Template 4 | All path-finding variants |
| Tree properties | Template 5 | Height/Balance/Comparison |
| LCA problems | Template 6 | Ancestor and distance queries |

### **Optimization Selection:**
- **Space-critical problems** → Morris Traversal
- **Iterator requirements** → BSTIterator Template
- **Large trees** → Iterative approaches
- **Memory constraints** → In-place algorithms

---

## 🔧 **TEMPLATE CUSTOMIZATION GUIDE**

### **How to Adapt Templates:**

1. **Change Return Type:** Modify result type as needed
2. **Add Conditions:** Insert problem-specific checks
3. **Modify Processing:** Change what happens at each node
4. **Add Parameters:** Include additional state variables
5. **Handle Edge Cases:** Add null checks and boundary conditions

### **Common Customizations:**
```cpp
// Example: Adapt traversal for different processing
void customTraversal(TreeNode* root, /* custom parameters */) {
    if (!root) return; // Always check null first
    
    // Pre-processing (preorder position)
    
    customTraversal(root->left, /* parameters */);
    
    // In-processing (inorder position)
    
    customTraversal(root->right, /* parameters */);
    
    // Post-processing (postorder position)
}
```

---

**🎯 TREE ALGORITHM TEMPLATES: COMPLETE LIBRARY READY FOR ANY TREE PROBLEM! 🌳**

**Master Strategy:** Copy appropriate template → Customize for specific problem → Test with examples → Optimize if needed
