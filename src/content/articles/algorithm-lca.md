---
slug: '39341'

category: oi算法
published: 2024-07-25T21:06:32.126742+08:00
tags:
- oi
- 算法
- 图论
title: LCA 最近公共祖先
updated: 2024-07-26T14:31:54.345+08:00
---
## LCA 树上倍增法

实质是把节点每次向上暴力移动一步变成更加高明的按 ${2^k}$ 步向上移动，借用的是每个数都可进行二进制分解的定理。期间维护一个父节点数组 `fa`，`fa[i][k]` 代表 $i$ 向上移动 ${2^k}$ 步的父节点。那我们该如何更新这个父节点呢？显然有 ${2^k=2^{k-1}+2^{k-1}}$，就是两次向上移动 ${2^{k-1}}$ 步，因此可以用 `fa[fa[i][k - 1]][k - 1]` 来递归更新。

初始化时使用宽搜，把所有点的深度更新一遍。注意要设置一个类似于 $\texttt{Splay}$ 中的边界节点，深度设为 ${0}$（根节点深度为 ${1}$），以防倍增移动时发生超出根节点的情况。

对于 $\texttt{LCA}$ 的求解，基本思路是把待求的两个节点先挪到同一位置上，然后共同向上移动，当二者根节点已经相同时就可以返回这个根节点了。特殊地，如果上移到同一深度时两点已经重合，则直接返回两点中的其中一个。

模板：

```cpp
#include <bits/stdc++.h>
#define N 500010
using namespace std;

struct Edge {
    int to, ne;
} edges[N << 1];
int h[N], idx = 0;

int fa[N][22];
int dep[N];

int root = 0;

void add(int a, int b) {
    idx++;
    edges[idx].to = b;
    edges[idx].ne = h[a];
    h[a] = idx;
}

void init() {
    memset(dep, 0x3f, sizeof dep);
    queue<int> q;
    dep[0] = 0;
    dep[root] = 1;
    q.push(root);
    while (!q.empty()) {
        int t = q.front();
        q.pop();
        for (int i = h[t]; ~i; i = edges[i].ne) {
            int j = edges[i].to;
            if (dep[j] > dep[t] + 1) {
                dep[j] = dep[t] + 1;
                fa[j][0] = t;
                q.push(j);
                for (int k = 1; k <= 21; k++) {
                    fa[j][k] = fa[fa[j][k - 1]][k - 1];
                }
            }
        }
    }
}

int LCA(int a, int b) {
    if (dep[a] < dep[b]) swap(a, b);
    for (int k = 21; k >= 0; k--) {
        if (dep[fa[a][k]] >= dep[b]) a = fa[a][k];
    }
    if (a == b) return a;
    for (int k = 21; k >= 0; k--) {
        if (fa[a][k] != fa[b][k]) {
            a = fa[a][k];
            b = fa[b][k];
        }
    }
    return fa[a][0];
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    memset(h, -1, sizeof h);
    int n, m;
    cin >> n >> m >> root;
    for (int i = 1; i < n; i++) {
        int x, y;
        cin >> x >> y;
        add(x, y);
        add(y, x);
    }
    init();
    while (m--) {
        int a, b;
        cin >> a >> b;
        cout << LCA(a, b) << endl;
    }
    return 0;
}
```

## 再探次小生成树

一个半月前，我写了[次小生成树](https://justpureh2o.cn/articles/28422/#%E6%AC%A1%E5%B0%8F%E7%94%9F%E6%88%90%E6%A0%91)的求解方法，当时是将非树边挨个加入进树中，形成一个环，并剔除这个环中最大的树内边，比较这些操作对最小生成树总边权的贡献从而得到原树的非严格次小生成树（若需要严格次小生成树则需要维护环上次大边）。其中为了找到环内最/次大边，我们使用了指数级别的 $\texttt{DFS}$，今天学习了倍增 $\texttt{LCA}$，可以用来优化这一方案。

### 洛谷 P4180 [BJWC2010] 严格次小生成树

题目地址：[P4180](https://www.luogu.com.cn/problem/P4180)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

题目来源：<span data-luogu data-region>北京</span>&nbsp;&nbsp;<span data-luogu data-date>2010</span>&nbsp;&nbsp;<span data-luogu data-source>各省省选</span>

依然是先求出最小生成树以及它的总边权，但是对于最大/次大边权的查询，考虑使用倍增 $\texttt{LCA}$ 做法。

联系到递归求解 ${2^k}$ 步父节点时的操作，其实维护树上最/次大边权也可如此。同样是把 ${2^k}$ 拆解成两个 ${2^{k-1}}$ 步，然后对于第一次移动，可以继续向下递归找到最/次大边权；第二次移动同理。最/次大值通过遍历就很容易找出来了，具体方法如下：

1. 如果当前值严格大于维护的最大值，更新最大值为当前值，把次大值赋为原先的最大值。
2. 如果当前值严格小于最大值且严格大于次大值，那么更新次大值为当前值。

对走两步分别得到的四个最/次大值执行遍历，就可以得到全局最/次大值了。在倍增 $\texttt{LCA}$ 过程中，我们把（最小生成树中）节点移动过程中经历的所有树内边的最大值和次大值保存起来，解出全局最/次大值，并与当前升序遍历到的非树边权作比较，得出新边的贡献，即可解得次小生成树的权值。注意去除自环。

其中 `d1[a][k]` 代表节点 $a$ 向上移动 ${2^k}$ 步经过的边的最大权值，`d2[a][k]` 则是相应的次大权值。

[代码过长（177行）](https://www.luogu.com.cn/paste/lmzhxaic)

## 维护树上差分

### AcWing 352. <ruby>闇<rt>くら</rt>の<rt></rt>連<rt>ねん</rt>鎖<rt>さ</rt></ruby>

题目地址：[AcWing 352](https://www.acwing.com/problem/content/description/354/)

题目难度：<span class="label label-danger round">困难</span>

> 传说中的暗之连锁被人们称为 Dark。
>
> Dark 是人类内心的黑暗的产物，古今中外的勇者们都试图打倒它。
>
> 经过研究，你发现 Dark 呈现无向图的结构，图中有 $N$ 个节点和两类边，一类边被称为主要边，而另一类被称为附加边。
>
> Dark 有 $N-1$ 条主要边，并且 Dark 的任意两个节点之间都存在一条只由主要边构成的路径。
>
> 另外，Dark 还有 $M$ 条附加边。
>
> 你的任务是把 Dark 斩为不连通的两部分。
>
> 一开始 Dark 的附加边都处于无敌状态，你只能选择一条主要边切断。
>
> 一旦你切断了一条主要边，Dark 就会进入防御模式，主要边会变为无敌的而附加边可以被切断。
>
> 但是你的能力只能再切断 Dark 的一条附加边。
>
> 现在你想要知道，一共有多少种方案可以击败 Dark。
>
> 注意，就算你第一步切断主要边之后就已经把 Dark 斩为两截，你也需要切断一条附加边才算击败了 Dark。
>
> **输入格式：**
>
> 第一行包含两个整数 $N$ 和 $M$。
>
> 之后 $N-1$ 行，每行包括两个整数 $A$ 和 $B$，表示 $A$ 和 $B$ 之间有一条主要边。
>
> 之后 $M$ 行以同样的格式给出附加边。
>
> **输出格式：**
>
> 输出一个整数表示答案。
>
> **数据范围：**
>
> $N\leq10^5$，$M\leq2\times10^5$，数据保证答案不超过 ${2^{31}-1}$。

![](https://cdn.luogu.com.cn/upload/image_hosting/pao39uu8.png)

假如树内边（主要边）用黑色表示，非树边（附加边）用红色表示。边上的数字代表：在砍断当前边的情况下还需要砍断多少附加边才能将图分成两部分（默认 ${0}$）。事实上，当图中添加了一组附加边，它所连接的两个树内点会和树内若干点组成一个环，并且这个环一定会过两点的最近公共祖先。我们这时从下往上，把环内边上的计数增加 ${1}$，就可得到如上的图。根据题意，显然有：

1. 当该边计数为 ${0}$ 时，砍断当前边后，任意砍断一条附加边即可，答案累加 $M$
2. 当该边计数为 ${1}$ 时，砍断当前边后，只能砍断特定的一条附加边，答案累加 ${1}$
3. 当该边计数大于 ${1}$ 时，因为最多只能砍两刀，因此不能通过砍当前主要边击败 Dark，答案不变

如何更新边上的计数呢？运用树上差分的思想——把权值的差分存储在图上，和序列差分一样，如果想要给某个区间内所有的数加减某个数，则只需在左端点和右端点加/减这个数，然后右端点的右边再减/加这个数，最后求前缀和即可得到原数；树上差分也很类似，我们在附加边连接的两个点上更改数值，然后找到它们的最近公共祖先，减去两倍的值即可。

```cpp
#include <bits/stdc++.h>
#define N 100010
using namespace std;

struct Edge {
    int to, ne;
} edges[N << 1];
int h[N], idx = 0;
int fa[N][20], depth[N];
int dist[N];
int m, ans = 0;

void add(int a, int b) {
    idx++;
    edges[idx].to = b;
    edges[idx].ne = h[a];
    h[a] = idx;
}

void init(int root) {
    memset(depth, 0x3f, sizeof depth);

    queue<int> q;
    depth[0] = 0;
    depth[root] = 1;
    q.push(1);
    while (!q.empty()) {
        int t = q.front();
        q.pop();
        for (int i = h[t]; ~i; i = edges[i].ne) {
            int j = edges[i].to;
            if (depth[j] > depth[t] + 1) {
                depth[j] = depth[t] + 1;
                fa[j][0] = t;
                q.push(j);
                for (int k = 1; k <= 19; k++) {
                    fa[j][k] = fa[fa[j][k - 1]][k - 1];
                }
            }
        }
    }
}

int LCA(int a, int b) {
    if (depth[a] < depth[b]) swap(a, b);
    for (int k = 19; k >= 0; k--) {
        if (depth[fa[a][k]] >= depth[b]) a = fa[a][k];
    }
    if (a == b) return a;
    for (int k = 19; k >= 0; k--) {
        if (fa[a][k] != fa[b][k]) {
            a = fa[a][k];
            b = fa[b][k];
        }
    }
    return fa[a][0];
}

int dfs(int u, int f) {
    int res = dist[u]; // 当前记录的差分权
    for (int i = h[u]; ~i; i = edges[i].ne) {
        int j = edges[i].to;
        if (j == f) continue;
        int t = dfs(j, u); // 获得子树的差分权值
        if (t == 0) ans += m;
        else if (t == 1) ans++;
        res += t; // 向上更新，累加子树差分权
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    memset(h, -1, sizeof h);

    int n;
    cin >> n >> m;
    for (int i = 1; i < n; i++) {
        int a, b;
        cin >> a >> b;
        add(a, b);
        add(b, a);
    }
    init(1);
    for (int i = 1; i <= m; i++) {
        int a, b;
        cin >> a >> b;
        int p = LCA(a, b);
        dist[a]++, dist[b]++, dist[p] -= 2; // 维护树上差分
    }
    dfs(1, -1);
    cout << ans << endl;
    return 0;
}
```
