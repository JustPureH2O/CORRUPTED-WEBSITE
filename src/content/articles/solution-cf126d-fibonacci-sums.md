---
slug: '126'

category: 题解
published: 2024-10-31T20:56:37.544663+08:00
image: https://pic.imgdb.cn/item/65f5a7c59f345e8d0395fdf7.jpg
tags:
- 题解
- 动态规划
- 数学
title: CF 126D - Fibonacci Sums 题解
updated: 2024-11-01T19:17:56.475+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[CF 126D](https://www.luogu.com.cn/problem/CF126D)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

> 计算一个整数被分解成若干个各不相等的Fibonacci数列中的数的方案。

## 前置 齐肯多夫定理

齐肯多夫定理的内容是：

> 任何正整数都可以被表示成若干不连续的斐波那契数之和（$F_1$ 除外）

而对于一个正整数，我们可以按照二进制分解的策略：先贪心地找到一个最大的 $k$ 满足 $F_{k-1}<n<F_k$，然后用 $n$ 减去 $F_{k-1}$，以此类推直到减为 $0$。

斐波那契数列一般定义为：$\{1,1,2,3,5,8,13,\dots\}$，这里我们做一个整体左移，本文所述的斐波那契数列应是数列 $\{1,2,3,5,8,13,\dots\}$，也就是 $F_1=1,F_2=2,F_3=3$。

类比二进制，齐肯多夫分解是可以用一个 $0/1$ 串表示出来的。例如：$28=21+3+1=F_7+F_3+F_1$。因此它的齐肯多夫拆分就是：$(1000101)_F$。

不难发现，按照贪心策略计算出的拆分是不会存在相邻的两个 $1$ 的。因为一旦出现连续的 $1$，都可以遵循斐波那契数的定义把它变为一个更大的斐波那契数。

## 回归正题

假如我们现在已经得到了一个齐肯多夫拆分，如何计算题目要求的方案总数呢？

可以利用“标准齐肯多夫拆分中不存在相邻 $1$”的结论。对于原串的一个模式串 `*100*`（星号代表任意 $0/1$ 串），我们可以拆成 `*011*`。如果在末尾的 $1$ 后还有更多的 $0$，那其实也是可以再次拆分的。

注意到要求方案数，考虑动态规划。我们用 $A_i$ 表示拆分中第 $i$ 个 $1$ 的出现位置，并令状态转移方程为 $f_{i,0/1}$，表示选择是否删除 $A_i$ 位后的总方案数。

接下来考虑当前状态从何而来。如果选择不删当前这一位，答案只能从前一位 $1$ 那里贡献而来，也即 $f_{i,0}=f_{i-1,0}+f_{i-1,1}$。

如果选择删除这一位，对于接下来的操作，我们仍然可以选择删除或不删除。发现删到最后整个字符串一定是像 `101010101` 这样交错排列的。于是可以得到：

$$
\begin{aligned}
f_{i,0}&=f_{i-1,0}+f_{i-1,1}
\\f_{i,1}&=f_{i-1,0}\times\lfloor\frac{A_i-A_{i-1}-1}{2}\rfloor+f_{i-1,1}\times\lfloor\frac{A_i-A_{i-1}}{2}\rfloor
\end{aligned}
$$

```cpp
#include <bits/stdc++.h>
 
#define N 90
using namespace std;
 
typedef long long ll;
 
vector<int> pos;
ll fib[N];
ll dp[N][2];
 
void init() {
    fib[1] = fib[2] = 1;
    for (int i = 3; i < N; i++) fib[i] = fib[i - 1] + fib[i - 2];
}
 
int solve(ll x) {
    pos.clear();
    for (int i = N - 1; i >= 1; i--) {
        if (!x) break;
        if (fib[i] <= x) {
            x -= fib[i];
            pos.push_back(i - 1);
        }
    }
    reverse(pos.begin(), pos.end());
    return pos.size();
}
 
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
 
    int t;
    cin >> t;
    init();
    while (t--) {
        memset(dp, 0, sizeof dp);
 
        ll x;
        cin >> x;
        int len = solve(x);
        dp[0][0] = 1;
        dp[0][1] = (pos[0] - 1) / 2;
        for (int i = 1; i < len; i++) {
            dp[i][0] = dp[i - 1][0] + dp[i - 1][1];
            dp[i][1] = dp[i - 1][0] * ((pos[i] - pos[i - 1] - 1) / 2) + dp[i - 1][1] * ((pos[i] - pos[i - 1]) / 2);
        }
        cout << dp[len - 1][1] + dp[len - 1][0] << endl;
    }
    return 0;
}
```

[CF 通过记录](https://codeforces.com/contest/126/submission/288986966)

$\texttt{The End}$
