---
slug: '30284'

category: oi算法
published: 2024-07-18T14:46:30.908455+08:00
tags:
- oi
- 算法
- 数据结构
title: 基础数据结构合辑
updated: 2024-10-06T19:23:38.527+08:00
---
## 单调栈/单调队列

### 单调栈

<ruby>单调栈<rt>Monotone Stack</rt></ruby>，顾名思义，是一种栈状结构，且栈内元素单调。它既满足栈的“<ruby>先进后出<rt>F I L O</rt></ruby>”性质，也符合元素从栈顶到栈底呈单调排列（或者从栈底到栈顶）。根据单调性的不同，大致可以分为“单调递增栈”和“单调递减栈”。若无特殊说明，单调栈的递增/递减判断顺序是**从栈顶到栈底**。

在单调栈构建过程中，有如下要求：

1. 当前待插入元素与栈顶元素满足全栈的单调关系，则直接插入顶端。
2. 反之，弹出栈顶元素直到满足第一点，此时直接插入。

例如一个单调递增栈的实现：

```cpp
stack<int> stk;

void insert(int x) {
    while (!stk.empty() && stk.top() > x) stk.pop();
    stk.push(x);
}
```

~~没错就这么短~~

依据单调栈的这些性质，人们探索出了一种能在 $\mathcal O(n)$ 时间复杂度内求解<ruby>下一大元素<rt>N G E</rt></ruby>问题（或者下一小元素）的算法。

我们新建一个数组用来记录下一大元素的下标，数组 `nge[i]` 即表示原序列中下标 $i$ 的元素的下一大元素的下标。让单调栈存储元素下标，当每次待插入的元素大于栈顶下标对应的元素时，则记录当前栈顶到 `nge` 中，并弹出栈顶。如此一来便处理得到了一个完整的 `nge` 数组

[P5788 [模板] 单调栈](https://www.luogu.com.cn/problem/P5788)

```cpp
#include <bits/stdc++.h>

#define N 3000010
using namespace std;

typedef long long ll;

stack<int> stk;
ll arr[N];
int nge[N];
int n;

void NGE() {
    for (int i = 1; i <= n; i++) {
        while (!stk.empty() && arr[i] > arr[stk.top()]) {
            nge[stk.top()] = i;
            stk.pop();
        }
        stk.push(i);
    }
}

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> arr[i];
    NGE();
    for (int i = 1; i <= n; i++) cout << nge[i] << ' ';
    return 0;
}
```

### 单调队列

<ruby>单调队列<rt>Monotone Queue</rt></ruby>其实和单调栈非常相似——给队列规定一个定长，让它在一段序列上滑动，当队首元素符合单调性则推入，否则就弹出队首直到满足单调性为止，同时，队列随着每次的滑动会自然抛除末尾的某个值。这样一来，单调队列就可以解决区间内最值的问题。

首先，我们依据单调栈里面的单调性检验，弹出队头不符合单调性的值。接着，把当前的值插入队头。如果队头元素的下标与队尾元素下标的差值超过了队列长度，则自然淘汰掉。反之输出队尾元素，它储存了当前区间的最值。

[P1886 滑动窗口 /[模板] 单调队列](https://www.luogu.com.cn/problem/P1886)

```cpp
#include <bits/stdc++.h>

#define N 1000010
using namespace std;

typedef long long ll;

struct Node {
    int idx;
    ll v;
} nodes[N];

deque<Node> q;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n, k;
    cin >> n >> k;
    for (int i = 1; i <= n; i++) {
        cin >> nodes[i].v;
        nodes[i].idx = i;
    }
    for (int i = 1; i <= n; i++) {
        while (!q.empty() && nodes[i].v < q.front().v) q.pop_front();
        q.push_front(nodes[i]);
        if (i - q.back().idx == k) q.pop_back();
        if (i >= k) cout << q.back().v << ' ';
    }
    cout << endl;
    q.clear();
    for (int i = 1; i <= n; i++) {
        while (!q.empty() && nodes[i].v > q.front().v) q.pop_front();
        q.push_front(nodes[i]);
        if (i - q.back().idx == k) q.pop_back();
        if (i >= k) cout << q.back().v << ' ';
    }
    return 0;
}
```

## ST 表

<ruby>ST 表<rt>Sparse Table</rt></ruby>是一种能在 $\mathcal O(n\log n)$ 时间内预处理，$\mathcal O(1)$ 回答区间最值查询（不支持修改，若要修改请移步线段树）的一种数据结构。借用了动态规划的思想，兼以步长 ${2^j-1}$ 的倍增。

对于一段静态序列（不变），为了求某段子列的最大值，先把这个子列分成两个更小的子序列。假设 $f(i,j)$ 表示在区间 $[i,i+2^j-1]$ 内的最大值，对于单个点，即 $f(i,0)$ 时，显然有 $f(i,0)=a_i$（最大值就是自己）。否则，最大值即是左区间最大值和右区间最大值更大的那一个。

[P3865 [模板] ST 表](https://www.luogu.com.cn/problem/P3865)

```cpp
#include <bits/stdc++.h>

#define N 100010
using namespace std;

int a[N];
int logn[N];
int f[N][22];
int n;

void init() {
    for (int i = 1; i <= n; i++) f[i][0] = a[i];
    for (int j = 1; j <= logn[n]; j++) {
        for (int i = 1; i + (1 << j) - 1 <= n; i++) {
            f[i][j] = max(f[i][j - 1], f[i + (1 << (j - 1))][j - 1]);
        }
    }
}

void initLog() {
    logn[1] = 0;
    logn[2] = 1;
    for (int i = 3; i <= n + 100; i++) logn[i] = logn[i >> 1] + 1;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int m;
    cin >> n >> m;
    for (int i = 1; i <= n; i++) cin >> a[i];
    initLog();
    init();
    while (m--) {
        int l, r;
        cin >> l >> r;
        int tmp = logn[r - l + 1];
        cout << max(f[l][tmp], f[r - (1 << tmp) + 1][tmp]) << endl;
    }
    return 0;
}
```

~~个人感觉理解难度有点大，建议先背下来~~

警示后人：不要用 `endl`，换成 `\n` 快了高达七倍不止！[AC](https://www.luogu.com.cn/record/166971353)、[TLE](https://www.luogu.com.cn/record/166971353)。

> [!NOTE]
> 在 C++ 中，数组的访问是行优先的。因此如果把 ST 表数组的第一维和第二维交换位置，那么程序的运行效率会变得更高

## 并查集

<ruby>并查集<rt>Disjoint Set Union</rt></ruby>，顾名思义，它是一种能完成数据合并、查询的集合数据结构。在路径压缩优化下，它能在平均 $\mathcal O(\alpha(n))$ 的时间复杂度内完成一次操作（由 $\texttt{Robert Tarjan}$ 证明，他也是 $\texttt{Splay}$ 的奠基人之一）。关于并查集时间复杂度的证明请看：[并查集复杂度 - OI Wiki](https://oi-wiki.org/ds/dsu-complexity/)。

首先，我们需要一个数组来记录每个点的父节点。在查询时，我们采取从底部逐级向上递归搜索的方式，可以发现，我们在实际操作时并不会关心它到根节点路径上的其他非根节点，出于效率考虑，可以将沿途每个点的父节点都一次性设成全局父节点，而这一切都可以在递归查询的过程中完成。在合并时，无需将每个点都合并过去，只需要把某棵树的根节点并到另一棵树的根节点下面去就行了！

[P3367 [模板] 并查集](https://www.luogu.com.cn/problem/P3367)

```cpp
#include <bits/stdc++.h>

using namespace std;

int p[10010];

int find(int x) {
    if (p[x] != x) p[x] = find(p[x]);
    return p[x];
}

void merge(int x, int y) {
    p[find(x)] = find(y);
}

bool query(int x, int y) {
    return find(x) == find(y);
}

int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; i++) p[i] = i;
    for (int i = 1; i <= m; i++) {
        int z, x, y;
        cin >> z >> x >> y;
        if (z == 1) merge(x, y);
        else {
            if (query(x, y)) cout << "Y" << endl;
            else cout << "N" << endl;
        }
    }
    return 0;
}
```

关于带权并查集、种类并查集，请参阅[这篇博客](https://justpureh2o.cn/articles/74839)。

## 哈希/散列函数

<ruby>哈希<rt>Hash</rt></ruby>或者称“散列”，其运作原理是把一个数据映射到一个较小（但不能太小）的值域里进行比较。通常来说，我们希望哈希满足如下两个性质：

1. 两个对象哈希值不同，则两个对象一定不同
2. 哈希值相同，则两个对象不一定相同

人们把第二种情况中可能出现的“对象不同却哈希相同”的现象叫做“<ruby>哈希碰撞<rt>Hash Clash</rt></ruby>”。

对于一个字符串 $s$，一般采取的是多项式散列的方法。首先把字符串的每一位挑出来，类比成一个数字位，然后采取形如 $\sum\limits_{i=0}^{|s|-1}s_i\times b^{|s|-i-1}\pmod m$ 的方法获取它的散列结果。举个例子，字符串 $\text{xyz}$ 会被散列成 $x+yb+zb^2$。一般来说，把 $m$ 设定成一个较大质数，发生碰撞的概率是很低的~~阳寿碰撞就没办法了，多交几次吧~~。

当然，你也可以使用碰撞率更低的 MD5，但是 C++ 并没有内置相关的库，你如果想用，那么就必须要完全背下来或者是现场复制。其实还不如自己选特殊值算。

按照上边的方法计算，复杂度是 $\mathcal O(n)$。如果加上询问，那就是 $\mathcal O(nm)$。在多次询问子串哈希时，观察到有如下式子：

$$
\begin{cases}
H=s_1b^{len-1}+s_2b^{len-2}+\dots+s_i
\\h=s_lb^{len-l}+s_{l+1}b^{len-l-1}+\dots+s_rb^{len-r}
\end{cases}
$$

假设 $f(i,j)$ 代表原字符串区间 $[i,j]$ 内的子串的哈希值，那么 $f(i,j)=f(1,r)-f(1,l-1)\times b^{r-l+1}$。现在就可以最快用 $\mathcal O(m\log n)$ 的快速幂求解了。

[P3370 [模板] 字符串哈希](https://www.luogu.com.cn/problem/P3370)

```cpp
#include <bits/stdc++.h>

using namespace std;

typedef long long ll;

const int MOD = 1000000007;
const int b = 2;
map<string, int> mp;

int qpow(int a, int b) {
    int res = 1;
    while (b) {
        if (a & 1) res = (ll) (res * a) % MOD;
        a = (ll) (a * a) % MOD;
        b >>= 1;
    }
    return res;
}

int hashStr(string s) {
    int res = 0;
    for (int i = 0; i < s.length(); i++) {
        res = (res + (s[i] - '0') * qpow(b, s.length() - i - 1)) % MOD;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        string s;
        cin >> s;
        int h = hashStr(s);
        if (!mp.count(s)) mp[s] = h;
    }
    cout << mp.size() << endl;
    return 0;
}
```
