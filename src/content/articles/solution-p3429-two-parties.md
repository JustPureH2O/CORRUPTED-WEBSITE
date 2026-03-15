---
slug: '3429'

category: 题解
published: 2024-10-07T09:37:24.903704+08:00
image: https://pic.imgdb.cn/item/66e56c92d9c307b7e904e723.jpg
tags:
- oi
- 算法
- 线性代数
title: P3429 [POI2005] DWA - Two Parties 题解
updated: 2024-10-07T10:01:42.635+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[P3429](https://www.luogu.com.cn/problem/P3429)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

题目来源：<span data-luogu data-source>POI Poland</span>&nbsp;&nbsp;<span data-luogu data-date>2005</span>

> 拜占庭国王要举办两个大派对，并且希望邀请更多的居民。
>
> 国王从他的丰富经验里知道，如果一个居民在派对上能遇到偶数个的朋友，那他会非常高兴。因此，他要求你邀请国家的居民去两个派对，而使尽可能多的人在他们的聚会上有偶数个的朋友。认识是一种对称关系，如 $A$ 认识 $B$，那么 $B$ 也认识 $A$。
>
> 输出第一行是一个整数 $M$，是前往第一个排队的人数。第二行 $M$ 个整数，是去第一个派对的居民编号，其余的居民前往第二个派对。如果有多种答案，你只需要输出一个。

建方程组的思路和 [P6126 始祖鸟](https://justpureh2o.cn/articles/9850/) 相同。分朋友数的奇偶性讨论，如果朋友数是偶数，那么只要 $A,B$ 任意一处出现偶数个朋友，另一处就一定也会出现偶数个朋友，那么这个人去哪里都可以；如果朋友数是奇数，且在 $A$ 地出现奇数个朋友，那么 $B$ 地就一定会有偶数个朋友，他只能去 $B$ 地，反之亦然。

如果第 $i$ 个人去 $A$ 地，那么令 $x_i=1$，否则令 $x_i=0$。对于有偶数个朋友的人，只要他的朋友里存在偶数个 ${1}$ 和偶数个 ${0}$ 即可，不难发现，这些朋友的代表值异或起来是等于 ${0}$ 的；相对地，对于有奇数个朋友的人，他只能去偶数的那一方，此时如果算上这个人，就会出现偶数个 ${0/1}$ 和奇数个 ${1/0}$，全部异或的结果是 ${1}$。然后就可以列方程组求解了。

```cpp
#include <bits/stdc++.h>
#define N 210
using namespace std;

bitset<N> matrix[N];
bitset<N> ans;
int n;

void out() {
    cerr << "-----------------" << endl;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n + 1; j++) {
            cerr << setw(5) << matrix[i][j];
        }
        cerr << endl;
    }
    cerr << "-----------------" << endl;
}

int gauss() {
    int rank = 0;
    for (int c = 1, r = 1; c <= n; c++) {
        int t = r;
        for (int i = r; i <= n; i++) {
            if (matrix[i].test(c)) {
                t = i;
                break;
            }
        }
        if (!matrix[t].test(c)) continue;
        if (t ^ r) swap(matrix[r], matrix[t]);

        for (int i = 1; i <= n; i++) {
            if (matrix[i].test(c) && i ^ r) {
                matrix[i] ^= matrix[r];
            }
        }
        r++;
        rank++;
    }
    if (rank < n) {
        for (int i = rank + 1; i <= n; i++) {
            if (matrix[i].test(n + 1)) return 0;
        }
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n + 1; j++) {
                if (matrix[i].test(j)) {
                    ans[j] = matrix[i][n + 1];
                    break;
                }
            }
        }
        return 1;
    }
    for (int i = 1; i <= n; i++) ans[i] = matrix[i][n + 1];
    return 2;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    cin >> n;
    for (int i = 1; i <= n; i++) {
        int k;
        cin >> k;
        if (k & 1) matrix[i].flip(i);
        matrix[i][n + 1] = k & 1;
        while (k--) {
            int x;
            cin >> x;
            matrix[i].flip(x);
        }
    }
    int res = gauss();
    if (res) {
        cout << ans.count() << endl;
        for (int i = 1; i <= n; i++) {
            if (ans.test(i)) cout << i << ' ';
        }
    } else cout << "Impossible" << endl;
    return 0;
}
```

$\texttt{The End}$
