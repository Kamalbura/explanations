# 🎯 GRAPH ALGORITHMS: TEMPLATE LIBRARY & QUICK REFERENCE

## 🧠 **CORE TEMPLATES FOR INSTANT USE**

### **Template 1: Graph Representation**
```cpp
// Adjacency List (Most Common)
class Graph {
private:
    int V; // Number of vertices
    vector<vector<int>> adjList; // For unweighted
    vector<vector<pair<int,int>>> weightedAdjList; // For weighted
    
public:
    Graph(int vertices) : V(vertices) {
        adjList.resize(V);
        weightedAdjList.resize(V);
    }
    
    // Add edge for unweighted graph
    void addEdge(int u, int v, bool directed = false) {
        adjList[u].push_back(v);
        if (!directed) {
            adjList[v].push_back(u);
        }
    }
    
    // Add edge for weighted graph
    void addWeightedEdge(int u, int v, int weight, bool directed = false) {
        weightedAdjList[u].push_back({v, weight});
        if (!directed) {
            weightedAdjList[v].push_back({u, weight});
        }
    }
    
    // Get neighbors
    vector<int>& getNeighbors(int u) { return adjList[u]; }
    vector<pair<int,int>>& getWeightedNeighbors(int u) { return weightedAdjList[u]; }
    int size() const { return V; }
};
```

### **Template 2: DFS Framework**
```cpp
class DFSFramework {
private:
    vector<vector<int>> graph;
    vector<bool> visited;
    vector<int> result;
    
    void dfs(int node) {
        visited[node] = true;
        result.push_back(node); // Process current node
        
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                dfs(neighbor);
            }
        }
    }
    
    // DFS with return value (useful for path finding)
    bool dfsWithReturn(int node, int target) {
        if (node == target) return true;
        
        visited[node] = true;
        
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                if (dfsWithReturn(neighbor, target)) {
                    return true; // Found target
                }
            }
        }
        
        return false;
    }
    
    // DFS for cycle detection in directed graph
    bool hasCycleDFS(int node, vector<int>& color) {
        color[node] = 1; // Gray (currently processing)
        
        for (int neighbor : graph[node]) {
            if (color[neighbor] == 1) {
                return true; // Back edge found (cycle)
            }
            if (color[neighbor] == 0 && hasCycleDFS(neighbor, color)) {
                return true;
            }
        }
        
        color[node] = 2; // Black (completely processed)
        return false;
    }
    
public:
    // Connected components
    int countComponents(vector<vector<int>>& g) {
        graph = g;
        visited.assign(graph.size(), false);
        int components = 0;
        
        for (int i = 0; i < graph.size(); i++) {
            if (!visited[i]) {
                dfs(i);
                components++;
            }
        }
        
        return components;
    }
    
    // Cycle detection in directed graph
    bool hasCycle(vector<vector<int>>& g) {
        graph = g;
        vector<int> color(graph.size(), 0); // 0=white, 1=gray, 2=black
        
        for (int i = 0; i < graph.size(); i++) {
            if (color[i] == 0) {
                if (hasCycleDFS(i, color)) {
                    return true;
                }
            }
        }
        
        return false;
    }
};
```

### **Template 3: BFS Framework**
```cpp
class BFSFramework {
public:
    // Basic BFS traversal
    vector<int> bfsTraversal(vector<vector<int>>& graph, int start) {
        vector<bool> visited(graph.size(), false);
        vector<int> result;
        queue<int> q;
        
        q.push(start);
        visited[start] = true;
        
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            result.push_back(node);
            
            for (int neighbor : graph[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        
        return result;
    }
    
    // BFS shortest path (unweighted)
    int shortestPath(vector<vector<int>>& graph, int start, int target) {
        if (start == target) return 0;
        
        vector<bool> visited(graph.size(), false);
        queue<pair<int,int>> q; // {node, distance}
        
        q.push({start, 0});
        visited[start] = true;
        
        while (!q.empty()) {
            auto [node, dist] = q.front();
            q.pop();
            
            for (int neighbor : graph[node]) {
                if (neighbor == target) {
                    return dist + 1;
                }
                
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push({neighbor, dist + 1});
                }
            }
        }
        
        return -1; // Target not reachable
    }
    
    // BFS level order processing
    vector<vector<int>> bfsLevels(vector<vector<int>>& graph, int start) {
        vector<vector<int>> levels;
        vector<bool> visited(graph.size(), false);
        queue<int> q;
        
        q.push(start);
        visited[start] = true;
        
        while (!q.empty()) {
            int levelSize = q.size();
            vector<int> currentLevel;
            
            for (int i = 0; i < levelSize; i++) {
                int node = q.front();
                q.pop();
                currentLevel.push_back(node);
                
                for (int neighbor : graph[node]) {
                    if (!visited[neighbor]) {
                        visited[neighbor] = true;
                        q.push(neighbor);
                    }
                }
            }
            
            levels.push_back(currentLevel);
        }
        
        return levels;
    }
    
    // Multi-source BFS
    vector<int> multiSourceBFS(vector<vector<int>>& graph, vector<int>& sources) {
        vector<int> distance(graph.size(), -1);
        queue<int> q;
        
        // Add all sources to queue
        for (int source : sources) {
            q.push(source);
            distance[source] = 0;
        }
        
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            
            for (int neighbor : graph[node]) {
                if (distance[neighbor] == -1) {
                    distance[neighbor] = distance[node] + 1;
                    q.push(neighbor);
                }
            }
        }
        
        return distance;
    }
};
```

### **Template 4: Dijkstra's Algorithm**
```cpp
class DijkstraFramework {
public:
    // Single source shortest path
    vector<int> dijkstra(vector<vector<pair<int,int>>>& graph, int start) {
        int n = graph.size();
        vector<int> dist(n, INT_MAX);
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
        
        dist[start] = 0;
        pq.push({0, start}); // {distance, node}
        
        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();
            
            // Skip if we've found a better path
            if (d > dist[u]) continue;
            
            // Relax all neighbors
            for (auto [v, weight] : graph[u]) {
                int newDist = dist[u] + weight;
                if (newDist < dist[v]) {
                    dist[v] = newDist;
                    pq.push({newDist, v});
                }
            }
        }
        
        return dist;
    }
    
    // Dijkstra with path reconstruction
    pair<vector<int>, vector<int>> dijkstraWithPath(vector<vector<pair<int,int>>>& graph, 
                                                   int start, int target) {
        int n = graph.size();
        vector<int> dist(n, INT_MAX);
        vector<int> parent(n, -1);
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
        
        dist[start] = 0;
        pq.push({0, start});
        
        while (!pq.empty()) {
            auto [d, u] = pq.top();
            pq.pop();
            
            if (u == target) break; // Early termination
            if (d > dist[u]) continue;
            
            for (auto [v, weight] : graph[u]) {
                int newDist = dist[u] + weight;
                if (newDist < dist[v]) {
                    dist[v] = newDist;
                    parent[v] = u;
                    pq.push({newDist, v});
                }
            }
        }
        
        // Reconstruct path
        vector<int> path;
        if (dist[target] != INT_MAX) {
            int current = target;
            while (current != -1) {
                path.push_back(current);
                current = parent[current];
            }
            reverse(path.begin(), path.end());
        }
        
        return {dist, path};
    }
    
    // Modified Dijkstra for different objectives
    vector<double> maxProbabilityPath(vector<vector<pair<int,double>>>& graph, int start) {
        int n = graph.size();
        vector<double> prob(n, 0.0);
        priority_queue<pair<double,int>> pq; // Max heap for probabilities
        
        prob[start] = 1.0;
        pq.push({1.0, start});
        
        while (!pq.empty()) {
            auto [p, u] = pq.top();
            pq.pop();
            
            if (p < prob[u]) continue;
            
            for (auto [v, edgeProb] : graph[u]) {
                double newProb = prob[u] * edgeProb;
                if (newProb > prob[v]) {
                    prob[v] = newProb;
                    pq.push({newProb, v});
                }
            }
        }
        
        return prob;
    }
};
```

---

## 🎯 **SPECIALIZED TEMPLATES BY ALGORITHM TYPE**

### **Type 1: Topological Sort**
```cpp
class TopologicalSort {
public:
    // Kahn's Algorithm (BFS-based)
    vector<int> kahnsAlgorithm(vector<vector<int>>& graph) {
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
    
    // DFS-based topological sort
    vector<int> dfsTopologicalSort(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<bool> visited(n, false);
        stack<int> st;
        
        function<void(int)> dfs = [&](int u) {
            visited[u] = true;
            
            for (int v : graph[u]) {
                if (!visited[v]) {
                    dfs(v);
                }
            }
            
            st.push(u); // Add to result after processing all dependencies
        };
        
        // Process all unvisited nodes
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                dfs(i);
            }
        }
        
        // Extract result from stack
        vector<int> result;
        while (!st.empty()) {
            result.push_back(st.top());
            st.pop();
        }
        
        return result;
    }
    
    // Course scheduling with prerequisites
    bool canFinishCourses(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> graph(numCourses);
        
        for (auto& prereq : prerequisites) {
            graph[prereq[1]].push_back(prereq[0]);
        }
        
        vector<int> topoOrder = kahnsAlgorithm(graph);
        return topoOrder.size() == numCourses;
    }
};
```

### **Type 2: Union-Find (Disjoint Set)**
```cpp
class UnionFind {
private:
    vector<int> parent, rank, size;
    int components;
    
public:
    UnionFind(int n) : parent(n), rank(n, 0), size(n, 1), components(n) {
        iota(parent.begin(), parent.end(), 0);
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
            size[rootY] += size[rootX];
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
            size[rootX] += size[rootY];
        } else {
            parent[rootY] = rootX;
            size[rootX] += size[rootY];
            rank[rootX]++;
        }
        
        components--;
        return true;
    }
    
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
    
    int getSize(int x) {
        return size[find(x)];
    }
    
    int getComponents() const {
        return components;
    }
    
    // Get all component representatives
    vector<int> getComponentRoots() {
        unordered_set<int> roots;
        for (int i = 0; i < parent.size(); i++) {
            roots.insert(find(i));
        }
        return vector<int>(roots.begin(), roots.end());
    }
};
```

### **Type 3: Minimum Spanning Tree**
```cpp
class MST {
public:
    // Kruskal's Algorithm
    int kruskalMST(int n, vector<vector<int>>& edges) {
        // Sort edges by weight
        sort(edges.begin(), edges.end(), [](const vector<int>& a, const vector<int>& b) {
            return a[2] < b[2];
        });
        
        UnionFind uf(n);
        int totalCost = 0;
        int edgesUsed = 0;
        
        for (auto& edge : edges) {
            int u = edge[0], v = edge[1], weight = edge[2];
            
            if (uf.unite(u, v)) {
                totalCost += weight;
                edgesUsed++;
                
                if (edgesUsed == n - 1) {
                    break; // MST complete
                }
            }
        }
        
        return edgesUsed == n - 1 ? totalCost : -1;
    }
    
    // Prim's Algorithm
    int primMST(vector<vector<pair<int,int>>>& graph) {
        int n = graph.size();
        vector<bool> inMST(n, false);
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
        
        int totalCost = 0;
        int edgesUsed = 0;
        
        // Start from node 0
        inMST[0] = true;
        for (auto [neighbor, weight] : graph[0]) {
            pq.push({weight, neighbor});
        }
        
        while (!pq.empty() && edgesUsed < n - 1) {
            auto [weight, u] = pq.top();
            pq.pop();
            
            if (inMST[u]) continue; // Already in MST
            
            // Add to MST
            inMST[u] = true;
            totalCost += weight;
            edgesUsed++;
            
            // Add all edges from u to priority queue
            for (auto [neighbor, w] : graph[u]) {
                if (!inMST[neighbor]) {
                    pq.push({w, neighbor});
                }
            }
        }
        
        return edgesUsed == n - 1 ? totalCost : -1;
    }
};
```

### **Type 4: Advanced Algorithms**
```cpp
class AdvancedGraphs {
public:
    // Bidirectional BFS for shortest path
    int bidirectionalBFS(vector<vector<int>>& graph, int start, int target) {
        if (start == target) return 0;
        
        unordered_set<int> visitedFromStart, visitedFromTarget;
        queue<int> qStart, qTarget;
        
        qStart.push(start);
        qTarget.push(target);
        visitedFromStart.insert(start);
        visitedFromTarget.insert(target);
        
        int level = 0;
        
        while (!qStart.empty() || !qTarget.empty()) {
            level++;
            
            // Always expand smaller frontier
            if (qStart.size() > qTarget.size()) {
                swap(qStart, qTarget);
                swap(visitedFromStart, visitedFromTarget);
            }
            
            int size = qStart.size();
            for (int i = 0; i < size; i++) {
                int node = qStart.front();
                qStart.pop();
                
                for (int neighbor : graph[node]) {
                    if (visitedFromTarget.count(neighbor)) {
                        return level; // Found intersection
                    }
                    
                    if (!visitedFromStart.count(neighbor)) {
                        visitedFromStart.insert(neighbor);
                        qStart.push(neighbor);
                    }
                }
            }
        }
        
        return -1;
    }
    
    // Bellman-Ford Algorithm (handles negative weights)
    vector<int> bellmanFord(vector<vector<pair<int,int>>>& edges, int n, int start) {
        vector<int> dist(n, INT_MAX);
        dist[start] = 0;
        
        // Relax edges n-1 times
        for (int i = 0; i < n - 1; i++) {
            for (auto& edge : edges) {
                for (auto [v, weight] : edge) {
                    int u = &edge - &edges[0]; // Get index
                    if (dist[u] != INT_MAX && dist[u] + weight < dist[v]) {
                        dist[v] = dist[u] + weight;
                    }
                }
            }
        }
        
        // Check for negative cycles
        for (auto& edge : edges) {
            for (auto [v, weight] : edge) {
                int u = &edge - &edges[0];
                if (dist[u] != INT_MAX && dist[u] + weight < dist[v]) {
                    return {}; // Negative cycle detected
                }
            }
        }
        
        return dist;
    }
    
    // Floyd-Warshall Algorithm (all pairs shortest path)
    vector<vector<int>> floydWarshall(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<vector<int>> dist = graph;
        
        // Initialize
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) dist[i][j] = 0;
                else if (graph[i][j] == 0) dist[i][j] = INT_MAX;
            }
        }
        
        // Floyd-Warshall
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
};
```

---

## 🔧 **OPTIMIZATION TECHNIQUES**

### **1. Space Optimization**
```cpp
// For implicit graphs (like word ladder), don't store entire graph
// Generate neighbors on-the-fly
vector<string> getNeighbors(const string& word, const unordered_set<string>& wordSet) {
    vector<string> neighbors;
    string temp = word;
    
    for (int i = 0; i < word.length(); i++) {
        char original = temp[i];
        for (char c = 'a'; c <= 'z'; c++) {
            if (c != original) {
                temp[i] = c;
                if (wordSet.count(temp)) {
                    neighbors.push_back(temp);
                }
            }
        }
        temp[i] = original;
    }
    
    return neighbors;
}
```

### **2. Early Termination**
```cpp
// In shortest path algorithms, stop when target is reached
if (current == target) {
    return distance;
}

// In connectivity problems, stop when all nodes are visited
if (visitedCount == totalNodes) {
    return result;
}
```

### **3. Preprocessing Optimizations**
```cpp
// Sort adjacency lists for binary search
for (auto& neighbors : graph) {
    sort(neighbors.begin(), neighbors.end());
}

// Precompute degrees for optimization decisions
vector<int> degrees(n);
for (int i = 0; i < n; i++) {
    degrees[i] = graph[i].size();
}
```

---

## 🎯 **QUICK DECISION GUIDE**

### **Algorithm Selection Flowchart:**
```cpp
// Problem analysis
if (need_shortest_path) {
    if (unweighted) return "BFS";
    if (single_source && no_negative_weights) return "Dijkstra";
    if (negative_weights) return "Bellman-Ford";
    if (all_pairs) return "Floyd-Warshall";
}

if (need_connectivity) {
    if (static_queries) return "DFS/BFS";
    if (dynamic_queries) return "Union-Find";
}

if (need_ordering) {
    if (dependencies) return "Topological-Sort";
    if (minimum_cost_connection) return "MST";
}

if (detect_cycles) {
    if (directed_graph) return "DFS-with-colors";
    if (undirected_graph) return "Union-Find";
}
```

---

## 🏆 **COMPLEXITY REFERENCE**

### **Time Complexities:**
```cpp
DFS/BFS:           O(V + E)
Dijkstra:          O((V + E) log V)
Bellman-Ford:      O(V × E)
Floyd-Warshall:    O(V³)
Topological Sort:  O(V + E)
Union-Find:        O(E × α(V))
Kruskal's MST:     O(E log E)
Prim's MST:        O((V + E) log V)
```

### **Space Complexities:**
```cpp
Adjacency List:    O(V + E)
Adjacency Matrix:  O(V²)
DFS Recursion:     O(V)
BFS Queue:         O(V)
Dijkstra Heap:     O(V)
Union-Find:        O(V)
```

---

**🎯 Use these templates as building blocks for any graph algorithm problem!**
