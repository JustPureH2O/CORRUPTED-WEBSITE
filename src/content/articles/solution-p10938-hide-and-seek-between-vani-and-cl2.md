---
slug: '1126'

category: 题解
published: 2024-09-01T09:37:03.940861+08:00
image: https://pic.imgdb.cn/item/662b8e430ea9cb140332e110.jpg
tags:
- oi
- 算法
- 图论
title: P10938 - Vani 和 Cl2 捉迷藏
updated: 2024-09-01T11:27:47.245+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[P10938](https://www.luogu.com.cn/problem/P10938)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

> Vani 和 cl2 在一片树林里捉迷藏。
>
> 这片树林里有 $N$ 座房子，$M$ 条有向道路，组成了一张有向无环图。
>
> 树林里的树非常茂密，足以遮挡视线，但是沿着道路望去，却是视野开阔。
>
> 如果从房子 $A$ 沿着路走下去能够到达 $B$，那么在 $A$ 和 $B$ 里的人是能够相互望见的。
>
> 现在 cl2 要在这 $N$ 座房子里选择 $K$ 座作为藏身点，同时 Vani 也专挑 cl2 作为藏身点的房子进去寻找，为了避免被 Vani 看见，cl2 要求这 $K$ 个藏身点的任意两个之间都没有路径相连。
>
> 为了让 Vani 更难找到自己，cl2 想知道最多能选出多少个藏身点。
>
> 对于 $100\%$ 的数据，${1\leq N\leq 200}$，${1\leq M\leq 30000}$，${1\leq x,y\leq N}$。

乍一看好像求最大点独立集的问题，但是它只存在于无向图中，题目所给是有向图。这道题的答案是该图的最小重复路径点覆盖的路径条数。那么什么是路径点覆盖呢？

在图上选取若干条互不相交的路径，并让这些路径不重不漏覆盖到每一个点。符合上述要求且总数最小的方案就叫做原图的最小路径点覆盖，图中每个节点均只被覆盖一次。而最小重复路径点覆盖则是允许选取的路径相交，即某个点至少被覆盖一次。

在二分图中，最小路径点覆盖的路径条数等于总点数减去最大匹配数；最小路径重复点覆盖的数量则需要先求传递闭包，再计算最小路径点覆盖得出。

这启发我们可以把图转化为二分图来做，具体流程如下：

1. 原图中的点 $P$，在二分图中变为 $P$ 和 $P^\prime$
2. 对于原图所有形如 $(P,A)$ 的边，在二分图上连 $(P,A^\prime)$；对于所有形如 $(A,P)$ 的边，在二分图上连边 $(A,P^\prime)$

就可以把原图当二分图求解了。

---

接下来证明为什么答案就是原图的最小重复路径点覆盖。设答案为 $f(x)$、原图最小重复路径点覆盖数为 $k$，即证明 $f(x)=k$：

1. 证明 $f(x)\geq k$，考虑最小路径点覆盖的定义：因为 $k$ 条路径已经把所有点覆盖了，选点只能选其中某条路径的某个端点，已知有道路相连的房屋是可以互相看到的，所以不可能同时选某条路径的两个端点（最多选一个）。因此选出的 $k$ 是一定小于等于 $f(x)$ 的。
2. 证明 $f(x)\leq k$，考虑构造：将所有路径的终点 $E$ 放入一个集合 $\mathbb D$ 中，$\mathbb E$ 为“从 $E$ 出发能够到达的所有点的集合”。如果 $\forall E\in\mathbb D$，均有 $\mathbb D\cap\mathbb E=\varnothing$，意味着 $\mathbb E$ 内任意两点不互通，此时 $\mathbb E$ 为一组合法方案，大小为 $k$；反之，让当前的 $E$ 沿有向边反着走直到满足上面的情况。若当前点已经退回到它的起点，都还不满足上述情况，意味着这个起点与 $\mathbb D$ 中的所有点都互通，我们完全可以让 $E$ 作为起点，所有点也都能被覆盖到，此时的最小路径点覆盖数为 $k-1$，与原图最小路径点覆盖数为 $k$ 矛盾。故一定存在 $f(x)\leq k$。
3. 综上，$f(x)=k$ 必定成立。证毕。

此时使用匈牙利算法跑二分图最大匹配，然后就可以得出答案了。时间复杂度 $\mathcal O(nm)$，实际上会远小于此。

```cpp
#include <bits/stdc++.h>
#define N 210
#define M 30010
using namespace std;

bool g[N][N];
int match[N];
bool st[N];
int n, m;

bool hungary(int u) {
    for (int i = 1; i <= n; i++) {
        if (g[u][i] && !st[i]) {
            st[i] = true;
            if (!match[i] || hungary(match[i])) {
                match[i] = u;
                return true;
            }
        }
    }
    return false;
}

void floyd() {
    // Floyd 传递闭包
    for (int k = 1; k <= n; k++) {
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                g[i][j] |= g[i][k] & g[k][j];
            }
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    cin >> n >> m;
    while (m--) {
        int a, b;
        cin >> a >> b;
        g[a][b] = 1;
    }
    floyd();
    int res = 0;
    for (int i = 1; i <= n; i++) {
        memset(st, false, sizeof st);
        if (hungary(i)) res++;
    }
    cout << (n - res) << endl;
    return 0;
}
```

~~瓦尼瓦尼和氯气？~~

$\texttt{The End}$
