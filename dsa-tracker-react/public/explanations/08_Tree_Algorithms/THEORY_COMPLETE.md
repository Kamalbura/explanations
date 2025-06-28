# 🌳 TREE ALGORITHMS - COMPLETE THEORY MASTERY

## 📚 **COMPREHENSIVE TREE THEORY GUIDE**

### **🎯 Learning Objectives**
- Master all tree data structures and algorithms
- Understand tree traversal patterns and applications
- Implement tree-based problem-solving strategies
- Achieve interview-level proficiency in tree algorithms

---

## 🌳 **FUNDAMENTAL TREE CONCEPTS**

### **What is a Tree?**
A tree is a hierarchical data structure consisting of nodes connected by edges, with these properties:
- **Exactly one root node** (no parent)
- **No cycles** (acyclic graph)
- **N-1 edges for N nodes**
- **Connected graph** (path exists between any two nodes)

### **Essential Tree Terminology**
```
        1       ← Root
      /   \
     2     3    ← Level 1 (Children of root)
   /  \   / \
  4    5 6   7  ← Level 2 (Leaves)

Node: Each element in tree
Edge: Connection between nodes
Root: Top node (no parent)
Leaf: Node with no children
Parent: Node with children
Sibling: Nodes with same parent
Ancestor: Any node on path to root
Descendant: Any node in subtree
Depth: Distance from root
Height: Maximum depth in tree
```

---

## 🔄 **TREE TRAVERSAL ALGORITHMS**

### **1. Depth-First Search (DFS) Traversals**

#### **Inorder Traversal (Left → Root → Right)**
```cpp
void inorder(TreeNode* root) {
    if (!root) return;
    inorder(root->left);     // Visit left subtree
    process(root->val);      // Process current node
    inorder(root->right);    // Visit right subtree
}
```
**Use Cases:** BST → gives sorted order, expression evaluation

#### **Preorder Traversal (Root → Left → Right)**
```cpp
void preorder(TreeNode* root) {
    if (!root) return;
    process(root->val);      // Process current node
    preorder(root->left);    // Visit left subtree
    preorder(root->right);   // Visit right subtree
}
```
**Use Cases:** Tree copying, prefix expressions, tree serialization

#### **Postorder Traversal (Left → Right → Root)**
```cpp
void postorder(TreeNode* root) {
    if (!root) return;
    postorder(root->left);   // Visit left subtree
    postorder(root->right);  // Visit right subtree
    process(root->val);      // Process current node
}
```
**Use Cases:** Tree deletion, postfix expressions, calculating tree height

### **2. Breadth-First Search (BFS) - Level Order**
```cpp
void levelOrder(TreeNode* root) {
    if (!root) return;
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        process(node->val);
        
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
}
```
**Use Cases:** Level-by-level processing, shortest path in unweighted tree

---

## 🔍 **BINARY SEARCH TREE (BST) ALGORITHMS**

### **BST Properties**
- **Left subtree:** All values < root
- **Right subtree:** All values > root
- **Inorder traversal:** Gives sorted sequence
- **Search/Insert/Delete:** O(log n) average, O(n) worst case

### **BST Core Operations**

#### **Search in BST**
```cpp
TreeNode* search(TreeNode* root, int target) {
    if (!root || root->val == target) return root;
    
    if (target < root->val)
        return search(root->left, target);
    else
        return search(root->right, target);
}
```

#### **Insert in BST**
```cpp
TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    
    if (val < root->val)
        root->left = insert(root->left, val);
    else if (val > root->val)
        root->right = insert(root->right, val);
    
    return root;
}
```

#### **Delete in BST**
```cpp
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
        
        // Node has both children
        TreeNode* minRight = findMin(root->right);
        root->val = minRight->val;
        root->right = deleteNode(root->right, minRight->val);
    }
    return root;
}
```

---

## 🏗️ **TREE CONSTRUCTION ALGORITHMS**

### **Build Tree from Traversals**

#### **From Inorder + Preorder**
```cpp
TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    unordered_map<int, int> inMap;
    for (int i = 0; i < inorder.size(); i++) {
        inMap[inorder[i]] = i;
    }
    return build(preorder, 0, 0, inorder.size() - 1, inMap);
}

TreeNode* build(vector<int>& preorder, int& preStart, 
                int inStart, int inEnd, 
                unordered_map<int, int>& inMap) {
    if (inStart > inEnd) return nullptr;
    
    int rootVal = preorder[preStart++];
    TreeNode* root = new TreeNode(rootVal);
    int inRoot = inMap[rootVal];
    
    root->left = build(preorder, preStart, inStart, inRoot - 1, inMap);
    root->right = build(preorder, preStart, inRoot + 1, inEnd, inMap);
    
    return root;
}
```

### **Validate Binary Search Tree**
```cpp
bool isValidBST(TreeNode* root) {
    return validate(root, LONG_MIN, LONG_MAX);
}

bool validate(TreeNode* root, long minVal, long maxVal) {
    if (!root) return true;
    
    if (root->val <= minVal || root->val >= maxVal) return false;
    
    return validate(root->left, minVal, root->val) &&
           validate(root->right, root->val, maxVal);
}
```

---

## 📏 **TREE PROPERTY ALGORITHMS**

### **Tree Height and Depth**
```cpp
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
```

### **Balanced Tree Check**
```cpp
bool isBalanced(TreeNode* root) {
    return checkHeight(root) != -1;
}

int checkHeight(TreeNode* root) {
    if (!root) return 0;
    
    int leftHeight = checkHeight(root->left);
    if (leftHeight == -1) return -1;
    
    int rightHeight = checkHeight(root->right);
    if (rightHeight == -1) return -1;
    
    if (abs(leftHeight - rightHeight) > 1) return -1;
    
    return 1 + max(leftHeight, rightHeight);
}
```

### **Diameter of Binary Tree**
```cpp
int diameterOfBinaryTree(TreeNode* root) {
    int diameter = 0;
    height(root, diameter);
    return diameter;
}

int height(TreeNode* root, int& diameter) {
    if (!root) return 0;
    
    int leftHeight = height(root->left, diameter);
    int rightHeight = height(root->right, diameter);
    
    diameter = max(diameter, leftHeight + rightHeight);
    
    return 1 + max(leftHeight, rightHeight);
}
```

---

## 🔍 **LOWEST COMMON ANCESTOR (LCA) ALGORITHMS**

### **LCA in Binary Tree**
```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    
    if (left && right) return root;  // p and q in different subtrees
    return left ? left : right;      // both in same subtree
}
```

### **LCA in BST (Optimized)**
```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    while (root) {
        if (p->val < root->val && q->val < root->val) {
            root = root->left;
        } else if (p->val > root->val && q->val > root->val) {
            root = root->right;
        } else {
            return root;  // Split point found
        }
    }
    return nullptr;
}
```

---

## 🛤️ **TREE PATH ALGORITHMS**

### **Root to Leaf Paths**
```cpp
vector<string> binaryTreePaths(TreeNode* root) {
    vector<string> result;
    if (root) dfs(root, "", result);
    return result;
}

void dfs(TreeNode* root, string path, vector<string>& result) {
    if (!root->left && !root->right) {
        result.push_back(path + to_string(root->val));
        return;
    }
    
    if (root->left) 
        dfs(root->left, path + to_string(root->val) + "->", result);
    if (root->right) 
        dfs(root->right, path + to_string(root->val) + "->", result);
}
```

### **Path Sum Problems**
```cpp
// Path Sum II - All root-to-leaf paths with target sum
vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
    vector<vector<int>> result;
    vector<int> path;
    dfs(root, targetSum, path, result);
    return result;
}

void dfs(TreeNode* root, int sum, vector<int>& path, vector<vector<int>>& result) {
    if (!root) return;
    
    path.push_back(root->val);
    sum -= root->val;
    
    if (!root->left && !root->right && sum == 0) {
        result.push_back(path);
    }
    
    dfs(root->left, sum, path, result);
    dfs(root->right, sum, path, result);
    
    path.pop_back();  // Backtrack
}
```

### **Maximum Path Sum**
```cpp
int maxPathSum(TreeNode* root) {
    int maxSum = INT_MIN;
    maxPathHelper(root, maxSum);
    return maxSum;
}

int maxPathHelper(TreeNode* root, int& maxSum) {
    if (!root) return 0;
    
    int leftSum = max(0, maxPathHelper(root->left, maxSum));
    int rightSum = max(0, maxPathHelper(root->right, maxSum));
    
    int currentMax = root->val + leftSum + rightSum;
    maxSum = max(maxSum, currentMax);
    
    return root->val + max(leftSum, rightSum);
}
```

---

## 🔄 **TREE TRANSFORMATION ALGORITHMS**

### **Invert Binary Tree**
```cpp
TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    
    TreeNode* temp = root->left;
    root->left = invertTree(root->right);
    root->right = invertTree(temp);
    
    return root;
}
```

### **Flatten Tree to Linked List**
```cpp
void flatten(TreeNode* root) {
    if (!root) return;
    
    flatten(root->left);
    flatten(root->right);
    
    TreeNode* rightSubtree = root->right;
    root->right = root->left;
    root->left = nullptr;
    
    TreeNode* current = root;
    while (current->right) current = current->right;
    current->right = rightSubtree;
}
```

---

## 🧠 **ADVANCED TREE ALGORITHMS**

### **Serialize and Deserialize Binary Tree**
```cpp
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
    
    return buildTree(nodes);
}

TreeNode* buildTree(queue<string>& nodes) {
    string val = nodes.front(); nodes.pop();
    if (val == "#") return nullptr;
    
    TreeNode* root = new TreeNode(stoi(val));
    root->left = buildTree(nodes);
    root->right = buildTree(nodes);
    return root;
}
```

### **Tree Iterators**
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
```

---

## 📊 **COMPLEXITY ANALYSIS**

### **Time Complexities**
```
Operation               Best    Average   Worst
BST Search              O(1)    O(log n)  O(n)
BST Insert              O(1)    O(log n)  O(n)
BST Delete              O(1)    O(log n)  O(n)
Tree Traversal          O(n)    O(n)      O(n)
Height Calculation      O(n)    O(n)      O(n)
LCA                     O(1)    O(log n)  O(n)
Path Finding            O(n)    O(n)      O(n)
```

### **Space Complexities**
```
Algorithm               Space Complexity
Recursive Traversal     O(h) where h = height
Iterative Traversal     O(h) for stack/queue
Tree Construction      O(n) for storing tree
Path Algorithms        O(h) for recursion depth
```

---

## 🎯 **TREE ALGORITHM SELECTION GUIDE**

### **When to Use Each Algorithm:**

| Problem Type | Algorithm | Time | Space |
|-------------|-----------|------|-------|
| Search in sorted tree | BST Search | O(log n) | O(1) |
| Tree traversal | DFS/BFS | O(n) | O(h) |
| Find ancestor | LCA | O(log n) | O(h) |
| Path problems | DFS + Backtracking | O(n) | O(h) |
| Tree validation | Inorder + Bounds | O(n) | O(h) |
| Tree construction | Divide & Conquer | O(n) | O(n) |

### **Decision Tree for Tree Problems:**
```
Is it a BST? 
├─ Yes → Use BST properties (inorder = sorted)
└─ No → Use general tree algorithms

Need paths?
├─ Root to leaf → DFS with backtracking
├─ Any path → Modified DFS with global tracking
└─ Shortest path → BFS

Need tree properties?
├─ Height/Depth → Recursive DFS
├─ Balance → Height with difference check
└─ Validation → Bounds checking

Need construction?
├─ From traversals → Divide and conquer
├─ From array → Level order construction
└─ Modification → In-place algorithms
```

---

## 🚀 **OPTIMIZATION TECHNIQUES**

### **1. Memoization for Tree DP**
```cpp
unordered_map<TreeNode*, int> memo;

int rob(TreeNode* root) {
    if (!root) return 0;
    if (memo.count(root)) return memo[root];
    
    int robRoot = root->val;
    if (root->left) {
        robRoot += rob(root->left->left) + rob(root->left->right);
    }
    if (root->right) {
        robRoot += rob(root->right->left) + rob(root->right->right);
    }
    
    int notRobRoot = rob(root->left) + rob(root->right);
    
    return memo[root] = max(robRoot, notRobRoot);
}
```

### **2. Iterative vs Recursive Trade-offs**
```cpp
// Iterative inorder (space efficient)
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
```

### **3. Morris Traversal (O(1) Space)**
```cpp
vector<int> morrisInorder(TreeNode* root) {
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
```

---

## 🎯 **MASTERY CHECKLIST**

### **Theory Understanding** ✅
- [ ] Tree structure and properties
- [ ] All traversal algorithms (DFS, BFS)
- [ ] BST operations and properties
- [ ] Tree construction techniques
- [ ] LCA algorithms
- [ ] Path finding algorithms
- [ ] Tree validation methods

### **Implementation Skills** ✅
- [ ] Recursive and iterative traversals
- [ ] BST search, insert, delete
- [ ] Tree construction from traversals
- [ ] Path sum and path finding
- [ ] Tree property calculations
- [ ] Tree transformations

### **Problem-Solving Patterns** ✅
- [ ] Identify when to use each traversal
- [ ] Apply BST properties effectively
- [ ] Handle tree edge cases
- [ ] Optimize space and time complexity
- [ ] Choose appropriate data structures

### **Interview Readiness** ✅
- [ ] Explain approach clearly
- [ ] Code without syntax errors
- [ ] Handle edge cases
- [ ] Analyze time/space complexity
- [ ] Optimize solutions when asked

---

**🎯 TREE ALGORITHMS THEORY: COMPLETE AND READY FOR IMPLEMENTATION! 🌳**
