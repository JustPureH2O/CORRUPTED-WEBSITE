---
slug: '10315'

category: 题解
published: 2024-09-18T14:38:27.468677+08:00
image: https://pic.imgdb.cn/item/65acd0a3871b83018acf5225.png
tags:
- oi
- 算法
- 题解
- 线性代数
title: P10315 [SHUPC 2024] - 原神，启动！ 题解
updated: 2024-09-18T14:38:29.022+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

[题目原型谜题解法浅究](https://justpureh2o.cn/articles/9306/?keyword=%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0#%E7%AC%AC%E5%9B%9B%E8%8A%82-%E7%A7%A9)（$m=4$ 的情况）

[题目地址](https://www.luogu.com.cn/problem/P10315)

本题考察模意义下的高斯消元。

基本思路是，让 ${1\sim n}$ 号方块分别击打 $x_1\sim x_n$ 次，使得最终每个方块都朝向位置 $t_1\sim t_n$。

---

欲解决此题，首先需要为每个位置编号。定义 $a\rightarrow b,c$ 为“击打 $a$ 方块后，$a,b,c$ 均会旋转一次”。那么样例输入 #1 如下图（编号方式不唯一），红线为目标方向、初始时均在 $0$ 朝向：

![](https://cdn.luogu.com.cn/upload/image_hosting/wpqed84b.png)

假设三个方块需要击打 $x,y,z$ 次，那么可以列出以下方程组：

$$
\begin{cases}
x+y=0
\\y+z=2
\\x+y+z=1
\end{cases}
$$

但是不够严谨，因为我们没考虑“转过头”这种情况。即朝向为 $2$ 的方块旋转后会变为朝向 $0$。因此可以发现朝向存在模 $m$ 意义的同余关系。

上例方程组解得：

$$
\begin{cases}
x=-1\\y=1\\z=1
\end{cases}
$$

出现了负数，怎么处理？

根据解的意义考虑，这相当于 $x$ 往回转一次，根据同余关系可以得到，往回转 $1$ 次就相当于向前转 $m-1$ 次。因此对于负数，采取 `(x % m + m) % m` 的方式即可转化为非负数。

---

于是题目就很明了了，让我们求出如下 $n$ 元一次同余方程组的解：

$$
\begin{cases}
x_1+x_2+x_3+\dots+x_n\equiv t_1-s_1\pmod m
\\x_1+x_2+x_3+\dots+x_n\equiv t_2-s_2\pmod m
\\\vdots
\\x_1+x_2+x_3+\dots+x_n\equiv t_n-s_n\pmod m
\end{cases}
$$

因而可以用高斯消元求解。那么如何处理无数组解的情况呢？

高斯消元时我们会跳过一些零行。此时零行对应的变量就是一个自由元，可以任意赋值。

因此使用一个 `ans` 数组来存储答案，如果出现无数组解的情况，那么不管它，`ans` 数组也会自动赋值它为 $0$。

模意义下的除法显然需要用逆元解决，考虑到 $m$ 为质数，因此使用费马小定理计算。注意处处取模，答案不要忘了转化为 $[0,m)$ 内的数，还要开 `long long`。

```cpp
#include <bits/stdc++.h>
#define N 110
#define SOLVE_OK 200
#define SOLVE_NO 404
#define LUXURIOUS_CHEST 0;
#define F return
using namespace std;

typedef long long ll;

int n, m;
ll matrix[N][N];
ll ans[N];

ll qpow(ll a, ll b, int p) {
    ll res = 1;
    while (b) {
        if (b & 1) res = res * a % p;
        a = a * a % p;
        b >>= 1;
    }
    return res % p;
}

ll inv(ll x, int p) {
    return qpow(x, p - 2, p);
}

int gauss() {
    // 1-index 高斯消元
    int rank = 0;
    for (int c = 1, r = 1; c <= n; c++) {
        int max_row = r;
        for (int i = r; i <= n; i++) {
            if (abs(matrix[i][c]) > abs(matrix[max_row][c])) {
                max_row = i;
            }
        }
        if (!matrix[max_row][c]) continue;
        if (max_row != r) swap(matrix[max_row], matrix[r]);
        for (int i = n + 1; i >= c; i--) {
            matrix[r][i] *= inv(matrix[r][c], m);
            matrix[r][i] = (matrix[r][i] % m + m) % m;
        }
        for (int i = r + 1; i <= n; i++) {
            if (abs(matrix[i][c])) {
                for (int j = n + 1; j >= c; j--) {
                    matrix[i][j] -= (matrix[r][j] * matrix[i][c]);
                    matrix[i][j] = (matrix[i][j] % m + m) % m;
                }
            }
        }
        r++;
        rank++;
    }
    if (rank < n) {
        // 无解判断
        for (int i = rank + 1; i <= n; i++) {
            for (int j = 1; j <= n + 1; j++) {
                if (abs(matrix[i][j])) return SOLVE_NO;
            }
        }
        // 无穷解处理，无穷解算作有解
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                if (abs(matrix[i][j])) {
                    ans[j] = matrix[i][n + 1];
                    break;
                }
            }
        }
        return SOLVE_OK;
    }
    // 有唯一解，回代
    for (int i = n; i >= 1; i--) {
        for (int j = i + 1; j <= n; j++) {
            matrix[i][n + 1] -= (matrix[i][j] * matrix[j][n + 1]);
            matrix[i][n + 1] = (matrix[i][n + 1] % m + m) % m;
        }
    }
    for (int i = 1; i <= n; i++) ans[i] = matrix[i][n + 1];
    return SOLVE_OK;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    cin >> n >> m;

    for (int i = 1; i <= n; i++) matrix[i][i] = 1; // 每个方块被击打后自己也会转一下，因此主对角线全为 1
    for (int i = 1; i <= n; i++) {
        int k;
        cin >> k;
        for (int j = 1; j <= k; j++) {
            int x;
            cin >> x;
            matrix[x][i] = 1;
        }
    }
    for (int i = 1; i <= n; i++) {
        ll s;
        cin >> s;
        matrix[i][n + 1] -= s;
    }
    for (int i = 1; i <= n; i++) {
        ll t;
        cin >> t;
        matrix[i][n + 1] += t;
    }
    int res = gauss();
    if (res == SOLVE_OK) {
        for (int i = 1; i <= n; i++) cout << (ans[i] % m + m) % m << ' ';
    } else cout << "niuza" << endl;

    F LUXURIOUS_CHEST
}
```

$\texttt{The End}$
