---
slug: '23333'

category: 题解
published: 2024-09-01T19:36:37.000577+08:00
image: https://pic.imgdb.cn/item/66698e02d9c307b7e9ff3241.jpg
tags:
- oi
- 算法
- 线性代数
title: P10503 - 233 Matrix 题解
updated: 2024-09-04T20:13:57.871+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[P10503](https://www.luogu.com.cn/problem/P10503)

> 假设我们有一个称为 233 矩阵。在第一行，它可能是 233、2333、23333...（表示 $a _ {0,1} = 233$，$a_{0,2} = 2333$，$a_{0,3} = 23333$...）。此外，在 233 矩阵中，我们有 $a_{i,j} = a_{i-1,j} +a_{i,j-1}( i,j \neq 0)$。现在已知 $a_{1,0},a_{2,0},\dots,a_{n,0}$，你能告诉我 233 矩阵中的 $a_{n,m}$ 吗？
>
> $n\leq10,m\leq10^9$

发现 $n$ 很小、$m$ 很大，于是选择使用 $\mathcal O(n^3\log m)$ 的矩阵快速幂做法。

假设矩阵一开始存储 $a$ 列的信息，它看起来是这样的：

$$
\begin{bmatrix}
a_{1,0}&a_{2,0}&a_{3,0}&\dots&a_{n,0}
\end{bmatrix}
$$

由于涉及到 $233$ 的计算，我们需要同时递推 $233$ 相关项，显然有 $2333=233\times10+3$，出现了常数，连同 $233$ 一起，初始矩阵就应该是如下的样子：

$$
\begin{bmatrix}
1&23&a_{1,0}&a_{2,0}&\dots&a_{n,0}
\end{bmatrix}
$$

然后可以发现：

$$
\begin{cases}
a_{1,1}=10\times23+3+a_{1,0}
\\a_{2,1}=10\times23+3+a_{1,0}+a_{2,0}
\\\vdots
\\a_{n,1}=10\times23+3+\sum\limits_{i=1}^{n}a_{i,0}
\end{cases}
$$

得出 $(n+2)\times(n+2)$ 的转移矩阵：

$$
\begin{bmatrix}
1&3&3&3&\dots&3
\\0&10&10&10&\dots&10
\\0&0&1&1&\dots&1
\\0&0&0&1&\dots&1
\\0&0&0&0&\dots&1
\\\vdots&\vdots&\vdots&\vdots&\ddots&\vdots
\\0&0&0&0&\dots&1
\end{bmatrix}
$$

然后让初始矩阵乘以转移矩阵的 $m$ 次幂即可。

```cpp
#include <bits/stdc++.h>
#define N 15
#define MOD 10000007
using namespace std;

typedef long long ll;
typedef pair<int, int> PII;

int n, m;
struct Matrix {
    ll mat[N][N]{};

    Matrix() {
        memset(mat, 0, sizeof mat);
    }

    void I() {
        for (int i = 1; i <= n + 2; i++) mat[i][i] = 1;
    }
};

Matrix operator*(const Matrix &l, const Matrix &r) {
    Matrix res;
    for (int i = 1; i <= n + 2; i++) {
        for (int j = 1; j <= n + 2; j++) {
            for (int k = 1; k <= n + 2; k++) {
                res.mat[i][j] = (res.mat[i][j] + l.mat[i][k] % MOD * r.mat[k][j] % MOD) % MOD;
            }
        }
    }
    return res;
}

Matrix qpow(Matrix a, ll b) {
    Matrix res;
    res.I();
    while (b) {
        if (b & 1) res = res * a;
        a = a * a;
        b >>= 1;
    }
    return res;
}

void print(Matrix m) {
    for (int i = 1; i <= n + 2; i++) {
        for (int j = 1; j <= n + 2; j++) {
            cout << setw(5) << m.mat[i][j] << ' ';
        }
        cout << endl;
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    while (cin >> n >> m) {
        Matrix A, M;
        A.mat[1][1] = 1, A.mat[1][2] = 23;
        for (int i = 1; i <= n; i++) {
            int x;
            cin >> x;
            A.mat[1][i + 2] = x;
        }
        for (int i = 1; i <= n + 2; i++) {
            for (int j = i; j <= n + 2; j++) {
                M.mat[i][j] = 1;
            }
        }
        for (int i = 2; i <= n + 2; i++) M.mat[1][i] = 3, M.mat[2][i] = 10;
        A = A * qpow(M, m);
        cout << A.mat[1][n + 2] % MOD << endl;
    }
    return 0;
}
```

$\texttt{The End}$
