---
slug: '8856'

category: oi算法
published: 2024-06-26T17:26:10.318422+08:00
tags:
- oi
- 算法
- 差分约束
title: 差分约束
updated: 2024-06-26T17:45:43.367+08:00
---
## 差分约束系统 理论基础

我们称形如下面给出的多元一次不等式组为一个**差分约束系统**：

$$
\begin{cases}
x_2-x_1\leq c_1
\\x_3-x_2\leq c_2
\\\qquad\vdots
\\x_n-x_{n-1}\leq c_{n-1}
\\x_1-x_n\leq c_n
\end{cases}
$$

它包含 $n$ 个未知数，以及 $m$ 个约束条件，每个约束条件是由两个未知数作差构成的不等式。

求解这个不等式组，我们首先考虑移项，例如第一个不等式变成：$x_2\leq x_1+c_1$。联想到最短路的三角不等式，即 $\text{dist}_j\leq\text{dist}_i+w_i$，这个方程组可以转化为一个最短路问题。具体到第一个不等式，就是创建边 $(1,2)$，边权为 $c_1$。在读入所有不等关系后在建出的图上做最短路即可。

最短路的源点首先要能遍历到所有的边，若某个点遍历不到所有的边，部分点的最短路值显然不能正确更新，导致整体错误。一般来说考虑建立虚拟源点代替。

如果原图存在负环，假设是下图的形式：

![](https://cdn.luogu.com.cn/upload/image_hosting/hwu8vvy1.png)

那么就有：$x_1\leq x_6-1$，$x_6$ 可以进一步放缩，因为 $x_6\leq x_5-5$，所以 $x_1\leq x_5-1-5$，而 $x_5$ 又可以接着放缩，依此类推……当放缩到 $x_2$ 时，原式已然变成了：

$$
x_1\leq x_2-1-2-2-5-1=x_2-11
$$

最后放缩得 $x_1\leq x_1-14$ 显然有矛盾。因此当出现负环时就判断无解。

否则，每个点的最短路径长就是原不等式组的一组可行解。特殊地，给定一个实数 $\Delta$ ，让所有未知数同时加/减去这个常数得到的新答案组也是成立的。

以 [P5960](https://www.luogu.com.cn/problem/P5960) 差分约束模板为例，给出求解代码：

```cpp
#include <bits/stdc++.h>

#define N 5010
#define M 5010
using namespace std;

struct Edge {
    int to, ne, w;
} edges[M];
int h[N], idx = 0;
int n, m;
int dist[N], cnt[N];
bool st[N];

void add(int u, int v, int w) {
    idx++;
    edges[idx].to = v;
    edges[idx].ne = h[u];
    edges[idx].w = w;
    h[u] = idx;
}

bool spfa() {
    memset(dist, 0x3f, sizeof dist);

    queue<int> q;
    for(int i = 1; i <= n; i++) {
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
                if (cnt[j] >= n) return false;
                if (!st[j]) {
                    st[j] = true;
                    q.push(j);
                }
            }
        }
    }
    return true;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    memset(h, -1, sizeof h);

    cin >> n >> m;
    while (m--) {
        int u, v, w;
        cin >> v >> u >> w;
        add(u, v, w);
    }
    if (!spfa()) cout << "NO" << endl;
    else {
        for (int i = 1; i <= n; i++) cout << dist[i] << ' ';
    }
    return 0;
}
```

---

那么如何求出未知数的最值呢？当所求为未知数的最大值时，最短路径长度就是最小解；反之最长路径长度为最大解。

首先该不等式组必须有解，因此所有不等式可以排列成一串 $x_1\leq x_2+c_1\leq x_3+c_1+c_2\leq\dots\leq x_n+c_1+\dots+c_{n-1}$。此时 $x_1$ 显然最小值是 $-\infty$，但最大值就不是正无穷了，可以发现它的最大值是不等号连接的每一项的最小值。也就是到达这个点的最短路径长度；反之就是最长路径长度，此时图中若存在正环则无解。

## 差分约束典例

### 洛谷 P3275 [SCOI2011] 糖果

~~四川OI有很多典中典的题目，不只是这一道，包括繁忙的都市、k短路、方伯伯运椰子、序列操作等都是四川OI的杰作~~

题目地址：[P3275](https://www.luogu.com.cn/problem/P3275)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

题目来源：<span data-luogu data-source>各省省选</span>&nbsp;&nbsp;<span data-luogu data-region>四川</span>&nbsp;&nbsp;<span data-luogu data-date>2011</span>

> 幼儿园里有 $N$ 个小朋友，$\text{lxhgww}$ 老师现在想要给这些小朋友们分配糖果，要求每个小朋友都要分到糖果。但是小朋友们也有嫉妒心，总是会提出一些要求，比如小明不希望小红分到的糖果比他的多，于是在分配糖果的时候，$\text{lxhgww}$ 需要满足小朋友们的 $K$ 个要求。幼儿园的糖果总是有限的，$\text{lxhgww}$ 想知道他至少需要准备多少个糖果，才能使得每个小朋友都能够分到糖果，并且满足小朋友们所有的要求。
>
> **输入格式**
>
> 输入的第一行是两个整数 $N$，$K$。接下来 $K$ 行，表示这些点需要满足的关系，每行 $3$ 个数字，$X$，$A$，$B$。
>
> + 如果 $X=1$， 表示第 $A$ 个小朋友分到的糖果必须和第 $B$ 个小朋友分到的糖果一样多；
> + 如果 $X=2$， 表示第 $A$ 个小朋友分到的糖果必须少于第 $B$ 个小朋友分到的糖果；
> + 如果 $X=3$， 表示第 $A$ 个小朋友分到的糖果必须不少于第 $B$ 个小朋友分到的糖果；
> + 如果 $X=4$， 表示第 $A$ 个小朋友分到的糖果必须多于第 $B$ 个小朋友分到的糖果；
> + 如果 $X=5$， 表示第 $A$ 个小朋友分到的糖果必须不多于第 $B$ 个小朋友分到的糖果；
>
> **输出格式：**
>
> 输出一行，表示 $\text{lxhgww}$ 老师至少需要准备的糖果数，如果不能满足小朋友们的所有要求，就输出 $-1$。
>
> **数据范围：**
>
> 对于 ${30\%}$ 的数据，保证 $N\leq100$
>
> 对于 ${100\%}$ 的数据，保证 $N\leq100000$
>
> 对于所有的数据，保证 $K\leq100000, 1\leq X\leq5, 1\leq A, B\leq N$

根据题目中给出的五种大小关系，可以列出如下不等式组：

$$
\begin{cases}
A\leq B,B\leq A&\dots1
\\A+1\leq B&\dots2
\\B\leq A&\dots3
\\B+1\leq A&\dots4
\\A\leq B&\dots5
\end{cases}
$$

可以直接按照上一节所说的方式建图，注意第一种情况相当于建边权为 ${0}$ 的双向边。

题目中还有一个要求——“每个小朋友都要分到糖果”，转换一下就是 $\forall i\in[1,n],x_i\geq1$。那么像这种要求解必须大于一个常数的情况该怎么样操作呢？

考虑到建立虚拟源点 ${0}$，并令 $x_0=0$，则原式化为 $x_i\geq x_0+1$。因此建立边权为 ${1}$ 的边 $(0,i)$ 即可。因为要求出所有未知数的最小值，因此要跑最长路，同时无解的判断就是存在正环。在 $\texttt{SPFA}$ 里，做最长路就是把松弛操作的不等号换向，同时初始化距离为正无穷。

```cpp

```
