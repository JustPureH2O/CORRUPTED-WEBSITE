---
slug: '21999'

category: oi算法
published: 2024-09-28T20:48:57.270436+08:00
tags:
- oi
- 算法
- 图论
title: 图论 环计数问题
updated: 2024-10-04T20:53:55.467+08:00
---
## 环

~~顾名思义，环就是环~~

一般研究较多的是三元环和四元环计数。题目给定一张无向图，让你直接或间接地求图中有多少个不同的三元/四元环。形式化的，给定一张无向图，统计出满足要求的无序对 $(i,j,k)$ 或 $(i,j,k,l)$ 的个数，无序对需满足图中存在仅由点 $i,j,k$ 或 $i,j,k,l$ 组成的环。而且它还喜欢和容斥一起考（~~属实是出生到家了~~）。

### 三元环计数

对于三元环计数，我们有很好的算法可以解决，还能够顺带给出三元环的组成点分别是哪些。基本思路如下：

1. 将所有边定向：统计每个点的度数，并让度数小的点指向度数大的点（原边基础上定向，不创建新边），若度数相同则编号小的点指向编号大的点。此时可以得到一张有向无环图 $\texttt{DAG}$。
2. 枚举每个点 $u$ 的所有出点 $v$，并将 $v$ 标记，再对 $v$ 枚举其出点 $w$，检查 $w$ 是否已被标记过，最终把 $u$ 所有出点的标记清空。

其实听起来很暴力（尤其是第二步），但是它却能做到 $\mathcal O(m\sqrt m)$ 的复杂度。~~太强辣~~

代码来自于：[P1989 无向图三元环计数](https://www.luogu.com.cn/problem/P1989)

```cpp
#include <bits/stdc++.h>

#define N 100010
using namespace std;

struct Edge {
    int to, ne;
} edges[N << 1];

int h[N], idx = 0;
int deg[N << 1];
bool st[N << 1];
int u[N << 1], v[N << 1];

void add(int a, int b) {
    idx++;
    edges[idx].to = b;
    edges[idx].ne = h[a];
    h[a] = idx;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    memset(h, -1, sizeof h);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= m; i++) {
        cin >> u[i] >> v[i];
        deg[u[i]]++;
        deg[v[i]]++;
    }
    for (int i = 1; i <= m; i++) {
        if ((deg[u[i]] == deg[v[i]] && u[i] > v[i]) || deg[u[i]] > deg[v[i]]) swap(u[i], v[i]);
        add(u[i], v[i]);
    }
    int cnt = 0;
    for (int u = 1; u <= n; u++) {
        for (int i = h[u]; ~i; i = edges[i].ne) {
            int j = edges[i].to;
            st[j] = true;
        }
        for (int i = h[u]; ~i; i = edges[i].ne) {
            int v = edges[i].to;
            for (int j = h[v]; ~j; j = edges[j].ne) {
                int w = edges[j].to;
                if (st[w]) cnt++;
            }
        }
        for (int i = h[u]; ~i; i = edges[i].ne) {
            int j = edges[i].to;
            st[j] = false;
        }
    }
    cout << cnt << endl;
    return 0;
}
```

如果使用上面这种方法，千万不要忘记数组开二倍。

### 四元环计数

基本步骤如下：

1. 为无向边定向，思路同三元环计数。
2. 设定一个辅助计数数组 `cnt`，在有向图上枚举点 $u$ 的出点 $v$，再在原本的无向图上枚举 $v$ 的出点 $w$，当 $u$ 的度数严格大于 $w$ 的度数时，答案累加 `cnt[w]`，并把 `cnt[w]` 自增一，当前 $u$ 枚举结束时把 `cnt` 清零。

## 例题

### P9850 [ICPC2021 Nanjing R] Ancient Magic Circle in Teyvat

题目地址：[P9850](https://www.luogu.com.cn/problem/P9850)

题目难度：<span data-luogu data-black>NOI/NOI+/CTSC</span>

题目来源：<span data-luogu data-source>ICPC</span>&nbsp;&nbsp;<span data-luogu data-region>南京</span>&nbsp;&nbsp;<span data-luogu data-date>2021</span>

> 给定一个 $n$ 个点的完全图，有 $m$ 条边是红色的，其余边是蓝色的，求出边均为蓝色的大小为 $4$ 的完全子图个数与边均为红色的大小为 $4$ 的完全子图个数的差。
> 
> 对所有数据满足，${4\le n\le 10^5}$，${0\le m\le \min(\frac{n(n-1)}{2},2\times 10^5)}$

将蓝色子图容斥掉，接着分类讨论选择的边数即可。

> [!NOTE]
> 题解同步于本站 %}

