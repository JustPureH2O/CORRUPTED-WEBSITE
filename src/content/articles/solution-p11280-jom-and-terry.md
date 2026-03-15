---
slug: '11280'

category: 题解
published: 2024-11-16T16:51:08.970252+08:00
image: https://pic.imgdb.cn/item/65c9e1d99f345e8d031880fb.jpg
tags:
- oi
- 题解
- 搜索算法
title: P11280 - Jom & Terry 题解
updated: 2024-11-16T16:51:09.392+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[P11280](https://www.luogu.com.cn/problem/P11280)

题目难度：<span data-luogu data-yellow>普及/提高-</span>

> Terry 和 Jom 在一个 $n$ 个点 $m$ 条边的有“根”无向连通图上博弈（图的根为 $r$），遵循以下规则：
>
> - Terry 先手；
> - 两人轮流在图上移动，每次只能走一条边（也可以睡觉，啥都不干）；
> - Terry 不能走到 Jom 所在的结点（我们认为只有 Terry 自投罗网时才会被抓到，即如果 Terry 先移动到结点 $u$ 后 Jom 在同一回合也移动到 $u$ 是合法的）。
>
> 每次询问给定 Terry 和 Jom 的起点 $a, b$，你需要回答 Terry 能否到达点 $r$。

**为了避免题面命名给个人理解带来的混乱，本题解将用“猫”（Jom）、“鼠”（Terry）来区分二者。**

我们的目的是让鼠无论如何都能在猫之前到达 $r$，因此我们先考虑猫的最优策略——当猫使用最优策略都无法抓到鼠时，那必定有鼠必胜。

鼠的唯一目的地是 $r$，因此猫只需先到 $r$ 点，然后等着它就好了。于是猫一定会沿着到根的最短路径前行，而鼠为了不被抓住也会沿着距离根最短的那条路径行进。我们只需在最开始预处理出每个节点到 $r$ 的最短距离即可。预估时间复杂度是 $\texttt{BFS}$ 的 $\mathcal O(m)$。

注意不要把 `Terry` 和 `Jom` 搞混了；输出量较大，慎用 `endl`（时间膨胀一倍多）。

```cpp
#include <bits/stdc++.h>
#define N 1000010
using namespace std;

struct Edge {
    int to, ne;
} edges[N << 1];
int h[N], idx = 0;
int dep[N];
int n, m, r;

void add(int u, int v) {
    idx++;
    edges[idx].to = v;
    edges[idx].ne = h[u];
    h[u] = idx;
}

void bfs() {
    queue<int> q;
    q.push(r);
    dep[r] = 0;
    while (!q.empty()) {
        int t = q.front();
        q.pop();

        for (int i = h[t]; ~i; i = edges[i].ne) {
            int j = edges[i].to;
            if (dep[j] > dep[t] + 1) {
                dep[j] = dep[t] + 1;
                q.push(j);
            }
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    memset(dep, 0x3f, sizeof dep);
    memset(h, -1, sizeof h);

    int q;
    cin >> n >> m >> r;
    while (m--) {
        int u, v;
        cin >> u >> v;
        add(u, v);
        add(v, u);
    }
    bfs();
    cin >> q;
    cout << "I'm here!" << endl;
    while (q--) {
        int a, b;
        cin >> a >> b;
        cout << (dep[a] <= dep[b] ? "Terry" : "Jom") << '\n';
    }
    return 0;
}
```

$\texttt{The End}$
