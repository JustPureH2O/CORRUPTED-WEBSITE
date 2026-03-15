---
slug: '35098'

category: 题解
published: 2024-08-05T20:42:47.431066+08:00
image: https://pic.imgdb.cn/item/66a76b76d9c307b7e91171ca.jpg
tags:
- 题解
- 图论
title: CF 1404E - Bricks 题解
updated: 2024-08-06T10:11:34.929+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[CF1404E - Bricks](https://www.luogu.com.cn/problem/CF1404E)

初做这道题时，我发现它和 [P6062 - Muddy Fields G](https://www.luogu.com.cn/problem/P6062) 神似。于是冲动交了一发，吃了 WA。仔细审题发现，这道题要求所用**木板不能重叠**。因此寻找其他的解题方法。

现在我们的当务之急是找出一个处理木板重叠的好方法，从黑色格子的分布入手——木板重叠放置的唯一可能就是当前黑色方格位于一个交叉的位置，如下图：

![](https://cdn.luogu.com.cn/upload/image_hosting/dflbgdef.png)

位于交点上的黑色方格可能被同时划分到橙色和蓝色的木板里去，这是题目不允许的，但这也启发我们在位于交点位置上的黑色方格做特定的操作。也就是说，当确定选择使用蓝色木板覆盖后，橙色木板就不能再覆盖交点位置。考虑把原图改换成如下形式：

![](https://cdn.luogu.com.cn/upload/image_hosting/gar81kek.png)

当选择 $3$ 号点后（蓝色木板），$2$ 号就不能再选。何不考虑在“仇家”之间连边？也就是连接边 $(2,3)$，对于整张图，按此方法全部连边。题目要求我们覆盖住所有的黑色方格，并且还不能同时选择一条边上的两个端点（因为它们是敌人）。此时突然想到，这是二分图的最大点独立集问题。

在一张二分图中，选出若干点组成一个点集，使得点集里任意两点都不互通。原图中满足以上要求且所含点最多的集合叫做原二分图的最大点独立集。感性理解一下：我们需要选出尽量少的点丢弃，使得剩下的点不互通，考虑到最小点覆盖的定义，把属于最小点覆盖集的所有点从图中去掉，此时图上的每条边均只剩一个端点，满足定义，于是最大点独立集的大小就等于总点数减去最小点覆盖集的大小（根据 $\texttt{K\"onig}$ 定理，又有最小点覆盖集的大小等于二分图最大匹配数），推导出它等价于求：**总点数减去最大匹配数**。

不妨设所有新加的边组成一个新图 $G$，换到这道题上来，就是：

> 黑色方格总数减去黑色方格间的总边数再加上 $G$ 的最大匹配数

此后，把原图中的边当作一个点进行编号，并统计黑色方格数；然后统计所有位于交叉位置的黑色方格，并根据上述的连接方式连边，顺带统计黑色方格间的边数；最后在新图上做最大匹配，根据公式计算出结果即可。我为边编号的方式较为繁琐，理解思路后自行编号计算即可。

```cpp
#include <bits/stdc++.h>
#define N 210     // 题目所给最大长宽
#define M 1000010
#define K 80000   // 化边为点后最多 n(m-1)+m(n-1) 个点，极限情况下等于79600
using namespace std;

struct Edge {
    int to, ne;
} edges[M];
int h[N * N], idx = 0; // 方阵中最多 n^2 个点
char land[N][N];       // 暂存原图
int id[N][N];          // 按顺序给点编号
int match[K];          // 新图最多 K 个点
bool st[K], vis[N * N][4]; // vis 用作搜索判重，记录当前点是从哪个方向扩展而来的
int edge = 0, point = 0;
int n, m;

void add(int a, int b) {
    idx++;
    edges[idx].to = b;
    edges[idx].ne = h[a];
    h[a] = idx;
}

bool hungary(int u) {
    // 匈牙利算法，二分图最大匹配
    for (int i = h[u]; ~i; i = edges[i].ne) {
        int j = edges[i].to;
        if (!st[j]) {
            st[j] = true;
            if (!match[j] || hungary(match[j])) {
                match[j] = u;
                return true;
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

    cin >> n >> m;
    int tmp = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            cin >> land[i][j];
            id[i][j] = ++tmp;
            if (land[i][j] == '#') point++; // 统计黑色方格个数
        }
    }
    // 写得稀烂，建议理解后自己写一个
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (land[i][j] == '#') {
                if (land[i - 1][j] == '#' && land[i][j - 1] == '#') {
                    add(id[i][j] - i, n * (m - 1) + (i - 2) * m + j);
                }
                if (land[i - 1][j] == '#' && land[i][j + 1] == '#') {
                    add(id[i][j] - i + 1, n * (m - 1) + (i - 2) * m + j);
                }
                if (land[i + 1][j] == '#' && land[i][j + 1] == '#') {
                    add(id[i][j] - i + 1, n * (m - 1) + (i - 1) * m + j);
                }
                if (land[i + 1][j] == '#' && land[i][j - 1] == '#') {
                    add(id[i][j] - i, n * (m - 1) + (i - 1) * m + j);
                }
            }
        }
    }
    // 搜索统计边数
    int dx[4] = {1, -1, 0, 0};
    int dy[4] = {0, 0, 1, -1};
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (land[i][j] == '#') {
                for (int k = 0; k < 4; k++) {
                    int nx = i + dx[k];
                    int ny = j + dy[k];
                    if (nx < 1 || nx > n || ny < 1 || ny > m) continue;
                    if (land[nx][ny] != '#') continue;
                    if (vis[id[i][j]][k]) continue;
                    vis[id[i][j]][k] = true;
                    edge++;
                }
            }
        }
    }
    int res = 0;
    for (int i = 1; i <= n * (m - 1); i++) {
        memset(st, false, sizeof st);
        if (hungary(i)) res++;
    }
    // 由于搜索统计时重复扫了两遍，因此边数需要折半
    cout << point - edge / 2 + res << endl;
    return 0;
}
```

~~然后 in queue 一晚上~~

![](https://cdn.luogu.com.cn/upload/image_hosting/idb0hdk5.png)

$\texttt{CodeForces}~\textcolor{red}{\times}\qquad\texttt{QueuedForces}~\textcolor{green}{\checkmark}$
