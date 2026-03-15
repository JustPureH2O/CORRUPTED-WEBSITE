---
slug: '11253'

category: 题解
published: 2024-11-09T18:00:33.445321+08:00
image: https://pic.imgdb.cn/item/67256b2cd29ded1a8c25a9bb.jpg
tags:
- oi
- 数学
- 题解
title: P11253 [GDKOI2023 普及组] 小学生数学题
updated: 2024-11-09T18:00:33.798+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[P11253](https://www.luogu.com.cn/problem/P11253)

题目难度：<span data-luogu data-green>普及/提高+</span>

题目来源：<span data-luogu data-region>广东</span>&nbsp;&nbsp;<span data-luogu data-date>2023</span>

> 求出和式 $\sum\limits_{i=1}^n\frac{i!}{i^k}$ 的值，$1\leq n,k\leq2\times10^7$

开始我以为这只是一道快速幂的大水题，$5min$ 敲了一个快速幂然后测试了一下大样例，发现 T 飞了。于是我又用上了不知从哪道题里学来的十进制快速幂，结果还是不行。最后我又类比十进制快速幂写了个百进制快速幂，希望能过一些点，最后还是全 T……

注意到维护阶乘的复杂度是 $\mathcal O(n)$，实际上该题的瓶颈在于如何快速求出 $1\sim n$ 内每个数的 $k$ 次幂。其次，注意到 $(ab)^k=a^kb^k$，也即 $f(ab)=f(a)f(b)$，显然是一个积性函数。

又发现线性筛在筛去合数时有一个乘积的形式，于是我们可以借用这个思路，在筛去合数的同时维护这个函数。

```cpp
#include <bits/stdc++.h>
#define MOD 998244353
#define N 20000010
using namespace std;

typedef long long ll;

int n, k;
int cnt = 0;
ll prime[N], p[N];
bool st[N];

ll qpow(ll a, ll b) {
    ll res = 1;
    while (b) {
        if (b & 1) res = res * a % MOD;
        a = a * a % MOD;
        b >>= 1;
    }
    return res % MOD;
}

ll inv(ll x) {
    return qpow(x, MOD - 2);
}

void sieve() {
    p[1] = 1;
    for (int i = 2; i <= n; i++) {
        if (!st[i]) {
            prime[++cnt] = i;
            p[i] = inv(qpow(i, k));
        }
        st[i] = true;
        for (int j = 1; i * prime[j] <= n; j++) {
            if (prime[j] > p[i] || j > cnt) break;
            st[i * prime[j]] = true;
            p[i * prime[j]] = p[prime[j]] * p[i] % MOD; // 维护积性函数
            if (i % prime[j] == 0) break;
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    cin >> n >> k;
    sieve();
    ll fac = 1;
    ll ans = 0;
    for (int i = 1; i <= n; i++) {
        fac = fac * i % MOD; // 线性维护阶乘
        ans = (ans + fac * p[i] % MOD) % MOD; // 计算
    }
    cout << ans << endl;
    return 0;
}
```

$\texttt{The End}$

