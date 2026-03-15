---
slug: '12834'

category: 题解
published: 2024-09-01T09:13:04.595177+08:00
image: https://pic.imgdb.cn/item/667fc806d9c307b7e9470fff.jpg
tags:
- oi
- 算法
- 图论
title: P10939 - 骑士放置 题解
updated: 2024-09-01T09:40:10.073+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[P10939](https://www.luogu.com.cn/problem/P10939)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

> 给定一个 $N \times M$ 的棋盘，有一些格子禁止放棋子。
>
> 问棋盘上最多能放多少个不能互相攻击的骑士（国际象棋的“骑士”，类似于中国象棋的“马”，按照“日”字攻击，但没有中国象棋“别马腿”的规则）。
>
> ${1 \le N,M \le 100}$

看到数据范围，$N,M\leq100$，状压 DP 肯定是没戏的。转而寻找其他能够解决棋盘问题的算法。

棋盘是这样的（从隔壁 [P3355](https://www.luogu.com.cn/problem/P3355) 借的图）：

![](https://cdn.luogu.com.cn/upload/pic/2669.png)

骑士放在 $S$ 处，可以攻击到叉号的位置。

此时发现一个规律：骑士能攻击到的方格的颜色与当前被放置方格的颜色是相反的。如果我们让所有某色方格向能到达的异色方格连边，那么两个骑士能互相攻击到就意味着这两个骑士通过若干条边相连。

此时两种颜色的方格恰好组成一张二分图的左右部点；题目要求我们选择尽量多的点，使得选出的点任意两点不互通，我们就可以求这个二分图上的最大点独立集的大小来得到答案。

最大点独立集的大小可以用总点数减去最大匹配得到。由于本题设置了不可到达点，计算时同样也要减去、且进行匈牙利算法时需要排除它们。总的时间复杂度是 $\mathcal O(nm)$。

```cpp
#include <bits/stdc++.h>

#define N 210
using namespace std;

typedef pair<int, int> PII;

bool g[N][N];
PII match[N][N];
bool st[N][N];
int dx[8] = {-2, -1, 1, 2, -2, 1, -1, 2};
int dy[8] = {1, 2, 2, 1, -1, -2, -2, -1};
int n, m, k;

bool hungary(PII t) {
    for (int i = 0; i < 8; i++) {
        int nx = t.first + dx[i];
        int ny = t.second + dy[i];
        if (nx < 1 || nx > n || ny < 1 || ny > m) continue;
        if (st[nx][ny] || g[nx][ny]) continue;
        st[nx][ny] = true;
        if (!match[nx][ny].first || hungary(match[nx][ny])) {
            match[nx][ny] = t;
            return true;
        }
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    cin >> n >> m >> k;
    for (int i = 1; i <= k; i++) {
        int a, b;
        cin >> a >> b;
        g[a][b] = true;
    }
    int res = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if ((i + j) % 2 || g[i][j]) continue;
            memset(st, false, sizeof st);
            if (hungary((PII) {i, j})) res++;
        }
    }
    cout << n * m - res - k << endl;
    return 0;
}
```

$\texttt{The End}$
