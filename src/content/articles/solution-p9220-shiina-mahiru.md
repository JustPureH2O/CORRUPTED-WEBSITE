---
slug: '9220'

category: 题解
published: 2024-10-05T21:22:55.891270+08:00
image: https://pic.imgdb.cn/item/67067f39d29ded1a8cb49df8.jpg
tags:
- oi
- 算法
- 图论
- 博弈论
title: P9220 [TAOI-1] - 椎名真昼 题解
updated: 2024-10-09T21:02:49.743+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验

题目地址：[P9220](https://www.luogu.com.cn/problem/P9220)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

> Alice 和 Bob 正在玩一款游戏，给定一个有向图，每个点初始有一个颜色（黑或白）。
>
> 双方轮流进行操作，Alice 先手，每次操作选定一个节点，将所有从该点开始，能到达的点（包括自身）颜色翻转。如果某次操作后所有节点都变为白色，则进行该次操作的人胜利。
>
> 假如双方都采用最优策略使得自己胜利，或者如果自己无法胜利，使得对方无法胜利。
>
> 给你节点的初始状态，请你求出最终的胜者，亦或者，没有胜者。
>
> 定义点 $u$ 能到达点 $v$，当且仅当存在数列 $(a_1,a_2,a_3,\cdots,a_k)$，其中 $k \ge 1$，使得 $\forall i \in [1,k)$，存在有向边 $a_i \to a_{i+1}$，且 $a_1=u$，$a_k=v$。
>
> 对于所有测试数据，${1 \leq n \leq 10^5}$，${1 \leq m \leq 2 \times 10^5}$，${1 \le T \le 15}$。

首先，如果这个游戏无法在两步及以内结束的话，就可以直接算平局了。因为若是超过两步，认为自己会输的那一方将会想尽办法不让你赢，具体表现就是重复另一方先前的操作，让图变为另一方操作前的状态，最终陷入死循环。因此我们只需关注一步定胜负和两步定胜负的情况。

根据题目中对两点能互相到达的定义，我们很容易知道——若对某个 $\texttt{SCC}$ 中的点进行一次操作，那么同处于这个 $\texttt{SCC}$ 的其他点的颜色也都会翻转（但不止这些点的颜色被翻转）。这启发我们处理出原图中的所有强连通分量。此时不难发现，如果某个 $\texttt{SCC}$ 中存在异色点，那么无论怎么翻转，它们都不会变为统一颜色，于是这种情况可以直接判成平局；否则我们就把这个强连通分量染成内部点的颜色。

处理出所有的强连通分量后，我们再把一个强连通分量整体看作一个新点，建在新图上（即缩点），此时新图必定是一个有向无环图 $\texttt{DAG}$。那么如果在某个强连通分量中的某个点上进行操作，新图中该强连通分量的子节点一定也会受到影响从而变化颜色。至此我们便理清了操作与颜色翻转之间的规律。

现在来讨论必胜局面。因为游戏不会超过两轮，所以如果先手的 $\texttt{Alice}$ 想要获胜，她就必须在第一轮胜利，否则要么 $\texttt{Bob}$ 胜、要么平局。也因此，在新建的有向无环图上，有且仅能存在一个节点，使得它的子树包含新图中所有的黑色 $\texttt{SCC}$，且不包含任何白色 $\texttt{SCC}$。这样一来先手 $\texttt{Alice}$ 才能一次把这些黑色点转化成白色从而获胜。如果这个子树不完全是黑色 $\texttt{SCC}$，或者是存在多个节点满足要求，都不能保证 $\texttt{Alice}$ 获胜（但也不代表必输，因为还存在平局）。

再来看 $\texttt{Bob}$ 这边，他如果想要获胜，就只能抓住第二轮这唯一的机会。有三种可能性：

1. 全图均为白色节点。这样 $\texttt{Alice}$ 只能选择白色节点染黑，此时 $\texttt{Bob}$ 只需重复她的操作即可恢复全图到全白的状态。
2. 仅有两个孤立的黑色 $\texttt{SCC}$。此时 $\texttt{Alice}$ 选择其一染白，$\texttt{Bob}$ 仅需染白另一个即可。
3. 一个白色 $\texttt{SCC}$ 和一个黑色 $\texttt{SCC}$，并且仅有一条有向边从黑点指向白点。此时无论 $\texttt{Alice}$ 开局选择染哪个点，$\texttt{Bob}$ 总能在第二轮把全图染成白色而获胜。

其他情况即为二人平局。**注意多测清空**！

```cpp
#include <bits/stdc++.h>
#define N 100010
#define M 200010
using namespace std;

struct Edge {
    int to, ne;
} edges[M], dag[M];

int h[N], hs[N], idx = 0, idx1 = 0;
int scc_cnt = 0, dfs_cnt = 0;
int dfn[N], low[N];
int scc_id[N];
vector<int> scc[N];
stack<int> stk;
bool st[N];
bool in_stk[N];
bool color[N], scc_color[N];
int deg[N];

void add(int u, int v) {
    // 建原图
    idx++;
    edges[idx].to = v;
    edges[idx].ne = h[u];
    h[u] = idx;
}

void shrink(int u, int v) {
    // 建缩点后的图
    idx1++;
    dag[idx1].to = v;
    dag[idx1].ne = hs[u];
    hs[u] = idx1;
}

bool tarjan(int u) {
    stk.push(u);
    in_stk[u] = true;
    dfn[u] = low[u] = ++dfs_cnt;

    for (int i = h[u]; ~i; i = edges[i].ne) {
        int j = edges[i].to;
        if (!dfn[j]) {
            tarjan(j);
            low[u] = min(low[u], low[j]);
        } else if (in_stk[j]) {
            low[u] = min(low[u], dfn[j]);
        }
    }
    if (dfn[u] == low[u]) {
        scc_cnt++;
        int t;
        do {
            t = stk.top();
            stk.pop();
            in_stk[t] = false;
            scc_id[t] = scc_cnt;       // 每个点对应的 SCC 编号
            scc[scc_cnt].push_back(t); // 维护 SCC 内的节点
        } while (t != u);
        // 如果同一个 SCC 内存在异色节点，即为无解（平局）
        for (int i = 1; i < scc[scc_cnt].size(); i++) {
            if (color[scc[scc_cnt][i]] ^ color[scc[scc_cnt][i - 1]]) return false;
        }
        scc_color[scc_cnt] = color[scc[scc_cnt][0]]; // 同色，给 SCC 染色
    }
    return true;
}

void init() {
    idx = 0;
    idx1 = 0;
    while (!stk.empty()) stk.pop();
    for (int i = 1; i <= scc_cnt; i++) scc[i].clear();
    scc_cnt = dfs_cnt = 0;
    memset(st, false, sizeof st);
    memset(scc_id, 0, sizeof scc_id);
    memset(dfn, 0, sizeof dfn);
    memset(low, 0, sizeof low);
    memset(in_stk, false, sizeof in_stk);
    memset(deg, 0, sizeof deg);
    memset(h, -1, sizeof h);
    memset(hs, -1, sizeof hs);
}

int getFirstBlack() {
    // 拓扑排序找出第一个黑色 SCC
    queue<int> topo;
    for (int i = 1; i <= scc_cnt; i++) {
        if (!deg[i]) topo.push(i);
    }
    while (!topo.empty()) {
        int t = topo.front();
        topo.pop();
        if (scc_color[t]) return t;
        for (int i = hs[t]; ~i; i = dag[i].ne) {
            int j = dag[i].to;
            if (--deg[j] == 0) topo.push(j);
        }
    }
    return 0;
}

bool dfs(int u) {
    // 检查黑色子树中是否混有白色 SCC
    bool ret = scc_color[u];
    st[u] = true;
    for (int i = hs[u]; ~i; i = dag[i].ne) {
        int j = dag[i].to;
        if (st[j]) continue;
        ret &= dfs(j);
    }
    return ret;
}

bool check() {
    for (int i = 1; i <= scc_cnt; i++) {
        if (scc_color[i] && !st[i]) return false; // 子树必须包含新图中所有的黑色 SCC
    }
    return true;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int t, m, n;
    cin >> t;
    while (t--) {
        init();
        cin >> n >> m;
        for (int i = 1; i <= n; i++) cin >> color[i];
        int u, v;
        for (int i = 1; i <= m; i++) {
            cin >> u >> v;
            add(u, v);
        }
        bool tmp = true;
        for (int i = 1; i <= n; i++) {
            if (!dfn[i]) {
                if (!tarjan(i)) {
                    tmp = false;
                    cout << 'N';
                    break;
                }
            }
        }
        if (!tmp) continue; // 同 SCC 存在异色节点，直接判无解（平局）
        bool b2w = true;
        for (int i = 1; i <= scc_cnt; i++) {
            for (int a: scc[i]) {
                for (int j = h[a]; ~j; j = edges[j].ne) {
                    int k = edges[j].to;
                    if (scc_id[a] != scc_id[k]) {
                        // 缩点建图
                        shrink(scc_id[a], scc_id[k]);
                        b2w &= !scc_color[scc_id[k]] && scc_color[scc_id[a]]; // 存在一黑一白，检查是否是黑点指向白点
                        deg[scc_id[k]]++; // 维护入度
                    }
                }
            }
        }
        int start = getFirstBlack();
        if (dfs(start) && check()) cout << 'A'; // Alice
        else if (!start && !color[1]) cout << 'B'; // Bob 情况1
        else if (scc_cnt == 2 && scc_color[1] & scc_color[2]) cout << 'B'; // Bob 情况2
        else if (scc_cnt == 2 && b2w) cout << 'B'; // Bob 情况3
        else cout << 'N';
    }
    return 0;
}
```

$\texttt{The End}$
