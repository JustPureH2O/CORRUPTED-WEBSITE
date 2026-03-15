---
slug: '9850'

category: 题解
published: 2024-10-04T21:56:24.940348+08:00
image: https://pic.imgdb.cn/item/66e6bdb2d9c307b7e9a2a9c9.jpg
tags:
- oi
- 算法
- 图论
- 数论
title: P9850 [ICPC2021 Nanjing R] - Ancient Magic Circle in Teyvat 题解
updated: 2024-10-04T22:00:04.952+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[P9850](https://www.luogu.com.cn/problem/P9850)

题目难度：<span data-luogu data-black>NOI/NOI+/CTSC</span>

题目来源：<span data-luogu data-source>ICPC</span>&nbsp;&nbsp;<span data-luogu data-region>南京</span>&nbsp;&nbsp;<span data-luogu data-date>2021</span>

> 给定一个 $n$ 个点的完全图，有 $m$ 条边是红色的，其余边是蓝色的，求出边均为蓝色的大小为 $4$ 的完全子图个数与边均为红色的大小为 $4$ 的完全子图个数的差。
>
> 对所有数据满足，${4\le n\le 10^5}$，${0\le m\le \min(\frac{n(n-1)}{2},2\times 10^5)}$

$n$ 的量级是 ${10^5}$ 的，因此不能直接建完全图，考虑把蓝色图用红色图表示出来。假设存在 $f_i$ 个有 $i$ 条边的红色子图，那么对于一张存在 $j$ 条红色边的图，就能有 $\binom{j}{i}$ 种选择方法；此时再令 $g_i$ 表示大小为 ${4}$ 且存在 $i$ 条红色边的完全子图个数，因此有下式：

$$
f_i=\sum\limits_{j=i}\binom{j}{i}g_j
$$

对上面的式子使用二项式反演得：

$$
g_i=\sum\limits_{j=i}\binom{j}{i}(-1)^{j-i}f_j
$$

那么求蓝色完全子图和红色完全子图的差就可以用 $|g_0-g_6|=|\sum\limits_{i=0}^5(-1)^if_i|$ 得到，接下来对每个 $f_i$ 进行分类讨论：

1. $i=0$ 时，即没有选定的红色边。此时随便选择四个点组成图，即 $f_0=\binom{n}{4}$。
2. $i=1$ 时，需选定一条红色边。选边方案数是 $\binom{m}{1}$，此时确定下两个端点，那么在剩下的 $n-2$ 个点里选择两个点，即 $f_1=\binom{m}{1}\binom{n-2}{2}$。
3. $i=2$ 时，分两类考虑：

   * 两条线有公共端点：首先枚举这个公共点，再枚举两条以该点为端点的线段，最后选剩下的那个点。此时方案数为 $(n-3)\sum\limits_{u=1}^n\binom{d_u}{2}$，其中 $d_u$ 为原无向图中点 $u$ 的度数。
   * 两条线无公共端点：正难则反，将原图中任意选两条边的方案数减去两条线有公共端点的方案数即得两条线无公共端点的方案数。也就是 $\binom{m}{2}-\sum\limits_{u=1}^n\binom{d_u}{2}$。
   * 两情况求和得：$f_2=\binom{m}{2}+(n-4)\sum\limits_{u=1}^{n}\binom{d_u}{2}$。
4. $i=3$ 时，继续分类讨论：

   * 三条边组成一个三元环，再枚举剩下的一个点，结果为 $(n-3)C_3$。
   * 三条边共用一个顶点，枚举这个顶点，选择直连边中的三条即可涵盖四个点，即 $\sum\limits_{u=1}^n\binom{n}{3}$。
   * 三条边形成链状结构。选择一条边，该边的两个端点分别支出去一条边，刚好覆盖满四个点。注意把成环情况舍去，同一个三元环会算三次，最终需减去 ${3}C_3$。结果为：$-3C_3+\sum\limits_{(u,v)\in E}(d_u-1)(d_v-1)$。
   * 综上，$f_3=(n-6)C_3+\sum\limits_{(u,v)\in E}(d_u-1)(d_v-1)$。
5. $i=4$ 时，分两类讨论：

   * 四条边组成一个四元环，四个点恰好均被覆盖，无需多余枚举，结果为 $C_4$。
   * 三元环的某个顶点支出去一条边，枚举这个端点。结果为 $\sum\limits_{u=1}^ns_u(d_u-2)$，其中 $s_u$ 为经过点 $u$ 的不同三元环个数。
   * 综上，$f_3=C_4+\sum\limits_{u=1}^ns_u(d_u-2)$。
6. $i=5$ 时，只有一种情况，那就是两个三元环共用一条边。此时只需枚举这个公共边即可，即 $f_5=\sum\limits_{i\in\mathbb C_3}\binom{t_i}{2}$，其中 $\mathbb C_3$ 表示求解三元环时完成定向的边集，$t_i$ 表示覆盖到边 $i$ 的不同三元环个数。

最后套公式计算即可，注意加上绝对值，建图用前向星会超时。

```cpp
#include <bits/stdc++.h>

#define N 100010
#define M 200010
using namespace std;

typedef long long ll;
typedef pair<int, int> PII;

vector<PII> E[N];
vector<int> G[N];
int u[N << 1], v[N << 1];
ll deg[N << 1];
ll cnt[N << 1];
ll containerP[N], containerE[M];
int tmp[N], id[N];
ll n, m;

ll countTripling() {
    ll ret = 0;
    for (int i = 1; i <= n; i++) {
        for (auto j: E[i]) id[j.first] = j.second;
        for (auto j: E[i]) {
            int k = j.first;
            for (auto l: E[k]) {
                int w = l.first;
                if (id[w]) {
                    containerP[i]++;
                    containerP[k]++;
                    containerP[w]++;
                    containerE[j.second]++;
                    containerE[l.second]++;
                    containerE[id[w]]++;
                    ret++;
                }
            }
        }
        for (auto j: E[i]) id[j.first] = 0;
    }
    return ret;
}

ll countQuadrant() {
    for (int i = 1; i <= m; i++) {
        if ((deg[u[i]] == deg[v[i]] && u[i] > v[i]) || deg[u[i]] > deg[v[i]]) swap(u[i], v[i]);
        E[u[i]].emplace_back(v[i], i);
    }
    ll ret = 0;
    int hh = 0;
    for (int i = 1; i <= n; i++) {
        for (int j: G[i]) {
            for (auto k: E[j]) {
                int w = k.first;
                if (deg[i] < deg[w] || (deg[i] == deg[w] && i < w)) {
                    ret += cnt[w];
                    if (!cnt[w]) tmp[hh++] = w;
                    cnt[w]++;
                }
            }
        }
        for (int j = 0; j < hh; j++) cnt[tmp[j]] = 0;
        hh = 0;
    }
    return ret;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    cin >> n >> m;
    for (int i = 1; i <= m; i++) {
        cin >> u[i] >> v[i];
        deg[u[i]]++;
        deg[v[i]]++;
        G[u[i]].push_back(v[i]);
        G[v[i]].push_back(u[i]);
    }
    ll quad = countQuadrant();
    ll trip = countTripling();
    ll f0, f1, f2 = 0, f3 = 0, f4 = 0, f5 = 0;
    for (int i = 1; i <= n; i++) {
        f2 += deg[i] * (deg[i] - 1) / 2 * (n - 4);
        f3 += deg[i] * (deg[i] - 1) * (deg[i] - 2) / 6;
        f4 += containerP[i] * (deg[i] - 2);
        for (auto j: E[i]) {
            int k = j.first;
            f3 += (deg[i] - 1) * (deg[k] - 1);
        }
    }
    for (int i = 1; i <= m; i++) {
        f5 += containerE[i] * (containerE[i] - 1) / 2;
    }
    f0 = (__int128) n * (n - 1) * (n - 2) * (n - 3) / 24;
    f1 = m * (n - 2) * (n - 3) / 2;
    f2 += m * (m - 1) / 2;
    f3 += trip * (n - 6);
    f4 += quad;
    cout << abs(f0 - f1 + f2 - f3 + f4 - f5);
    return 0;
}
```
