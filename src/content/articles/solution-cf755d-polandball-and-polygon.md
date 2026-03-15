---
slug: '755'

category: 题解
published: 2024-11-27T20:32:36.654890+08:00
image: https://img.justpureh2o.cn/image/banners/673dd9f5d29ded1a8c0506f8.png
tags:
- oi
- 题解
- 算法
- 数据结构
title: CF 755D - PolandBall and Polygon 题解
updated: 2024-11-27T21:55:53.363+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[CF 755D](https://www.luogu.com.cn/problem/CF755D)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

> 给出一个 $n$ 边形，和距离 $k$。 第一次连接 ${1}$ 和 $k+1$，第二次连接 $k+1$ 和 $(k+1+n)\bmod n$，依次进行 $n$ 次，每次结束后输出 $n$ 边形被分割成了几个区域。
>
> ${5}\leq n\leq10^6,2\leq k\leq n-2$，保证 $n$ 和 $k$ 互质。

今天模拟赛 T2 原题，赛时多测卡线段树加上多测没清空喜爆零。同机房大佬 Brilliant11001 用 $\mathcal O(n)$ 惊天地泣鬼神纯数学做法 A 的，在此表示深深膜拜 %%%。

---

为了取模方便，本文是 `0-index` 的。

首先，根据互质关系可得，本题无需考虑重边的情况。因为在 `0-index` 下，题目可以看作是 $x$ 向 $(x+k)\bmod n$ 连边，因此只有满足 $x\equiv x+\lambda k\pmod n,\lambda\in\mathbb Z$ 时才可能出现重边，这要求 $n\mid\lambda k$，而 $n\perp k$（互质），所以 $\lambda\geq n$，且是 $n$ 的倍数时才会出现重边，对应 $n+1$ 次操作之后。本题中只考虑前 $n$ 次操作，因而不存在重边问题。

手搓可以发现第一个规律：$k$ 具有对称性，即 $k$ 和 $n-k$ 作为步长时的答案是相同的，只是连边顺序相反而已。

接着研究，发现第二个规律——连边带来的贡献是当前边与已有边的相交次数加一。我们的核心任务就是维护当前边会与多少已连接的边相交。

假设当前待连的边是 $(L,R)$。仔细观察样例可发现，其实相交线段个数就是 $L$ 到 $R$（注意顺序，不是 $R$ 到 $L$）间内每个点的度数之和（多边形本身的边不计入度数）。因此对于每次操作，我们获得区间 $[L+1,R-1]$ 内所有点已经连出边的总数即可，注意特判右端点是否越过节点 $0$。贡献的产生如下图：

![](https://cdn.luogu.com.cn/upload/image_hosting/cshpg1mw.png)

线段树的常数还是很大的，建议使用树状数组（或者上边大佬的数学做法）。

```cpp
#include <bits/stdc++.h>
#define N 1000010
using namespace std;

typedef long long ll;

struct SegmentTree {
#define le(x) (x << 1)
#define ri(x) (x << 1 | 1)
#define leftSubtree(x) (tree[le(x)])
#define rightSubtree(x) (tree[ri(x)])
    int l, r, size;
    ll sum;
} tree[N << 2];

void pushup(int idx) {
    tree[idx].sum = leftSubtree(idx).sum + rightSubtree(idx).sum;
}

void build(int idx, int l, int r) {
    tree[idx].l = l, tree[idx].r = r;
    tree[idx].size = r - l + 1;
    if (l == r) return;
    int mid = (l + r) >> 1;
    build(le(idx), l, mid);
    build(ri(idx), mid + 1, r);
    pushup(idx);
}

void modify(int idx, int uid) {
    if (tree[idx].size == 1 && tree[idx].l == uid) {
        tree[idx].sum++;
        return;
    }
    int mid = (tree[idx].l + tree[idx].r) >> 1;
    if (uid <= mid) modify(le(idx), uid);
    if (uid > mid) modify(ri(idx), uid);
    pushup(idx);
}

ll query(int idx, int l, int r) {
    if (l <= tree[idx].l && tree[idx].r <= r) return tree[idx].sum;
    int mid = (tree[idx].l + tree[idx].r) >> 1;
    ll ret = 0;
    if (l <= mid) ret += query(le(idx), l, r);
    if (r > mid) ret += query(ri(idx), l, r);
    return ret;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n, k;
    cin >> n >> k;
    k = min(k, n - k);
    build(1, 0, n - 1);
    int pos = 0;
    ll section = 1;
    for (int i = 1; i <= n; i++) {
        int L = (pos + 1) % n, R = (pos + k - 1 + n) % n; // 左右端点
        ll sum = R < L ? query(1, 0, R) + query(1, L, n - 1) : query(1, L, R); // 获得区间内每个点连出去多少条边，注意判断是否跨过节点 0
        modify(1, pos); // 为当前的线段端点累加 1
        modify(1, (pos + k) % n);
        section += sum + 1; // 图形总数
        pos = (pos + k) % n; // 跳到下一个位置
        cout << section << ' ';
    }

    return 0;
}
```

[AC 记录](https://codeforces.com/contest/755/submission/293491375)

$\texttt{The End}$
