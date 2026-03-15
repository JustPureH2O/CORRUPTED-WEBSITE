---
slug: '6669'

category: 题解
published: 2024-09-28T20:29:22.486492+08:00
image: https://pic.imgdb.cn/item/66e6bde8d9c307b7e9a2d572.jpg
tags:
- oi
- 算法
- 题解
- 数论
title: P6669 - [清华集训2016] 组合数问题 题解
updated: 2024-09-28T20:29:36.436+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[P6669](https://www.luogu.com.cn/problem/P6669)

看到超大组合数对质数取模首先考虑朴素 $\texttt{Lucas}$ 定理，定理内容如下：

$$
\binom{n}{m}\bmod p=\binom{\lfloor\frac{n}{p}\rfloor}{\lfloor\frac{m}{p}\rfloor}\times\binom{n\bmod p}{m\bmod p}
$$

其中第一项可以继续递归。但是这里要涉及到 $\texttt{Lucas}$ 定理的另外一个意义——发现这个公式实质上是在对 $n,m$ 进行 $p$ 进制分解。整个组合数可以看作是将 $n,m$ 转换为 $p$ 进制后对位求组合数然后累乘得到的，即：

$$
\binom{n}{m}=\prod\limits_{i=1}^{k}\binom{n_i}{m_i}
$$

其中 $k$ 为 $n,m$ 在 $p$ 进制下位数的最大值，若位数不够则将该位看作 $0$。

如果一个数要是 $k$ 的倍数，那么这个数模 $k$ 的结果一定是 $0$。根据 $\texttt{Lucas}$ 定理，在连乘过程中，必须至少出现一个零项，最终结果才会是 $0$。根据组合数 $\binom{a}{b}$ 在 $b>a$ 时结果为 $0$ 的性质，可知我们需要统计 $p$ 进制下有多少 $j$ 有至少一个位严格大于 $i$，此时同时对 $i,j$ 数位 DP 即可。

```cpp
#include <bits/stdc++.h>

#define N 62
#define MOD 1000000007
using namespace std;

typedef long long ll;

int numN[N], numM[N];
ll f[N][2][2][2][2];
int k;

ll dfs(int pos, bool valid, bool limitN, bool limitM, bool limitI) {
//     当前位   是否已合法   i顶到上界n   j顶到上界m   j顶到上界i
    if (pos < 0) return valid;
    if (f[pos][valid][limitN][limitM][limitI] >= 0) return f[pos][valid][limitN][limitM][limitI]; // 记忆化搜索
    ll sum = 0;
    for (int i = 0; i <= (limitN ? numN[pos] : k - 1); i++) {
        // 枚举 i 在这一位上填的数字
        for (int j = 0; j <= min((limitM ? numM[pos] : k - 1), (limitI ? i : k - 1)); j++) {
            // 枚举 j 在这一位上填的数字，注意需要满足 j 不超过 i 和 m 的最小值
            sum = (sum + dfs(pos - 1, valid | (j > i), limitN & (i == numN[pos]), limitM & (j == numM[pos]),limitI & (i == j))) % MOD;
        }
    }
    f[pos][valid][limitN][limitM][limitI] = sum;
    return sum;
}

ll calc(ll n, ll m) {
    memset(numN, 0, sizeof numN);
    memset(numM, 0, sizeof numM);
    memset(f, -1, sizeof f);

    // 进制分解
    int size1 = 0, size2 = 0;
    ll tmp1 = n, tmp2 = m;
    while (tmp1) {
        numN[size1++] = tmp1 % k;
        tmp1 /= k;
    }
    while (tmp2) {
        numM[size2++] = tmp2 % k;
        tmp2 /= k;
    }
    return dfs(max(size1, size2) - 1, false, true, true, true);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    memset(f, -1, sizeof f);

    int t;
    cin >> t >> k;
    while (t--) {
        ll n, m;
        cin >> n >> m;
        cout << calc(n, m) << endl;
    }
    return 0;
}
```

$\texttt{The End}$
