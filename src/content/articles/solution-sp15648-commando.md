---
slug: '90304'

category: 题解
published: 2024-07-25T17:01:36.362160+08:00
image: https://pic.imgdb.cn/item/6698f45fd9c307b7e9ab0dc1.jpg
tags:
- 题解
- oi
- 算法
- 动态规划
title: SP15648 [APIO10A] - Commando 题解
updated: 2024-07-25T18:56:43.596+08:00
---
![](https://pic.imgdb.cn/item/6698f45fd9c307b7e9ab0dc1.jpg)

~~小星野战力那么强一个人一组就够了ᕕ(◠ڼ◠)ᕗ~~

> [!DONE]
> 您已获得最佳的阅读体验！~~以及上面的小彩蛋……~~

我们会发现这道题和 [P5785 任务安排](https://www.luogu.com.cn/problem/P5785) 长得神似。两道题都是把一个连续的序列分成若干块（块数没有特殊限制）。这启发我们把状态设置为 `dp[i]`，含义是：“把前 $i$ 个士兵全部分好的最大修正战斗力”。

现在我们着手设计一个暴力 DP 程序，分析如下图：

![](https://cdn.luogu.com.cn/upload/image_hosting/h39de3d7.png)

因为 $[1,j]$ 部分已知，就是我们的 `dp[j]`；我们重点需要解决的就是 $[j+1,i]$ 部分的计算。

考虑到题面行动队战斗力的定义涉及到部分元素的和，因此预先维护整个序列的前缀和 $s$，于是 $s_k=\sum\limits_{i=1}^{k}s_i$。把待求区间分成一组，初始战斗力就是 $s_i-s_j$。本题还涉及到一个“修正战斗力”，且题目要求求解修正战斗力的最大值，不妨令 $X=s_i-s_j$，那么该组的修正战斗力就是 $aX^2+bX+c$。

暴力 DP 代码就可以写出来了，时间复杂度 $\mathcal O(n^2)$。预计 $\texttt{TLE}$，就不放了。

---

看到题面的 $n\leq10^6$，正解的时间复杂度很可能是 $\mathcal O(n)$ 或 $\mathcal O(n\log n)$ 的。暴力程序的性能瓶颈卡在变量 $j$ 的循环上，因此考虑优化 $j$ 的求解，此时就开始了本题的重头戏——**斜率优化/凸包优化**。

把需要最大化的算式拿出来分析，我们进行化简可以得到：

$$
\begin{aligned}
dp_i&=dp_j+aX^2+bX+c
\\&=dp_j+a(s_i-s_j)^2+b(s_i-s_j)+c
\\&=dp_j+as_i^2+as_j^2-2s_is_j+bs_i-bs_j+c
\\&=dp_j+as_i^2+bs_i+as_j^2-bs_j-2s_is_j+c
\end{aligned}
$$

进行斜率优化时，我们把 $j$ 看作主元，并且希望让斜率仅和 $i$ 有关。那我们移项可以得到：

$$
2as_is_j+dp_i-as_i^2-bs_i-c=dp_j+as_j^2-bs_j
$$

类比直线的斜截式方程 $y=kx+b$，发现这个式子可以用数形结合的方式做出来：斜率 $k=2as_i$，截距 $t=dp_i-as_i^2-bs_i-c$，纵坐标 $y=dp_j+as_j^2-bs_j$，横坐标 $x=s_j$。任务是最大化 `dp[i]` 的值，考虑到 $dp_i=t+as_i^2+bs_i+c$，所以只要构造的直线的截距最大，`dp[i]` 就是最大的。

对于特定斜率的直线，显然是靠上端的直线截距更大，如下图（若绘图有误烦请指出）：

![](https://cdn.luogu.com.cn/upload/image_hosting/y4yqdk0m.png)

对于不同斜率的点，截距最大的直线所过的点均在一个上凸包上（红线连出）：

![](https://cdn.luogu.com.cn/upload/image_hosting/e2yg5zac.png)

同时，当前直线所过的点是第一个斜率比当前直线斜率小的点。“最小值最大”，那不就是二分嘛！别急，这道题可以不用二分，有更简便的方法。

考虑到每次代入的点 $(s_j,dp_j+as_j^2-bs_j)$，因为每个士兵的战斗力均为正数，显然它的前缀和不可能出现下降趋势，是单调递增的。又知道 $i$ 是递增枚举的，所以每次构造的直线的斜率是单调递减的。因此考虑用单调队列维护这个合法点，具体操作如下：

1. 当队头点的斜率大于了当前直线的斜率，显然不会再被用到，直接弹出。形式化地，当 $\frac{y_{h+1}-y_{h}}{x_{h+1}-x_{h}}\geq2as_i$ 时弹队头。
2. 当队尾点的斜率小于将要加入的点 $i$ 的斜率，原先的队尾已经不满足上凸包“斜率单调递减”的要求了，故弹出。也就是说当 $\frac{y_{t-1}-y_t}{x_{t-1}-x_t}\leq\frac{y_t-y_i}{x_t-x_i}$ 时就弹出队尾。

至此，单调队列的队头就是我们所维护的 $j$。把 $j$ 代入状态转移方程里即可计算出答案了（注意超时的原因是暴力找 $j$，和状态转移方程本身没关系），由于涉及斜率的计算，要使用浮点数（或者你也可以就使用整型，斜率换成交叉相乘）。

**代码：**

```cpp
#include <bits/stdc++.h>

#define N 1000010
using namespace std;

typedef long long ll;

double dp[N];
double x[N], sumX[N];
double a, b, c;
int q[N];
int hh = 0, tt = 0;

double getY(int i) {
    // 获得纵坐标的值
    return dp[i] + a * sumX[i] * sumX[i] - b * sumX[i];
}

double slope(int x1, int x2) {
    // 获取两点斜率
    return (getY(x1) - getY(x2)) * 1.0 / (sumX[x1] - sumX[x2]) * 1.0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n, t;
    cin >> t;
    while (t--) {
        // 多测清空
        memset(dp, 0, sizeof dp);
        memset(x, 0, sizeof x);
        memset(sumX, 0, sizeof sumX);
        hh = 0, tt = 0; // 初始时队列里已有一个元素0

        cin >> n >> a >> b >> c;
        for (int i = 1; i <= n; i++) {
            cin >> x[i];
            sumX[i] = sumX[i - 1] + x[i];       // 预处理前缀和
        }
        q[0] = 0;
        for (int i = 1; i <= n; i++) {
            while (hh < tt && slope(q[hh + 1], q[hh]) >= 2 * a * sumX[i]) hh++; // 不满足单调性，弹出
            int j = q[hh]; // 维护的点
            double X = sumX[i] - sumX[j]; // 我们定义的X，用来简化计算
            dp[i] = dp[j] + a * X * X + b * X + c; // 代入状态转移方程
            while (hh < tt && slope(q[tt], q[tt - 1]) <= slope(i, q[tt])) tt--; // 不满足上凸包性质，弹出
            q[++tt] = i; // 插入新点
        }
        cout << (ll) dp[n] << endl; // 注意转型成整型
    }
    return 0;
}
```

$\texttt{The End}$
