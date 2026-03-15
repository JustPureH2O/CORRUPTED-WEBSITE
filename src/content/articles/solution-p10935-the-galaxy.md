---
slug: '7830'

category: 题解
published: 2024-09-01T08:06:35.168861+08:00
image: https://pic.imgdb.cn/item/66a76b76d9c307b7e91171ca.jpg
tags:
- oi
- 算法
- 图论
title: P10935 - 银河 题解
updated: 2024-09-01T09:10:32.398+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[P10935](https://www.luogu.com.cn/problem/P10935)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

> 银河中的恒星浩如烟海，但是我们只关注那些最亮的恒星。
>
> 我们用一个正整数来表示恒星的亮度，数值越大则恒星就越亮，恒星的亮度最暗是 $1$。
>
> 现在对于 $N$ 颗我们关注的恒星，有 $M$ 对亮度之间的相对关系已经判明。
>
> 你的任务就是求出这 $N$ 颗恒星的亮度值总和至少有多大。
>
> **输入格式：**
>
> 第一行给出两个整数 $N$ 和 $M$。
>
> 之后 $M$ 行，每行三个整数 $T, A, B$，表示一对恒星 $(A, B)$ 之间的亮度关系。恒星的编号从 $1$ 开始。
>
> 如果 $T = 1$，说明 $A$ 和 $B$ 亮度相等。
> 如果 $T = 2$，说明 $A$ 的亮度小于 $B$ 的亮度。
> 如果 $T = 3$，说明 $A$ 的亮度不小于 $B$ 的亮度。
> 如果 $T = 4$，说明 $A$ 的亮度大于 $B$ 的亮度。
> 如果 $T = 5$，说明 $A$ 的亮度不大于 $B$ 的亮度。
>
> **输出格式：**
>
> 输出一个整数表示结果。
>
> 若无解，则输出 $-1$。
>
> **数据范围：**
>
> 数据保证，${1\le N \le 100000}$，${1\le M \le 100000}$。

题目给出的大小关系可以转化为如下不等式组：

$$
\begin{cases}
A\leq B,B\leq A
\\A\leq B+1
\\A\geq B
\\A\geq B+1
\\A\leq B
\end{cases}
$$

且需要满足亮度均大于等于 ${1}$，那么这道题有两种做法：

## 差分约束

差分约束可以通过把若干形如 $x_1\leq x_2+c$ 的不等式组转化为图论问题来求得不等式组的特解。做法是把大的那部分向小的部分连一条长为 $c$ 的有向边，本例中就是有向边 $(x_2,x_1,c)$。题目要求亮度至少为 $1$，让一个虚拟源点向所有点连一条权值为 $1$ 的有向边即可。

然后注意到有一个结论，要求出未知量的最小值，就需要在新图上做最长路，反之做最短路，这两种情况无解当且仅当图中存在正环/负环。

因而可以使用 $\mathcal O(nm)$ 的 $\texttt{SPFA}$ 来求解，但是数据范围都是 ${10^5}$ 级别的，这条路不可取。于是我们转而寻找更优的策略解答。

## 强连通分量

强连通分量是指图中的极大强连通子图，而有向图强连通当且仅当图中任意两个点连通。

根据这个定义，有向图的强连通分量中必定会存在至少一个环（单点构成的强连通分量除外），考虑到建出的图中边权只会是 $0/1$，因此整张图存在正环当且仅当某个强连通分量中出现了长度为正数的边。

同样需要虚拟源点，使用 $\texttt{Tarjan}$ 算法能够在 $\mathcal O(n+m)$ 复杂度内解决。

```cpp
#include <bits/stdc++.h>

#define N 100010
#define M 300010
using namespace std;

typedef long long ll;

struct Edge {
    int to, ne, w;
} edges[M << 1];
int h[N], hs[N], idx = 0;
int scc_cnt = 0, dfs_cnt = 0;
int scc_id[N], scc_size[N];
int dfn[N], low[N];
int dist[N];
stack<int> stk;
bool in_stk[N];

void add(int head[], int a, int b, int w) {
    idx++;
    edges[idx].to = b;
    edges[idx].ne = head[a];
    edges[idx].w = w;
    head[a] = idx;
}

void tarjan(int u) {
    dfn[u] = low[u] = ++dfs_cnt;
    stk.push(u);
    in_stk[u] = true;
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
            scc_id[t] = scc_cnt;
            scc_size[scc_cnt]++;
        } while (t != u);
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    memset(h, -1, sizeof h);
    memset(hs, -1, sizeof hs);

    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; i++) add(h, 0, i, 1);
    while (m--) {
        int t, a, b;
        cin >> t >> a >> b;
        if (t == 1) {
            add(h, a, b, 0);
            add(h, b, a, 0);
        } else if (t == 2) add(h, a, b, 1);
        else if (t == 3) add(h, b, a, 0);
        else if (t == 4) add(h, b, a, 1);
        else add(h, a, b, 0);
    }
    tarjan(0);
    for (int i = 0; i <= n; i++) {
        for (int j = h[i]; ~j; j = edges[j].ne) {
            int k = edges[j].to;
            int a = scc_id[i], b = scc_id[k];
            if (a == b) {
                if (edges[j].w > 0) {
                    cout << -1 << endl;
                    return 0;
                }
            } else add(hs, a, b, edges[j].w);
        }
    }
    for (int i = scc_cnt; i >= 1; i--) {
        for (int j = hs[i]; ~j; j = edges[j].ne) {
            int k = edges[j].to;
            dist[k] = max(dist[k], dist[i] + edges[j].w);
        }
    }
    ll res = 0;
    for (int i = 1; i <= scc_cnt; i++) res += dist[i] * scc_size[i];
    cout << res << endl;
    return 0;
}
```

## 后记

这道题启示我们，某些差分约束的题目可以使用强连通分量加速求解。

我发现这道题和 [P3275 [SCOI2011] 糖果](https://www.luogu.com.cn/problem/P3275) 很像，没错，这是双倍经验！

$\texttt{The End}$
