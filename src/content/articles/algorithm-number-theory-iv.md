---
slug: '29256'

category: oi算法
published: 2024-09-18T21:04:03.506503+08:00
tags:
- oi
- 算法
- 数论
title: 数论补完计划 Part4 中国剩余定理
updated: 2024-09-25T15:00:34.509+08:00
---
## 中国剩余定理

《孙子算经》有云：

> 今有物不知其数，三三数之剩二，五五数之剩三，七七数之剩二，问物几何？

大意为：有 $x$ 个物品，满足如下线性同余方程组：

$$
\begin{cases}
x\equiv2\pmod3
\\x\equiv3\pmod5
\\x\equiv2\pmod7
\end{cases}
$$

刚入坑编程的估计在“循环结构”那一章里就写过求解这个方程的枚举代码了。这种方式不好的一点就是码量随方程数的增多而膨胀（~~但是你可以写一个生成计算代码的程序，然后运行编译后的程序~~）。我们急需一种通解，在码量不增的情况下实现对这个方程组的求解。

---

我们考虑拆开这个方程组，分别令 $x_1,x_2,x_3$ 满足：

$$
\begin{cases}
x_1\bmod3=2
\\x_2\bmod5=3
\\x_3\bmod7=2
\end{cases}
$$

两个方程组的写法其实是等价的，只是把同余转化为了带余除法罢了。我们惊奇地发现，如果再加上几个约束条件，原方程组的解 $x$ 就可以经过 $x_1,x_2,x_3$ 表示出来：

$$
\begin{cases}
x_1\bmod35=0
\\x_2\bmod21=0
\\x_3\bmod15=0
\end{cases}
$$

此时 $x=x_1+x_2+x_3$，因为 $(x_1+x_2+x_3)\bmod 3=x_1\bmod3+x_2\bmod3+x_3\bmod3=2+0+0=2$，其他同理。

而我们的中国剩余定理断言道，对于模数均互质的 $n$ 元线性同余方程组：

$$
\begin{cases}
x_1\equiv a_1\pmod{M_1}
\\x_2\equiv a_2\pmod{M_2}
\\x_3\equiv a_3\pmod{M_3}
\\\qquad\vdots
\\x_n\equiv a_n\pmod{M_n}
\end{cases}
$$

它的解 $x\equiv\sum\limits_{i=1}^na_im_im_i^{-1}\pmod M$，其中 $M=\prod\limits_{i=1}^nM_i,m_i=\frac{M}{M_i}\pmod{M_i}$。因此只需要计算同余号右侧的部分即可，由于方程组模数互质并不等于每个方程的模数是质数，因此需要用到[扩展欧几里得算法](https://justpureh2o.cn/articles/47621/#%E4%B9%98%E6%B3%95%E9%80%86%E5%85%83)来求解逆元。

```cpp
int n;
ll m[N], a[N];
ll M = 1;

ll exgcd(ll a, ll b, ll &x, ll &y) {
    if (!b) {
        x = 1, y = 0;
        return a;
    }
    ll d = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}

ll inv(ll x, ll p) {
    ll ans, tmp;
    exgcd(x, p, ans, tmp);
    return (ans % p + p) % p;
}

ll CRT() {
    ll res = 0;
    for (int i = 1; i <= n; i++) M *= m[i];
    for (int i = 1; i <= n; i++) {
        ll Mi = M / m[i];
        res += a[i] * Mi * inv(Mi, m[i]);
    }
    return res % M;
}
```

## 扩展中国剩余定理

经历过数论大风大浪的应该都知道，马上要开始推导模数不全互质的情况了。

还是那个方程组：

$$
\begin{cases}
x_1\equiv a_1\pmod{M_1}
\\x_2\equiv a_2\pmod{M_2}
\\x_3\equiv a_3\pmod{M_3}
\\\qquad\vdots
\\x_n\equiv a_n\pmod{M_n}
\end{cases}
$$

此时不保证 $M_1\sim M_n$ 两两互质，求出方程的最小正整数解。此时因为失去了互质，构造通解的方式已经不能用了。因此我们转而寻找另外的方法来简化这个方程组。

对大量事实的观测表明，两个线性同余方程在合并后遵循如下性质：

1. 模数变为原两个方程模数的最小公倍数
2. 合并得到的方程与原方程同型
3. 合并得到的方程不一定有解

也即：

$$
\begin{aligned}
\begin{cases}
x\equiv4\pmod6
\\x\equiv3\pmod5
\end{cases}&\Rightarrow
x\equiv28\pmod{30}
\\\begin{cases}
x\equiv2\pmod4
\\x\equiv3\pmod6
\end{cases}&\Rightarrow\varnothing
\end{aligned}
$$

事实上，假设我们有方程 $x\equiv a_1\pmod{m_1}$ 和 $x\equiv a_2\pmod{m_2}$。那么转化成带余方程之后就有：

$$
\begin{aligned}
x&=k_1m_1+a_1=k_2m_2+a_2
\\k_1m_1+a_1&=k_2m_2+a_2
\\k_1m_1-k_2m_2&=a_2-a_1
\\m_1k_1-m_2k_2&=a_2-a_1
\end{aligned}
$$

观察到这是二元一次不定方程 $ax+by=c$ 的形式，根据贝祖定理，有解的充要条件是 $\gcd(m_1,m_2)\mid(a_2-a_1)$，因此无解情况就可以筛去了。

约去最大公倍数得：$\frac{m_1}{\gcd(m_1,m_2)}k_1-\frac{m_2}{\gcd(m_1,m_2)}k_2=\frac{a_2-a_1}{\gcd(m_1,m_2)}$。用扩展欧几里得解出方程 $m_1t_1+m_2t_2=1$ 的特解 $t_1,t_2$，那么 $k_1,k_2$ 可以用如下关系得到：

$$
\begin{cases}
k_1=t_1\frac{a_2-a_1}{\gcd(m_1,m_2)}
\\k_2=-t_2\frac{a_2-a_1}{\gcd(m_1,m_2)}
\end{cases}
$$

于是 $x=k_1m_1+a_1=m_1t_1\frac{a_2-a_1}{\gcd(m_1,m_2)}+a_1$。用 $k_2$ 去代结果是一样的。

那么对于方程

$$
\begin{cases}
x\equiv a_1\pmod{m_1}
\\x\equiv a_2\pmod{m_2}
\end{cases}
$$

仅当 $\gcd(m_1,m_2)\mid(a_2-a_1)$ 时有整数解 $x=m_1t_1\frac{a_2-a_1}{\gcd(m_1,m_2)}+a_1$。那么方程的通解可以表示成 $x+\lambda\operatorname{lcm}(m_1,m_2),\lambda\in\mathbb Z$ 的形式，这样就能解释合并后方程的模数为什么为最小公倍数了。

我们假设 ${0\leq p\leq q<\operatorname{lcm(m_1,m_2)}}$，并假设存在关系：

$$
\begin{cases}
p\equiv a_1\pmod{m_1}
\\p\equiv a_2\pmod{m_2}
\end{cases}\qquad\begin{cases}
q\equiv a_1\pmod{m_1}
\\q\equiv a_2\pmod{m_2}
\end{cases}
$$

做差可得：

$$
\begin{cases}
q-p\equiv0\pmod{m_1}
\\q-p\equiv0\pmod{m_2}
\end{cases}
$$

得到关系 $m_1\mid(q-p),m_2\mid(q-p)\Rightarrow\operatorname{lcm}(m_1,m_2)\mid(q-p)$。注意到两个数的最小公倍数一定满足 $\operatorname{lcm}(a,b)\geq\max(a,b)$。但是对于非负整数 $p,q$ 来说，$q-p\leq\max(p,q)$ 是一定成立的，且在 $p=q$ 时取得等号，那么当且仅当在 $p=q$ 时才存在最小公倍数的整除关系。因此导出式是一定正确的。

---

总结一下，对于方程组：

$$
\begin{cases}
x\equiv a_1\pmod{m_1}
\\x\equiv a_2\pmod{m_2}
\end{cases}
$$

有解的充要条件是 $\gcd(m_1,m_2)\mid(a_2-a_1)$。若已知有解，假设二元一次不定方程 $m_1t_1+m_2t_2=1$ 的特解是 $t_1,t_2$，并记 $S=\operatorname{lcm}(m_1,m_2)=\frac{m_1m_2}{\gcd(m_1,m_2)},D=\gcd(m_1,m_2)$，那么原方程等价于：

$$
x\equiv m_1t_1\frac{a_2-a_1}{D}+a_1\pmod S
$$

```cpp
#include <bits/stdc++.h>

#define N 100010
using namespace std;

typedef long long ll;

struct Equation {
    ll a, m;
};

ll a[N], b[N];
stack <Equation> stk;

ll exgcd(ll a, ll b, ll &x, ll &y) {
    // 扩展欧几里得过程，求解特解 t1 和 t2
    if (!b) {
        x = 1, y = 0;
        return a;
    }
    ll d = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}

ll mul(ll a, ll b, ll p) {
    // 著名的龟速乘，就是把快速幂中的乘号改成加号，用来在不爆范围的情况下计算乘积取模的结果
    ll res = 0;
    bool flag = (b < 0) ^ (a < 0); // 处理负数情况，同号相乘为正，异号为负
    a = abs(a) % p;
    b = abs(b) % p;
    // 注意到：a * (-b) = -(a * b)，数字按绝对值相乘，负号最后处理
    while (b) {
        if (b & 1) res = (res + a) % p;
        a = (a + a) % p;
        b >>= 1;
    }
    return res * (flag ? -1 : 1) % p; // 处理负号
}

ll exCRT() {
    while (stk.size() > 1) {
        // 不断合并方程直至剩下最后一个
        Equation cur = stk.top();
        stk.pop();
        Equation nxt = stk.top();
        stk.pop();

        ll t1, t2;
        ll D = gcd(cur.m, nxt.m);
        ll S = lcm(cur.m, nxt.m);
        if ((nxt.a - cur.a) % D != 0) return -1; // 无解判断
        exgcd(cur.m, nxt.m, t1, t2); // 求解特解
        ll X = ((mul(mul(cur.m, t1, S), (nxt.a - cur.a) / D, S)) + cur.a) % S;
        stk.push((Equation) {X, S});
    }
    Equation res = stk.top();
    return (res.a % res.m + res.m) % res.m; // 转为正整数
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> a[i] >> b[i];
    for (int i = 1; i <= n; i++) stk.push((Equation) {b[i], a[i]});
    cout << exCRT() << endl;

    return 0;
}

```
