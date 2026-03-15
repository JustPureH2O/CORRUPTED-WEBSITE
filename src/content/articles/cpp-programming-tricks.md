---
slug: '40484'

category: 奇技淫巧
published: 2024-06-15T14:25:49.881623+08:00
tags:
- 奇技淫巧
- oi
title: '[奇技淫巧] C++ 编程小寄巧'
updated: 2024-06-15T15:49:43.078+08:00
---
## 前言

我非常喜欢一些奇技淫巧，每次有机会时就想用点小技巧，既方便了自己、有时还能博来他人的赞叹，实属一举两得的行为。在这篇文章之前，我的奇技淫巧仅局限于高中数学题。接下来我把进入 C++ 编程以来收集的实用小技巧全部放在这里，并不定时更新新的小技巧。希望能帮到后人。

引用伟大的毛主席的一句话：

> 幸亏古人和外国人替我们造好了这许多符号，使我们开起中药铺来毫不费力。
>
> *毛泽东 ——《反对党八股》*

当然这句话在这里已经失去了原先的讽刺意味，我们会着重探讨使用这些小技巧的好处而非坏处。毕竟它的正确性就摆在那里，自己写还可能出现错误，为什么不保险一些呢？

## GCC 内建函数的巧用

在位运算中，很多人为了~~加快运行效率~~图方便，会使用以双下划线+“builtin”开头的 GCC 内建函数。其中最为常见的是 `__builtin_popcount()` 函数。接下来介绍几种实用的内建函数。

**注意**：赛时的机器可能并不支持使用下划线开头的库函数，如果不想吃 CE 的话就还是老老实实的写一遍。

### popcount 系列函数

一般来说，这种内建函数针对于不同类型的参数会设计不同的函数签名。一般来说，在 `__builtin_popcount` 后直接加上数据类型的简写就可以得到针对这种数据类型的函数。目前仅支持 `int`、`long` 和 `long long` 类型，除 `int` 类型外，函数签名分别追加 `l` 和 `ll`。对于这个函数就是 `__builtin_popcountl()` 和 `__builtin_popcountll()`。后文不再对这点进行赘述。

$\texttt{popcount}$ 用来计算该数在二进制表示下 ${1}$ 的总个数。一般我们会写的 $\mathcal O(\log n)$ 做法如下：

```cpp
int popcount(int x) {
    int res = 0;
    while (x) {
        if (x & 1) res++;
        x >>= 1;
    }
    return res;
}
```

GCC 在实现这些函数时自动将函数设为内联 inline，因此通常情况下会效率更高。~~主要还是不用自己写~~

**例子：**

```cpp
__builtin_popcount(5)               // 返回2，因为十进制的5等于二进制的101
__builtin_popcountll(INT_MAX + 1)   // 返回33
__builtin_popcountll(LLONG_MAX - 1) // 返回62
```

值得注意的是，GCC 并没有计算二进制下 ${0}$ 个数的函数。不过实现起来也很简单，把上文代码里的 `b & 1` 的判断条件取反即可。

### clz、ctz 系列函数

`__builtin_clz()` 用来获取二进制表示下前导 ${0}$ 的个数；`__builtin_ctz()` 则是二进制末尾 ${0}$ 的个数。日常使用中前导 ${0}$ 的个数不常使用，较常使用的是 `ctz` 函数。

$\mathcal O(\log n)$ 做法如下：

```cpp
int clz(int x) {
    int res = 0;
    if (x == 0) return 0;
    for (int i = 32; i >= 0; i--) {
        if ((x >> i) & 1) return res;
        else res++;
    }
    return 0;
}

int ctz(int x) {
    if (x == 0) return 0;
    for (int i = 0; i <= 32; i++) {
        if ((x << i) & 1) return i;
    }
    return 0;
}
```

**例子：**

```cpp
__builtin_clz(7)        // 29
__builtin_ctz(20071126) // 1
```

### ffs 系列函数

`__builtin_ffs()` 函数用来求得二进制位下第一个非零位的下标（从低位到高位，下标从 ${1}$ 开始），除开特殊数字 ${0}$ 外，都有 $\texttt{ffs}=\texttt{ctz}+1$。因此：

```cpp
int ffs(int x) {
    if (x == 0) return 0;
    return ctz(x) + 1;
}
// 或者...
int ffs(int x) {
    if (x == 0) return 0;
    for (int i = 0; i <= 32; i++) {
        if ((x >> i) & 1) return i + 1;
    }
    return 0;
}
```

**例子：**

```cpp
__builtin_ffs(14)            // 2
__builtin_ffs(INT_MAX - 1)   // 2
```

### parity 系列函数

`__builtin_parity()` 函数用来求解二进制下 ${1}$ 的个数的奇偶性（二进制下 ${1}$ 的个数对 ${2}$ 取模）。在某些游戏的二进制文件校验里可能会用到（具体是检测二进制文件下 ${1}$ 或 ${0}$ 的个数来判断文件是否损坏或被篡改）。

```cpp
int parity(int x) {
    return popcount(x) % 2;
}
// 或者...
int parity(int x) {
    int res = 0;
    while (x) {
        if (x & 1) res++;
        x >>= 1;
    }
    return res % 2;
}
```

**例子：**

```cpp
__builtin_parity(26)          // 1
__builtin_parity(INT_MAX / 2) // 0
```

## 系统宏定义的巧用

### INFINITY 宏

考虑这样一个情境：你在赛时写出了一个最短路代码，由于害怕数据爆 `int`，你选择改用 `long long`，并把最短路的 $\operatorname{dist}$ 数组初始化成了 $\texttt{LLONG\_MAX}$。但临近结束时，经过一通推算，你发现数据不会爆 `int`，反而发现开一个过大的 `long long` 数组可能会爆空间。你又将它改成了 `int` 类型。比赛结束后，你在场外忽然想起初始化还是一个爆 `int` 的值，果不其然喜提零分评测……

如何避免像上边那样写出一个爆类型的极大值，我的建议是使用 $\texttt{INFINITY}$ 宏定义。编译时将会替换为 `__builtin_inff()` 函数（其实本来应该放到上边那一栏的）。它的具体值会随数据类型的改变而改变，例如：

```cpp
int a = INFINITY;
long b = INFINITY;
long long c = INFINITY;
double d = INFINITY;
float e = INFINITY;
short f = INFINITY;
bool g = INFINITY;
char h = INFINITY;

cout << a << ' ' << b << ' ' << c << ' ' << d << ' ' << e << ' ' << f << ' ' << g << ' ' << h << endl;
// 输出 2147483647 2147483647 9223372036854775807 inf inf 32767 1 〼 （char 值为 127，对应字符 '\177'）
```

可见使用这种方法可以优雅地避开上述情景中的窘境，助力 $AK$。对于特定数据类型（一般是 `int` 和 `long long`），$\texttt{INT\_MAX}$ 和 $\texttt{LLONG\_MAX}$ 也能帮到你。

## 库函数的巧用

### __gcd 函数

在数学题中经常需要我们去求两个数的最大公约数，一般来说我们会写欧几里得算法（辗转相除法）：

```cpp
int gcd(int a, int b) {
    return b ? gcd(b, a % b) : a;
}
```

库函数中 `__gcd()` 也可以实现这一功能，它要求传入的两个参数是同一数据类型。这一点与 `min()`、`max()` 函数是相同的。

如果想要求解最小公倍数，则只需用两个数的乘积除以它们的最大公约数即可。
