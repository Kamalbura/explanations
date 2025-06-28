# 📈 GRAPH ALGORITHMS - COMPLETE THEORY MASTERY

## 📚 **COMPREHENSIVE GRAPH THEORY GUIDE**

### **🎯 Learning Objectives**
- Master graph data structures and representations
- Understand graph traversal algorithms (DFS/BFS)
- Implement topological sorting and cycle detection
- Solve connectivity and pathfinding problems
- Achieve interview-level proficiency in graph algorithms

---

## 📊 **FUNDAMENTAL GRAPH CONCEPTS**

### **What is a Graph?**
A graph G = (V, E) consists of:
- **V**: Set of vertices (nodes)
- **E**: Set of edges (connections between vertices)

### **Graph Types**
```
Directed Graph (Digraph):    Undirected Graph:
    A → B                        A --- B
    ↓   ↓                        |     |
    C → D                        C --- D

Weighted Graph:              Unweighted Graph:
    A --5-- B                    A --- B
    |       |                    |     |
    3       2                    C --- D
    |       |
    C --1-- D
```

### **Graph Terminology**
- **Adjacent**: Two vertices connected by an edge
- **Degree**: Number of edges connected to a vertex
- **Path**: Sequence of vertices connected by edges
- **Cycle**: Path that starts and ends at the same vertex
- **Connected Graph**: Path exists between every pair of vertices
- **Component**: Maximal connected subgraph

---

## 🗃️ **GRAPH REPRESENTATIONS**

### **1. Adjacency Matrix**
```cpp
// For n vertices, use n×n boolean matrix
vector<vector<bool>> adjMatrix(n, vector<bool>(n, false));

// Add edge between u and v
adjMatrix[u][v] = true;
if (!directed) adjMatrix[v][u] = true;

// Space: O(V²), Edge check: O(1), Add vertex: O(V²)
```

### **2. Adjacency List (PREFERRED)**
```cpp
// Vector of vectors - most efficient for sparse graphs
vector<vector<int>> adjList(n);

// Add edge between u and v
adjList[u].push_back(v);
if (!directed) adjList[v].push_back(u);

// Space: O(V + E), Edge check: O(degree), Add vertex: O(1)
```

### **3. Edge List**
```cpp
// Vector of pairs/tuples
vector<pair<int, int>> edges;
// For weighted: vector<tuple<int, int, int>> edges;

// Add edge
edges.push_back({u, v});

// Space: O(E), Good for algorithms like Kruskal's MST
```

---

## 🚀 **GRAPH TRAVERSAL ALGORITHMS**

### **1. Depth-First Search (DFS)**

#### **Recursive DFS Template**
```cpp
class Solution {
    vector<bool> visited;
    vector<vector<int>> graph;
    
    void dfs(int node) {
        visited[node] = true;
        
        // Process current node
        cout << node << " ";
        
        // Visit all unvisited neighbors
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                dfs(neighbor);
            }
        }
    }
    
public:
    void traverseGraph(vector<vector<int>>& adj) {
        int n = adj.size();
        graph = adj;
        visited.assign(n, false);
        
        // Handle disconnected components
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                dfs(i);
            }
        }
    }
};

// Time: O(V + E), Space: O(V) for recursion stack
```

#### **Iterative DFS with Stack**
```cpp
void dfsIterative(int start, vector<vector<int>>& graph) {
    vector<bool> visited(graph.size(), false);
    stack<int> stk;
    
    stk.push(start);
    
    while (!stk.empty()) {
        int node = stk.top();
        stk.pop();
        
        if (!visited[node]) {
            visited[node] = true;
            cout << node << " ";
            
            // Add neighbors to stack (reverse order for same traversal as recursive)
            for (int i = graph[node].size() - 1; i >= 0; i--) {
                if (!visited[graph[node][i]]) {
                    stk.push(graph[node][i]);
                }
            }
        }
    }
}
```

### **2. Breadth-First Search (BFS)**

#### **BFS Template for Level Order**
```cpp
void bfs(int start, vector<vector<int>>& graph) {
    vector<bool> visited(graph.size(), false);
    queue<int> q;
    
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int size = q.size();
        
        // Process all nodes at current level
        for (int i = 0; i < size; i++) {
            int node = q.front();
            q.pop();
            
            cout << node << " ";
            
            // Add unvisited neighbors
            for (int neighbor : graph[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
    }
}

// Time: O(V + E), Space: O(V) for queue
```

#### **BFS for Shortest Path (Unweighted)**
```cpp
int shortestPath(int start, int end, vector<vector<int>>& graph) {
    if (start == end) return 0;
    
    vector<bool> visited(graph.size(), false);
    queue<pair<int, int>> q; // {node, distance}
    
    visited[start] = true;
    q.push({start, 0});
    
    while (!q.empty()) {
        auto [node, dist] = q.front();
        q.pop();
        
        for (int neighbor : graph[node]) {
            if (neighbor == end) return dist + 1;
            
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push({neighbor, dist + 1});
            }
        }
    }
    
    return -1; // No path exists
}
```

---

## 🔄 **CYCLE DETECTION ALGORITHMS**

### **1. Cycle Detection in Undirected Graph**
```cpp
bool hasCycleDFS(int node, int parent, vector<vector<int>>& graph, vector<bool>& visited) {
    visited[node] = true;
    
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            if (hasCycleDFS(neighbor, node, graph, visited)) {
                return true;
            }
        }
        // Back edge found (not to parent)
        else if (neighbor != parent) {
            return true;
        }
    }
    
    return false;
}

bool hasCycle(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<bool> visited(n, false);
    
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            if (hasCycleDFS(i, -1, graph, visited)) {
                return true;
            }
        }
    }
    
    return false;
}
```

### **2. Cycle Detection in Directed Graph**
```cpp
bool hasCycleDirected(int node, vector<vector<int>>& graph, 
                     vector<int>& color) {
    // Color: 0 = unvisited, 1 = visiting, 2 = visited
    color[node] = 1; // Mark as visiting
    
    for (int neighbor : graph[node]) {
        if (color[neighbor] == 1) { // Back edge found
            return true;
        }
        if (color[neighbor] == 0 && hasCycleDirected(neighbor, graph, color)) {
            return true;
        }
    }
    
    color[node] = 2; // Mark as visited
    return false;
}

bool hasCycleDirected(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> color(n, 0);
    
    for (int i = 0; i < n; i++) {
        if (color[i] == 0) {
            if (hasCycleDirected(i, graph, color)) {
                return true;
            }
        }
    }
    
    return false;
}
```

---

## 📊 **TOPOLOGICAL SORTING**

### **1. Kahn's Algorithm (BFS-based)**
```cpp
vector<int> topologicalSort(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> indegree(n, 0);
    vector<int> result;
    
    // Calculate indegrees
    for (int u = 0; u < n; u++) {
        for (int v : graph[u]) {
            indegree[v]++;
        }
    }
    
    // Add all nodes with indegree 0 to queue
    queue<int> q;
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) {
            q.push(i);
        }
    }
    
    // Process nodes level by level
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        result.push_back(node);
        
        // Reduce indegree of neighbors
        for (int neighbor : graph[node]) {
            indegree[neighbor]--;
            if (indegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }
    
    // Check for cycle
    if (result.size() != n) {
        return {}; // Cycle exists, no valid topological sort
    }
    
    return result;
}
```

### **2. DFS-based Topological Sort**
```cpp
void topologicalSortDFS(int node, vector<vector<int>>& graph, 
                       vector<bool>& visited, stack<int>& stk) {
    visited[node] = true;
    
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            topologicalSortDFS(neighbor, graph, visited, stk);
        }
    }
    
    stk.push(node); // Add to result after visiting all descendants
}

vector<int> topologicalSort(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<bool> visited(n, false);
    stack<int> stk;
    
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            topologicalSortDFS(i, graph, visited, stk);
        }
    }
    
    vector<int> result;
    while (!stk.empty()) {
        result.push_back(stk.top());
        stk.pop();
    }
    
    return result;
}
```

---

## 🌊 **CONNECTED COMPONENTS**

### **1. Count Connected Components**
```cpp
int countConnectedComponents(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<bool> visited(n, false);
    int components = 0;
    
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            components++;
            dfs(i, graph, visited); // Any DFS implementation
        }
    }
    
    return components;
}
```

### **2. Find All Components**
```cpp
vector<vector<int>> findConnectedComponents(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<bool> visited(n, false);
    vector<vector<int>> components;
    
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            vector<int> component;
            dfsCollect(i, graph, visited, component);
            components.push_back(component);
        }
    }
    
    return components;
}

void dfsCollect(int node, vector<vector<int>>& graph, 
               vector<bool>& visited, vector<int>& component) {
    visited[node] = true;
    component.push_back(node);
    
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfsCollect(neighbor, graph, visited, component);
        }
    }
}
```

---

## 🎨 **GRAPH COLORING & BIPARTITE**

### **Bipartite Graph Detection**
```cpp
bool isBipartite(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> color(n, -1); // -1: uncolored, 0: color A, 1: color B
    
    for (int i = 0; i < n; i++) {
        if (color[i] == -1) {
            if (!bfsColor(i, graph, color)) {
                return false;
            }
        }
    }
    
    return true;
}

bool bfsColor(int start, vector<vector<int>>& graph, vector<int>& color) {
    queue<int> q;
    color[start] = 0;
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        
        for (int neighbor : graph[node]) {
            if (color[neighbor] == -1) {
                color[neighbor] = 1 - color[node]; // Opposite color
                q.push(neighbor);
            } else if (color[neighbor] == color[node]) {
                return false; // Same color adjacent nodes
            }
        }
    }
    
    return true;
}
```

---

## 🚀 **ADVANCED GRAPH PATTERNS**

### **1. Multi-Source BFS**
```cpp
// Example: Rotten Oranges problem
int orangesRotting(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    queue<pair<int, int>> rotten;
    int fresh = 0;
    
    // Find all initially rotten oranges and count fresh ones
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == 2) {
                rotten.push({i, j});
            } else if (grid[i][j] == 1) {
                fresh++;
            }
        }
    }
    
    int minutes = 0;
    vector<vector<int>> directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    
    while (!rotten.empty() && fresh > 0) {
        int size = rotten.size();
        
        for (int i = 0; i < size; i++) {
            auto [x, y] = rotten.front();
            rotten.pop();
            
            for (auto& dir : directions) {
                int nx = x + dir[0], ny = y + dir[1];
                
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] == 1) {
                    grid[nx][ny] = 2;
                    fresh--;
                    rotten.push({nx, ny});
                }
            }
        }
        
        minutes++;
    }
    
    return fresh == 0 ? minutes : -1;
}
```

### **2. Path Reconstruction**
```cpp
vector<int> reconstructPath(int start, int end, vector<int>& parent) {
    vector<int> path;
    int current = end;
    
    while (current != -1) {
        path.push_back(current);
        current = parent[current];
    }
    
    reverse(path.begin(), path.end());
    return path[0] == start ? path : vector<int>{};
}

// BFS with path tracking
vector<int> shortestPathWithReconstruction(int start, int end, 
                                          vector<vector<int>>& graph) {
    int n = graph.size();
    vector<bool> visited(n, false);
    vector<int> parent(n, -1);
    queue<int> q;
    
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        
        if (node == end) {
            return reconstructPath(start, end, parent);
        }
        
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                parent[neighbor] = node;
                q.push(neighbor);
            }
        }
    }
    
    return {}; // No path found
}
```

---

## ⚡ **OPTIMIZATION TECHNIQUES**

### **1. Early Termination**
```cpp
// Stop BFS when target is found
bool pathExists(int start, int end, vector<vector<int>>& graph) {
    if (start == end) return true;
    
    vector<bool> visited(graph.size(), false);
    queue<int> q;
    
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        
        for (int neighbor : graph[node]) {
            if (neighbor == end) return true; // Early termination
            
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
    
    return false;
}
```

### **2. Bidirectional BFS**
```cpp
bool bidirectionalBFS(int start, int end, vector<vector<int>>& graph) {
    if (start == end) return true;
    
    unordered_set<int> visitedFromStart, visitedFromEnd;
    queue<int> qStart, qEnd;
    
    visitedFromStart.insert(start);
    visitedFromEnd.insert(end);
    qStart.push(start);
    qEnd.push(end);
    
    while (!qStart.empty() || !qEnd.empty()) {
        // Expand smaller frontier
        if (qStart.size() <= qEnd.size()) {
            if (expandFrontier(qStart, visitedFromStart, visitedFromEnd, graph)) {
                return true;
            }
        } else {
            if (expandFrontier(qEnd, visitedFromEnd, visitedFromStart, graph)) {
                return true;
            }
        }
    }
    
    return false;
}

bool expandFrontier(queue<int>& q, unordered_set<int>& visited, 
                   unordered_set<int>& otherVisited, vector<vector<int>>& graph) {
    int size = q.size();
    
    for (int i = 0; i < size; i++) {
        int node = q.front();
        q.pop();
        
        for (int neighbor : graph[node]) {
            if (otherVisited.count(neighbor)) return true; // Paths meet
            
            if (!visited.count(neighbor)) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    
    return false;
}
```

---

## 🎯 **INTERVIEW PATTERNS & TIPS**

### **Common Graph Problem Types**
1. **Path Existence**: DFS/BFS to check connectivity
2. **Shortest Path**: BFS for unweighted, Dijkstra for weighted
3. **Cycle Detection**: DFS with states or BFS with indegree
4. **Topological Sort**: Kahn's algorithm or DFS postorder
5. **Connected Components**: DFS/BFS with component counting
6. **Bipartite Check**: BFS/DFS with 2-coloring
7. **Grid Problems**: DFS/BFS on 2D array as graph

### **Time Complexities Summary**
- **DFS/BFS**: O(V + E)
- **Topological Sort**: O(V + E)
- **Cycle Detection**: O(V + E)
- **Connected Components**: O(V + E)
- **Bipartite Check**: O(V + E)

### **Space Complexities**
- **Adjacency List**: O(V + E)
- **DFS Recursive**: O(V) for recursion stack
- **BFS**: O(V) for queue
- **Visited Array**: O(V)

---

## 💡 **KEY INSIGHTS FOR INTERVIEWS**

1. **Always clarify graph representation** before coding
2. **Consider disconnected components** - use outer loop
3. **DFS for deep exploration**, **BFS for level-wise**
4. **Cycle detection** differs for directed vs undirected
5. **Topological sort** only exists for DAGs
6. **Grid problems** are disguised graph problems
7. **State space** can often be modeled as graphs

---

## ✅ **MASTERY CHECKLIST**

- [ ] Can implement DFS (recursive & iterative) in 2 minutes
- [ ] Can implement BFS with level tracking in 2 minutes
- [ ] Understand when to use DFS vs BFS
- [ ] Can detect cycles in both directed and undirected graphs
- [ ] Can implement topological sort (both algorithms)
- [ ] Can solve connected components problems
- [ ] Can identify bipartite graphs
- [ ] Can solve grid-based graph problems
- [ ] Understand time/space complexity trade-offs
- [ ] Can recognize graph problems in disguise

**🎯 Next**: Practice 14 carefully selected problems to reinforce these patterns!
