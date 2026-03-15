---
slug: '16521'

category: oi算法
published: 2024-09-25T16:06:19.146790+08:00
tags:
- oi
- 算法
- 数论
title: 数论补完计划 Part5 组合计数
updated: 2024-09-28T16:29:00.402+08:00
---
## 排列数与组合数

### 排列组合基础

对于一个正整数 $n$，它的阶乘等于 $n\times(n-1)\times(n-2)\times\dots\times3\times2\times1=\prod\limits_{i=1}^{n}i$，记作 $n!$。特殊地，${0!=1}$。

小学时我们就知道，用 ${1,2,3}$ 三个数字最多能表示出 ${6}$ 个互不相同的三位数字；若改为 ${1,2,3,4}$ 组成四位数，那么答案就该是 ${24}$ 种。这其实就是排列数的一个经典应用。探究这个答案是怎么得到的——对于第一个位置，可以有 ${4}$ 种填数方法；对于第二个位置，因为先前已经用掉一个数了，此时可选的数就只剩 ${3}$ 个，根据分步乘法原理，就应该乘上 ${3}$，以此类推……我们会惊奇地发现答案其实就是 ${4!=24}$，或者可以表示成 $A_{4}^{4}$。

排列数 $A_n^m$ 是指从 $n$ 个物体中选出 $m$ 个并进行排列的总方案数。公式为 $A_n^m=n\times(n-1)\times(n-2)\times\dots\times(n-m+1)=\frac{n!}{(n-m)!}$。排列所隐含的意思是，选中的 $m$ 个物品之间是存在顺序差别的。例如上例选数字，${4321}$ 和 ${3421}$ 显然是不相同的两个数字，因此需要用到排列数。这也是它和组合数最大的差别。

上了高中，我们又知道，从 ${6}$ 个人中选出 ${2}$ 个人组队，总共能有 ${15}$ 种组队方案。答案是 $A_6^2$ 吗？鉴于 $A,B$ 一队和 $B,A$ 一对是等价的，那么其实队内的排序是不必要的，考虑到两个人能变出 ${2}$ 种排序，意味着同一个方案会出现两次，答案其实是 $\frac{A_6^2}{2}=15$。

组合数 $C_{n}^{m}$（或者用二项式表示法表示为 $\binom{n}{m}$）是指从 $n$ 个物体里选出 $m$ 个并进行组合的总方案数。公式为 $C_{n}^{m}=\frac{A_n^m}{A_m^m}=\frac{n!}{m!(n-m)!}=\frac{n\times(n-1)\times\dots\times(n-m+1)}{m\times(m-1)\times\dots\times3\times2\times1}$。它和排列数一样，只要 $n,m$ 均为正整数，那么结果也都是整数。特殊地，$A_n^0=A_n^n=1,C_n^0=C_n^n=1$。组合蕴含的意思是，不考虑选中元素之间的顺序关系，正如选择 $A,B$ 组成一组和选择 $B,A$ 成一组是完全等价的。

记不住组合数公式的看这张图：

![](https://cdn.luogu.com.cn/upload/image_hosting/peb0mouz.png)

还有特殊情况，例如 $C_{n}^{n+k}$，当 $k\in\mathbb Z$ 且 $k>1$ 时，我们规定计算结果是 ${0}$。

一个重要的恒等式是：$C_n^m=C_n^{n-m}$。可以套公式验证。

### 排列组合扩展

比如说二项式定理，这个非常的好用，尤其是当你需要计算 $(a+b)^k$ 的时候。二项式定理说道，对于 $(a+b)^k$ 的展开形式，我们可以通过公式：

$$
(a+b)^k=C_k^0a^0b^k+C_k^1a^1b^{k-1}+\dots+C_k^{k-1}a^{k-1}b^1+C_{k}^ka^kb^0=\sum\limits_{i=0}^{k}C_k^ia^ib^{k-i}=\sum\limits_{i=0}^k\binom{k}{i}a^ib{k-i}
$$

来快捷得到。注意 $i$ 从 ${0}$ 开始。$k=2$ 时我们很熟悉，完全平方展开，系数分别是 ${1~2~1}$；$k=3$ 还好，系数为 ${1~3~3~1}$；$k=4$ 时就是 ${1~4~6~4~1}$。很容易发现这个系数似乎关于中间那一项左右对称，这一点可以用恒等式 $C_n^m=C_n^{n-m}$ 完美解释。

跟二项式定理密切联系的还有一个杨辉三角，它长这个样子：

![](https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=4131437290,1213734484&fm=173&app=25&f=JPEG?w=639&h=404&s=7A283462099DD9C85E75B1C70100E0B1)

发现所有的二项式系数都可以在对应行找到。因此可以说，杨辉三角第 $n$ 行的第 $m$ 个数其实就对应组合数 $C_{n-1}^{m-1}$。再次仔细观察，可以发现当前的数字可以由它肩上的两个数字相加得到，例如 $C_3^1+C_3^2=C_4^2=3+3=6$，于是所有的组合数都可以由这个递推式得到：$C_n^m=C_{n-1}^{m-1}+C_{n-1}^m$。

杨辉三角还有许多有趣的性质，例如将第 $n$ 行的所有二项式系数加起来能得到 ${2^{n-1}}$，要证明也很简单，利用二项式定理代入特值 $a=1,b=1$，这样就会得到 $\sum\limits_{i=0}^k\binom{k}{i}=2^k$。还有，你还可以从第 $n$ 行开始，将杨辉三角中的数按特定规则相加，就可以得到斐波那契数列的项，见下图：

![](https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2655702577,3617396354&fm=173&app=25&f=JPEG?w=640&h=313&s=3C8A7432D98054C2D470E144030020E3)

即 $\sum\limits_{i=0}^{\lfloor\frac{i-1}{2}\rfloor}\binom{n+i}{(n+1)\bmod2+i}=F_{n}$。可以在了解组合数递推公式的基础上理解这个规律。

## Lucas 定理

用于组合数取模问题，公式其实很简洁：

$$
C_n^m\bmod p=C_{\lfloor n\div p\rfloor}^{\lfloor m\div p\rfloor}\times C_{n\bmod p}^{m\bmod p}
$$

其中 $p$ 为质数（~~暗示扩展~~），除法为整除。而当 $n\geq m\geq p^2+p$ 时，第一项可以通过递归这个公式得到。

如果考虑递归，我们其实发现它和 $p$ 进制分解蛮像。事实上，$\texttt{Lucas}$ 定理就可以看作是 $n,m$ 在 $p$ 进制下进行对位求组合数的结果之积。也就是说，假如 $n,m$ 的 $p$ 进制表示分别为 $n_1:n_2:n_3:\dots:n_{\lfloor\log_pn\rfloor}$ 和 $m_1:m_2:m_3:\dots:m_{\lfloor\log_pm\rfloor}$（不存在对应为则为 ${0}$），那么 $C_n^m\bmod p=\prod\limits_{i=1}^{\log_pn}\binom{n_i}{m_i}$。证明略（~~不会~~）。它经常和数位DP放在一起考。

虽然它简化了计算，但是它本质上还是需要计算组合数的值。因此需要维护模意义下的阶乘和阶乘的逆元，或者你还可以暴力求解，适用于模数易变的情况。

```cpp
// 暴力求解组合数
int C(int n, int m, int p) {
    int res = 1;
    for (int i = 1, j = n; i <= m; i++, j--) {
        res = ((ll) res % p * j % p * inv(i, p) % p) % p;
    }
    return res;
}

int lucas(int n, int m, int p) {
    if (m > n) return 0; // 必须特判，否则 RE+WA
    if (n < p && m < p) return C(n, m, p) % p;
    return (lucas(n / p, m / p, p) % p * lucas(n % p, m % p, p) % p) % p;
}
```

```cpp
// 预处理
int lucas(int n, int m, int p) {
    if (n < m) return 0; // 必须特判
    if (n < p && m < p) return (fac[n] % p * infac[m] % p * infac[n - m] % p) % p;
    return (lucas(n / p, m / p, p) % p * lucas(n % p, m % p, p) % p) % p;
}

void init(int lim) {
    fac[0] = infac[0] = 1;
    for (int i = 1; i <= lim; i++) {
        fac[i] = (fac[i - 1] * i % p) % p;
        infac[i] = (infac[i - 1] * inv(i, p) % p) % p;
    }
}
```

无论你选用哪一种，都不要忘了对特殊情况的特判，例如 $\binom{2}{3}$ 的答案应为 ${0}$。

## 扩展 Lucas 定理

~~回收伏笔~~

既然 $\texttt{Lucas}$ 定理只适用于 $p$ 为质数，何不把模数 $M$ 拆成质数呢？根据算术基本定理，这是可以做到的，假设最终分解为 $\prod\limits_{i=1}^{k}p_i^{c_i}$。我们把代求的组合数当作一个未知数 $x$，联立可以得到方程组：

$$
\begin{cases}
x\equiv a_1\pmod{p_1^{c_1}}
\\x\equiv a_2\pmod{p_2^{c_2}}
\\\vdots
\\x\equiv a_k\pmod{p_k^{c_k}}
\end{cases}
$$

发现可以使用朴素的中国剩余定理合并（不同质数之间显然互质），前提是我们得知道 $a_1\sim a_n$ 的值。

根据组合数的阶乘定义式得到：$a_i=\frac{n!}{m!(n-m)!}\bmod{p_i^{c_i}}$。但是还不能直接算，万一逆元不存在（$p\mid m!$ 或 $p\mid(n-m)!$）怎么办？既然导致无解的原因是出现了 $p_i$ 的倍数，那么我们就把 $p_i$ 因子拆除了！设 $x,y,z$ 分别为 $n!,m!,(n-m)!$ 中 $p_i$ 因子的个数，那么原问题可以变为求解：

$$
\cfrac{\cfrac{n!}{p_i^x}}{\cfrac{m!}{p_i^y}\times\cfrac{(n-m)!}{p_i^z}}\times p_i^{x-y-z}\bmod p_i^{c_i}
$$

此时因为除去了因子 $p_i$，逆元就可以放心求解了。此时还面临一个问题，即形如 $\frac{a!}{p^\lambda}\bmod p^\omega$ 的算式的快速求解。分母可以用逆元求，其实时间复杂度瓶颈还是在阶乘取模上，因此只需要解决 $a!\bmod p^\omega$ 即可。我们从一个实例来感受如何求解：

---

**例 3.1**

> 求解 ${22!\bmod3^2}$ 的值

即 $a=22,p=3,\omega=2$。我们先写阶乘，再把 $p$ 的倍数提出来：

$$
\begin{aligned}
22!&=22\times\textcolor{green}{21}\times20\times19\times\textcolor{green}{18}\times17\times16\times\textcolor{green}{15}\times14\times13\times\textcolor{green}{12}\times11
\times10\times\textcolor{green}9\times8\times7\times\textcolor{green}6\times5\times4\times\textcolor{green}3\times2\times1
\\&=3^7\times7!\times\frac{22!}{3\times6\times9\times12\times15\times18\times21}
\end{aligned}
$$

发现原式分为三个部分：$p$ 的 $\lfloor\frac{a}{p}\rfloor$ 次幂、$\lfloor\frac{a}{p}\rfloor$ 的阶乘和与 $p$ 互质的数的乘积。对于第二部分，由于可能仍然存在 $p$ 的倍数，故递归求解；对于第三部分，有一个很好的性质——把互质的数按 $p^\omega$ 个一组分下去（余下的另算），发现每个完整组的乘积模 $p^\omega$ 的值是相同的，故快速幂解决，最后暴力乘上剩下的即可。

假设每一个完整组的乘积模 $p^\omega$ 的值均为 $M_A$，剩余组模出来的值为 $M_B$，那么可以得到：

$$
\begin{aligned}
a!&=p^{\lfloor\frac{a}{p}\rfloor}\times\lfloor\frac{a}{p}\rfloor!\times M_A^{\lfloor\frac{a}{p^\omega}\rfloor}\times M_B
\\\cfrac{a!}{p^{\lfloor\frac{a}{p}\rfloor}}&=\underbrace{\lfloor\frac{a}{p}\rfloor!}_{\text{do recursively}}\times M_A^{\lfloor\frac{a}{p^\omega}\rfloor}\times M_B
\end{aligned}
$$

递归的下一层就是求解 $\lfloor\frac{a}{p}\rfloor!\bmod p^\omega$ 的值。

```cpp
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;
typedef pair<ll, ll> Equation;

ll exgcd(ll a, ll b, ll &x, ll &y) {
    if (!b) {
        x = 1, y = 0;
        return a;
    }
    ll d = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}

ll inv(ll a, ll p) {
    ll ans, tmp;
    exgcd(a, p, ans, tmp);
    return (ans % p + p) % p;
}

ll qmul(ll a, ll b, ll p) {
    ll res = 0;
    while (b) {
        if (b & 1) res = (res + a) % p;
        a = (a + a) % p;
        b >>= 1;
    }
    return res % p;
}

ll qpow(ll a, ll b, ll p) {
    ll res = 1;
    while (b) {
        if (b & 1) res = (res % p * a % p) % p;
        a = (a * a) % p;
        b >>= 1;
    }
    return res % p;
}

ll mul(initializer_list<ll> args, ll p) {
    // 很方便的变长参数列表求连乘，int128 防止爆范围
    __int128 res = 1;
    for (ll i: args) {
        res = (res % p * i % p) % p;
    }
    return (ll) (res % p);
}

ll CRT(vector<Equation> &v) {
    // 中国剩余定理部分
    ll M = 1;
    ll res = 0;
    for (Equation eq: v) M *= eq.second;
    for (Equation i: v) {
        ll Mi = M / i.second;
        res = (res + qmul(qmul(i.first, Mi, M), inv(Mi, i.second), M)) % M;
    }
    return res % M;
}

ll resolve(ll a, ll p, ll ppow) {
    // 递归过程求解，即实现例3.1
    if (!a) return 1; // 1的阶乘模质数当然无论如何都是1
    ll s = 1;
    for (ll i = 1; i <= ppow; i++) {
        if (i % p) s = mul({s, i}, ppow); // 完整组循环节连乘
    }
    s = qpow(s, a / ppow, ppow); // 对完整组的积求幂
    for (ll i = a / ppow * ppow + 1; i <= a; i++) {
        if (i % p) s = mul({s, i}, ppow); // 对不完整组求积
    }
    return mul({s, resolve(a / p, p, ppow)}, ppow); // 递归过程
}

ll getA(ll n, ll m, ll p, ll ppow) {
    // 获取 CRT 方程组中的 a
    ll x = 0, y = 0, z = 0;
    // 统计 n, m, n - m 分别是 p 的多少次幂
    for (ll i = n; i; i /= p) x += i / p;
    for (ll i = m; i; i /= p) y += i / p;
    for (ll i = n - m; i; i /= p) z += i / p;
    // 套公式
    return mul({
        qpow(p, x - y - z, ppow),
        resolve(n, p, ppow),
        inv(resolve(m, p, ppow), ppow),
        inv(resolve(n - m, p, ppow), ppow)
    }, ppow);
}

ll exLucas(ll n, ll m, ll p) {
    // 分解质因数
    vector<Equation> E;
    for (ll i = 2; i * i <= p; i++) {
        if (p % i == 0) {
            // 统计对应质数以及它的幂
            ll c = 1;
            while (p % i == 0) {
                c *= i;
                p /= i;
            }
            E.emplace_back(getA(n, m, i, c), c);
        }
    }
    if (p > 1) E.emplace_back(getA(n, m, p, p), p); // 最后一个质数
    return CRT(E);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    ll n, m, p;
    cin >> n >> m >> p;
    cout << exLucas(n, m, p) << endl;

    return 0;
}
```

其中 `getA(n, m, p, ppow)` 用来求解 $\frac{n!}{m!(n-m)!}\bmod ppow(ppow=p^{c})$，即中国剩余定理中的 $a_i$； `resolve(a, p, ppow)` 实现求解 $a!\bmod ppow(ppow=p^\omega)$。

## Lucas 定理的实际应用

鉴于 $\texttt{Lucas}$ 定理在进制分解上的性质，它其实可以跟一些涉及到进制的算法放在一起考。例如数位DP，数位DP相关内容请见：[记忆化搜索 数位DP](https://justpureh2o.cn/articles/3140/)。

### 洛谷 P7976 [Stoi2033] 园游会

题目地址：[P7976](https://www.luogu.com.cn/problem/P7976)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

> 设 $F(x)=(x+1)\bmod 3-1$，给定 $n$，求：
>
> $$
> \sum_{l=0}^n \sum_{r=l}^n F\left(\binom{r}{l}\right)
> $$
>
> 对 ${1732073999}$ 取模。
>
> 对于 ${100\%}$ 的数据，${1 \le t \le 3 \times 10^4,1 \le n \le maxn \le 2 \times 10^{16}}$。

根据 $\texttt{Lucas}$ 定理，我们知道 $\binom{r}{j}=\prod\limits_{i=1}^{k}\binom{r_k}{j_k}$。那怎么把这个用到函数 $F(x)$ 上呢？我们可以发现，$F(x)$ 满足 $F(nm)=F(n)F(m)$，即积性函数。

我们把 $i,j$ 转为三进制，那么此时求 $F\left(\binom{r}{l}\right)$ 就可以通过按位算组合数并连乘得到。固定一个 $r$，此时对于 $l$ 的每一位，有几种可能：

1. $r_k=0$，保证 $l\leq r$ 的情况下，$l_k=0$，此时贡献为 $F(\binom{0}{0})=1$
2. $r_k=1$，$l_k$ 只能枚举 ${0\sim1}$，贡献为 $F(\binom{1}{0})+F(\binom{1}{0})=2$
3. $r_k=2$，此时 $l_k\in[0,2]$，贡献为 $F(\binom{2}{0})+F(\binom{2}{1})+F(\binom{2}{2})=1$

因此，真正能对答案产生实质性贡献的就是 $r_k=1$ 的情况。换句话说，当 $r$ 在 $[0,n]$ 内枚举时，我们只需要统计 $r$ 取不同值时（三进制下）${1}$ 位的个数即可，也就是标准的数位DP求解 $[0,n]$ 内数在三进制下总共有多少个 ${1}$。记结果为 $s$，那么答案就是 ${2^s}$。

### 洛谷 P6669/BZOJ 4737 [清华集训2016] 组合数问题

题目地址：[P6669](https://www.luogu.com.cn/problem/P6669)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

题目来源：<span data-luogu data-source>清华集训</span>&nbsp;&nbsp;<span data-luogu data-date>2016</span>

> 给定 $n,m$ 和 $k$，对于所有的 ${0≤i≤n,0≤j≤\min(i,m)}$ 有多少对 $(i,j)$ 满足 $\binom{i}{j}$ 是 $k$ 的倍数。答案对 ${10^9+7}$ 取模。
>
> 对于 ${100\%}$ 的测试点， ${1≤n,m≤10^{18}}$，${1≤t,k≤100}$，且 $k$ 是一个质数。

读题，倍数必定满足关系 $x\bmod k=0$。根据 $\texttt{Lucas}$ 定理的基数对位组合求积意义，我们可以把 $i,j$ 都转成 $k$ 进制，并且，只要在连乘式中出现任意一个及以上的 ${0}$ 项，整个结果就是 ${0}$，也即 $k$ 的倍数。根据组合数的计算公式，发现只要 $\binom{i_k}{j_k}$ 满足 $i_k<j_k$，那么结果就是 ${0}$。

布尔型维护当前是否已经存在 ${0}$ 项。此时考虑同时填两个不同数的相同位置，也就是一次性填 $i,j$ 两个数，自然需要用到双层循环。鉴于题目要求 $j\leq\min(i,m)$，我们不仅需要维护 $i$ 是否顶到上界 $n$，还要额外维护 $j$ 是否顶到上界 $m$ 和上界 $i$。总的状态数是 $\log_210^{18}\times2^4\approx960$，转移是双层循环的 $\mathcal O(k^2)$，时间复杂度约为 $10^7$，完全足够。

> [!NOTE]
> 题解同步于本站
