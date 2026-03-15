---
slug: '32645'

category: oi算法
published: 2024-06-05T19:05:52.940950+08:00
tags:
- 图论
- 算法
- oi
title: Floyd 算法——脚踏图论、数学两条船的算法
updated: 2024-06-05T19:05:52.945+08:00
---
## Floyd 算法简介

Floyd 算法是一种能在 $\mathcal O(n^3)$ 时间复杂度内求出任意两点间最短路长度的多源最短路算法，又称 $\texttt{Floyd-Warshall}$ 算法或插点法，以它的发明者命名。Floyd 算法基于动态规划，通过穷举 $i$ 节点和 $j$ 节点的所有中继节点 $k$ 进行松弛操作得到最短路径。对于稠密图，它的执行效率会快于 Dijkstra 和 Bellman-Ford 算法。

在初始建图时。对于邻接矩阵 $A$，$A_{ij}$ 代表 $i$ 和 $j$ 点间的直连最短路径长度，也就是读入时数据告诉你的两点间的边长；剩下没有直接连接的两点间距离设为正无穷。特别地，$A_{ii}$ 需要初始化为 ${0}$ ，因为从自己出发回到自己的边权为零。

在算法运行过程中，假设当前枚举到点 $i$ 和 $j$ ，算法需要枚举中继点 $k$。那么路径 $i\rightarrow j\rightarrow k$ 成为最短距离的必要条件是**存在边 $(i,j)$ 和 $(j,k)$**。若当前 $\operatorname{dis}(i,j)<\operatorname{dis}(i,k)+\operatorname{dis}(k,j)$，则将 $\operatorname{dis}(i,j)$ 更新，这一点和 Dijkstra 是类似的。

Floyd 算法的基本模板如下：

```cpp
for (int k = 1; k <= n; k++) {
	for (int i = 1; i <= n; i++) {
		for (int j = 1; j <= n; j++) {
			dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
		}
	}
}
```

~~只有四层，非常简单。~~

对于 Floyd 算法，还需注意的一点是它的循环次序问题。如果想一次跑出正确结果，那就需要将中继点枚举放在最外层，也就是最外层是 $k$ 循环，剩余的循环只需保证在 $k$ 层内即可，顺序无所谓。而如果是类似于 `ikj` 次序的循环，那么至多需要两次才能求出正确答案；如果是 `ijk` 次序，则至多需要求三次。具体参见[这篇博客](https://www.cnblogs.com/yyyyxh/articles/floyd_implementations.html)。

## Floyd 图论

Floyd 在图论方面有几大重要作用——求无向图最小环、传递闭包。

### P6175 无向图最小环问题

题目地址：[P6175](https://www.luogu.com.cn/problem/P6175)

题目难度：<span data-luogu data-yellow>普及/提高-</span>

> 给定一张无向图，求图中一个至少包含 $3$ 个点的环，环上的节点不重复，并且环上的边的长度之和最小。该问题称为无向图的最小环问题。在本题中，你需要输出最小的环的边权和。若无解，输出 `No solution.`。
>
> ---
>
> **输入格式：**
>
> 第一行两个正整数 $n,m$ 表示点数和边数。
>
> 接下来 $m$ 行，每行三个正整数 $u,v,d$，表示节点 $u,v$ 之间有一条长度为 $d$ 的边。
>
> **输出格式：**
>
> 输出边权和最小的环的边权和。若无解，输出 `No solution.`。

假设有一张图：

![](https://cdn.luogu.com.cn/upload/image_hosting/em2ycp6e.png)

当 Floyd 算法枚举到中继节点 $k$ 时，且存在边 $(i,j)$ 和 $(k,j)$。那么环 $(i,j,k)$ 是有机会成为当前图上的最小环的（注意到图是无向图，若 $i$ 能到 $j$，则 $j$ 一定能到达 $i$）。若当前环的权值（$\operatorname{dis}(i,j)+\operatorname{w}(i,k)+\operatorname{w}(k,j)$，注意是边权 $w$）小于全局最小值，则更新全局最小值。

```cpp
#include <bits/stdc++.h>
#define N 110
#define INF 0x3f3f3f3f
using namespace std;

typedef long long ll;

int n, m;
ll g[N][N], dist[N][N];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    memset(g, 0x2a, sizeof g);

    cin >> n >> m;

    for (int i = 1; i <= n; i++) g[i][i] = 0;

    while (m--) {
        int u, v;
        ll d;
        cin >> u >> v >> d;
        g[u][v] = g[v][u] = min(g[u][v], d);
    }

    memcpy(dist, g, sizeof dist);

    ll ans = LLONG_MAX;
    for (int k = 1; k <= n; k++) {
        for (int i = 1; i < k; i++) {
            for (int j = i + 1; j < k; j++) {
                ans = min(ans, dist[i][j] + g[i][k] + g[k][j]);
            }
        }
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                dist[i][j] = dist[j][i] = min(dist[i][j], dist[i][k] + dist[k][j]);
            }
        }
    }
    if (ans >= INF) cout << "No solution." << endl;
    else cout << ans << endl;

    return 0;
}

```

### B3611 [模板] 传递闭包

题目地址：[B3611](https://www.luogu.com.cn/problem/B3611)

题目难度：<span data-luogu data-yellow>普及/提高-</span>

> 给定一张点数为 $n$ 的有向图的邻接矩阵，图中不包含自环，求该有向图的传递闭包。
>
> 一张图的邻接矩阵定义为一个 $n\times n$ 的矩阵 $A=(a_{ij})_{n\times n}$，其中
>
> $$
> a_{ij}=\left\{
> \begin{aligned}
> 1,i\ 到\ j\ 存在直接连边\\
> 0,i\ 到\ j\ 没有直接连边 \\
> \end{aligned}
> \right.
> $$
>
> 一张图的传递闭包定义为一个 $n\times n$ 的矩阵 $B=(b_{ij})_{n\times n}$，其中
>
> $$
> b_{ij}=\left\{
> \begin{aligned}
> 1,i\ 可以直接或间接到达\ j\\
> 0,i\ 无法直接或间接到达\ j\\
> \end{aligned}
> \right.
> $$
>
> **输入格式：**
>
> 输入数据共 $n+1$ 行。
>
> 第一行一个正整数 $n$。
>
> 第 $2$ 到 $n+1$ 行每行 $n$ 个整数，第 $i+1$ 行第 $j$ 列的整数为 $a_{ij}$。
>
> **输出格式：**
>
> 输出数据共 $n$ 行。
>
> 第 $1$ 到 $n$ 行每行 $n$ 个整数，第 $i$ 行第 $j$ 列的整数为 $b_{ij}$。

~~说句闲话，感觉这个传递闭包和并查集路径压缩好像……~~

我们在用 Floyd 求最短路时，以 $k$ 为中继节点进行的松弛操作其实就指明了一个间接到达的关系：“点 $i$ 可以经过点 $k$ 间接到达点 $j$”。因此只需要在 Floyd 内部加入“若存在边 $(i,k)$ 和 $(k,j)$，则将传递闭包 $(i,j)$ 置为 ${1}$”。

```cpp
#include <bits/stdc++.h>
#define N 110
using namespace std;

int g[N][N];

void floyd(int n) {
    for (int k = 1; k <= n; k++) {
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                if (g[i][k] && g[k][j]) g[i][j] = 1;
            }
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            cin >> g[i][j];
        }
    }

    floyd(n);

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            cout << g[i][j] << ' ';
        }
        cout << endl;
    }
    return 0;
}

```

### P1347 排序

题目地址：[P1347](https://www.luogu.com.cn/problem/P1347)

题目难度：<span data-luogu data-green>普及+/提高</span>

> 一个不同的值的升序排序数列指的是一个从左到右元素依次增大的序列，例如，一个有序的数列 $A,B,C,D$ 表示 $A<B,B<C,C<D$。在这道题中，我们将给你一系列形如 $A<B$ 的关系，并要求你判断是否能够根据这些关系确定这个数列的顺序。
>
> **输入格式：**
>
> 第一行有两个正整数 $n,m$，$n$ 表示需要排序的元素数量，$2\leq n\leq 26$，第 $1$ 到 $n$ 个元素将用大写的 $A,B,C,D,\dots$ 表示。$m$ 表示将给出的形如 $A<B$ 的关系的数量。
>
> 接下来有 $m$ 行，每行有 $3$ 个字符，分别为一个大写字母，一个 `<` 符号，一个大写字母，表示两个元素之间的关系。
>
> **输出格式：**
>
> 若根据前 $x$ 个关系即可确定这 $n$ 个元素的顺序 `yyy..y`（如 `ABC`），输出
>
> `Sorted sequence determined after xxx relations: yyy...y.`
>
> 若根据前 $x$ 个关系即发现存在矛盾（如 $A<B,B<C,C<A$），输出
>
> `Inconsistency found after x relations.`
>
> 若根据这 $m$ 个关系无法确定这 $n$ 个元素的顺序，输出
>
> `Sorted sequence cannot be determined.`
>
> （提示：确定 $n$ 个元素的顺序后即可结束程序，可以不用考虑确定顺序之后出现矛盾的情况）

矛盾情况是诸如：$A<A$ 的情况。

我们把所有的小于关系存在一张邻接矩阵里，$A_{ij}=1$ 所承载的含义就变成了：存在严格小于关系 $A_i<A_j$。那么想要求出所有的大小关系，就需要对每个字母能直接或间接导出的所有字母进行比较判断。这道题就可以用传递闭包来处理每个字母间的推导关系。

由于题目的特殊要求，我们选择每次只读入一个大小关系，然后跑一次传递闭包，再对结果进行判断输出。若传递闭包的对角线元素不全为零，代表存在矛盾，直接跳出；若存在点对 $(i,j)$，使得 $A_{ij}=0$，那么就是一个亚定的关系，需要进一步增加条件，特殊地，若此时已读入所有关系，则输出无解；若对于所有点对 $(i,j)$ 都有 $A_{ij}\neq0$ 且不存在矛盾，那么就可以输出序列了。

对于序列的升序输出，首先枚举 $i$。$i$ 是最小值的充要条件是不存在任何点对 $(i,j)$ 使得 $A_{ij}\neq0$，即不存在更小的值。在找到最小值后标记一下，重复查找即可得到整个序列。

```cpp
#include <bits/stdc++.h>
#define N 30
using namespace std;

int g[N][N], cpy[N][N];
bool st[N];
int n, m;

void floyd() {
    memcpy(cpy, g, sizeof g);
    for (int k = 1; k <= n; k++) {
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                if (cpy[i][k] && cpy[k][j]) cpy[i][j] = 1;
            }
        }
    }
}

int check() {
    for (int i = 1; i <= n; i++) {
        if (cpy[i][i]) return 1;
    }
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j < i; j++) {
            if (!cpy[i][j] && !cpy[j][i]) return 0;
        }
    }
    return 2;
}

char getC() {
    for (int i = 1; i <= n; i++) {
        if (!st[i]) {
            bool flag = true;
            for (int j = 1; j <= n; j++) {
                if (!st[j] && cpy[j][i]) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                st[i] = true;
                return static_cast<char>(i + 'A' - 1);
            }
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    while (cin >> n >> m, n || m) {
        memset(g, 0, sizeof g);
        memset(st, false, sizeof st);

        int t = 0, tmp = 0;
        for (int i = 1; i <= m; i++) {
            char s[5];
            cin >> s;
            int a = s[0] - 'A' + 1, b = s[2] - 'A' + 1;
            g[a][b] = 1;
            floyd();
            t = check();

            if (t) {
                tmp = i;
                break;
            }
        }
        if (t == 1) cout << "Inconsistency found after " << tmp << " relations." << endl;
        else if (t == 0) cout << "Sorted sequence cannot be determined." << endl;
        else {
            cout << "Sorted sequence determined after " << tmp << " relations: ";
            for (int i = 1; i <= n; i++) cout << getC();
            cout << "." << endl;
        }
    }
    return 0;
}

```

## Floyd 数学

因为 Floyd 算法基于邻接矩阵存图，所以它可以通过矩阵运算来实现一些图上的计数问题。

### P2886 [USACO07NOV] Cow Relays G

题目地址：[P2886](https://www.luogu.com.cn/problem/P2886)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

> 给定一张 $T$ 条边的无向连通图，求从 $S$ 到 $E$ 经过 $N$ 条边的最短路长度。
>
> **输入格式**
>
> 第一行四个正整数 $N,T,S,E$ ，意义如题面所示。
>
> 接下来 $T$ 行每行三个正整数 $w,u,v$ ，分别表示路径的长度，起点和终点。
>
> **输出格式：**
>
> 一行一个整数表示图中从 $S$ 到 $E$ 经过 $N$ 条边的最短路长度。

类比矩阵乘法的定义式：$C_{ij}=\sum\limits_{k=1}^{n}A_{ik}B_{kj}$。是不是很像松弛操作时的下标？其实将邻接矩阵乘幂就可以看作枚举可达的两点路径。相应的，在无权图中求诸如“从起点到终点经过 $N$ 条边的路径总数”就可以将邻接矩阵乘 $N$ 次幂。但如果是像这道题，是带边权的形式，又该如何操作？

我们把矩阵乘法重新变成如下的形式：

$$
C_{ij}=\operatorname{min}(C_{ij},A_{ik}+B_{kj})
$$

就可以做了，有点像在矩阵乘幂的同时跑最短路。将上文所说的无权图情况和带权 Floyd 有机结合了起来。加入快速幂可以进一步优化。需要注意的是矩阵的初始化。

```cpp
#include <bits/stdc++.h>
#define N 210
using namespace std;

typedef long long ll;

struct Matrix {
    ll mat[N][N];

    Matrix() {
        memset(mat, 0, sizeof mat);
    }

    void init() {
        for (int i = 1; i <= N - 1; i++) mat[i][i] = 1;
    }

    void zero() {
        for (int i = 1; i <= N - 1; i++) mat[i][i] = 0;
    }

    void inf() {
        memset(mat, 0x2a, sizeof mat);
    }
};

int n, t, S, E;
int cnt = 0;
Matrix g;

Matrix operator*(const Matrix &A, const Matrix &B) {
    Matrix C;
    C.inf();
    for (int k = 1; k <= t; k++) {
        for (int i = 1; i <= t; i++) {
            for (int j = 1; j <= t; j++) {
                C.mat[i][j] = min(C.mat[i][j], A.mat[i][k] + B.mat[k][j]);
            }
        }
    }

    return C;
}

Matrix qpow(Matrix a, int b) {
    Matrix res;
    res.inf();
    res.zero();
    while (b) {
        if (b & 1) res = res * a;
        a = a * a;
        b >>= 1;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    cin >> n >> t >> S >> E;

    g.inf();

    map<int, int> mp;
    mp[S] = ++cnt;
    mp[E] = ++cnt;
    S = mp[S], E = mp[E];
    for (int i = 1; i <= t; i++) {
        ll w;
        int u, v;
        cin >> w >> u >> v;
        if (!mp.count(u)) mp[u] = ++cnt;
        if (!mp.count(v)) mp[v] = ++cnt;

        u = mp[u], v = mp[v];

        g.mat[u][v] = g.mat[v][u] = min(g.mat[u][v], w);
    }
    g = qpow(g, n);
    cout << g.mat[S][E] << endl;
    return 0;
}

```

## 小结

Floyd 作为一个最短路算法具备了图论和数学计算的双重功能，只是在实际运用中需要留意它 $\mathcal O(n^3)$ 的时间复杂度。对于较大的点数/稀疏图，建议使用 Dijkstra 或 Bellman-Ford；但若是一个稠密图，或者是点数较少，且需要求出一些奇奇妙妙的数据，那么就可以考虑一下 Floyd。
