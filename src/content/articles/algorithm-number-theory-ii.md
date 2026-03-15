---
slug: '47621'

category: oi算法
published: 2024-09-15T21:48:13.086196+08:00
tags:
- oi
- 算法
- 数论
title: 数论补完计划 Part2 欧几里得算法
updated: 2024-09-15T21:48:13.205+08:00
---
## 欧几里得算法

众所周知的是，欧几里得算法可以用来求解最大公约数。它的核心是一个恒等式 $\gcd(a,b)=\gcd(b,a\bmod b)$，并且在 $b=0$ 时函数值是 $a$。C++14 标准提供一个函数 `__gcd()` 来求解最大公约数，而在 C++17 以后，我们可以使用 `gcd()` 和 `lcm()` 函数来求解两个数的最大公约数和最小公倍数。

通常我们采用递归版本：

```cpp
int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}
```

当然，C++ 标准使用的是循环版本：

```cpp
int gcd(int a, int b) {
    while (b) {
        int t = a % b;
        a = b;
        b = t;
    }
    return a;
}
```

## 扩展欧几里得算法

今天的重头戏是我们的扩展欧几里得算法（简称“扩欧”）。它和一般的朴素-扩展定理不太一样，按照常理，应该是一个针对互质（朴素）、一个针对不互质（扩展）。但是欧几里得算法并不存在互质和不互质的差别，因而也就没有这样的区分。扩展欧几里得算法能够在求解最大公约数的基础上连带求出不定方程 $ax+by=c$ 的特解，也算是在功能方面上的一种“扩展”吧。

### 贝祖定理

也就是 $\texttt{Bezout}$ 定理，它表述为：

> 对于任意不全为零的整数 $a,b$，总存在整数 $x,y$，使得 $ax+by=\gcd(a,b)$ 成立

我们可以利用这个定理来判断不定方程解的情况。

**证明：**

当 $a,b$ 其一为 ${0}$ 时，显然成立。

当 $a,b$ 均不为 ${0}$ 时，有一个结论是 $\gcd(a,b)=\gcd(a,-b)$。那么问题可以收缩到只考虑 $a,b$ 同为正数时的情况了。接下来我们借用欧几里得算法的思路，即执行 $\gcd(a,b)\rightarrow\gcd(b,a\bmod b)$ 直到 $b=0$。假设初始参数为 $a,b$，并把欧几里得算法变为带余数的除法：

$$
\left\{\begin{array}{c}
a_1=k_1b_1+r_1
\\b_1=k_2r_1+r_2
\\r_1=k_3r_2+r_3
\\\vdots
\\r_{n-2}=k_nr_{n-1}+r_n
\\r_{n-1}=k_{n+1}r_n+r_{n+1}
\end{array}\right.
$$

退出时 $r_n=1$，则 $r_{n-2}-k_nr_{n-1}=1$，继续向上回代，最终得到 $ax+by=1$。两边同乘 $\gcd(a,b)$ 得到原式。

---

因此在方程 $ax+by=c$ 中，如果 $\gcd(a,b)\nmid c$，那么是铁定无解的。

### 扩展欧几里得

假如我们拿到一个方程 $ax+by=c$，并且已知它是有解的。我们一定可以把它化简成 $ax+by=\gcd(a,b)$ 的形式。根据欧几里得证明的最大公约数的等价变换，可以得到：

$$
bx+(a\bmod b)y=\gcd(b,a\bmod b)=\gcd(a,b)
$$

把取模换成带余除法，$a\bmod b$ 就等价于 $a-\lfloor\frac{a}{b}\rfloor b$，那么原式变为：

$$
bx+(a-\lfloor\frac{a}{b}\rfloor b)y=\gcd(a,b)
$$

即，

$$
ay+b(x-\lfloor\frac{a}{b}\rfloor y)=\gcd(a,b)
$$

发现这个式子和最开始的那个是同型的。也就是说我们每次递归的时候都需要把 $x$ 减去 $\lfloor\frac{a}{b}\rfloor y$ 然后代入计算。递归终点和朴素欧几里得算法相同，在 $b=0$ 时，原式为 $ax+by=a$，可以返回特解 $x=1,y=0$。注意传参时需要将 $x,y$ 反着传入。

借助 C++ 的引用特性，可以在每次递归时计算。

```cpp
int exgcd(int a, int b, int &x, int &y) {
    if (!b) {
        y = 0, x = 1;
        return a;
    }
    int d = exgcd(b, a % b, y, x);
    y -= (a / b) * x;
    return d;
}
```

### 不定方程的通解

我们都知道，通过扩展欧几里得算法求出的 $x,y$ 是一组特解，而不定方程是可能存在无数组解的。我们需要找到这些解之间的规律，从而更加方便快捷地导出具有某些特殊性质的解来。

对于一个二元一次不定方程的基本式 $ax+by=\gcd(a,b)$，显然有解。对于一般情况 $ax+by=c$，满足 $\gcd(a,b)\mid c$ 时才有解。一般式其实可以由基本式推导而来：$a\frac{cx}{\gcd(a,b)}+b\frac{cy}{\gcd(a,b)}=c$。

一组特解为 $x_0,y_0$，根据上边的推导式，可以得到：

$$
x_0=\frac{cx}{\gcd(a,b)},y_0=\frac{cy}{\gcd(a,b)}
$$

也因此，$ax_0+by_0=c$ 是成立的。假设有一个有理数 $\lambda$，显然下面的式子是成立的（拆开括号后会消去）：

$$
a(x_0+\lambda b)+b(y_0-\lambda a)=c
$$

我们一般只考虑整数解，所以需要保证 $\lambda b\in\mathbb Z,\lambda a\in\mathbb Z$。显然当 $\lambda=\frac{1}{\gcd(a,b)}$ 时是可行的，方程的整数通解就可以通过如下形式导出：

$$
x=x_0+k\frac{b}{\gcd(a,b)},y=y_0-k\frac{a}{\gcd(a,b)},k\in\mathbb Z
$$

题目中还会给你一些限制条件，例如 $x,y$ 的最大/小正整数解分别是多少。此时需要进一步推导。

假如限制条件是，$x,y$ 均为正整数。那么有如下不等式组：

$$
\begin{cases}
x_0+k\frac{b}{\gcd(a,b)}>0
\\y_0-k\frac{a}{\gcd(a,b)}>0
\end{cases}
$$

解得：

$$
k\in(-\frac{x_0\gcd(a,b)}{b},\frac{y_0\gcd(a,b)}{a})
$$

因为 $k$ 为整数，放缩得：

$$
\lceil\frac{-(x_0+1)\gcd(a,b)}{b}\rceil\leq k\leq\lfloor\frac{(y_0-1)\gcd(a,b)}{a}\rfloor
$$

当右边严格小于左边时，无解，即没有 $x,y$ 同为正整数的解。否则，注意到 $x_1$ 与 $k$ 成正关系，$y_1$ 与 $k$ 成负关系。$x$ 的最大可能整数值就由 $k$ 的上界代入得出，$y$ 的最大可能整数值是 $k$ 的下界对应的值，反之亦然。

```cpp
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;

ll exgcd(ll a, ll b, ll &x, ll &y) {
    if (!b) {
        x = 1, y = 0;
        return a;
    }
    ll d = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int t;
    cin >> t;
    while (t--) {
        ll a, b, c, x, y;
        cin >> a >> b >> c;
        if (c % gcd(a, b) == 0) {
            ll gcd = exgcd(a, b, x, y);
            x *= c / gcd, y *= c / gcd; // 转化为推导式
            ll low = ceil((1.0 - x) * gcd / b); // 算下界，浮点数1.0是必须的
            ll up = floor((y - 1.0) * gcd / a); // 上界
            if (up < low) {
                cout << (x + low * b / gcd) << ' ' << (y - up * a / gcd) << endl; // x,y 最小值
            } else {
                cout << up - low + 1 << ' '; // 区间大小
                cout << (x + low * b / gcd) << ' ' << (y - up * a / gcd) << ' '; // x,y 最小值
                cout << (x + up * b / gcd) << ' ' << (y - low * a / gcd) << endl;// x,y 最大值
            }
        } else cout << -1 << endl;
    }
    return 0;
}
```

### 乘法逆元

乘法逆元其实就是模意义下的倒数，因为取模是针对整数而言的，而实数域的倒数可能不是一个整数，所以引入一个乘法逆元的概念。定义线性同余方程 $ax\equiv1\pmod p$ 的解 $x$ 为 $a$ 在模 $p$ 意义下的乘法逆元，记作 $a^{-1}$。

根据定义，我们其实就可以直接开始用扩展欧几里得计算了。特殊情况下，当 $p$ 为质数时，由费马小定理得到 $a^{p-1}\equiv1\pmod p$，进而得 $a^{p-2}\equiv a^{-1}\pmod p$，因此当 $p$ 为质数时，逆元就是 $a^{p-2}\bmod p$ 的值，可以用快速幂解决（如果 $a,b$ 特别大可以考虑十进制快速幂）。

根据带余除法，我们把同余方程变成这样：$ax-py=1$。有解的条件就是 $\gcd(a,p)\mid 1$，只要 $a$ 是 $p$ 的倍数（包括 $0$），那么就不存在逆元。所以我们直接把 $a$ 和 $b=p$ 代入即可计算出逆元的值。注意解出的 $x$ 可能为负数，那么就需要用 `(x % MOD + MOD) % MOD` 来将它转化为非负数。

调用 `exgcd(a, p, x, y)` 所得 $x$ 即为逆元的值。
