---
slug: '2011'

category: 题解
published: 2024-10-09T20:27:23.489384+08:00
image: https://pic.imgdb.cn/item/661fb4640ea9cb1403c5d0df.jpg
tags:
- oi
- 算法
- 线性代数
title: P2011 - 计算电压 题解
updated: 2024-10-09T21:05:24.383+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[P2011](https://www.luogu.com.cn/problem/P2011)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

> 现给定一个电阻网络，已知其中每条边上的电阻，和若干个点和负极之间的电压（电源电压不变） ，现在求任意两点之间的电压。
>
> 对于 $100\%$ 的数据，${1\le k\le n\le 200}$，${1\le m\le 2\times 10^5}$，${1\le r_i,u_i\le 10^4}$，${1\le q\le 10^6}$。

要解决这道题，我们首先要明白一个定理，即 $\texttt{Kirchhoff}$ 电流定律（$\texttt{KCL}$，或称 $\texttt{Kirchhoff} $ 第一定律）。定理内容如下：

> [!QUOTE]
> 电路中任意一个节点上，在任何时刻，流入这个节点的电流之和等于流出这个节点的电流之和。

于是我们把每一个接线柱分开来看。假如当前在讨论接线柱 $M$，假设电流从若干接线柱流出并流入 $M$，那么记 $A$ 为这些接线柱的集合；相应地，如果电流从 $M$ 流出，并流入另一些接线柱，那么记这些接线柱的集合为 $B$。此时根据欧姆定律有如下关系：

$$
\sum\limits_{i\in A}\frac{U_i}{R_i}=\sum\limits_{j\in B}\frac{U_j}{R_j}
$$

发现此时又要求每个电阻丝的电压，非常的麻烦。根据高中知识可得，导体两端的电压其实就等于它两端的电势之差，假如电阻丝 $T$ 左右分别连接着接线柱 $a,b$，那么 $U_T=|\varphi_a-\varphi_b|$。上式转化为：

$$
\begin{aligned}
\sum\limits_{i\in A}\frac{|\varphi_i-\varphi_M|}{R_i}&=\sum\limits_{j\in B}\frac{|\varphi_M-\varphi_j|}{R_j}
\\\sum\limits_{i\in A}\frac{|\varphi_i-\varphi_M|}{R_i}+\sum\limits_{j\in B}\frac{|\varphi_j-\varphi_M|}{R_j}&=0
\\\sum\limits_{i\in A\cup B}\frac{|\varphi_i-\varphi_M|}{R_i}&=0
\\\sum\limits_{i\in A\cup B}\frac{\varphi_i}{R_i}-\varphi_M\sum\limits_{i\in A\cup B}\frac{1}{R_i}&=0
\\\frac{\varphi_1}{R_1}+\frac{\varphi_2}{R_2}+\dots-\varphi_M\sum\limits_{i\in A\cup B}\frac{1}{R_i}+\dots+\frac{\varphi_n}{R_n}&=0
\end{aligned}
$$

发现最后的这个方程式可以使用高斯消元来解决，在系数矩阵中分别填入 $\frac{1}{R_1},\frac{1}{R_2},\dots,\frac{1}{R_k}$，作为系数。此时需要注意，第 $M$ 项的系数应是 $-\sum\limits_{i\in A\cup B}\frac{1}{R_i}$。对于题目中已经给定的值，即直接与正极相连的接线柱只需要列出形如 $\varphi_k=a_k$ 的方程即可。不难发现方程组有 $n$ 条方程，$n$ 个未知数，是一定有解的。题目的询问就可以转化成求两接线柱之间的电势差了。

```cpp
#include <bits/stdc++.h>

#define N 210
using namespace std;

typedef pair<int, double> PID;

const double EPS = 1e-12;

vector<PID> G[N];

double matrix[N][N];
double voltage[N];
double start[N];

int gauss(int n) {
    int rank = 0;
    for (int c = 0, r = 0; c <= n; c++) {
        int t = r;
        for (int i = r; i <= n; i++) {
            if (abs(matrix[i][c]) > abs(matrix[t][c])) t = i;
        }
        if (abs(matrix[t][c]) < EPS) continue;
        if (t ^ r) swap(matrix[t], matrix[r]);
        for (int i = n + 1; i >= c; i--) matrix[r][i] /= matrix[r][c];
        for (int i = 0; i <= n; i++) {
            if (abs(matrix[i][c]) > EPS && i ^ r) {
                for (int j = n + 1; j >= c; j--) {
                    matrix[i][j] -= matrix[i][c] * matrix[r][j];
                }
            }
        }
        r++;
        rank++;
    }
    for (int i = 0; i <= n; i++) voltage[i] = matrix[i][n + 1];
    return 2;
}

void out(int n) {
    cerr << "------------------" << endl;
    for (int i = 0; i <= n; i++) {
        for (int j = 0; j <= n + 1; j++) {
            cerr << fixed << setprecision(2) << setw(10) << matrix[i][j];
        }
        cerr << endl;
    }
    cerr << "------------------" << endl;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n, m, k, q;
    cin >> n >> m >> k >> q;
    while (k--) {
        int u;
        cin >> u >> start[u];
    }
    while (m--) {
        int u, v;
        double w;
        cin >> u >> v >> w;
        G[u].emplace_back(v, w);
        G[v].emplace_back(u, w);
    }
    matrix[0][0] = 1.0;
    for (int i = 1; i <= n; i++) {
        double sum = 0.0;
        if (abs(start[i]) > EPS) {
            matrix[i][i] = 1.0;
            matrix[i][n + 1] = start[i];
            continue;
        }
        for (auto p: G[i]) {
            int u = p.first;
            matrix[i][u] += 1.0 / p.second;
            sum += 1.0 / p.second;
        }
        matrix[i][i] = -sum;
    }
    gauss(n);
    while (q--) {
        int u, v;
        cin >> u >> v;
        cout << fixed << setprecision(2) << voltage[u] - voltage[v] << endl;
    }
    return 0;
}
```

~~说句闲话：第一学月物理考试彻底炸了……诺贝尔物理学奖颁给了机器学习……我在这里写信息学物理题题解……~~

$\texttt{The End}$
