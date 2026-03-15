---
slug: '57241'

category: oi算法
published: 2024-06-19T20:02:07.457347+08:00
tags:
- oi
- 算法
- 分数规划
title: 分数规划算法
updated: 2024-06-26T14:50:08.387+08:00
---
## 前言

在写 [SPFA 判负环](https://justpureh2o.cn/articles/18405/) 的时候发现很多题目需要联系到高贵的0/1分数规划，但是截至当时我还没有学这样优雅的算法，故先将 $\texttt{SPFA}$ 咕一咕，把关于分数规划的东西弄清楚再回去填坑。正好刚考完高一下的合格考，觉得正是适合学新东西的时候，在此归纳一些简单的分数规划知识……~~这都什么跟什么啊~~

分数规划基本模型如下：

> 给出有 $n$ 个元素的两个数列 $a_i$ 和 $b_i$，求对整数 $w\in\{0,1\}$，使得下式最大化：
>
> $$
> \frac{\sum\limits_{i=1}^{n}a_i\cdot w}{\sum\limits_{i=1}^{n}b_i\cdot w}
> $$

通俗一点地说，给出 $n$ 件商品。每件商品都有一个价格 $b_i$ 和价值 $a_i$ ，你需要做的就是求出买哪些商品能够让所有物品总的性价比最高——即最优购买问题。

> 一般分数规划问题还会有一些奇怪的限制，比如『分母至少为 $W$』。
>
> *——OI WIKI*

## 分数规划求解

我们假设当前有一个值 $A$，假定当前的 $A$ 并非最优解，那么一定会有如下特殊情况：

$$
\begin{aligned}
\frac{\sum a_i\cdot w}{\sum b_i\cdot w}&>A
\\\sum a_i\cdot w&>A\sum b_i\cdot w
\\\sum(a_i-A\cdot b_i)x_i&>0
\end{aligned}
$$

也就是说存在组合使最后一个不等式成立时，$A$ 就不是最大值，也就是比答案小；反之，将大于号反向，$A$ 就比答案大。我们就可以二分 $A$ 值，不断检测上面的不等式情况，收缩二分区间。

代码：

```cpp
const double EPS = 1e-6;

bool check(double d) {
    double res = 0;
    for (int i = 1; i <= n; i++) {
        if (a[i] - d * b[i] > 0) res += a[i] - d * b[i];
    }
    return res >= 0;
}

int main() {
    cin >> n >> k;
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) cin >> b[i];

    double L = 0, R = INFINITY;
    while (R - L > EPS) {
        double mid = (L + R) / 2;
        if (check(mid)) L = mid;
        else R = mid;
    }
    cout << L << endl;
    return 0;
}
```

很多时候分数规划的题目都会直接间接地把物品的权值变为 $a_i-d\cdot b_i$，因此二分 $d$ 即可求解。

## 分数规划例题

### 洛谷 P10505 Dropping Test

题目地址：[P10505](https://www.luogu.com.cn/problem/P10505)

题目难度：<span data-luogu data-yellow>普及/提高-</span>

> 在某个课程中，你需要进行 $n$ 次测试。
>
> 如果你在共计 $b_i$ 道题的测试 $i$ 上的答对题目数量为 $a_i$，你的累积平均成绩就被定义为
>
> ![](https://cdn.luogu.com.cn/upload/image_hosting/3q2c5dwy.png)
>
> 给定您的考试成绩和一个正整数 $k$，如果您被允许放弃任何 $k$ 门考试成绩，您的累积平均成绩的可能最大值是多少。
>
> 假设您进行了 $3$ 次测试，成绩分别为 $5/5,0/1$ 和 $2/6$。
>
> 在不放弃任何测试成绩的情况下，您的累积平均成绩是 ![](https://cdn.luogu.com.cn/upload/image_hosting/lnyw6eca.png)。
>
> 然而，如果你放弃第三门成绩，则您的累积平均成绩就变成了 ![](https://cdn.luogu.com.cn/upload/image_hosting/9cjpknhr.png)。
>
> **输入格式：**
>
> 输入包含多组测试用例，每个测试用例包含三行。
>
> 对于每组测试用例，第一行包含两个整数 $n$ 和 $k$。
>
> 第二行包含 $n$ 个整数，表示所有的 $a_i$。
>
> 第三行包含 $n$ 个整数，表示所有的 $b_i$。
>
> 当输入用例 $n=k=0$ 时，表示输入终止，且该用例无需处理。
>
> **输出格式：**
>
> 对于每个测试用例，输出一行结果，表示在放弃 $k$ 门成绩的情况下，可能的累积平均成绩最大值。
>
> 结果应四舍五入到最接近的整数。
>
> **数据范围：**
>
> 数据范围 $1 \le n \le 1000$, $0 \le k < n$, $0 \le a_i \le b_i \le 10^9$。

这道题结合了分数规划和贪心。我们的目标是让 $\sum a_i-A\sum b_i\geq0$ 的 $A$ 值最大。先预处理所有的 $a_i-d\cdot b_i$，并对它排序，每次取最大的 $n-k$ 个累加。判断得到的结果是否大于等于 ${0}$ 即可。

```cpp
#include <bits/stdc++.h>
#define N 1010
using namespace std;

double a[N], b[N];
double arr[N];
const double EPS = 1e-6;
int n, k;

bool check(double d) {
    double res = 0;
    for (int i = 1; i <= n; i++) arr[i] = a[i] - d * b[i];
    sort(arr + 1, arr + 1 + n);
    for (int i = n; i > k; i--) {
        res += arr[i];
    }
    return res >= 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    while (cin >> n >> k, n || k) {
        for (int i = 1; i <= n; i++) cin >> a[i];
        for (int i = 1; i <= n; i++) cin >> b[i];
        double L = 0, R = 1;
        while (R - L > EPS) {
            double mid = (L + R) / 2;
            if (check(mid)) L = mid;
            else R = mid;
        }
        cout << round(100 * L) << endl;
    }
    return 0;
}
```

由于涉及到浮点数二分，我们需要定义一个浮点数精确度来近似处理，一般来说不会大于 $10^{-5}$。

### 洛谷 P4377 [USACO18OPEN] Talent Show G

题目地址：[P4377](https://www.luogu.com.cn/problem/P4377)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

题目来源：<span data-luogu data-source>USACO</span>&nbsp;&nbsp;<span data-luogu data-date>2018</span>

> Farmer John 要带着他的 $n$ 头奶牛，方便起见编号为 ${1\ldots n}$，到农业展览会上去，参加每年的达牛秀！他的第 $i$ 头奶牛重量为 $w_i$，才艺水平为 $t_i$，两者都是整数。
>
> 在到达时，Farmer John 就被今年达牛秀的新规则吓到了：
>
> （一）参加比赛的一组奶牛必须总重量至少为 $W$（这是为了确保是强大的队伍在比赛，而不仅是强大的某头奶牛），并且。
>
> （二）总才艺值与总重量的比值最大的一组获得胜利。
>
> FJ 注意到他的所有奶牛的总重量不小于 $W$，所以他能够派出符合规则（一）的队伍。帮助他确定这样的队伍中能够达到的最佳的才艺与重量的比值。
>
> **输入格式：**
>
> 第一行是两个整数，分别表示牛的个数 $n$ 和总重量限制 $W$。
>
> 第 $2$ 到 $(n+1)$ 行，每行两个整数，第 $(i + 1)$ 行的整数表示第 $i$ 头奶牛的重量 $w_i$ 和才艺水平 $t_i$。
>
> **输出格式：**
>
> 请求出 Farmer 用一组总重量最少为 $W$ 的奶牛最大可能达到的总才艺值与总重量的比值。
>
> 如果你的答案是 $A$，输出 ${1000A}$ 向下取整的值，以使得输出是整数（当问题中的数不是一个整数的时候，向下取整操作在向下舍入到整数的时候去除所有小数部分）。
>
> 请注意当问题的答案恰好是整数 $x$ 时，你的程序可能会由于**浮点数精度误差**问题最后得到一个 $x-\epsilon$ 的答案，向下取整后变为 $x-1$ 导致答案错误。这种情况下你可以在输出答案前给答案加上一个极小的值 $x\gets x+10^{-k}$ 来避免该问题。
>
> **数据范围：**
>
> 对于全部的测试点，保证 ${1 \leq n \leq 250}$，${1 \leq W \leq 1000}$，${1 \leq w_i \leq 10^6}$，${1 \leq t_i \leq 10^3}$。

这道题结合了01背包和01分数规划。这里的 $W$ 限制提醒我们需要用背包解决，根据分数规划的二分判别式 $\sum(a_i-d\cdot b_i)x_i\geq0$，我们把每头牛的价值重新赋为 $t_i-d\cdot w_i$，$d$ 在每次二分过程中都会改变。对于当前二分到的每个值，都做一次01背包。`dp[i]` 的含义是“总重量为 $i$ 的牛的最大规划价值（判别式的最大值）”，对于每头牛，就有两种情况：

1. 选择这头牛：数据更新为“不选这头牛的最大价值加上当前牛的价值”，即 $dp_j+w_i$。
2. 不选这头牛：数据不更新，即 $dp_{j+w_i}$。
3. 若 $j+w_i\geq W$，直接结算到总重量为 $W$ 的情况。

也就是说每次二分得到一个中值，然后对每个中值跑背包算法即可。为了避免一些奇奇妙妙的浮点数误差，输入时统一将才艺水平乘 ${1000}$，对应下来二分的上下界也要乘 ${1000}$。

```cpp
#include <bits/stdc++.h>
#define N 300
#define M 1010

using namespace std;
typedef long long ll;

struct Cow {
	int talent, weight;
	ll w;
} cow[N];
int n, W;
ll dp[M];

bool check(ll d) {
	for (int i = 1; i <= n; i++) {
		cow[i].w = cow[i].talent - d * cow[i].weight;
	}
	dp[0] = 0;
	for (int i = 1; i <= W; i++) {
		dp[i] = -1e10;
	}
	for (int i = 1; i <= n; i++) {
		for (int j = W; j >= 0; j--) {
			dp[min(W, j + cow[i].weight)] = max(dp[min(W, j + cow[i].weight)], dp[j] + cow[i].w);
		}
	}
	return dp[W] >= 0;
}

int main() {
	ios::sync_with_stdio(false);
	cin.tie(nullptr);
	cout.tie(nullptr);

	cin >> n >> W;
	ll sum = 0;
	for (int i = 1; i <= n; i++) {
		int w, t;
		cin >> w >> t;
		sum += t * 1000;
		cow[i].talent = t * 1000;
		cow[i].weight = w;
	}
	ll L = 0, R = sum;
	while (R >= L) {
		ll mid = (L + R) >> 1;
		if (check(mid)) L = mid + 1;
		else R = mid - 1;
	}
	cout << L - 1 << endl;
	return 0;
}
```

当然还有一种 $\mathcal O(nm)$ 的做法，由 <span><a href="https://www.luogu.com.cn/user/501947"><img src="https://cdn.luogu.com.cn/upload/usericon/501947.png?x-oss-process=image/resize,lift_m,w_25/quality,q_50/circle,r_25"></a></span> **DengDuck** 提出。其中提到了“糖水不等式”：

> 我们都知道，向水中放糖会让水变甜。如果放糖前水的总体积为 $b$，溶质（糖）的体积为 $a$，放入糖的体积为 $c$。根据生活经验有 $\frac{a}{b}<\frac{a+c}{b+c}$，即糖水变甜。推论：$\max(\frac{a}{b},\frac{c}{d})\geq\frac{a+c}{b+d}$。

[博客地址](https://www.luogu.com.cn/article/oj9itzmz)

### 洛谷 P3199 [HNOI2009] 最小圈

题目地址：[P3199](https://www.luogu.com.cn/problem/P3199)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

题目来源：<span data-luogu data-source>各省省选</span>&nbsp;&nbsp;<span data-luogu data-region>湖南</span>&nbsp;&nbsp;<span data-luogu data-date>2009</span>

> 考虑带权有向图 $G=(V,E)$ 以及 $w:E\rightarrow \R$，每条边 $e=(i,j)$（$i\neq j$，$i, j\in V$）的权值定义为 $w_{i,j}$。设 $n=|V|$。
>
> $c=(c_1,c_2,\cdots,c_k)$（$c_i\in V$）是 $G$ 中的一个圈当且仅当 $(c_i,c_{i+1})$（$1\le i<k$）和 $(c_k,c_1)$ 都在 $E$ 中。称 $k$ 为圈 $c$ 的长度，同时记 $c_{k+1}=c_1$，并定义圈 $c=(c_1,c_2,\cdots,c_k)$ 的平均值为
>
> $$
> \mu(c)= \frac 1 k \sum\limits_{i=1}^{k} w_{c_i,c_{i+1}}
> $$
>
> 即 $c$ 上所有边的权值的平均值。设 $\mu'(G)=\min_c\mu(c)$ 为 $G$ 中所有圈 $c$ 的平均值的最小值。
>
> 给定图 $G=(V,E)$ 以及 $w:E\rightarrow \R$，求出 $G$ 中所有圈 $c$ 的平均值的最小值 $\mu'(G)$。
>
> **输入格式：**
>
> 第一行两个正整数，分别为 $n$ 和 $m$，并用一个空格隔开。其中 $n=|V|$，$m=|E|$ 分别表示图中有 $n$ 个点 和 $m$ 条边。
>
> 接下来 $m$ 行，每行三个数 $i,j,w_{i,j}$，表示有一条边 $(i,j)$ 且该边的权值为 $w_{i,j}$，注意边权可以是实数。输入数据保证图 $G=(V,E)$ 连通，存在圈且有一个点能到达其他所有点。
>
> **输出格式：**
>
> 一个实数 $\mu'(G)$，要求精确到小数点后 ${8}$ 位。
>
> **数据范围：**
>
> 对于 ${100\%}$ 的数据，${2\leq n\le 3000}$，${1\leq m\le 10000}$，$|w_{i,j}| \le 10^7$，${1\leq i, j\leq n}$ 且 $i\neq j$。
>
> ---
>
> 提示：本题存在 $\mathcal O(nm)$ 的做法，但是 $\mathcal O(nm\log n)$ 的做法也可以通过。

本题的 $\mathcal O(nm)$ 做法来源于 $\texttt{Richard M. Karp}$ 在1977年发布的一篇题为《有向图最优环比率的特征》的论文。其中他描述的算法被称作 $\texttt{Karp}$ 算法，能够在 $\mathcal O(nm)$ 的复杂度内求解该问题，而且是正解。~~但是我不会这个算法~~，这里仅介绍 $\mathcal O(nm\log n)$ 的做法，也就是分数规划的解法。

根据题意，我们要求分式 $\frac{\sum w_{ij}}{k}$ 的最小值。也就是找到一个环，使得环上边权之和与环中点数之商最大。接续分数规划的思路，我们先来化简这个式子：假设当前二分到 $A$，且它不是最小值，因此存在数据满足 $\frac{\sum w}{k}\leq A$。接下来去分母得 $kA\geq\sum w$。考虑到当前环中有 $k$ 个点，严格来说上式应为 $kA\geq\sum\limits_{i=1}^{k}w$。移项展开得 $(w_1-A)+(w_2-A)+\dots+(w_k-A)\leq0$，即 $\sum\limits_{i=1}^{k}(w_i-A)\leq0$。

这下非常明朗了：对于每次二分，假设我们把边权重新设为 $w-A$。根据化简的式子可得，我们需要求出一个环，环上所有边的边权均重设为 $w-A$，并满足重设后的边权之和小于等于 ${0}$。就可以转化为 $\texttt{SPFA}$ 求负环的问题了。如果存在负环，代表最初假设成立，最终答案应小于 $A$，收缩右区间；否则收缩左区间。注意到**边权为实数，可正可负**，极端情况下，环的均值可以达到 $\pm10^7$，二分的左右区间就是 $-10^7$ 和 ${10^7}$。要求答案保留八位小数，浮点数精度的设置不宜大于 ${10^{-8}}$。

```cpp
#include <bits/stdc++.h>

#define N 3010
#define M 100010

using namespace std;

struct Edge {
    int to, ne;
    double w;
} edges[M];
const double EPS = 1e-9;
int h[N], cnt[N], idx = 0;
double dist[N];
bool st[N];
int n;

void add(int u, int v, double w) {
    idx++;
    edges[idx].to = v;
    edges[idx].ne = h[u];
    edges[idx].w = w;
    h[u] = idx;
}

bool check(double d) {
    memset(cnt, 0, sizeof cnt);
    memset(st, false, sizeof st);
    for (int i = 1; i <= n; i++) dist[i] = INT_MAX;

    queue<int> q;
    for (int i = 1; i <= n; i++) {
        q.push(i);
        st[i] = true;
        dist[i] = 0;
    }

    while (!q.empty()) {
        int id = q.front();
        q.pop();

        st[id] = false;
        for (int i = h[id]; ~i; i = edges[i].ne) {
            int j = edges[i].to;
            double wfp = edges[i].w - d;
            if (dist[j] > dist[id] + wfp) {
                dist[j] = dist[id] + wfp;
                cnt[j] = cnt[id] + 1;
                if (cnt[j] == n) return true;
                if (!st[j]) {
                    q.push(j);
                    st[j] = true;
                }
            }
        }
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    memset(h, -1, sizeof h);

    int m;
    cin >> n >> m;
    for (int i = 1; i <= m; i++) {
        int a, b;
        double c;
        cin >> a >> b >> c;
        add(a, b, c);
    }
    double L = -1e7, R = 1e7;
    while (R - L > EPS) {
        double mid = (L + R) / 2;
        if (check(mid)) R = mid;
        else L = mid;
    }
    cout << fixed << setprecision(8) << L << endl;

    return 0;
}
```

### POJ 2728 Desert King

题目地址：[POJ 2728](http://poj.org/problem?id=2728)

> 伟大的呆娃 David 刚刚成为沙漠王国的国王。为了巩固他的统治，他准备在王国内修建很多连通每座城市的灌溉水渠。作为王国的统治者兼吉祥物，他需要用一种最优的方式修建这些水渠……
>
> 经过几天的实地调研，他想到了一个修建方案：他想要最小化单位长度内的修建成本。换句话说，**修建的总成本与总长度的比值需要最小**。他只需修建必要的水渠，因此连接到某个城市的水渠只有唯一一条到达王宫的可行路径。
>
> 他的御用工程师们测量了每个城市的位置与海拔高度。每条水渠必须笔直地连通两个城市，且没有坡度。但是两座城市之间又可能存在高度差，因此他们决定在某两座城市之间修建一个垂直运水机，它可以垂直地运送水资源。水渠的长度定义为两座城市之间的水平距离、其修建成本定义为垂直运水机的竖直高度。需要注意的是：**任意两座城市的高度都是不同的，且不同的水渠不能共用一个垂直运水机**。水渠之间允许交叉，且任意三座城市不共线。
>
> 作为呆娃 David 的御用科学家和 OIer，你被要求求出符合要求的最小比值。
>
> **输入格式：**
>
> 多组测试数据，每组数据的第一行有一个整数 $N$，代表城市总数。
>
> 接下来 $N$ 行，每行三个数 $x,y,z$，代表每座城市的三维坐标。第一座城市是王宫所在地 $A$。
>
> $N=0$ 时结束读入
>
> **输出格式：**
>
> 对于每组数据，输出一行代表最优比率，保留三位小数
>
> **数据范围：**
>
> ${2\leq N\leq1000}$，${0\leq x,y<10^4}$，${0\leq z<10^7}$
>
> 题目翻译 By 我

这是一道最优比率生成树的题目。题目要求最小化 $\frac{\sum \text{budget}}{\sum \text{dist}}$，熟练地推出如下式子： $\sum \text{budget}-d\cdot\text{dist}\geq0$，当该式子成立时代表还可以收缩左区间。

接下来，我们预处理规划权值 $\text{budget}-d\cdot\text{dist}$，然后对于邻接矩阵的稠密图，跑一遍~~我个人蛮不想用的~~Prim算法（甚至Prim没有加高贵的 $\LaTeX$ 和首尾空格，可见作者的不情愿使用之情），返回最小比率生成树的权值是否非负即可。注意到保留三位小数，精度理论上不应大于 ${10^{-3}}$ 数量级。

```cpp
#include <iostream>
#include <iomanip>
#include <cmath>
#include <cstring>

#define N 1010
using namespace std;

struct Village {
    double x, y, z;
} villages[N];
const double EPS = 1e-6;
double dist[N][N], budget[N][N];
double prim[N];
bool st[N];
int n;
double sum = 0;

double dis(Village i, Village j) {
    return sqrt(pow(i.x - j.x, 2) + pow(i.y - j.y, 2));
}

void init() {
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j < i; j++) {
            dist[i][j] = dist[j][i] = dis(villages[i], villages[j]);
            budget[i][j] = budget[j][i] = fabs(villages[i].z - villages[j].z);
            sum += budget[i][j];
        }
    }
}

bool check(double d) {
    memset(st, false, sizeof st);

    double tmp = 0;
    for (int i = 1; i <= n; i++) prim[i] = budget[1][i] - d * dist[1][i];
    st[1] = true;

    for (int i = 1; i <= n; i++) {
        int t = -1;
        double minx = INT_MAX;
        for (int j = 1; j <= n; j++) {
            if (!st[j] && minx > prim[j]) {
                t = j;
                minx = prim[j];
            }
        }
        if (t == -1 || minx >= INT_MAX) break;
        st[t] = true;
        tmp += minx;
        for (int j = 1; j <= n; j++) {
            double wfp = budget[t][j] - d * dist[t][j];
            if (!st[j] && prim[j] > wfp) {
                prim[j] = wfp;
            }
        }
    }
    return tmp >= 0;
}

int main() {
    while (cin >> n, n) {
        sum = 0;
        for (int i = 1; i <= n; i++) {
            double x, y, z;
            cin >> x >> y >> z;
            villages[i].x = x;
            villages[i].y = y;
            villages[i].z = z;
        }
        init();
        double L = 0, R = sum;
        while (R - L > EPS) {
            double mid = (L + R) / 2;
            if (check(mid)) L = mid;
            else R = mid;
        }
        cout << fixed << setprecision(3) << L << endl;
    }
    return 0;
}
```

由于 POJ 的评测机编译不了万能头和转型式结构体赋值，甚至没有 `nullptr`，因而把一些最具有本人特色的代码给删除/修改了。望周知。
