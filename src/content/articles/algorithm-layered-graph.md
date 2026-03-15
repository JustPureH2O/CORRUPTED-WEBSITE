---
slug: '9131'

category: oi算法
published: 2024-06-01T08:56:35.340613+08:00
image: https://cdn.luogu.com.cn/upload/image_hosting/gv819did.png
keywords:
- 图论分层图
- 分层图
tags:
- oi算法
- 图论
- 最短路算法
title: 图论建模——分层图
updated: 2024-06-01T08:56:35.656+08:00
---
## 分层图简介

分层图，顾名思义。是将原图按不同状态分为若干与原图连接方式相同的图层，图层之间以特定方式连接的一类建图方式。如果画成立体图，大概是这样的：

![](https://cdn.luogu.com.cn/upload/image_hosting/gv819did.png)

根据如上思路，可以发现分层图有以下的几个性质：

1. 假设原图位于 ${0}$ 层，总共有 $k$ 层图。那么对于任意 $i\in[1,k]$，层 $i$ 内的节点之间的连接方式与 ${0}$ 层是完全相同的（与原图连接方式相同）；但是层与层之间的连接方式不一定相同，具体取决于题意
2. 假设不考虑节点所在层，仅考虑它在原图上对应的编号。假设有一条无向边 $(S,V)$，那么这条边会有大于等于一个权值（图层之间以特定方式连接）

根据性质二，我们大致可以明白分层图的使用范围——当题目中允许对某一条边做有限次的边权更改时即可考虑使用分层图做。在建图方面，根据数据范围的大小大致可以分为两种——离散建边和直观建边。接下来对两种建图方式作简要介绍。

## 分层图建图

### 离散建图

**优点**：细节较少、代码量短

**缺点**：对于大部分图论的数据范围容易爆空间、离散化有时不够直观

**空间（最劣情况）**：数组均为一维。对于前向星，无向存边数组为 ${2}[(K+1)M+KN^2]$（$K$ 层与原图相同的边，各层每个点间互相连了一条双向边，有向边则折半）；对于前向星的头数组，需要 $NK$ 的空间（$K$ 层，每层 $N$ 个点），最短路长度的记录数组和节点判重数组同上。

---

这种建图方法相当于将所有的图存在同一维数组上。假设原图共 $n$ 个节点，且原图为第 ${0}$ 层，那么对于原图上编号为 $i$ 的点，它在第 $k$ 层上的对应点的编号就应是 $i+kn$。至此我们就得到了分层图节点之间的映射关系。

在建图时，我们只需要在读入时处理连边即可。前向星存图和最短路算法都是模板，直接写就好。

```cpp
while (m--) {
    int a, b, c;
    cin >> a >> b >> c;
    for (int i = 0; i <= k; i++) {
        add(a + i * n, b + i * n, c); // 在当前层之内连正常边权的双向边
        add(b + i * n, a + i * n, c);
        if (i < k) {
            add(a + i * n, b + (i + 1) * n, c / 2); // 当前层和下一层直接互相连一条特定边权的双向边（此处为边权折半的情况）
            add(b + i * n, a + (i + 1) * n, c / 2);
        }
    }
}
```

### 直观建图（推荐）

**优点**：一般不会爆空间、当前节点的信息明确、直观易懂

**缺点**：数组是二维的，代码量较长、需要注意部分细节

**空间（最劣情况）**：一维无向图前向星数组，大小为 ${2}MK$，头数组如上；最短路记录数组、判重数组为二维，第一维 $N$、第二维 $K$。

---

这种建图方式是最保险的，空间超限的概率相比上边那个要小，而且层数信息的传递也较直观。建议使用这个方法存图。

读入时只需建立层内边即可，若需要实现层与层之间的转化，只需要在最短路算法里判断即可。因而空间是大幅度节省的。我们只需对最短路进行一番修改即可：

```cpp
for (int i = h[id]; ~i; i = edges[i].ne) {
    int j = edges[i].to;
    if (dis + edges[i].w < dist[j][layer]) {
        // 当前层内，正常的最短路
        dist[j][layer] = dis + edges[i].w;
        q.push((PIII) {dist[j][layer], (PII) {j, layer}});
    }
    if (layer < k && dis + edges[i].w / 2 < dist[j][layer + 1]) {
        // 如果下一层的点可更新，那么转移到下一层
        dist[j][layer + 1] = dis;
        q.push((PIII) {dist[j][layer + 1], (PII) {j, layer + 1}});
    }
}
```

## 分层图典例

### 洛谷 P4822 [BJWC 2012] 冻结

题目地址：[P4822](https://www.luogu.com.cn/problem/P4822)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

题目来源：<span data-luogu data-region>北京</span>&nbsp;&nbsp;<span data-luogu data-date>2012</span>

> **题目背景：**
>
> “我要成为魔法少女！”
>
> “那么，以灵魂为代价，你希望得到什么？”
>
> “我要将有关魔法和奇迹的一切，封印于卡片之中„„”
>
> 在这个愿望被实现以后的世界里，人们享受着魔法卡片（SpellCard，又名符卡）带来的便捷。
>
> 现在，不需要立下契约也可以使用魔法了！你还不来试一试？
>
> 比如，我们在魔法百科全书（Encyclopedia of Spells）里用“freeze”作为关键字来查询，会有很多有趣的结果。
>
> 例如，我们熟知的 Cirno，她的冰冻魔法当然会有对应的 SpellCard 了。当然，更加令人惊讶的是，居然有冻结时间的魔法，Cirno 的冻青蛙比起这些来真是小巫见大巫了。
>
> 这说明之前的世界中有很多魔法少女曾许下控制时间的愿望，比如 Akemi Homura、Sakuya Izayoi、……
>
> 当然，在本题中我们并不是要来研究历史的，而是研究魔法的应用。
>
> ---
>
> **题目描述：**
>
> 我们考虑最简单的旅行问题吧： 现在这个大陆上有 $N$ 个城市，$M$ 条双向的道路。城市编号为 $1$ ~ $N$，我们在 $1$ 号城市，需要到 $N$ 号城市，怎样才能最快地到达呢？
>
> 这不就是最短路问题吗？我们都知道可以用 Dijkstra、Bellman-Ford、Floyd-Warshall等算法来解决。
>
> 现在，我们一共有 $K$ 张可以使时间变慢 50%的 SpellCard，也就是说，在通过某条路径时，我们可以选择使用一张卡片，这样，我们通过这一条道路的时间 就可以减少到原先的一半。需要注意的是：
>
> 1. 在一条道路上最多只能使用一张 SpellCard。
> 2. 使用一张SpellCard 只在一条道路上起作用。
> 3. 你不必使用完所有的 SpellCard。
>
> 给定以上的信息，你的任务是：求出在可以使用这不超过 $K$ 张时间减速的 SpellCard 之情形下，从城市 $1$ 到城市 $N$ 最少需要多长时间。
>
> ---
>
> **输入格式：**
>
> 第一行包含三个整数：$N$、$M$、$K$。
>
> 接下来 $M$ 行，每行包含三个整数：$A_i$、$B_i$、$Time_i$，表示存在一条  $A_i$ 与 $B_i$ 之间的双向道路，在不使用 SpellCard 之前提下，通过它需要 $Time_i$ 的时间。
>
> **输出格式：**
>
> 输出一个整数，表示从 $1$ 号城市到 $N$ 号城市的最小用时。
>
> ---
>
> **数据范围：**
>
> 对于 $100\%$ 的数据，保证：
>
> - $1 \leq K \leq N \leq 50$，$M \leq 10^3$。
> - $1 \leq A_i,B_i \leq N$，$2 \leq Time_i \leq 2 \times 10^3$。
> - 为保证答案为整数，保证所有的 $Time_i$ 均为偶数。
> - 所有数据中的无向图保证无自环、重边，且是连通的。

这道题的数据范围较小，可以考虑使用离散建图。根据先前分析的空间，存边数组大概在 ${4.2\times10^5}$ 左右，其他的数组大概在 ${5.6\times10^4}$ 左右。具体可以自行代值计算。

答案的结果就是对第 $0\sim k$ 层的终点的长度值取最小。

```cpp
#include <bits/stdc++.h>
#define N 55
#define M 1010
#define K 51
using namespace std;

typedef pair<int, int> PII;

struct Edge {
    int to, ne, w;
} edges[((K + 1) * M + K * N * N) << 1];

int n, m, k;
int h[N * M], idx = 0;
int dist[N * M];
bool st[N * M];

void add(int u, int v, int w) {
    idx++;
    edges[idx].to = v;
    edges[idx].ne = h[u];
    edges[idx].w = w;
    h[u] = idx;
}

void dijkstra() {
    priority_queue<PII, vector<PII>, greater<> > q;
    q.push((PII){0, 1});
    dist[1] = 0;

    while (!q.empty()) {
        PII p = q.top();
        q.pop();

        int id = p.second;
        int dis = p.first;

        if (st[id]) continue;
        st[id] = true;

        for (int i = h[id]; ~i; i = edges[i].ne) {
            int j = edges[i].to;
            if (dis + edges[i].w < dist[j]) {
                dist[j] = dis + edges[i].w;
                q.push((PII){dist[j], j});
            }
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    memset(h, -1, sizeof h);
    memset(dist, 0x3f, sizeof dist);

    cin >> n >> m >> k;
    while (m--) {
        int a, b, c;
        cin >> a >> b >> c;
        for (int i = 0; i <= k; i++) {
            add(a + i * n, b + i * n, c); // 在当前层之内连正常边权的双向边
            add(b + i * n, a + i * n, c);
            if (i < k) {
                add(a + i * n, b + (i + 1) * n, c / 2); // 当前层和下一层直接互相连一条边权减半的双向边
                add(b + i * n, a + (i + 1) * n, c / 2);
            }
        }
    }

    dijkstra();
    int ans = 0x3f3f3f3f;
    for (int i = 0; i <= k; i++) {
        ans = min(ans, dist[n + i * n]);
    }
    cout << ans << endl;

    return 0;
}
```

### 洛谷 P4568 [JLOI 2011] 飞行路线

题目地址：[P4568](https://www.luogu.com.cn/problem/P4568)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

题目来源：<span data-luogu data-source>各省省选</span>&nbsp;&nbsp;<span data-luogu data-region>吉林</span>&nbsp;&nbsp;<span data-luogu data-date>2011</span>

> Alice 和 Bob 现在要乘飞机旅行，他们选择了一家相对便宜的航空公司。该航空公司一共在 $n$ 个城市设有业务，设这些城市分别标记为 $0$ 到 $n-1$，一共有 $m$ 种航线，每种航线连接两个城市，并且航线有一定的价格。
>
> Alice 和 Bob 现在要从一个城市沿着航线到达另一个城市，途中可以进行转机。航空公司对他们这次旅行也推出优惠，他们可以免费在最多 $k$ 种航线上搭乘飞机。那么 Alice 和 Bob 这次出行最少花费多少？
>
> ---
>
> **输入格式：**
>
> 第一行三个整数 $n,m,k$，分别表示城市数，航线数和免费乘坐次数。
>
> 接下来一行两个整数 $s,t$，分别表示他们出行的起点城市编号和终点城市编号。
>
> 接下来 $m$ 行，每行三个整数 $a,b,c$，表示存在一种航线，能从城市 $a$ 到达城市 $b$，或从城市 $b$ 到达城市 $a$，价格为 $c$。
>
> **输出格式：**
>
> 输出一行一个整数，为最少花费。
>
> ---
>
> **数据范围：**
>
> 对于 $30\%$ 的数据，$2 \le n \le 50$，$1 \le m \le 300$，$k=0$。
>
> 对于 $50\%$ 的数据，$2 \le n \le 600$，$1 \le m \le 6\times10^3$，$0 \le k \le 1$。
>
> 对于 $100\%$ 的数据，$2 \le n \le 10^4$，$1 \le m \le 5\times 10^4$，$0 \le k \le 10$，$0\le s,t,a,b < n$，$a\ne b$，$0\le c\le 10^3$。
>
> 另外存在一组 hack 数据。

如果继续用离散建图的话……

![（危）](https://cdn.luogu.com.cn/upload/image_hosting/k3jh7p8f.png)

~~交上去绝对会吃一发 RE……~~

因此改用直观建图，改之后的存边数组在 $10^6$ 左右，其他的数组基本上都是小于十万的。可以放心食用。

```cpp
#include <bits/stdc++.h>
#define N 10010
#define M 50010
#define K 11
using namespace std;

typedef pair<int, int> PII;
typedef pair<int, PII> PIII;

struct Edge {
    int to, ne, w;
} edges[M * K << 1];

int h[N * K], idx = 0;
int n, m, k, S, T;
int dist[N][K];
bool st[N][K];

void add(int u, int v, int w) {
    idx++;
    edges[idx].to = v;
    edges[idx].ne = h[u];
    edges[idx].w = w;
    h[u] = idx;
}

void dijkstra() {
    priority_queue<PIII, vector<PIII>, greater<> > q;

    q.push((PIII){0, (PII){S, 0}});
    dist[S][0] = 0;

    while (!q.empty()) {
        PIII t = q.top();
        q.pop();

        int id = t.second.first;
        int dis = t.first;
        int layer = t.second.second;

        if (st[id][layer]) continue;
        st[id][layer] = true;

        for (int i = h[id]; ~i; i = edges[i].ne) {
            int j = edges[i].to;
            if (dis + edges[i].w < dist[j][layer]) {
                // 当前层内，即不使用免费机会
                dist[j][layer] = dis + edges[i].w;
                q.push((PIII) {dist[j][layer], (PII) {j, layer}});
            }
            if (layer < k && dis < dist[j][layer + 1]) {
                // 使用免费特权，转移到下一层
                dist[j][layer + 1] = dis;
                q.push((PIII) {dist[j][layer + 1], (PII) {j, layer + 1}});
            }
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    memset(h, -1, sizeof h);
    memset(dist, 0x3f, sizeof dist);

    cin >> n >> m >> k >> S >> T;

    while (m--) {
        int a, b, c;
        cin >> a >> b >> c;
        for (int i = 0; i <= k; i++) {
            add(a, b, c);
            add(b, a, c);
        }
    }

    dijkstra();

    int ans = 0x3f3f3f3f;
    for (int i = 0; i <= k; i++) {
        ans = min(ans, dist[T][i]);
    }
    cout << ans << endl;

    return 0;
}

```

双倍经验：[P2939](https://www.luogu.com.cn/problem/P2939)
