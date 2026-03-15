---
slug: '18405'

category: oi算法
published: 2024-06-15T15:56:20.655946+08:00
image: https://cdn.luogu.com.cn/upload/image_hosting/eb5brrod.png
tags:
- oi
- 算法
- 最短路算法
title: SPFA 和负环
updated: 2024-06-22T22:10:43.125+08:00
---
## 关于 SPFA，以及……

~~……以及它死了~~，现在有意无意卡 $\texttt{SPFA}$ 似乎已经成为 OI 出题界的常规操作了……

$\texttt{Bellman-Ford}$ 算法的流程如下：

1. 遍历 $n$ 个点
2. 对于当前的点 $i$，遍历它的所有出边，并获取出边相连的点 $j$
3. 进行松弛操作，将 $\operatorname{dist}_{j}$ 设为 $\operatorname{min}(\operatorname{dist}_j,\operatorname{dist}_i+w_{ij})$
4. 若终点的最短路长度不为正无穷，则找到最短路；否则整张图不连通

但是在第三步中，每个点的最短距离不一定能够被更新——只有上一次松弛成功的点连接的边，才有可能引起下一次更新。做一个优化，减少不必要的出队。$\texttt{SPFA}$ 引入了一个队列（类似于宽搜的队列），用来记录点的入队，避免不必要的松弛，具体如下：

```cpp
void spfa(int s) {
    memset(dist, 0x3f, sizeof dist);

    queue<int> q;
    q.push(s);
    st[s] = true;
    dist[s] = 0;

    while (!q.empty()) {
        int t = q.front();
        q.pop();
        st[t] = false;

        for (int i = h[t]; ~i; i = edges[i].ne) {
            int j = edges[i].to;
            if (dist[j] > dist[t] + edges[i].w) {
                dist[j] = dist[t] + edges[i].w;
                if (!st[j]) {
                    q.push(j);
                    st[j] = true;
                }
            }
        }
    }
}
```

~~长得和 $\texttt{Dijkstra}$ 真的很像~~。

## 负环

负环，顾名思义，就是边权之和为负数的环。在 $\texttt{SPFA}$ 中，有两种判负环的方式。

1. 对每个点出队的次数进行计数，若某个点出队次数大于等于 $n$ （点数），则存在负环
2. 求出到达当前点的最短路所经过的边数，若边数大于等于 $n$ 则存在负环

实际情况我们更喜欢用第二种，考虑极端情况——$n$ 个点构成一个大负环，那么程序在这个环上跑一圈，每个点均只出队一次；要想使某个点出队 $n$ 次，就要经过 $n^2-1$ 条边，会造成严重的性能浪费。相较之下，第二种方案只需要在这个环上绕一圈即可判断负环，效率是极高的。

以 [P3385](https://www.luogu.com.cn/problem/P3385) 负环模板题为例，给出修改后的 $\texttt{SPFA}$ 核心代码：

```cpp
bool spfa(int n) {
    memset(cnt, 0, sizeof cnt);
    memset(dist, 0x3f, sizeof dist);
    memset(st, false, sizeof st);

    queue<int> q;
    q.push(1);
    st[1] = true;
    dist[1] = 0;
    while (!q.empty()) {
        int t = q.front();
        q.pop();
        st[t] = false;
        for (int i = h[t]; ~i; i = edges[i].ne) {
            int j = edges[i].to;
            if (dist[j] > dist[t] + edges[i].w) {
                dist[j] = dist[t] + edges[i].w;
                cnt[j] = cnt[t] + 1;
                if (cnt[j] == n) return false;
                if (!st[j]) {
                    q.push(j);
                    st[j] = true;
                }
            }
        }
    }
    return true;
}
```

### 洛谷 P2850 [USACO06DEC] Wormhole G

题目地址：[P2850](https://www.luogu.com.cn/problem/P2850)

题目难度：<span data-luogu data-green>普及+/提高</span>

题目来源：<span data-luogu data-source>USACO</span>&nbsp;&nbsp;<span data-luogu data-date>2006</span>

> John 在他的农场中闲逛时发现了许多虫洞。虫洞可以看作一条十分奇特的有向边，并可以使你返回到过去的一个时刻（相对你进入虫洞之前）。
> 
> John 的每个农场有 $m$ 条小路（无向边）连接着 $n$ 块地（从 $1 \sim n$ 标号），并有 $w$ 个虫洞。
> 
> 现在 John 希望能够从某块地出发，走过一条路径回到出发点，且同时也回到了出发时刻以前的某一时刻。请你告诉他能否做到。
> 
> **输入格式：**
> 
> 输入的第一行是一个整数 $T$，代表测试数据的组数。
> 
> 每组测试数据的格式如下：
> 
> 每组数据的第一行是三个用空格隔开的整数，分别代表农田的个数 $n$，小路的条数 $m$，以及虫洞的个数 $w$。
> 
> 每组数据的第 $2$ 到第 $(m + 1)$ 行，每行有三个用空格隔开的整数 $u, v, p$，代表有一条连接 $u$ 与 $v$ 的小路，经过这条路需要花费 $p$ 的时间。
> 
> 每组数据的第 $(m + 2)$ 到第 $(m + w + 1)$ 行，每行三个用空格隔开的整数 $u, v, p$，代表点 $u$ 存在一个虫洞，经过这个虫洞会到达点 $v$，并回到 $p$ 秒之前。
> 
> **输出格式：**
> 
> 对于每组测试数据，输出一行一个字符串，如果能回到出发时刻之前，则输出 `YES`，否则输出 `NO`。
> 
> **数据范围：**
> 
> 对于 ${100\%}$ 的数据，${1 \le T \le 5}$，${1 \le n \le 500}$，${1 \le m \le 2500}$，${1 \le w \le 200}$，${1 \le p \le 10^4}$。

经典题。在题目中，我们不确定图的起点编号，图论中的经典技巧“虚拟源点”就派上用场了。虚拟源点是指新建一个原图中不存在的点，并把这个点向所有其他点连一条权值为 ${0}$ 的双向边，以实现多源汇最短路的求解。但实际操作中不一定需要真正的创建一个新点，可以从最短路初始的入队点入手——初始时先将 ${1\sim n}$ 号点全部入队。因为虚拟源点在初次松弛时，一定会遍历到所有相连点，即 ${1\sim n}$ 号点，然后松弛入队。因此开始将所有点加入队列和建立虚拟点并入队是等价的。

考虑把所有虫洞通道看作边权为 $-T$ 的**有向边**，这道题就转化成了判断是否存在负环的题目。也就是说我们直接敲一遍求负环的模板，就可以通过此题 $\downarrow$。

```cpp
#include <bits/stdc++.h>
#define N 510
#define M 3010
using namespace std;

struct Edge {
    int to, ne, w;
} edges[M << 1];

int h[N], idx = 0;
int dist[N], cnt[N];
bool st[N];

void add(int u, int v, int w) {
    idx++;
    edges[idx].to = v;
    edges[idx].ne = h[u];
    edges[idx].w = w;
    h[u] = idx;
}

bool spfa(int n) {
    memset(dist, 0x3f, sizeof dist);
    memset(st, false, sizeof st);
    memset(cnt, 0, sizeof cnt);

    queue<int> q;
    for (int i = 1; i <= n; i++) {
        q.push(i);
        st[i] = true;
        dist[i] = 0;
    }
    while (!q.empty()) {
        int t = q.front();
        q.pop();

        st[t] = false;
        for (int i = h[t]; ~i; i = edges[i].ne) {
            int j = edges[i].to;
            if (dist[j] > dist[t] + edges[i].w) {
                dist[j] = dist[t] + edges[i].w;
                cnt[j] = cnt[t] + 1;
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

    int t;
    cin >> t;
    while (t--) {
        memset(h, -1, sizeof h);
        idx = 0;

        int n, m, k;
        cin >> n >> m >> k;
        int u, v, w;
        for (int i = 1; i <= m; i++) {
            cin >> u >> v >> w;
            add(u, v, w);
            add(v, u, w);
        }
        for (int i = 1; i <= k; i++) {
            cin >> u >> v >> w;
            add(u, v, -w);
        }
        cout << (spfa(n) ? "YES" : "NO") << endl;
    }
    return 0;
}
```

### 洛谷 P2868 [USACO07DEC] Sightseeing Cows G

题目地址：[P2868](https://www.luogu.com.cn/problem/P2868)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

题目来源：<span data-luogu data-source>USACO</span>&nbsp;&nbsp;<span data-luogu data-date>2007</span>

> 给你一张 $L$ 点 $P$ 边的有向图，第 $i$ 个点点权为 $F_i$，第 $i$ 条边边权为 $T_i$。
> 
> 找一个环，设环上的点组成的集合为 $S$，环的边组成的集合为 $E$，最大化 $\dfrac{\sum_{u\in S}F_u}{\sum_{e\in E}T_e}$。
> 
> **输入格式：**
> 
> 第一行是两个整数 $L$ 和 $P$
> 
> 接下来 $L$ 行，每行一个整数代表 $F_i$
> 
> 接下来 $P$ 行，每行三个整数 $a,b,t_i$，代表 $a$ 和 $b$ 之间有一条长为 $t_i$ 的边
> 
> **输出格式：**
> 
> 一行一个数表示结果，保留两位小数
> 
> **数据范围：**
> 
> ${1\leq L,F_i,T_i\leq1000},1\leq P\leq5000$

这道题需要用到[分数规划](https://justpureh2o.cn/articles/57241/)相关知识，主要在对题目中算式的处理。根据题意可知，要求出一个环使得环中点权之和与边权之和比值最大。我们把环中的点权看作“性价比模型”里的“性能”，即 $a_i$；把边权看作“价格”，即 $b_i$。在分数规划中，当 $\sum a_i-d\cdot b_i\geq0$ 时，证明当前二分到的 $d$ 值小于正确答案；反之大于正确答案。根据这两条收缩二分区间，即可达到求解的效果。

在这道题里。考虑将上式变号，同乘 $-1$，变为 $\sum d\cdot b_i-a\leq0$。如果我们把边 $(u,v)$ 的边权重定义为 $d\cdot T_i-F_i$，就简化成“判断图上是否存在权值和为负的环”——负环的判断了。若形成负环，返回真，左区间收缩；反之收缩右区间。注意到负环的起始点并不确定，因此应用上面的超级源点思想来求解：

```cpp
#include <bits/stdc++.h>
#define N 1010
#define M 5010
using namespace std;

struct Edge {
    int to, ne, w;
} edges[M << 1];
int h[N], idx = 0;
int p[N];
int cnt[N];
double dist[N];
bool st[N];
int L, P;
const double EPS = 1e-6;

void add(int u, int v, int w) {
    idx++;
    edges[idx].to = v;
    edges[idx].ne = h[u];
    edges[idx].w = w;
    h[u] = idx;
}

bool check(double mid) {
    memset(st, false, sizeof st);
    memset(cnt, 0, sizeof cnt);
    memset(dist, 127, sizeof dist);

    queue<int> q;
    for (int i = 1; i <= L; i++) q.push(i), st[i] = true, dist[i] = 0;

    while (!q.empty()) {
        int id = q.front();
        q.pop();

        st[id] = false;
        for (int i = h[id]; ~i; i = edges[i].ne) {
            int j = edges[i].to;
            double wfp = mid * edges[i].w - p[id];
            if (dist[j] > wfp + dist[id]) {
                dist[j] = wfp + dist[id];
                cnt[j] = cnt[id] + 1;
                if (cnt[j] == L) return true;
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

    cin >> L >> P;

    for (int i = 1; i <= L; i++) cin >> p[i];
    for (int j = 1; j <= P; j++) {
        int a, b, w;
        cin >> a >> b >> w;
        add(a, b, w);
    }
    double LEFT = 0, RIGHT = 1000;
    while (RIGHT - LEFT > EPS) {
        double mid = (LEFT + RIGHT) / 2;
        if (check(mid)) LEFT = mid;
        else RIGHT = mid;
    }
    cout << fixed << setprecision(2) << LEFT << endl;
    return 0;
}
```

### SPOJ 2885 WORDRING - Word Rings

题目地址：[SPOJ 2885](https://www.luogu.com.cn/problem/SP2885)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

> 如果字符串A的**结尾两个**字符与字符串B的**开头两个**字符相匹配，我们称A与B能 **“ 相连 ”** ( 注意：A与B能相连，不代表B与A能相连 )
> 
> 当若干个串首尾 “ 相连 ” 成一个环时，我们称之为一个环串（一个串首尾相连也算）
> 
> 我们希望从给定的全小写字符串中找出一个环串，使这个环串的平均长度最长
> 
> ```
> intercommunicational
>  alkylbenzenesulfonate
>  tetraiodophenolphthalein
> ```
> 
> 如上例：第一个串能与第二个串相连，第二个串能与第三个串相连，第三个串又能与第一个串相连。按此顺序连接，便形成了一个环串。
> 
> 长度为 20+21+24=65 ( **首尾重复部分需计算两次** ) ，总共使用了3个串，所以平均长度是 65/3≈21.6666
> 
> **输入格式：**
> 
> 多组数据
> 每组数据第一行一个整数n，表示字符串数量
> 接下来n行每行一个长度**小于等于1000**的字符串
> 读入以n=0结束
> 
> **输出格式：**
> 
> 若不存在环串，输出"No solution."。否则输出最长的环串平均长度。
> 
> Translated by @远藤沙椰
> 
> **数据范围：**
> 
> ${1\leq n\leq10^5}$

这道题让我们最大化一个比值，再次把目光放到分数规划上来。如同上一道题，这道题也可以转化为分数规划+判负环的算法求解。难点在于如何把一个一个的字符串建成图。

首先考虑把每个字符串当成一个点，如果两个字符串能首尾相接（直接判断首位两个字符），就连边，边权为两字符串长度之和。这样建图有没有什么不妥之处？

观察到数据范围，$n$ 的极端情况是十万，假设我们有十万个完全相同的字符串，那么点数将是 ${10^5}$，两两连边，边数是 ${10^{10}}$。完全失败！

换一种思路，把首位两个字符当作点，把一个字符串拆成两点和一边（~~化学键~~），边权是该字符串的长度。此时的最大点数将是 ${26^2=676}$，最大边数是 ${10^5}$ （字符串总数）。然后就可以用分数规划求解了。

从基本模型出发，得到 $\sum a_i-d\cdot k\geq0$。不难发现此时 $a_i$ 代表字符串的长度，$k$ 代表所用字符串的数量（经过的边数）。求和是从 ${1\sim k}$ 的，每项展开得 $(a_1-d)+(a_2-d)+\dots+(a_k-d)$，新边权就是 $w_{ij}-d$。像上一道题那样不等号两边同乘以 $-1$，得到 $\sum d\cdot k-a_i\leq0$，就可以转化为一个判负环问题。$\texttt{SPFA}$ 判负环使用 $\texttt{BFS}$ 会稍慢（会TLE），这里改用 $\texttt{DFS}$ 来实现。

```cpp
#include <bits/stdc++.h>

#define N 700
#define M 100010
#define distinct(a, b) ((a - 'a') * 26 + b - 'a')
#define recover(x) (string(1, char(x / 26 + 'a')) += char(x % 26 + 'a'))

using namespace std;

struct Edge {
    int to, ne, w;
} edges[M << 1];
int h[N], idx = 0;
const double EPS = 1e-6;
int n;
double dist[N];
bool st[N];

void add(int u, int v, int w) {
    idx++;
    edges[idx].to = v;
    edges[idx].ne = h[u];
    edges[idx].w = w;
    h[u] = idx;
}

bool spfa_dfs(int u, double d) {
    if (st[u]) return true;
    st[u] = true;
    for (int i = h[u]; ~i; i = edges[i].ne) {
        int j = edges[i].to;
        double wfp = d - edges[i].w;
        if (dist[j] > dist[u] + wfp) {
            dist[j] = dist[u] + wfp;
            if (spfa_dfs(j, d)) return true;
        }
    }
    st[u] = false;
    return false;
}

bool check(double d) {
    memset(dist, 0, sizeof dist);
    memset(st, false, sizeof st);

    for (int i = 0; i < 676; i++) {
        if (spfa_dfs(i, d)) return true;
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    while (cin >> n && n) {
        memset(h, -1, sizeof h);
        idx = 0;

        for (int i = 1; i <= n; i++) {
            string s;
            cin >> s;
            if (s.length() < 2) continue;
            add(distinct(s[0], s[1]), distinct(s[s.length() - 2], s[s.length() - 1]), s.length());
        }
        double L = 0, R = 1e5;
        while (R - L > EPS) {
            double mid = (L + R) / 2;
            if (check(mid)) L = mid;
            else R = mid;
        }
        if (L > EPS) cout << L << endl;
        else cout << "No solution." << endl;
    }
    return 0;
}
```

相似题目：[UVA 11090](https://www.luogu.com.cn/problem/UVA11090)、[P3199](https://www.luogu.com.cn/problem/P3199)、[P3288](https://www.luogu.com.cn/problem/P3288)

