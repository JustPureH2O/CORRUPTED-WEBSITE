---
slug: '7812'

category: 题解
published: 2024-08-31T16:43:10.356744+08:00
image: https://pic.imgdb.cn/item/669f9ae5d9c307b7e90432f1.jpg
tags:
- oi
- 算法
- 随机化
- 题解
title: P7812 [JRKSJ R2] - Dark Forest 题解
updated: 2024-09-01T09:11:04.933+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[P7812](https://www.luogu.com.cn/problem/P7812)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

题目类型：<span data-luogu data-special>提交答案</span>&nbsp;&nbsp;<span data-luogu data-special>Special Judge</span>

> **本题为提交答案题。**
>
> 给你一个长为 $n$ 的序列 $a$，定义 ${1\dots n}$ 的排列 $p$ 的权值为
>
> $$
> \sum_{i=1}^n p_i a_{p_{i-1}} a_{p_i}a_{p_{i+1}}
> $$
>
> 你可以理解为这个排列是一个环，即 $p_{0}=p_n,p_{n+1}=p_1$。
>
> 请构造一个权值**尽量大**的 $1\dots n$ 的排列。
>
> **输入格式：**
>
> 第一行一个整数 $n$。
>
> 第二行 $n$ 个整数表示序列 $a$。
>
> **输出格式：**
>
> 一行 $n$ 个整数表示排列。
>
> **数据范围：**
>
> 对于 $100\%$ 的数据，${1\le n,a_i\le 10^3}$。
>
> **评分方式：**
>
> **本题使用 Special Judge**，每个测试点都有 ${10}$ 个参数 $v_1,v_2,\dots v_{10}$。如果你的输出的权值 $V\ge v_i$，则该测试点您至少会获得 $i$ 分。
>
> 特别的，如果您的输出不是一个 ${1\dots n}$ 的排列，您会在该测试点获得 $0$ 分。
>
> 评分参数已经放至附件。
>
> **附件下载：**
>
> 1. [评分参数](https://www.luogu.com.cn/fe/api/problem/downloadAttachment/2ymf7ql5)
> 2. [输入数据](https://www.luogu.com.cn/fe/api/problem/downloadAttachment/v79mgzi5)

什么？提交答案题？直接打表！

首先我们需要明确如何才能构造出一个符合题意的排列，暴力枚举的复杂度是 $\mathcal O(n!)$ 的，显然是不可取的做法。因此我们考虑随机化做法。

## 测试点 1-2

提到随机化，我们有模拟退火。先随机一个 ${1\sim n}$ 的排列，再任意交换若干元素并与先前的序列权值进行比较，若更优则直接采纳，否则就依据 $\texttt{Metropolis}$ 准则概率接受，其余情况则恢复原状。

在本地跑没有时限，可以把参数调精一点。

```cpp
#include <bits/stdc++.h>
#define N 1010
#define PRINT_TABLE
using namespace std;

typedef long long ll;

int n;
ll a[N], p[N], q[N];
random_device rd;
ll ans = 0;

double rand(double l, double r) {
    return (double) rd() / random_device::max() * (r - l) + l;
}

int rand(int l, int r) {
    return (int) (rd() % (r - l + 1)) + l;
}

ll calc() {
    // 计算权值
    ll sum = p[1] * a[p[n]] * a[p[1]] * a[p[2]];
    for (int i = 2; i < n; i++) sum += p[i] * a[p[i - 1]] * a[p[i]] * a[p[i + 1]];
    sum += p[n] * a[p[n - 1]] * a[p[n]] * a[p[1]];
    return sum;
}

void SA() {
    double T = 1e10;
    ans = max(ans, calc());
    while (T > 1e-17) {
        int a = rand(1, n), b = rand(1, n);
        swap(p[a], p[b]);
        ll now = calc();
        long double delta = now - ans;
        if (delta > 0) {
            memcpy(q, p, sizeof p);
            ans = now;
        } else if (exp(delta / T) <= (double) rd() / random_device::max()) swap(p[a], p[b]);
        T *= 0.99996;
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    // Test Point #1 #2
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) p[i] = i;
    shuffle(p + 1, p + 1 + n, mt19937(rd()));
    SA();
    clog << ans << endl;
// 打表格式化
#ifdef PRINT_TABLE
    cout << '{';
    for (int i = 1; i < n; i++) cout << q[i] << ", ";
    cout << q[n] << "},\n";
#else
    for (int i = 1; i <= n; i++) cout << q[i] << ' ';
#endif
    return 0;
}
```

一般来说一秒之内可以出答案。

## 测试点 3

测试点 3 的数据很有意思，它是一个单调递增的排列。模拟退火跑了很久，得出的排列有两头大、中间小的特征。于是大胆构造一个特解——从左至右奇数递减、从右至左偶数递减。

## 测试点 4-10

模拟退火调了半天参数就是过不去……同机房的大佬好像用加强版的模拟退火跑了几天才跑过？这里推荐一个叫“遗传算法”的解决方案。

---

遗传算法能通过模拟生物繁衍、自然选择等自然现象来实现求解全局最优解的功能。具体是让当前的优解进行变换，期望能得到一个更优的解。

```cpp
#include <bits/stdc++.h>
#define N 1010
#define PRINT_TABLE
#define LIMIT 141473199965824ll // 每个测试点的最大值

#pragma optimize(3)

using namespace std;

typedef long long ll;

int n;
ll ans = 0, submax = 0;
random_device rd;
ll a[N], p[N], q[N], id[N];

ll calc(const ll arr[] = p) {
    ll sum = arr[1] * a[arr[n]] * a[arr[1]] * a[arr[2]];
    for (int i = 2; i < n; i++) sum += arr[i] * a[arr[i - 1]] * a[arr[i]] * a[arr[i + 1]];
    sum += arr[n] * a[arr[n - 1]] * a[arr[n]] * a[arr[1]];
    return sum;
}

ll d(int pos1, int pos2) {
    // 处理交换前后的变化量
    ll sum = 0;
    sum -= p[pos1] * a[p[pos1 - 1]] * a[p[pos1]] * a[p[pos1 + 1]] + p[pos1 + 1] * a[p[pos1]] * a[p[pos1 + 1]] * a[p[pos1 + 2]] + p[pos1 - 1] * a[p[pos1 - 2]] * a[p[pos1 - 1]] * a[p[pos1]];
    sum -= p[pos2] * a[p[pos2 - 1]] * a[p[pos2]] * a[p[pos2 + 1]] + p[pos2 + 1] * a[p[pos2]] * a[p[pos2 + 1]] * a[p[pos2 + 2]] + p[pos2 - 1] * a[p[pos2 - 2]] * a[p[pos2 - 1]] * a[p[pos2]];
    swap(p[pos1], p[pos2]);
    sum += p[pos1] * a[p[pos1 - 1]] * a[p[pos1]] * a[p[pos1 + 1]] + p[pos1 + 1] * a[p[pos1]] * a[p[pos1 + 1]] * a[p[pos1 + 2]] + p[pos1 - 1] * a[p[pos1 - 2]] * a[p[pos1 - 1]] * a[p[pos1]];
    sum += p[pos2] * a[p[pos2 - 1]] * a[p[pos2]] * a[p[pos2 + 1]] + p[pos2 + 1] * a[p[pos2]] * a[p[pos2 + 1]] * a[p[pos2 + 2]] + p[pos2 - 1] * a[p[pos2 - 2]] * a[p[pos2 - 1]] * a[p[pos2]];
    return sum;
}

int rand(int l, int r) {
    return (int) (rd() % (r - l + 1)) + l;
}

void GA() {
    while (ans < LIMIT) {
        for (int i = 1; i <= 20; i++) {
            int a = rand(1, n), b = rand(1, n);
            swap(p[a], p[b]);
        }
        submax = calc(); // 当前值
        shuffle(id + 1, id + 1 + n, mt19937(rd())); // 每次打乱枚举顺序
        bool flag;
        do { // 还能变得更优就继续下去
            flag = false;
            #pragma unroll 20
            for (int i = 1; i < n; i++) {
                for (int j = i + 1; j <= n; j++) {
                    ll cur;
                    int pos1 = id[i], pos2 = id[j];
                    if (abs(pos2 - pos1) <= 5 || abs(pos2 - pos1) >= n - 5) {
                        swap(p[pos1], p[pos2]);
                        cur = calc();
                    } else {
                        cur = submax + d(pos1, pos2);
                    }
                    if (cur > ans) {
                        ans = submax = cur;
                        memcpy(q, p, sizeof p);
                        if (ans > (ll) (LIMIT * 0.999)) cerr << ans << endl;
                        flag = true;
                        if (ans >= LIMIT) return;
                    } else if (cur > submax) {
                        submax = cur;
                        flag = true;
                    } else swap(p[pos1], p[pos2]);
                }
            }
        } while (flag);
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    // Test Point #4 #5 #6 #7 #8 #9
    freopen("9.in", "r", stdin);
    freopen("9.out", "w", stdout);
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) p[i] = i, id[i] = i;
    GA();
    clog << "Final Answer: " << calc(q) << " Overloaded: " << calc(q) - LIMIT << endl;
#ifdef PRINT_TABLE
    cout << '{';
    for (int i = 1; i < n; i++) cout << q[i] << ", ";
    cout << q[n] << "}\n";
#else
    for (int i = 1; i <= n; i++) cout << q[i] << ' ';
#endif
    return 0;
}
```

跑得稍久一些，但是还是比较快的。

$\texttt{The End}$
