---
slug: '11186'

category: 题解
published: 2024-08-25T19:23:31.740303+08:00
image: https://pic.imgdb.cn/item/6676f2bfd9c307b7e939c0aa.jpg
tags:
- oi
- 算法
- 动态规划
- 题解
title: P3571 [POI2014] - Supercomputer 题解
updated: 2024-08-25T22:00:48.485+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

集训时讲到了这个题，刚好写篇题解记录一下思路。

题目地址：[P3571](https://www.luogu.com.cn/problem/P3571)

题目难度：<span data-luogu data-black>NOI/NOI+/CTSC</span>

> 给定一棵 $n$ 个节点的有根树，根节点为 $1$。$q$ 次询问，每次给定一个 $k$，用最少的操作次数遍历完整棵树，输出最少操作次数。每次操作可以选择访问不超过 $k$ 个未访问的点，且这些点的父亲必须在这次操作之前被访问过。
>
> $n, q \leq {10^6}$。

这道题其实有一个裸结论可以套：

> 对于一棵树，一定存在一个最优解，满足：恰好用 $i$ 步操作删除完树上深度小于等于 $i$ 的节点，此后一定可以通过每次删除 $k$ 个节点把整棵树的所有节点删除完毕。

形式化地，令 $f(k)$ 为对于给定的 $k$ 所能达到的最小操作数，$s_i$ 为深度大于 $i$ 的节点总数。那么有：

$$
f(k)=\max\limits_{i\in Tree}\{i+\lceil\frac{s_i}{k}\rceil\}
$$

此时把它看作动态规划的转移方程，移项可以得到 $s_i=-ki+kf(k)$，注意到自变量和因变量具有单调性，可以进行斜率优化，能够把时间复杂度降到 $\mathcal O(n)$。

重点在于如何证明转移方程的正确性。要想证明一个相等关系，可以从 $A\leq B$ 以及 $A\geq B$ 两个方面分别入手证明，只要两个条件均满足，则代表 $A=B$ 成立。

---

首先来证 $f(k)\geq\max\{i+\lceil\frac{s_i}{k}\rceil\}$：对于一个深度恰等于 $i$ 的节点，至少需要 $i$ 次操作，于是这是正确的。

再来证 $f(k)\leq\max\{i+\lceil\frac{s_i}{k}\rceil\}$：假设上式在 $i=a$ 时取得最大值，并令 $b$，假设前 $b$ 步可删去前 $b$ 层所有点，且它是满足该性质的最大的数。我们需要做的就是证明 $a=b$。

同样的思路，先证 $a\geq b$。考虑反证法，对于 $c<b$，若 $i=c$ 时的 $f(k)$ 大于 $i=b$ 时的 $f(k)$。那么：

$$
\begin{aligned}
c+\frac{s_c}{k}&>b+\frac{s_b}{k}
\\s_c-s_b&>k(b-c)
\end{aligned}
$$

而不等号左侧用两个前缀和相减代表所有深度介于 $c+1\sim b$ 之间的点的总数，删完所有 $c+1\sim b$ 层的节点的操作步数应该大于 $b-c$，又因为删除一个第 $c$ 层的节点需要 $c$ 步，那么前 $b$ 层仅用 $b$ 步无法删除完毕。与假设中 $b$ 的意义矛盾，于是 $a\geq b$ 得证。

接下来证 $a\leq b$：树的第 $b+1$ 层一定有超过 $k$ 个节点，有 $f(k)_{b+1}\leq f(k)_b$；对于 $b+1$ 和 $b+2$ 两层，若这两层的节点总数不超过 ${2k}$，那么 $b+2$ 层的节点数量一定小于 $k$，于是可以用 $b+2$ 次操作删完前 $b+2$ 层的点，与 $b$ 是满足条件的最大的数矛盾，故 $b+1$ 和 $b+2$ 两层节点总数一定大于 ${2k}$……以此类推，$b+1\sim b+n$ 层一共有超过 $nk$ 个节点。此时一定有 $a\leq b$ 成立。

综上所述，$a=b$。因为 $b+1\sim b+n$ 层节点数一定大于 $kn$，于是每次做删除 $k$ 个点的操作，并且优先删有孩子节点的节点即可。至此，整个结论得到证明。

最后就是套斜率优化的模板了（~~有现成的公式还真是方便呢~~）：

```cpp
#include <bits/stdc++.h>
#define N 1000010
using namespace std;

int dp[N];
int dep[N], s[N];
int query[N];
int q[N];
int hh = 0, tt = 0;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n, m;
    int maxd = 0, maxq = 0;
    cin >> n >> m;
    for (int i = 1; i <= m; i++) {
        cin >> query[i];
        maxq = max(maxq, query[i]);
    }
    s[1] = dep[1] = 1;
    for (int i = 2; i <= n; i++) {
        int x;
        cin >> x;
        dep[i] = dep[x] + 1; // 其实建单向边用DFS处理节点深度也是可以的，只是这道题并没这个必要？
        s[dep[i]]++;
        maxd = max(maxd, dep[i]);
    }
    for (int i = maxd; i; i--) s[i] += s[i + 1]; // 处理 i 层及更深层的节点总数
    // 单调队列维护凸包
    for (int i = 1; i <= maxd; i++) {
        // 用交叉相乘法以免出题人卡精度
        while (hh < tt && (s[q[tt] + 1] - s[i + 1]) * (q[tt] - q[tt - 1]) < (s[q[tt] + 1] - s[q[tt - 1] + 1]) * (q[tt] - i)) tt--;
        q[++tt] = i;
    }
    for (int i = 1; i <= maxq; i++) {
        while (hh < tt && (s[q[hh] + 1] - s[q[hh + 1] + 1]) < -i * (q[hh] - q[hh + 1])) hh++;
        int j = q[hh];
        dp[i] = j + (s[j + 1] + i - 1) / i; // 套转移方程
    }
    for (int i = 1; i <= m; i++) cout << dp[query[i]] << ' ';
    cout << endl;
    return 0;
}
```

$\texttt{The End}$
