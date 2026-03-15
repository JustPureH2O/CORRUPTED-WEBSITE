---
slug: '74839'

category: oi算法
published: 2024-07-19T11:36:41.496092+08:00
image: https://cdn.luogu.com.cn/upload/pic/24748.png
tags:
- oi
- 算法
- 数据结构
title: 并查集的高级用法——权值并查集与种类并查集
updated: 2024-07-19T11:42:21.297+08:00
---
## 并查集

并查集，或称<ruby>DSU<rt>Disjoint Set Union</rt></ruby>，是一种管理元素所属集合的数据结构。每次查询时把沿途的节点的父节点一并设置成全局父节点，从而达到均摊复杂度 $\mathcal O(\alpha(n))$ 的超高效率（其中 $\alpha(n)$ 为 $n$ 的反阿克曼函数，可以看作为常数复杂度）。基于并查集的许多特性（包括好写），人们开发出了许多不同种类不同用途的并查集，其中就包括带边权的权值并查集和对元素进行分类的种类并查集。这篇文章将探讨这两种并查集的实现及相关应用。

## 权值并查集

在并查集的边上加上边权，每次查找父节点时把边权向上推送更新，从而达到类似于线段树 `pushup` 操作的效果。

### UVA 11987 Almost Union-Find

题目地址：[UVA 11987](https://www.luogu.com.cn/problem/UVA11987)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

> 有 $n$ 个集合，$m$ 次操作。规定第 $i$ 个集合里初始只有 $i$。有三种操作：
> 
> 1. 输入两个元素 $p$ 和 $q$，若 $p$ 和 $q$ 不在一个集合中，合并两个元素的集合。
> 2. 输入两个元素 $p$ 和 $q$，若 $p$ 和 $q$ 不在一个集合中，把 $p$ 添加到 $q$ 所在的集合。
> 3. 输入一个元素 $p$，查询 $p$ 所在集合的元素个数和所有元素之和。
> 
> **输入格式：**
> 
> 有几组数据。
> 
> 每组数据第一行输入 $n$ 和 $m$ 两个整数。
> 
> 每组数据以下 $m$ 行，每行第一个数 $k$ 代表选择哪一个命令，若 $k$ 是 $1$ 或 $2$ 命令，则再输入两个整数 $p$ 和 $q$。若 $k$ 是 $3$，则输入一个整数 $p$。
> 
> 输入文件结束符（EOF）结束输入。
> 
> **输出格式：**
> 
> 输出行数为每组数据 $3$ 号命令的总数。
> 
> 每一行输出两个整数 $a$ 和 $b$，即元素个数和元素和。
> 
> **数据范围：**
> 
> ${1 \leq  n,m\leq 10 ^ 5}$，${1 \leq  p,q\leq n}$。
> 
> **原题面 PDF**：[Here](https://uva.onlinejudge.org/external/119/p11987.pdf)

这道题在普通并查集维护所属集合的要求外，另外要求我们维护并查集的集合大小及元素总和，因此考虑权值并查集。基本思路是：在每次合并操作时，更新被插入集合父节点的 `sum` 与 `size`，累加上待插入集合的 `sum` 与 `size` 即可。特殊一点，对于移动操作（相当于把待插入集合变成一个大小为 ${1}$ 的单点）也是一样。

那么如何实现单点的移动呢？一般的思路是把点的父亲直接指向被插入集合的根，但这显然是错误的，因为：

![](https://cdn.luogu.com.cn/upload/image_hosting/1j5qrpeo.png)

当我们根据并查集的标准合并方式合并节点 ${1}$ 到树 ${3}$ 时，我们会把从属于 ${1}$ 号的 ${2}$ 号节点也一并接过去，这是我们不希望的，期望效果是只把 ${1}$ 送过去，只留下 ${2}$ 号一个在原位置。

那我们就需要提出一种建图方式，使得 ${2}$ 不直接与 ${1}$ 相连，但是要求 ${2}$ 又属于 ${1}$ 树。考虑为每个集合设置虚拟源点，初始时每个集合就是以虚拟源点为根，普通节点为叶子的两点集合。如此一来，移动操作就变成了下图：

![](https://cdn.luogu.com.cn/upload/image_hosting/xd7o9np7.png)

然后就可以按照普通并查集的方法解了（因为创建了 $n$ 个虚拟源点，空间要开二倍）。

```cpp
#include <bits/stdc++.h>

#define N 200010

using namespace std;

typedef long long ll;

int p[N], vol[N];
ll sum[N];

int find(int x) {
    if (p[x] != x) p[x] = find(p[x]);
    return p[x];
}

void merge(int a, int b) {
    int u = find(a), v = find(b);
    p[u] = v;
    sum[v] += sum[u];
    vol[v] += vol[u];
}

void move(int a, int dest) {
    int u = find(a), v = find(dest);
    p[a] = v;
    vol[v]++;
    vol[u]--;
    sum[u] -= a;
    sum[v] += a;
}

bool related(int a, int b) {
    return find(a) == find(b);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n, m;
    while (cin >> n >> m) {
        for (int i = 1; i <= 2 * n; i++) {
            if (i <= n) {
                p[i] = i + n;
                vol[i] = 1;
                sum[i] = i;
            } else if (i > n) {
                p[i] = i;
                vol[i] = 1;
                sum[i] = i - n;
            }
        }
        while (m--) {
            int k, a, b;
            cin >> k;
            if (k == 1) {
                cin >> a >> b;
                if (!related(a, b)) merge(a, b);
            } else if (k == 2) {
                cin >> a >> b;
                if (!related(a, b)) move(a, b);
            } else {
                cin >> a;
                int u = find(a);
                cout << vol[u] << ' ' << sum[u] << endl;
            }
        }
    }
    return 0;
}
```

练习：[P1196 [NOI2002] 银河英雄传说](https://www.luogu.com.cn/problem/P1196)

## 种类并查集

一般的并查集可以用来维护一个带有传递性和连通性的集合，例如你亲戚的亲戚仍然是你的亲戚，普通并查集就可以做到维护你的所有亲戚和非亲戚，并判断某人是否是你的亲戚；而种类并查集则是它的升级，普通的并查集显然无法轻易维护诸如“敌人的敌人是朋友”的人际关系。这时，我们就可以多开几个普通的并查集用来维护不同类别之间的关系，即种类并查集。

### P2024 [NOI2001] 食物链

题目地址：[P2024](https://www.luogu.com.cn/problem/P2024)

题目难度：<span data-luogu data-green>普及+/提高</span>

题目来源：<span data-luogu data-source>NOI</span>&nbsp;&nbsp;<span data-luogu data-date>2001</span>

> 动物王国中有三类动物 $A,B,C$，这三类动物的食物链构成了有趣的环形。$A$ 吃 $B$，$B$ 吃 $C$，$C$ 吃 $A$。
> 
> 现有 $N$ 个动物，以 ${1 \sim N}$ 编号。每个动物都是 $A,B,C$ 中的一种，但是我们并不知道它到底是哪一种。
> 
> 有人用两种说法对这 $N$ 个动物所构成的食物链关系进行描述：
> 
> - 第一种说法是 `1 X Y`，表示 $X$ 和 $Y$ 是同类。
> - 第二种说法是`2 X Y`，表示 $X$ 吃 $Y$。
> 
> 此人对 $N$ 个动物，用上述两种说法，一句接一句地说出 $K$ 句话，这 $K$ 句话有的是真的，有的是假的。当一句话满足下列三条之一时，这句话就是假话，否则就是真话。
> 
> - 当前的话与前面的某些真的话冲突，就是假话；
> - 当前的话中 $X$ 或 $Y$ 比 $N$ 大，就是假话；
> - 当前的话表示 $X$ 吃 $X$，就是假话。
> 
> 你的任务是根据给定的 $N$ 和 $K$ 句话，输出假话的总数。
> 
> **输入格式：**
> 
> 第一行两个整数，$N,K$，表示有 $N$ 个动物，$K$ 句话。
> 
> 第二行开始每行一句话（按照题目要求，见样例）
> 
> **输出格式：**
> 
> 一行，一个整数，表示假话的总数。
> 
> **数据范围：**
> 
> 对于全部数据，${1\le N\le 5 \times 10^4}$，${1\le K \le 10^5}$。

这道题是种类并查集的经典应用之一，用来判断一个不等式组是否有冲突矛盾。之前在讲[Floyd 传递闭包](https://justpureh2o.cn/articles/32645/#p1347-%E6%8E%92%E5%BA%8F)的时候，我们就介绍了用传递闭包求解不等式组解的情况的方法。但是这种基于 $\texttt{Floyd}$ 算法的解法，其时间复杂度是恐怖的 $\mathcal O(n^3)$，在这道题里显然会超时，我们转而使用种类并查集来解决这道题。

整理一下题面，把这些动物分成三类——“国王”、“大臣”和“平民”。国王统治大臣、大臣压榨平民、平民推翻国王。但是关键是我们不知道动物的初始分类，因此我们在每一类里都放上 $n$ 个节点。

然后，对于操作 ${1}$——可能出现的矛盾是：二者不为同类，这里却归为同类；对于操作 ${2}$，可能出现的是：倒反天罡（大臣搞国王、平民踩大臣）、自残（自己吃自己）。换句话说，如果某个节点的根指到其他区域，那么这两个动物在当前信息下不可能成为同类；如果不满足镇压关系的二者共用同一个根，显然也不成立。

根据并查集所带的实际意义判断即可。注意如果当前命题是正确的，不要忘记合并到并查集里。

```cpp
#include <bits/stdc++.h>

#define N 50010
using namespace std;

int p[N * 3];
int n;

int find(int x) {
    if (p[x] != x) p[x] = find(p[x]);
    return p[x];
}

void merge(int a, int b) {
    p[find(a)] = find(b);
}

bool related(int a, int b) {
    return find(a) == find(b);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int k, ans = 0;
    cin >> n >> k;
    for (int i = 1; i <= 3 * n; i++) p[i] = i;
    while (k--) {
        int op, x, y;
        cin >> op >> x >> y;
        if (x > n || y > n) ans++;
        else if (op == 1) {
            if (related(x + n, y) || related(x, y + n)) ans++;
            else {
                merge(x, y);
                merge(x + n, y + n);
                merge(x + 2 * n, y + 2 * n);
            }
        } else {
            if (related(x, y) || related(x, y + n)) ans++;
            else {
                merge(x, y + 2 * n);
                merge(x + n, y);
                merge(x + 2 * n, y + n);
            }
        }
    }
    cout << ans << endl;
    return 0;
}
```

练习：[P1955 [NOI2015] 程序自动分析](https://www.luogu.com.cn/problem/P1955)

