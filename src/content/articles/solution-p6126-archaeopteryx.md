---
slug: '6126'

category: 题解
published: 2024-10-07T09:22:18.735176+08:00
image: https://pic.imgdb.cn/item/66e6bdb3d9c307b7e9a2aa2a.jpg
tags:
- oi
- 算法
- 线性代数
title: P6126 [JSOI2012] - 始祖鸟 题解
updated: 2024-10-07T09:39:34.425+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[P6126](https://www.luogu.com.cn/problem/P6126)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

题目来源：<span data-luogu data-region>江苏</span>&nbsp;&nbsp;<span data-luogu data-date>2012</span>&nbsp;&nbsp;<span data-luogu data-source>各省省选</span>

> 有 $N$ 只始祖鸟，我们从 $1$ 开始编号。对于第 $i$ 只始祖鸟，有 $M_i$ 个认识的朋友，它们的编号分别是 $F_{i,1},F_{i,2},\dots,F_{i,M_i}$。朋友的认识关系是单向的，也就是说如果第$s$只始祖鸟认识第 $t$ 只始祖鸟，那么第 $t$ 只始祖鸟不一定认识第 $s$ 只始祖鸟。
>
> 聚会的地点分为两处，一处在上游，一处在下游。对于每一处聚会场所，都必须满足对于在这个聚会场所中的始祖鸟，有恰好有偶数个自己认识的朋友与之在同一个聚会场所中。当然，每一只始祖鸟都必须在两处聚会场所之一。
>
> 现在需要你给出一种安排方式。你只需要给出在上游的始祖鸟编号，如果有多组解，请输出任何一组解。如果无法满足要求，只输出一行 `Impossible`。
>
> 对于 $100\%$ 的数据，${1 \le N \le 2000}$。

为所有始祖鸟按朋友数的奇偶性分类。对于朋友数是偶数的始祖鸟，只要在上游/下游出现偶数个朋友，那么另一方也肯定存在偶数个朋友，此时当前的始祖鸟就可以在上下游中任意选择去向；如果这只始祖鸟有奇数个朋友，那么上游/下游一定是一边奇数一边偶数，此时这只鸟只能去偶数那侧。

若当前始祖鸟在上游，我们令 $x_i=1$，否则 $x_i=0$。对于朋友数是偶数的始祖鸟，把它的所有朋友代表的数异或起来，那就相当于偶数个 $1$ 与偶数个 $0$ 异或，结果为 $0$；对于朋友数是奇数的始祖鸟，把自己和它的朋友代表的数异或起来，相当于偶数个 ${0/1}$ 和奇数个 ${1/0}$ 异或，结果一定是 $1$。因此对于某只有 $k$ 个朋友的始祖鸟 $x_1$，一定有如下关系：

$$
\begin{cases}
x_1\oplus x_2\oplus x_3\oplus\dots\oplus x_k=1&k\bmod2=1
\\x_2\oplus x_3\oplus x_4\oplus\dots\oplus x_k=0&k\bmod2=0
\end{cases}
$$

然后对每只始祖鸟建立关系，再使用异或高斯消元即可。这里介绍一种能方便解决“无数组解特解求解”问题的消元法。

一般的高斯消元会把矩阵消元成一个上/下三角矩阵，矩阵的同一列可能存在多个非零的系数，也就代表着方程之间的未知数还存在相互依赖关系，求解时只能老老实实向上回代，遇到存在自由元的情况时会较难处理。

我们认为这样的矩阵是“未完全化简的”，事实上，如果在减法/异或消元时让每一行都重新消元一次，而不是只对 $r+1\sim n$ 行消元，那么最终你会得到一个同一列只存在一个非零系数的增广矩阵。特别地，对于存在唯一解的情况，它是一个对角矩阵，此时每个未知数的解就是对应常数项的值；如果是存在无数组解的情况，找到主元也非常简单：只需找到每一行的第一个非零系数，然后直接将它赋值为常数项。对于主元右侧的所有非零系数，一律当自由元赋值为 $0$ 即可。

```cpp
#include <bits/stdc++.h>
#define N 2010
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
    int rank = 0; // 矩阵的秩
    for (int c = 1, r = 1; c <= n; c++) {
        int t = r;
        for (int i = r; i <= n; i++) {
            if (matrix[i].test(c)) {
                // 找到绝对值最大的行（只要第一个系数是 1 即可）
                t = i;
                break;
            }
        }
        if (!matrix[t].test(c)) continue; // 跳过零行
        if (t ^ r) swap(matrix[r], matrix[t]); // 交换到第一行

        for (int i = 1; i <= n; i++) {
            // 与普通高斯消元的不同之处，对 1~n 行全部消元
            if (matrix[i].test(c) && i ^ r) {
                // 当前行不消，零行不消
                matrix[i] ^= matrix[r]; // 异或代替减法进行消元
            }
        }
        r++;
        rank++;
    }
    if (rank < n) {
        // 秩小于 n，可能是无数组解、有可能无解
        for (int i = rank + 1; i <= n; i++) {
            if (matrix[i].test(n + 1)) return 0; // 存在类似于 0=k 的矛盾情况，无解
        }
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n + 1; j++) {
                if (matrix[i].test(j)) {
                    // 无数组解，找到主元并赋值
                    ans[j] = matrix[i][n + 1];
                    break;
                }
            }
        }
        return 1;
    }
    for (int i = 1; i <= n; i++) ans[i] = matrix[i][n + 1]; // 有唯一解，对角矩阵每个未知数的解就是常数项的值
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
        if (k & 1) matrix[i].flip(i); // 奇数个朋友建立方程组时要算上自己
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

[Hack 数据](https://www.luogu.com.cn/problem/U382588)也过了，这是[记录](https://www.luogu.com.cn/record/180600794)。你可以调用函数 `out()` 来输出矩阵的项。

$\texttt{The End}$
