# 🎯 GRAPH ALGORITHMS: COMPLETE MASTERY GUIDE

## 🧠 **CORE CONCEPT: CONNECTED DATA EXPLORATION**

Graph Algorithms are about **systematically exploring relationships** between connected data points. Graphs model real-world problems better than linear data structures.

### **The Graph Mindset:**
```
Real World → Graph Model → Algorithm → Solution
- Social Networks → Nodes = People, Edges = Friendships
- Maps → Nodes = Cities, Edges = Roads  
- Internet → Nodes = Servers, Edges = Connections
- Dependencies → Nodes = Tasks, Edges = Requirements
```

---

## 📐 **MATHEMATICAL FOUNDATION**

### **Graph Theory Basics:**
```
Graph G = (V, E) where:
- V = Set of vertices (nodes)
- E = Set of edges (connections)

Types:
- Directed vs Undirected
- Weighted vs Unweighted  
- Connected vs Disconnected
- Cyclic vs Acyclic (DAG)
```

### **Key Properties:**
```
|V| = Number of vertices
|E| = Number of edges

Dense Graph: |E| ≈ |V|² (adjacency matrix better)
Sparse Graph: |E| ≈ |V| (adjacency list better)

Complete Graph: |E| = |V|(|V|-1)/2
Tree: |E| = |V| - 1 (special case)
```

---

## 🎨 **CORE ALGORITHM PATTERNS**

### **Pattern 1: Graph Traversal (DFS/BFS)**
**Use Case**: Explore all reachable nodes, find connected components
```cpp
// DFS Template - Stack-based exploration
void dfs(int node, vector<vector<int>>& graph, vector<bool>& visited) {
    visited[node] = true;
    process(node); // Do something with current node
    
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfs(neighbor, graph, visited);
        }
    }
}

// BFS Template - Queue-based level exploration  
void bfs(int start, vector<vector<int>>& graph) {
    vector<bool> visited(graph.size(), false);
    queue<int> q;
    
    q.push(start);
    visited[start] = true;
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        
        process(node);
        
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}
```

### **Pattern 2: Shortest Path Algorithms**
**Use Case**: Find minimum cost/distance between nodes
```cpp
// Dijkstra's Algorithm - Single source shortest path
vector<int> dijkstra(int start, vector<vector<pair<int,int>>>& graph) {
    int n = graph.size();
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    
    dist[start] = 0;
    pq.push({0, start}); // {distance, node}
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        
        if (d > dist[u]) continue; // Skip outdated entries
        
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

### **Pattern 3: Topological Sorting**
**Use Case**: Order tasks with dependencies, detect cycles
```cpp
// Kahn's Algorithm - BFS-based topological sort
vector<int> topologicalSort(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> indegree(n, 0);
    
    // Calculate indegrees
    for (int u = 0; u < n; u++) {
        for (int v : graph[u]) {
            indegree[v]++;
        }
    }
    
    // Start with nodes having no dependencies
    queue<int> q;
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) {
            q.push(i);
        }
    }
    
    vector<int> result;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        result.push_back(u);
        
        // Remove edges from u
        for (int v : graph[u]) {
            indegree[v]--;
            if (indegree[v] == 0) {
                q.push(v);
            }
        }
    }
    
    // Check for cycle
    return result.size() == n ? result : vector<int>();
}
```

### **Pattern 4: Union-Find (Disjoint Set)**
**Use Case**: Dynamic connectivity, cycle detection, MST
```cpp
class UnionFind {
private:
    vector<int> parent, rank;
    
public:
    UnionFind(int n) : parent(n), rank(n, 0) {
        iota(parent.begin(), parent.end(), 0); // parent[i] = i
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // Path compression
        }
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int rootX = find(x), rootY = find(y);
        
        if (rootX == rootY) return false; // Already connected
        
        // Union by rank
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        
        return true;
    }
    
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
};
```

---

## 🔍 **PROBLEM RECOGNITION PATTERNS**

### **Pattern Recognition Table:**
| **Problem Statement** | **Algorithm** | **Key Insight** |
|----------------------|---------------|-----------------|
| "Find all connected components" | DFS/BFS | Traverse from each unvisited node |
| "Shortest path between two points" | BFS (unweighted) / Dijkstra (weighted) | Level-by-level exploration |
| "Can finish all courses?" | Topological Sort | Check for cycles in dependency graph |
| "Number of islands" | DFS/BFS | Each island is a connected component |
| "Minimum spanning tree" | Kruskal's + Union-Find | Connect all nodes with minimum cost |
| "Detect cycle in graph" | DFS (directed) / Union-Find (undirected) | Back edge detection |

---

## 💻 **ESSENTIAL PROBLEMS & SOLUTIONS**

### **Problem 1: Number of Islands (Leetcode 200)**
```cpp
// Problem: Count connected components in 2D grid
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        
        int m = grid.size(), n = grid[0].size();
        int islands = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    islands++;
                    dfs(grid, i, j); // Mark entire island as visited
                }
            }
        }
        
        return islands;
    }
    
private:
    void dfs(vector<vector<char>>& grid, int i, int j) {
        int m = grid.size(), n = grid[0].size();
        
        // Boundary and validity check
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] != '1') {
            return;
        }
        
        grid[i][j] = '0'; // Mark as visited
        
        // Explore all 4 directions
        dfs(grid, i-1, j); // Up
        dfs(grid, i+1, j); // Down  
        dfs(grid, i, j-1); // Left
        dfs(grid, i, j+1); // Right
    }
};

// Time: O(M×N), Space: O(M×N) for recursion stack
// Pattern: Connected component counting using DFS
```

### **Problem 2: Course Schedule (Leetcode 207)**
```cpp
// Problem: Can finish all courses given prerequisites?
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // Build adjacency list
        vector<vector<int>> graph(numCourses);
        vector<int> indegree(numCourses, 0);
        
        for (auto& prereq : prerequisites) {
            int course = prereq[0];
            int prerequisite = prereq[1];
            
            graph[prerequisite].push_back(course);
            indegree[course]++;
        }
        
        // Kahn's algorithm for topological sort
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                q.push(i);
            }
        }
        
        int completed = 0;
        while (!q.empty()) {
            int course = q.front();
            q.pop();
            completed++;
            
            for (int nextCourse : graph[course]) {
                indegree[nextCourse]--;
                if (indegree[nextCourse] == 0) {
                    q.push(nextCourse);
                }
            }
        }
        
        return completed == numCourses; // All courses completed = no cycle
    }
};

// Time: O(V + E), Space: O(V + E)
// Pattern: Cycle detection using topological sort
```

### **Problem 3: Clone Graph (Leetcode 133)**
```cpp
// Problem: Deep copy of undirected graph
class Solution {
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        
        unordered_map<Node*, Node*> cloned;
        return dfs(node, cloned);
    }
    
private:
    Node* dfs(Node* node, unordered_map<Node*, Node*>& cloned) {
        // If already cloned, return the clone
        if (cloned.count(node)) {
            return cloned[node];
        }
        
        // Create new node
        Node* clone = new Node(node->val);
        cloned[node] = clone;
        
        // Clone all neighbors recursively
        for (Node* neighbor : node->neighbors) {
            clone->neighbors.push_back(dfs(neighbor, cloned));
        }
        
        return clone;
    }
};

// Time: O(V + E), Space: O(V)
// Pattern: Graph traversal with state tracking
```

### **Problem 4: Network Delay Time (Leetcode 743)**
```cpp
// Problem: Time for signal to reach all nodes
class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        // Build adjacency list
        vector<vector<pair<int,int>>> graph(n + 1);
        for (auto& time : times) {
            int u = time[0], v = time[1], w = time[2];
            graph[u].push_back({v, w});
        }
        
        // Dijkstra's algorithm
        vector<int> dist(n + 1, INT_MAX);
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
        
        dist[k] = 0;
        pq.push({0, k});
        
        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();
            
            if (d > dist[u]) continue;
            
            for (auto [v, weight] : graph[u]) {
                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.push({dist[v], v});
                }
            }
        }
        
        // Find maximum distance
        int maxTime = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == INT_MAX) return -1; // Unreachable node
            maxTime = max(maxTime, dist[i]);
        }
        
        return maxTime;
    }
};

// Time: O((V + E) log V), Space: O(V + E)
// Pattern: Single-source shortest path with Dijkstra
```

### **Problem 5: Number of Connected Components (Leetcode 323)**
```cpp
// Problem: Count connected components in undirected graph
class Solution {
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        UnionFind uf(n);
        
        // Union connected nodes
        for (auto& edge : edges) {
            uf.unite(edge[0], edge[1]);
        }
        
        // Count unique roots
        unordered_set<int> roots;
        for (int i = 0; i < n; i++) {
            roots.insert(uf.find(i));
        }
        
        return roots.size();
    }
    
private:
    class UnionFind {
        vector<int> parent, rank;
    public:
        UnionFind(int n) : parent(n), rank(n, 0) {
            iota(parent.begin(), parent.end(), 0);
        }
        
        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }
        
        void unite(int x, int y) {
            int rootX = find(x), rootY = find(y);
            if (rootX == rootY) return;
            
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
        }
    };
};

// Time: O(E × α(V)), Space: O(V) where α is inverse Ackermann
// Pattern: Connected components using Union-Find
```

---

## 🧩 **ADVANCED TECHNIQUES**

### **Technique 1: Bidirectional BFS**
```cpp
// For shortest path between two specific nodes
int bidirectionalBFS(int start, int target, vector<vector<int>>& graph) {
    if (start == target) return 0;
    
    unordered_set<int> visited1, visited2;
    queue<int> q1, q2;
    
    q1.push(start);
    q2.push(target);
    visited1.insert(start);
    visited2.insert(target);
    
    int level = 0;
    
    while (!q1.empty() || !q2.empty()) {
        level++;
        
        // Always expand smaller frontier
        if (q1.size() > q2.size()) {
            swap(q1, q2);
            swap(visited1, visited2);
        }
        
        int size = q1.size();
        for (int i = 0; i < size; i++) {
            int node = q1.front();
            q1.pop();
            
            for (int neighbor : graph[node]) {
                if (visited2.count(neighbor)) {
                    return level; // Found intersection
                }
                
                if (!visited1.count(neighbor)) {
                    visited1.insert(neighbor);
                    q1.push(neighbor);
                }
            }
        }
    }
    
    return -1; // No path exists
}
```

### **Technique 2: Floyd-Warshall (All Pairs Shortest Path)**
```cpp
// Find shortest paths between all pairs of nodes
vector<vector<int>> floydWarshall(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<vector<int>> dist = graph;
    
    // Initialize distances
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) dist[i][j] = 0;
            else if (graph[i][j] == 0) dist[i][j] = INT_MAX;
        }
    }
    
    // Floyd-Warshall algorithm
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX) {
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }
    
    return dist;
}
```

### **Technique 3: Tarjan's Algorithm (Strongly Connected Components)**
```cpp
class TarjanSCC {
private:
    vector<vector<int>> graph;
    vector<int> disc, low, stackMember;
    stack<int> st;
    int timer;
    vector<vector<int>> sccList;
    
    void tarjanUtil(int u) {
        disc[u] = low[u] = ++timer;
        st.push(u);
        stackMember[u] = true;
        
        for (int v : graph[u]) {
            if (disc[v] == -1) {
                tarjanUtil(v);
                low[u] = min(low[u], low[v]);
            } else if (stackMember[v]) {
                low[u] = min(low[u], disc[v]);
            }
        }
        
        // If u is root of SCC
        if (low[u] == disc[u]) {
            vector<int> scc;
            while (true) {
                int w = st.top();
                st.pop();
                stackMember[w] = false;
                scc.push_back(w);
                if (w == u) break;
            }
            sccList.push_back(scc);
        }
    }
    
public:
    vector<vector<int>> findSCCs(vector<vector<int>>& g) {
        graph = g;
        int n = graph.size();
        disc.assign(n, -1);
        low.assign(n, -1);
        stackMember.assign(n, false);
        timer = 0;
        
        for (int i = 0; i < n; i++) {
            if (disc[i] == -1) {
                tarjanUtil(i);
            }
        }
        
        return sccList;
    }
};
```

---

## ⚡ **OPTIMIZATION STRATEGIES**

### **Strategy 1: Choose Right Data Structure**
```cpp
// Sparse graph (|E| ≈ |V|) → Adjacency List
vector<vector<int>> adjList(n);

// Dense graph (|E| ≈ |V|²) → Adjacency Matrix  
vector<vector<bool>> adjMatrix(n, vector<bool>(n, false));

// Weighted graph → Pair/Struct
vector<vector<pair<int,int>>> weightedGraph(n); // {neighbor, weight}
```

### **Strategy 2: Early Termination**
```cpp
// In BFS for shortest path, stop when target found
if (current == target) return distance;

// In DFS, use return value to stop early
bool dfs(int node) {
    if (found_solution) return true;
    // ... continue only if necessary
}
```

### **Strategy 3: Bidirectional Search**
```cpp
// For shortest path between two specific nodes
// Reduces complexity from O(b^d) to O(b^(d/2))
// where b = branching factor, d = depth
```

---

## 🎯 **PROBLEM-SOLVING FRAMEWORK**

### **Step 1: Graph Modeling (2 minutes)**
- Identify nodes and edges
- Determine if directed/undirected, weighted/unweighted
- Choose appropriate representation

### **Step 2: Algorithm Selection (1 minute)**
```cpp
if (problem_asks_for_shortest_path) {
    if (unweighted) use_bfs();
    else if (single_source) use_dijkstra();
    else use_floyd_warshall();
}

if (problem_involves_dependencies) {
    use_topological_sort();
}

if (problem_asks_for_connectivity) {
    use_dfs_or_union_find();
}

if (problem_involves_cycles) {
    if (directed) use_dfs_with_colors();
    else use_union_find();
}
```

### **Step 3: Implementation (15-20 minutes)**
1. Set up graph representation
2. Implement chosen algorithm
3. Handle edge cases
4. Test with examples

---

## 🔧 **COMMON PITFALLS & SOLUTIONS**

### **Pitfall 1: Wrong Graph Representation**
```cpp
// ❌ Wrong: Using adjacency matrix for sparse graph
vector<vector<bool>> adj(n, vector<bool>(n, false)); // O(V²) space

// ✅ Correct: Use adjacency list for sparse graph
vector<vector<int>> adj(n); // O(V + E) space
```

### **Pitfall 2: Not Handling Disconnected Components**
```cpp
// ❌ Wrong: Single DFS/BFS call
dfs(0, graph, visited);

// ✅ Correct: Check all unvisited nodes
for (int i = 0; i < n; i++) {
    if (!visited[i]) {
        dfs(i, graph, visited);
    }
}
```

### **Pitfall 3: Infinite Loops in Cycle Detection**
```cpp
// ❌ Wrong: No visited tracking in DFS
void dfs(int node) {
    for (int neighbor : graph[node]) {
        dfs(neighbor); // Infinite loop if cycle exists
    }
}

// ✅ Correct: Track visited states
void dfs(int node, vector<bool>& visited) {
    visited[node] = true;
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfs(neighbor, visited);
        }
    }
}
```

---

## 📊 **COMPLEXITY ANALYSIS**

### **Time Complexity Patterns:**
- **DFS/BFS**: O(V + E) - visit each node and edge once
- **Dijkstra**: O((V + E) log V) - with priority queue
- **Topological Sort**: O(V + E) - Kahn's algorithm
- **Union-Find**: O(E × α(V)) - α is inverse Ackermann
- **Floyd-Warshall**: O(V³) - three nested loops

### **Space Complexity:**
- **Adjacency List**: O(V + E)
- **Adjacency Matrix**: O(V²)
- **DFS Recursion**: O(V) - for call stack
- **BFS Queue**: O(V) - for queue storage

---

## 🏆 **MASTERY CHECKLIST**

- [ ] **Representation**: Choose optimal graph representation instantly
- [ ] **Traversal**: Implement DFS/BFS from memory
- [ ] **Shortest Path**: Know when to use BFS vs Dijkstra vs Floyd-Warshall
- [ ] **Topological Sort**: Detect cycles and order dependencies
- [ ] **Union-Find**: Handle dynamic connectivity efficiently
- [ ] **Optimization**: Apply bidirectional search and pruning
- [ ] **Real-World**: Model problems as graphs correctly

---

## 🚀 **INTERVIEW SUCCESS TIPS**

1. **Model First**: "I'll represent this as a graph where nodes are... and edges are..."
2. **Choose Algorithm**: "For this problem, I need... algorithm because..."
3. **Justify Complexity**: "This gives us O(V + E) time which is optimal because..."
4. **Handle Edge Cases**: "I need to check for disconnected components/cycles..."
5. **Optimize**: "We can improve this with bidirectional search/early termination..."

---

**🎯 Master Graph Algorithms and you'll solve connectivity and path problems with confidence!**
