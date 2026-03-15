---
slug: '40858'
category: 题解
published: 2024-08-06T10:07:39.386148+08:00
image: https://pic.imgdb.cn/item/66a86012d9c307b7e9bdc16e.jpg
tags:
- 题解
- 图论
title: CF 1728F - Fishermen 题解
updated: 2024-08-06T11:45:19.561+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[CF 1728F - Fishermen](https://www.luogu.com.cn/problem/CF1728F)

这道题很难一眼看出所用算法，因此先从题目本身入手。

可以发现，当每个 $b_i$ 都满足 $a_i\mid b_i$，且 $b_i$ 互不相同时，题目所给的两个构造条件就是不必要的。因为我们可以通过重排 $\{b\}$ 来满足这两条要求。

所以先来处理 $a_i\mid b_i$。$\mid$ 符号代表整除，也就是说 $b_i\div a_i$ 的结果是一个整数。换个思路，$a_i\times k=b_i,k\in\mathbb Z$。考虑到 $b_i$ 自带一个 $min$ 的性质，$k$ 取太大是不优的，于是设置 $k\in[1,n]$，预处理出 $a_i$ 一定范围内的倍数作为 $b_i$ 的候选。由于倍数可能很大，因此考虑离散化存储。

现在问题转化成了，让每一个 $a_i$ 匹配一个满足条件的 $b_i$。二分图的味道就来了，考虑把所有 $a_i$ 作为左部点，预处理的所有倍数作为右部点，把存在倍数关系的左右点连起来，就是一个合法的二分图了。

最后还需要处理一个要求：最小化 $\sum b_i$。把预处理的倍数从小到大排序、排列在右部就可以做到。提供一个优化的技巧：仅在某个点匹配成功后再清空 `st` 数组，如此可以优化时间复杂度到 $\mathcal O(n^3)$。

```cpp
#include <bits/stdc++.h>

#define N 1000010
#define M 1000010

using namespace std;
typedef long long ll;

struct Edge {
    int to, ne;
} edges[M << 1];
int h[N], idx = 0;
int a[N], b[N];
bool st[N];
int match[N];
vector<int> unq;
map<int, int> discrete;
int n;

void add(int a, int b) {
    idx++;
    edges[idx].to = b;
    edges[idx].ne = h[a];
    h[a] = idx;
}

bool hungary(int u) {
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

    cin >> n;
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) {
        for (int k = 1; k <= n; k++) {
            unq.push_back(a[i] * k); // 处理倍数，预备去重
        }
    }
    sort(unq.begin(), unq.end());
    int cnt = unique(unq.begin(), unq.end()) - unq.begin(); // 去重，顺带升序排序
    int disc = 0;
    for (int i = 0; i < cnt; i++) {
        // 离散化
        discrete[unq[i]] = ++disc;
        b[disc] = unq[i]; // 去重前就已完成排序，直接赋值
    }
    for (int i = 1; i <= n; i++) {
        for (int k = 1; k <= n; k++) {
            add(discrete[a[i] * k] + n, i);
        }
    }
    ll ans = 0;
    int res = 0;
    for (int i = 1; i <= cnt; i++) {
        if (hungary(i + n)) {
            // 优化
            memset(st, false, sizeof st);
            res++;
            ans += b[i];
        }
        if (res == n) break; // 总共匹配n个a
    }
    cout << ans << endl;
    return 0;
}

```

因为~~偷懒~~使用了 $\texttt{STL}$，程序执行效率并不是很高，$2.44s$ 拿倒数第五优，代码仅供参考。

$\texttt{The End}$
