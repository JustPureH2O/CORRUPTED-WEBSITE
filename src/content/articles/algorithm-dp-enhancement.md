---
slug: '3424'

category: oi算法
published: 2024-07-21T08:37:55.862172+08:00
tags:
- oi
- 算法
- 动态规划
- 数据结构
title: 动态规划的优化方式 Day1 单调队列优化
updated: 2024-07-23T10:24:51.510+08:00
---
有人私信我，说能不能不要在博客里写那么多“显然”。我的回答是：“好的，全部换成‘Apparently’”。~~我寻思我也没写那么多显然啊~~

## 单调队列优化

### 简介

我们都知道单调队列是用来 $\mathcal O(n)$ 维护一个序列的单调性的，在一个定长区间内，单调队列可以做到输出当前扫描区间内的最值元素。通过维护区间最值，在动态规划问题中，可以有效节省状态枚举带来的效率浪费，有时还可以用来对数组降维，是非常实用且简单的优化方法。

优化一个动态规划问题需要首先提出它的朴素解法，在保证正确性的前提下再来思考它的优化方式。例如下面这几道例题：

### 洛谷 P1714 切蛋糕

题目地址：[P1714](https://www.luogu.com.cn/problem/P1714)

题目难度：<span data-luogu data-green>普及+/提高</span>

> 今天是小 Z 的生日，同学们为他带来了一块蛋糕。这块蛋糕是一个长方体，被用不同色彩分成了 $n$ 个相同的小块，每小块都有对应的幸运值。
>
> 小 Z 作为寿星，自然希望吃到的蛋糕的幸运值总和最大，但小 Z 最多又只能吃 $m(m\le n)$ 小块的蛋糕。
>
> 请你帮他从这 $n$ 小块中找出**连续**的 $k(1 \le k\le m)$ 块蛋糕，使得其上的总幸运值最大。
>
> **形式化地**，在数列 $\{p_n\}$ 中，找出一个子段 $[l,r](r-l+1\le m)$，最大化 $\sum\limits_{i=l}^rp_i$。
>
> **输入格式：**
>
> 第一行两个整数 $n,m$。分别代表共有 $n$ 小块蛋糕，小 Z 最多只能吃 $m$ 小块。
>
> 第二行 $n$ 个整数，第 $i$ 个整数 $p_i$ 代表第 $i$ 小块蛋糕的幸运值。
>
> **输出格式：**
>
> 仅一行一个整数，即小 Z 能够得到的最大幸运值。
>
> **数据范围：**
>
> - 对于 ${20\%}$ 的数据，有 ${1\le n\le100}$。
> - 对于 ${100\%}$ 的数据，有 ${1\le n\le5\times 10^5}$，$|p_i|≤500$。
>
> 保证答案的绝对值在 $[0,2^{31}-1]$ 之内。

首先提出一个朴素做法：预处理序列的前缀和，记作 `sum` 数组，假设 `dp[i]`是以`a[i]` 结尾、子段长度不超过 $m$ 的最大子段和。那么：

$$
dp(i)=\max\limits_{j\in[i-m,i-1]}(sum(i)-sum(j))
$$

因此首先可以设计出一个双层循环，外层 $i\in[1,n]$，内层 $j\in[\max(i-m,0),i-1]$。这样做的时间复杂度是 $\mathcal O(n^2)$，对于 $n\leq5\times10^5$ 的数据无能为力，至少需要提出一个 $\mathcal O(n\log n)$ 的算法来解决。因此我们想到 $\mathcal O(n)$ 的单调队列优化。

对于每一次外层循环，$i$ 有一个固定的值，因而 $sum(i)$ 是定值，是我们处理的 $[1,i]$ 的前缀和。因此最大化上式，只需要让 $sum(j)$ 取最小值即可。那么 $\forall j\in[i-m,i-1]$，求 $sum(j)_{min}$ 就可以转化为滑动窗口问题了。

```cpp
#include <bits/stdc++.h>
#define N 500010
using namespace std;

int sum[N], a[N];
deque<int> q;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
  
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
        sum[i] = sum[i - 1] + a[i];
    }
    int ans = -INT_MAX;
    for (int i = 1; i <= n; i++) {
        while (!q.empty() && sum[i - 1] < sum[q.front()]) q.pop_front();
        q.push_front(i - 1);
        if (i - 1 - q.back() == m) q.pop_back();
        ans = max(ans, sum[i] - sum[q.back()]);
    }
    cout << ans << endl;
    return 0;
}
```

### 洛谷 P2627 [USACO11OPEN] Mowing the Lawn G

题目地址：[P2627](https://www.luogu.com.cn/problem/P2627)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

题目来源：<span data-luogu data-source>USACO</span>&nbsp;&nbsp;<span data-luogu data-date>2011</span>

> 在一年前赢得了小镇的最佳草坪比赛后，Farmer John 变得很懒，再也没有修剪过草坪。现在，新一轮的最佳草坪比赛又开始了，Farmer John 希望能够再次夺冠。
>
> 然而，Farmer John 的草坪非常脏乱，因此，Farmer John 只能够让他的奶牛来完成这项工作。Farmer John 有 $N$（${1\le N\le 10^5}$）只排成一排的奶牛，编号为 ${1\ldots N}$。每只奶牛的效率是不同的，奶牛 $i$ 的效率为 $E_i$（${0\le E_i\le 10^9}$）。
>
> 靠近的奶牛们很熟悉，因此，如果 Farmer John安排超过 $K$ 只连续的奶牛，那么，这些奶牛就会罢工去开派对 :)。因此，现在 Farmer John 需要你的帮助，计算 FJ 可以得到的最大效率，并且该方案中没有连续的超过 $K$ 只奶牛。
>
> **输入格式：**
>
> 第一行：空格隔开的两个整数 $N$ 和 $K$。
>
> 第二到 $N+1$ 行：第 $i+1$ 行有一个整数 $E_i$。
>
> **输出格式：**
>
> 第一行：一个值，表示 Farmer John 可以得到的最大的效率值。

既然不能有超过 $K$ 个连续的元素被选中，转换一下就变成了在 $K+1$ 个元素中至少要选中其中一个。题目要求总效率最高，那我们就让未选奶牛的效率总和最小就行了。假设 `dp[i]` 代表在前 $i$ 只奶牛中，且不选择第 $i$ 只奶牛损失的最小效率。初始时，$Apparently,$ `dp[i] = e[i]`，在动态规划过程中，对于当前的每一个 $i$，都在前 $k+1$ 个元素中选择最小的那个累加（使用单调队列维护长为 $k+1$ 的滑动窗口）即可。在最后 $k+1$ 个计算值中取最小的，用总和减去就行。

```cpp
#include <bits/stdc++.h>
#define N 100010
using namespace std;

typedef long long ll;

ll dp[N];
ll sum;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n, k;
    cin >> n >> k;
    for (int i = 1; i <= n; i++) {
        cin >> dp[i];
        sum += dp[i];
    }
    deque<ll> q;
    ll ans = INFINITY;
    q.push_front(0);
    for (int i = 1; i <= n; i++) {
        if (i - q.back() > k + 1) q.pop_back();
        dp[i] += dp[q.back()];
        while (!q.empty() && dp[i] < dp[q.front()]) q.pop_front();
        q.push_front(i);
    }
    for (int i = n - k; i <= n; i++) ans = min(ans, dp[i]);
    cout << sum - ans << endl;
    return 0;
}
```

双倍经验：[P2034 选择数字](https://www.luogu.com.cn/problem/P2034)。

### 洛谷 P2216 [HAOI2007] 理想的正方形

题目地址：[P2216](https://www.luogu.com.cn/problem/P2216)

题目难度：<span data-luogu data-green>普及+/提高</span>

题目来源：<span data-luogu data-region>河南</span>&nbsp;&nbsp;<span data-luogu data-date>2007</span>&nbsp;&nbsp;<span data-luogu data-source>各省省选</span>

> 有一个 $a \times b$ 的整数组成的矩阵，现请你从中找出一个 $n \times n$ 的正方形区域，使得该区域所有数中的最大值和最小值的差最小。
>
> **输入格式：**
>
> 第一行为 $3$ 个整数，分别表示 $a,b,n$ 的值。
>
> 第二行至第 $a+1$ 行每行为 $b$ 个非负整数，表示矩阵中相应位置上的数。每行相邻两数之间用一空格分隔。
>
> **输出格式：**
>
> 仅一个整数，为 $a \times b$ 矩阵中所有“ $n \times n$ 正方形区域中的最大整数和最小整数的差值”的最小值。
>
> **数据范围：**
>
> 矩阵中的所有数都不超过 ${10^9}$。
>
> ${20\%}$ 的数据 ${2 \le a,b \le 100,n \le a,n \le b,n \le 10}$。
>
> ${100\%}$ 的数据 ${2 \le a,b \le 1000,n \le a,n \le b,n \le 100}$。

~~其实跟动态规划没啥关系，按理说应该只归到单调队列下的~~

这道题首先需要我们找出一个正方形区域内的最大和最小值，$\max$ 运算的性质——$\max(a,b,c,d)=\max(\max(a,b),\max(c,d))$ 启发我们可以先将每一行连续 $n$ 个数的最值统一存起来，然后再按列求最值，最终就得到了这个正方形区块内的最值元素。每次求出列最值后直接更新答案就好。需注意的是传参时是 `a` 还是 `b`。

```cpp
#include <bits/stdc++.h>

#define N 1010
using namespace std;

int g[N][N];
int row_min[N][N], row_max[N][N], col_min[N], col_max[N];
int tmp[N];
int a, b, n;
deque<int> q;

void getMax(const int arr[], int dest[], int size) {
    // Get max segmental element from arr and copy the result to dest
    q.clear();
    for (int i = 1; i <= size; i++) {
        if (!q.empty() && i - q.back() >= n) q.pop_back();
        while (!q.empty() && arr[i] >= arr[q.front()]) q.pop_front();
        q.push_front(i);
        dest[i] = arr[q.back()];
    }
}

void getMin(const int arr[], int dest[], int size) {
    q.clear();
    for (int i = 1; i <= size; i++) {
        if (!q.empty() && i - q.back() >= n) q.pop_back();
        while (!q.empty() && arr[i] <= arr[q.front()]) q.pop_front();
        q.push_front(i);
        dest[i] = arr[q.back()];
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    cin >> a >> b >> n;
    for (int i = 1; i <= a; i++) {
        for (int j = 1; j <= b; j++) {
            cin >> g[i][j];
        }
    }
    for (int i = 1; i <= a; i++) {
        getMax(g[i], row_max[i], b);
        getMin(g[i], row_min[i], b);
    }
    int res = INFINITY;
    for (int i = n; i <= b; i++) {
        for (int j = 1; j <= a; j++) tmp[j] = row_max[j][i];
        getMax(tmp, col_max, a);

        for (int j = 1; j <= a; j++) tmp[j] = row_min[j][i];
        getMin(tmp, col_min, a);

        for (int j = n; j <= a; j++) res = min(res, col_max[j] - col_min[j]);
    }
    cout << res << endl;
    return 0;
}
```

三倍经验：[P9905 [COCI 2023/2024 #1] AN2DL](https://www.luogu.com.cn/problem/P9905)、[CF846D Monitor](https://www.luogu.com.cn/problem/CF846D).
