---
slug: '852'

category: oi算法
published: 2024-07-23T10:25:45.281509+08:00
tags:
- oi
- 算法
- 动态规划
- 数学
- 计算几何
title: 动态规划的几种优化方式 Day2 斜率优化
updated: 2024-07-23T16:23:15.283+08:00
---
前情提要：[Day1 单调队列优化](https://justpureh2o.cn/articles/3424)

## 斜率优化

### 引 洛谷 P2365 任务安排

题目地址：[P2365](https://www.luogu.com.cn/problem/P2365)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

> $n$ 个任务排成一个序列在一台机器上等待完成（顺序不得改变），这 $n$ 个任务被分成若干批，每批包含相邻的若干任务。
>
> 从零时刻开始，这些任务被分批加工，第 $i$ 个任务单独完成所需的时间为 $t_i$。在每批任务开始前，机器需要启动时间 $s$，而完成这批任务所需的时间是各个任务需要时间的总和（同一批任务将在同一时刻完成）。
>
> 每个任务的费用是它的完成时刻乘以一个费用系数 $f_i$。请确定一个分组方案，使得总费用最小。
>
> **输入格式：**
>
> 第一行一个正整数 $n$。
> 第二行是一个整数 $s$。
>
> 下面 $n$ 行每行有一对数，分别为 $t_i$ 和 $f_i$，表示第 $i$ 个任务单独完成所需的时间是 $t_i$ 及其费用系数 $f_i$。
>
> **输出格式：**
>
> 一个数，最小的总费用。
>
> **数据范围：**
>
> 对于 ${100\%}$ 的数据，${1\le n \le 5000}$，${0 \le s \le 50}$，${1\le t_i,f_i \le 100}$。

![](https://cdn.luogu.com.cn/upload/image_hosting/h4y6kpi9.png)

按照样例最优解给出的图示如上。

根据题目，我们的总花费应是每一组所包含线段的 $f_i$ 之和乘上该组的结束时刻（终点在数轴上的横坐标）并求每一组的和。即 $C=\sum\limits_{i=1}^{m}(t_i\cdot\sum f_i)=5\times(3+2)+10\times3+14\times(3+4)=153$。

我们可以发现，最终结果受分组情况的影响。在每一组的开头，均有一段机器的启动时间，它可能会对后期某一组的结束时刻造成影响。有一个技巧，即提前把启动段造成的影响计算出来，而这很明显会牵扯到前缀和的计算。例如下边这个更为普遍的图：

![](https://cdn.luogu.com.cn/upload/image_hosting/x6jhuf2a.png)

假设 `dp[i]` 代表将前 $i$ 个单任务全部分组完毕后的最小花费。在某一时刻，我们已经将前 $i$ 个任务分成了 $[1,j],[j+1,i]$ 两个待处理的区间，并且准备把剩下的 $[j+1,i]$ 区间划分为一组。分组就涉及到每组起始时的启动时间 $s$。对于已经处理好的 $[1,j]$ 区间，我们有 `dp[j]` 可以直接拿来调用；对于剩下的待处理区间，我们的总花费是 $\sum\limits_{k=1}^{i}t_k\times\sum\limits_{k=j+1}^{i}f_k+s\times\sum\limits_{k=j+1}^{N}f_k$。其中 $s$ 项的另一个乘数就代表在此处分组，启动时间 $s$ 对后边所有的花费带来的影响。因为公式里出现了部分和，因此预处理 $f,t$ 的前缀和。

注意到 $i\in[1,N]$，且 $j\in[1,i]$，因此算法是 $\mathcal O(n^2)$ 的。因为数据较小，此方法可以通过，状态转移方程 `dp[i] = min(dp[i], dp[j] + sumT[i] * (sumF[i] - sumF[j]) + s * (sumF[n] - sumF[j]))`。

### AcWing 301 任务安排2

题目地址：[AcWing 301](https://www.acwing.com/problem/content/303/)

题目难度：<span class="label label-warning round">中等</span>

题面相同，本题数据范围扩大到： ${1≤N≤3×10^5}$，${1\leq T_i,C_i\leq512}$，${0\leq S\leq512}$

状态转移方程与上一题完全相同，我们在这里探讨它的优化方式。

我们的目的是把求解状态的时间复杂度降落到 $\mathcal O(n\log n)$ 及以下，首先就需要压缩维度。先从 $j$ 的循环开始——观察到方程中涉及到 $j$ 的项有两个：`dp[j]` 和 `sumF[j]`。我们将 $j$ 拆出来，便于简化。得到：

$$
dp_j=(T_i+s)F_j+dp_i-F_iT_i-sF_N
\\\text{Definitions: }T_k=\sum\limits_{i=1}^{k}t_i,F_k=\sum\limits_{i=1}^{k}f_i
$$

$N$ 由题目给定，每次循环的 $i$ 均有一个固定值，因此有关 $i,N$ 的项为定值。例如 $T_i+s$、$F_iT_i+sF_N$。我们成功地把整个算式改造成了更为清爽的形式。联想到直线的斜截式方程：$y=kx+b$ 把转移方程看作这样一个方程，那么斜率 $k=T_i+s$，截距 $b=dp_i-F_iT_i-sF_N$。

我们需要最小化 $dp_i$，显然需要让 $b$ 最小，因为 $dp_i=b+F_iT_i+sF_N$。因为直线 $y_i=kx_i+b$ 过点 $(x_0,y_0)$，$(x_1,y_1)$……相应地，点 $(F_0,dp_0),(F_1,dp_1)$ 等也在这条直线上，问题再度简化为：“对于每次变化的斜率，找出一个点，使得当前直线截距最小”。

![](https://cdn.luogu.com.cn/upload/image_hosting/c1flgw2p.png)

可以发现，无论直线的斜率再怎么变动，能让截距取得最值的那个点从始至终都是下边的那几个。事实上，对于斜率为 $k$ 的直线，让它取得最值的点都是第一个斜率比 $k$ 大的点。剩下的点就完全是鸡肋了。

二维凸包是指内角均在 $(0,\pi)$ 范围内的凸多边形，相当于用一个橡皮筋围住一些固定的大头针，橡皮筋围出来的图形就是一个凸包。因为橡皮筋总是自发地向周长减小的方向去收缩，因而凸包在周长上具有优势。在上图中，红色线连出来的就是一个凸包的下边界。从左至右，每两个点连线的斜率是单调递增的，且直线倾斜角小于 ${90\degree}$。这启发我们把下边界上的每个点的斜率统计出来，然后组成一个斜率单调递增的点序列，对于每条直线，在序列中找到第一个斜率大于当前直线斜率的点即可，从而想到使用 `upper_bound` 或者是二分解决。

在本题中，有一些奇妙的性质。这些性质允许我们不使用二分，而是直接 $\mathcal O(1)$ 查询合法解：

1. $t_i,f_i$ 均为正整数，对于它们的前缀和显然也如此。循环 $i$ 时，$k=T_i+s$ 是单调递增的。
2. 每次新加入一个点 $(F_i,dp_i)$ 时，由于如上的单调性，点的横坐标是单调递增的。

因此我们在查询时，把队头斜率小于当前斜率的点弹出；插入时把队尾不在凸包上的点删去，其实就是让新读取的点代替原先的点。定量来说，就是：当 $\frac{dp_2-dp_1}{F_2-F_1}\leq T_i+s$ 时弹出点 ${1}$；当 $\frac{dp_{tt}-dp_{tt-1}}{F_{tt}-F_{tt-1}}\geq\frac{dp_i-dp_{tt}}{F_i-F_{tt}}$ 时弹出队尾点（代码中常用交叉相乘避免除法精度问题，但需要开 `long long`）。循环时只需要把 $j$ 设置成符合要求的凸包上的点就行了。以上其实也是 $\texttt{Graham}$ 扫描法维护凸包的核心思想。因为涉及到队列中非首尾元素的访问，故使用数组模拟。

```cpp
#include <bits/stdc++.h>
#define N 300010
using namespace std;

typedef long long ll;

ll dp[N];
ll f[N], t[N];
int q[N];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n, s;
    cin >> n >> s;
    for (int i = 1; i <= n; i++) {
        cin >> t[i] >> f[i];
        f[i] += f[i - 1];
        t[i] += t[i - 1];
    }
    int hh = 0, tt = 0;
    q[0] = 0;
    for (int i = 1; i <= n; i++) {
        while (hh < tt && (dp[q[hh + 1]] - dp[q[hh]]) <= (t[i] + s) * (f[q[hh + 1]] - f[q[hh]])) hh++;
        int j = q[hh];
        dp[i] = dp[j] - (t[i] + s) * f[j] + f[i] * t[i] + s * f[n];
        while (hh < tt && (dp[q[tt]] - dp[q[tt - 1]]) * (f[i] - f[q[tt]]) >= (dp[i] - dp[q[tt]]) * (f[q[tt]] - f[q[tt - 1]])) tt--;
        q[++tt] = i;
    }
    cout << dp[n] << endl;
    return 0;
}
```

### 洛谷 P5785 [SDOI2012] 任务安排/AcWing 302 任务安排3

题目地址：[P5785](https://www.luogu.com.cn/problem/P5785)/[AcWing 302](https://www.acwing.com/problem/content/304/)

题目难度：<span data-luogu data-purple>省选/NOI-</span>/<span class="label label-danger round">困难</span>

题目来源：<span data-luogu data-region>山东</span>&nbsp;&nbsp;<span data-luogu data-date>2012</span>&nbsp;&nbsp;<span data-luogu data-source>各省省选</span>

题面相同，数据范围中 $t_i$ 可能为负数。

$t_i$ 为负数，代表它的前缀和，或者更进一步—— $T_i+s$ 不再单调递增。此时使用单调队列维护凸包的思路就不再正确。但是考虑到我们要求大于当前斜率且斜率相对最小的点（最大的最小），考虑二分。

需要注意的是，尽管待求直线的斜率 $T_i+s$ 失去了单调性，但是凸包的基本性质并没改变，下凸包相邻两点构成的斜率还是单调递增的。因此继续用队列维护凸包，这时只需维护点是否在凸包上，即不满足要求时弹出队尾。对于每次 $T_i+s$ 的输入，都二分出一个斜率大于它且最接近它的凸包点，把 $j$ 赋值过去就完成了（把 `int j = q[hh]` 替换成二分查找）。

由于本题数据较大，在交叉相乘时可能会爆，因此推荐使用 `double` 或 `__int128`。

```cpp
#include <bits/stdc++.h>
#define N 300010
using namespace std;

typedef long long ll;

ll dp[N];
ll f[N], t[N];
int tt = 0;
int q[N];

int upperbound(ll piv) {
    int L = 0, R = tt;
    while (L < R) {
        int mid = (L + R) >> 1;
        if ((__int128) (dp[q[mid + 1]] - dp[q[mid]]) > (__int128) (f[q[mid + 1]] - f[q[mid]]) * piv) R = mid;
        else L = mid + 1;
    }
    return q[L];
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n, s;
    cin >> n >> s;
    for (int i = 1; i <= n; i++) {
        cin >> t[i] >> f[i];
        t[i] += t[i - 1];
        f[i] += f[i - 1];
    }
    q[0] = 0;
    for (int i = 1; i <= n; i++) {
        int j = upperbound(t[i] + s);
        dp[i] = dp[j] - (t[i] + s) * f[j] + f[i] * t[i] + s * f[n];
        while (tt && (__int128) (dp[q[tt]] - dp[q[tt - 1]]) * (f[i] - f[q[tt]]) >= (__int128) (dp[i] - dp[q[tt]]) * (f[q[tt]] - f[q[tt - 1]])) tt--;
        q[++tt] = i;
    }
    cout << dp[n] << endl;
    return 0;
}
```

### CF 311B Cats Transport

题目地址：[CF 311B](https://www.luogu.com.cn/problem/CF311B)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

> Zxr960115 是一个大农场主。
>
> 他养了 $m$ 只可爱的猫子,雇佣了 $p$ 个铲屎官。这里有一条又直又长的道路穿过了农场，有 $n$ 个山丘坐落在道路周围，编号自左往右从 $1$ 到 $n$。山丘 $i$ 与山丘 $i-1$ 的距离是 $D_i$ 米。铲屎官们住在 $1$ 号山丘。
>
> 一天，猫子们外出玩耍。猫子 $i$ 去山丘 $H_i$ 游玩，在 $T_i$ 时间结束他的游玩，然后在山丘 $H_i$ 傻等铲屎官。铲屎官们必须把所有的猫子带上。每个铲屎官直接从 $H_1$ 走到 $H_n$，中间不停下，可以认为不花费时间的把游玩结束的猫子带上。每个铲屎官的速度为一米每单位时间，并且足够强壮来带上任意数量的猫子。
>
> 举个栗子，假装我们有两个山丘( $D_2=1$ )，有一只猫子，他想去山丘 $2$ 玩到时间 $3$。然后铲屎官如果在时间 $2$ 或者时间 $3$ 从 $1$ 号山丘出发，他就能抱走猫子。如果他在时间 $1$ 出发那么就不行(猫子还在玩耍)。如果铲屎官在时间 $2$ 出发，猫子就不用等他（$\Delta T=0$）。如果他在时间 $3$ 出发，猫子就要等他 $1$ 个单位时间。
>
> 你的任务是安排每个铲屎官出发的时间(可以从 0 时刻之前出发），最小化猫子们等待的时间之和。
>
> 对于全部的数据，满足 ${2\le n\le10^5}$，${1\le m\le10^5}$，${1\le p\le100}$，${1\le D_i<10^4}$，${1\le H_i\le n}$，${0\le t\le10^9}$。
>
> **输入格式：**
>
> 输入的第一行是三个整数 $n,m,p$。
>
> 第二行有 $n-1$ 个整数，分别是 $d_2,d_3,\dots,d_n$。
>
> 接下来 $m$ 行，每行两个整数 $h_i,t_i$。
>
> **输出格式：**
>
> 一行一个整数，为最小化的等待时间之和。
>
> 在本题中，请务必使用 cin/cout 或者 %I64d 通配符来读入64位整数。

![](https://cdn.luogu.com.cn/upload/image_hosting/ma3efkam.png)

读题就能发现，我们的饲养员的行走时间和 $d$ 的前缀和有关，因此预处理出来，重定义 $D_k=\sum\limits_{i=1}^{k}d_i$。根据题意我们知道，当饲养员的出发时间早于或等于 $D_i-t_i$ 时，都等价于 $\Delta T=0$（刚好接到，毕竟干等着猫玩完的那一刻再接回去也是一样的），可以看作是饲养员出发时间的下限。更普遍地，假设 $i$ 饲养员出发的时间为 $s_i$，就有 $s_i+D_i=t_i+\Delta T\rightarrow\Delta T=\max(t_i-s_i-D_i,0)$。

接下来的转换非常巧妙：定义 $a_i=D_i-t_i$，即最早出发时间。按照 $a_i$ 升序排序获得一个新的序列，我们试着把排序后的山分组，使得总等待时间最小。看上去就有点《任务安排》三部曲的意思了。

假如我们的饲养员想要一次性接完排序 ${4\sim6}$ 的小猫，他的最早出发时间就是 $\max(a_4,a_5,a_6)=a_6$，${4\sim6}$ 号总的等待时间就是 $a_6-a_4+a_6-a_5+a_6-a_6=3a_6-(A_6-A_3)$（$A_k=\sum\limits_{i=1}^{k}a_i$）。普遍规律就是：

$$
X_{n\sim m}=(m-n+1)a_m-(A_m-A_{n-1})
$$

这道题还有一个硬性要求——饲养员的个数不超过 $p$，因此开两维动态规划数组 `dp[i][j]` 表示使用了 $j$ 名饲养员去接前 $i$ 只小猫的最小等待时长总和。在 $[1,i]$ 范围内，用中间变量 $k$ 分隔开：对于 $[1,k]$，它的最小值就是 `dp[k][j - 1]`，那么我们派出第 $j$ 名饲养员去接小猫 $k+1\sim i$，造成的花费是 $(i-k)a_{i}-(A_i-A_k)$。至此这道题完全转化为了《任务安排》三部曲。状态转移方程为：`dp[i][j] = min(dp[i][j], dp[k][j - 1] + (i - k) * a[i] - (sumA[i] - sumA[k]))`

同样的思路，我们把方程化简成 $y=kx+b$ 的形式。原则是把斜率设置成不变量，因此得到：

$$
dp_{k,j-1}+A_k=a_ik+dp_{i,j}+A_i-ia_i
$$

斜率是 $a_i$，注意到当前 $a_i$ 是单调递增的，因此沿用单调队列来维护整个凸包。

```cpp
#include <bits/stdc++.h>

#define N 200010
#define P 110
using namespace std;

typedef long long ll;

int q[N];
ll dp[N][P], a[N];
ll sumD[N], sumA[N];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n, m, p;
    cin >> n >> m >> p;
    for (int i = 2; i <= n; i++) {
        cin >> sumD[i];
        sumD[i] += sumD[i - 1];
    }
    for (int i = 1; i <= m; i++) {
        int h, t;
        cin >> h >> t;
        a[i] = t - sumD[h];
    }
    sort(a + 1, a + 1 + m);
    for (int i = 1; i <= m; i++) sumA[i] = sumA[i - 1] + a[i];

    memset(dp, 0x3f, sizeof dp);
    for (int i = 0; i <= p; i++) dp[0][i] = 0;

    for (int j = 1; j <= p; j++) {
        int hh = 0, tt = 0;
        q[0] = 0;
        for (int i = 1; i <= m; i++) {
            while (hh < tt && dp[q[hh + 1]][j - 1] + sumA[q[hh + 1]] - dp[q[hh]][j - 1] - sumA[q[hh]] <= a[i] * (q[hh + 1] - q[hh])) hh++;
            dp[i][j] = dp[q[hh]][j - 1] + i * a[i] - q[hh] * a[i] - sumA[i] + sumA[q[hh]];
            while (hh < tt && (dp[q[tt]][j - 1] + sumA[q[tt]] - dp[q[tt - 1]][j - 1] - sumA[q[tt - 1]]) * (i - q[tt]) >= (dp[i][j - 1] + sumA[i] - dp[q[tt]][j - 1] - sumA[q[tt]]) * (q[tt] - q[tt - 1])) tt--;
            q[++tt] = i;
        }
    }
    cout << dp[m][p] << endl;
    return 0;
}
```
