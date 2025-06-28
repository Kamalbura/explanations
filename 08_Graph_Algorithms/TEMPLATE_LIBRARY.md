# 📈 GRAPH ALGORITHMS - TEMPLATE LIBRARY

## 🚀 **QUICK REFERENCE TEMPLATES**

---

## 📊 **GRAPH REPRESENTATIONS**

### **Adjacency List (RECOMMENDED)**
```cpp
// Most efficient for sparse graphs
vector<vector<int>> adjList(n);

// Add edge u -> v
adjList[u].push_back(v);
// For undirected: adjList[v].push_back(u);

// Weighted graph
vector<vector<pair<int, int>>> weightedGraph(n); // {neighbor, weight}
weightedGraph[u].push_back({v, weight});
```

### **Adjacency Matrix**
```cpp
// Good for dense graphs or when need O(1) edge lookup
vector<vector<bool>> adjMatrix(n, vector<bool>(n, false));

// Add edge u -> v
adjMatrix[u][v] = true;
// For undirected: adjMatrix[v][u] = true;

// Weighted version
vector<vector<int>> weightedMatrix(n, vector<int>(n, INF));
weightedMatrix[u][v] = weight;
```

---

## 🔄 **GRAPH TRAVERSAL TEMPLATES**

### **DFS - Recursive**
```cpp
class DFS {
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
    void traverseAll(vector<vector<int>>& adj) {
        graph = adj;
        int n = graph.size();
        visited.assign(n, false);
        
        // Handle disconnected components
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                dfs(i);
            }
        }
    }
};
```

### **DFS - Iterative**
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
            
            // Add neighbors (reverse order for same result as recursive)
            for (int i = graph[node].size() - 1; i >= 0; i--) {
                if (!visited[graph[node][i]]) {
                    stk.push(graph[node][i]);
                }
            }
        }
    }
}
```

### **BFS - Level Order**
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
            
            for (int neighbor : graph[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        cout << endl; // End of level
    }
}
```

### **BFS - Shortest Path**
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

## 🔄 **CYCLE DETECTION TEMPLATES**

### **Undirected Graph Cycle Detection**
```cpp
bool hasCycleUndirected(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<bool> visited(n, false);
    
    function<bool(int, int)> dfs = [&](int node, int parent) -> bool {
        visited[node] = true;
        
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                if (dfs(neighbor, node)) return true;
            } else if (neighbor != parent) {
                return true; // Back edge found
            }
        }
        return false;
    };
    
    for (int i = 0; i < n; i++) {
        if (!visited[i] && dfs(i, -1)) {
            return true;
        }
    }
    
    return false;
}
```

### **Directed Graph Cycle Detection**
```cpp
bool hasCycleDirected(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> color(n, 0); // 0: white, 1: gray, 2: black
    
    function<bool(int)> dfs = [&](int node) -> bool {
        color[node] = 1; // Mark as visiting (gray)
        
        for (int neighbor : graph[node]) {
            if (color[neighbor] == 1) return true; // Back edge
            if (color[neighbor] == 0 && dfs(neighbor)) return true;
        }
        
        color[node] = 2; // Mark as visited (black)
        return false;
    };
    
    for (int i = 0; i < n; i++) {
        if (color[i] == 0 && dfs(i)) {
            return true;
        }
    }
    
    return false;
}
```

---

## 📊 **TOPOLOGICAL SORT TEMPLATES**

### **Kahn's Algorithm (BFS-based)**
```cpp
vector<int> topologicalSortKahn(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> indegree(n, 0);
    vector<int> result;
    
    // Calculate indegrees
    for (int u = 0; u < n; u++) {
        for (int v : graph[u]) {
            indegree[v]++;
        }
    }
    
    // Add all nodes with indegree 0
    queue<int> q;
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) {
            q.push(i);
        }
    }
    
    // Process nodes
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        result.push_back(node);
        
        for (int neighbor : graph[node]) {
            indegree[neighbor]--;
            if (indegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }
    
    // Check for cycle
    return result.size() == n ? result : vector<int>{};
}
```

### **DFS-based Topological Sort**
```cpp
vector<int> topologicalSortDFS(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<bool> visited(n, false);
    stack<int> stk;
    
    function<void(int)> dfs = [&](int node) {
        visited[node] = true;
        
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                dfs(neighbor);
            }
        }
        
        stk.push(node); // Add after visiting all descendants
    };
    
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            dfs(i);
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

## 🔗 **UNION FIND TEMPLATE**

### **Union Find with Path Compression & Union by Rank**
```cpp
class UnionFind {
    vector<int> parent, rank;
    int components;
    
public:
    UnionFind(int n) : parent(n), rank(n, 0), components(n) {
        iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // Path compression
        }
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false; // Already connected
        
        // Union by rank
        if (rank[px] < rank[py]) swap(px, py);
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        
        components--;
        return true;
    }
    
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
    
    int getComponents() {
        return components;
    }
};
```

---

## 🎨 **GRAPH COLORING TEMPLATE**

### **Bipartite Graph Check**
```cpp
bool isBipartite(vector<vector<int>>& graph) {
    int n = graph.size();
    vector<int> color(n, -1);
    
    function<bool(int)> bfs = [&](int start) -> bool {
        queue<int> q;
        color[start] = 0;
        q.push(start);
        
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            
            for (int neighbor : graph[node]) {
                if (color[neighbor] == -1) {
                    color[neighbor] = 1 - color[node];
                    q.push(neighbor);
                } else if (color[neighbor] == color[node]) {
                    return false;
                }
            }
        }
        return true;
    };
    
    for (int i = 0; i < n; i++) {
        if (color[i] == -1 && !bfs(i)) {
            return false;
        }
    }
    
    return true;
}
```

---

## 🌊 **GRID TRAVERSAL TEMPLATE**

### **Grid DFS/BFS**
```cpp
class GridTraversal {
    vector<vector<int>> directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    
    void dfs(vector<vector<char>>& grid, int i, int j, char target) {
        if (i < 0 || i >= grid.size() || j < 0 || j >= grid[0].size() || 
            grid[i][j] != target) {
            return;
        }
        
        grid[i][j] = '#'; // Mark as visited
        
        for (auto& dir : directions) {
            dfs(grid, i + dir[0], j + dir[1], target);
        }
    }
    
    void bfs(vector<vector<char>>& grid, int startI, int startJ, char target) {
        queue<pair<int, int>> q;
        grid[startI][startJ] = '#';
        q.push({startI, startJ});
        
        while (!q.empty()) {
            auto [i, j] = q.front();
            q.pop();
            
            for (auto& dir : directions) {
                int ni = i + dir[0], nj = j + dir[1];
                
                if (ni >= 0 && ni < grid.size() && nj >= 0 && nj < grid[0].size() && 
                    grid[ni][nj] == target) {
                    grid[ni][nj] = '#';
                    q.push({ni, nj});
                }
            }
        }
    }
    
public:
    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        
        for (int i = 0; i < grid.size(); i++) {
            for (int j = 0; j < grid[0].size(); j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j, '1');
                }
            }
        }
        
        return count;
    }
};
```

---

## 🚀 **ADVANCED TEMPLATES**

### **Multi-Source BFS**
```cpp
int multiSourceBFS(vector<vector<int>>& grid, vector<pair<int, int>>& sources) {
    int m = grid.size(), n = grid[0].size();
    queue<pair<int, int>> q;
    vector<vector<bool>> visited(m, vector<bool>(n, false));
    vector<vector<int>> directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    
    // Add all sources to queue
    for (auto& [x, y] : sources) {
        q.push({x, y});
        visited[x][y] = true;
    }
    
    int level = 0;
    while (!q.empty()) {
        int size = q.size();
        
        for (int i = 0; i < size; i++) {
            auto [x, y] = q.front();
            q.pop();
            
            for (auto& dir : directions) {
                int nx = x + dir[0], ny = y + dir[1];
                
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && 
                    !visited[nx][ny] && grid[nx][ny] == 0) {
                    visited[nx][ny] = true;
                    q.push({nx, ny});
                }
            }
        }
        
        level++;
    }
    
    return level;
}
```

### **Bidirectional BFS**
```cpp
int bidirectionalBFS(int start, int end, vector<vector<int>>& graph) {
    if (start == end) return 0;
    
    unordered_set<int> frontierA{start}, frontierB{end};
    unordered_set<int> visitedA{start}, visitedB{end};
    int level = 0;
    
    while (!frontierA.empty() && !frontierB.empty()) {
        // Always expand smaller frontier
        if (frontierA.size() > frontierB.size()) {
            swap(frontierA, frontierB);
            swap(visitedA, visitedB);
        }
        
        unordered_set<int> nextFrontier;
        
        for (int node : frontierA) {
            for (int neighbor : graph[node]) {
                if (visitedB.count(neighbor)) {
                    return level + 1; // Paths meet
                }
                
                if (!visitedA.count(neighbor)) {
                    visitedA.insert(neighbor);
                    nextFrontier.insert(neighbor);
                }
            }
        }
        
        frontierA = nextFrontier;
        level++;
    }
    
    return -1; // No path found
}
```

### **Tarjan's Bridge Detection**
```cpp
class TarjanBridges {
    vector<vector<int>> bridges;
    vector<int> disc, low, parent;
    vector<bool> visited;
    int timer;
    
    void bridgeUtil(int u, vector<vector<int>>& graph) {
        visited[u] = true;
        disc[u] = low[u] = timer++;
        
        for (int v : graph[u]) {
            if (!visited[v]) {
                parent[v] = u;
                bridgeUtil(v, graph);
                
                low[u] = min(low[u], low[v]);
                
                // Check if edge u-v is a bridge
                if (low[v] > disc[u]) {
                    bridges.push_back({u, v});
                }
            } else if (v != parent[u]) {
                low[u] = min(low[u], disc[v]);
            }
        }
    }
    
public:
    vector<vector<int>> findBridges(int n, vector<vector<int>>& connections) {
        // Initialize
        disc.assign(n, -1);
        low.assign(n, -1);
        parent.assign(n, -1);
        visited.assign(n, false);
        timer = 0;
        
        // Build adjacency list
        vector<vector<int>> graph(n);
        for (auto& conn : connections) {
            graph[conn[0]].push_back(conn[1]);
            graph[conn[1]].push_back(conn[0]);
        }
        
        // Find bridges
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                bridgeUtil(i, graph);
            }
        }
        
        return bridges;
    }
};
```

---

## ⚡ **OPTIMIZATION TECHNIQUES**

### **Early Termination**
```cpp
bool pathExists(int start, int target, vector<vector<int>>& graph) {
    vector<bool> visited(graph.size(), false);
    queue<int> q;
    
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        
        if (node == target) return true; // Early termination
        
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
    
    return false;
}
```

### **In-place Marking**
```cpp
void dfs(vector<vector<char>>& grid, int i, int j) {
    if (i < 0 || i >= grid.size() || j < 0 || j >= grid[0].size() || 
        grid[i][j] != '1') {
        return;
    }
    
    grid[i][j] = '0'; // Mark visited in-place (saves space)
    
    dfs(grid, i + 1, j);
    dfs(grid, i - 1, j);
    dfs(grid, i, j + 1);
    dfs(grid, i, j - 1);
}
```

---

## 🎯 **TEMPLATE USAGE GUIDE**

### **When to Use Each Template:**

1. **DFS Recursive**: Tree-like problems, path finding, component detection
2. **DFS Iterative**: When recursion stack might overflow
3. **BFS**: Shortest path in unweighted graphs, level-order processing
4. **Topological Sort**: Dependency resolution, course scheduling
5. **Union Find**: Dynamic connectivity, cycle detection in undirected graphs
6. **Bipartite Check**: Graph coloring, matching problems
7. **Grid Templates**: 2D array problems (islands, regions, etc.)
8. **Multi-source BFS**: Problems with multiple starting points
9. **Bidirectional BFS**: Optimization for shortest path problems
10. **Tarjan's**: Finding bridges, articulation points

### **Quick Decision Framework:**
- **Need shortest path?** → BFS (unweighted) or Dijkstra (weighted)
- **Check connectivity?** → DFS or Union Find
- **Detect cycles?** → DFS with coloring
- **Order dependencies?** → Topological Sort
- **2D grid problem?** → Grid DFS/BFS
- **Multiple sources?** → Multi-source BFS

---

## ✅ **COMPLEXITY QUICK REFERENCE**

| Algorithm | Time | Space | Use Case |
|-----------|------|-------|----------|
| DFS/BFS | O(V + E) | O(V) | Traversal, connectivity |
| Topological Sort | O(V + E) | O(V) | Dependency resolution |
| Union Find | O(E × α(V)) | O(V) | Dynamic connectivity |
| Bipartite Check | O(V + E) | O(V) | Graph coloring |
| Tarjan's Bridges | O(V + E) | O(V) | Critical connections |

**🚀 Master these templates and you'll solve 90% of graph problems efficiently!**
