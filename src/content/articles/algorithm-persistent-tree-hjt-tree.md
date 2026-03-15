---
slug: '53799'

category: oi算法
published: 2024-08-09T08:55:42.325338+08:00
image: https://cdn.luogu.com.cn/upload/image_hosting/r85787wa.png
tags:
- oi
- 算法
- 数据结构
title: '[熟肉] 一棵主席树新增了一个数据，这是它的结构发生的变化'
updated: 2024-10-05T18:51:20.349+08:00
---
标题及头图致敬油管兼B站UP主 [Chubbyemu](https://space.bilibili.com/297786973)——一位非常专业的医学区博主。

## 可持久化简介

可持久化数据结构，支持在保证操作不变的情况下、同时保存它的一个历史版本，以便后期的历史查询。一般的编辑器软件都会内置撤回/重做的功能，这时使用一个可持久化数据结构来存储用户的历史操作就显得非常便捷了；某些软件通过重演用户操作来实现撤回/重做功能：当用户操作较多时，会非常浪费系统资源、且效率极低，尤其是在进行连续撤回/重做时，体验感极差。

## 可持久化线段树/主席树 理论基础

对于一般的线段树，可以通过调用 `modify` 函数来进行单点插入，如果此时再加入一个要求——能够查询先前某一时刻的某一操作对应的区间最值，普通的线段树就无能为力了。比较直接的想法是：可以把每一次操作得到的线段树单独拎出来，然后对于每次询问，在对应的线段树里面跑即可。时间上过得了关，但显然这样太浪费空间——明明更改单点时只会影响到特定路径上的节点，为什么还要费劲把其他无关变量另外存下来呢？基于这个优化思路，可持久化线段树/主席树应运而生。

> [!TIP]
> **相关链接**：可持久化线段树的发明者叫黄嘉泰，由于他和当时的国家领导人名字首字母缩写雷同，因而又叫主席树。

先来看看普通线段树的插入操作：

![Insert#1](https://cdn.luogu.com.cn/upload/image_hosting/t1dmohle.png)

![Insert#2](https://cdn.luogu.com.cn/upload/image_hosting/kme9eowb.png)

如果每次操作都要新建一整个线段树的话，那么插入五个元素的空间复杂度就有原先的五倍之多。注意到在插入操作进行时，只有红色标出的节点是受影响的，因此只需把红圈存下来而无需无效地复制那些黑色的节点。

按此理论，完成五次插入后的线段树应是下面这样（部分虚边为了美观未在图上连出）：

![](https://cdn.luogu.com.cn/upload/image_hosting/wsqgjo7g.png)

可以发现一个规律：副本树的连接关系与原树相同、且副本树中不连接副本节点方向上的的子树与原树对应节点的对应子树相同。但同时我们失去了一些东西——左右子树的下标再也不满足线段树中的二倍和二倍加一关系了。不过对历史记录的访问变得轻松——从右到左，分别是第一次到第五次的操作所复制出来的副本树，每个副本树都有一个根节点，代表当前的历史记录。对于询问，直接在对应根节点上查询即可。

## 可持久化线段树/主席树 建树部分

根据上述分析，在主席树中，把 `l` 和 `r` 变量变成节点左右子树的下标（或指针）。由于每次操作最坏会复制出一个节点数为 $\log N$ 的副本，$N$ 次修改（插入节点）之后最多同时存在 ${2N-1+N\log N}$ 个节点，习惯性把空间开到 ${32}$ 倍，也就是左移 $5$ 位。此外维护一个数组 `root` 用来存储每个历史记录对应的根节点：

```cpp
struct HJTTree {
    int l, r;
    int dat; // 值
} tree[N << 5];
int idx = 0, root[N];
```

根据特定要求添加变量即可。在建树时，不断向深层递归，并动态创建新点。因为上面提到的主席树不再满足普通线段树的下标规律，我们给建树函数设置返回值，递归设置左右子树的值即可。大部分代码和原版线段树相差无几。

```cpp
int build(int l, int r) {
    int p = ++idx; // 开点
    if (l == r) {
        tree[p].dat = a[l];
        return p;
    }
    int mid = (l + r) >> 1;
    tree[p].l = build(l, mid); // 创建左子树
    tree[p].r = build(mid + 1, r); // 创建右子树
    return p;
}
```

## 可持久化线段树/主席树 节点插入

插入新节点时，我们需要先把沿途的所有节点复制一遍。节点复制写在一个函数 `clone(int u)` 中，顾名思义，这个操作非常简单——单纯就是原先点的复制、同时返回新建的副本节点的下标。

```cpp
int clone(int u) {
    int p = ++idx; // 开点
    tree[p] = tree[u]; // 复制
    return p;
}
```

接下来是节点插入的主体部分。把节点复制完毕得到一个新点后，就需要递归更新所有点的左右子树，最终在叶子节点的位置放置要插入的点。

```cpp
int insert(int u, int dat, int pos, int l, int r) {
    int p = clone(u); // 先复制
    if (l == r) {
        tree[p].dat = dat; // 叶子节点的位置插入
        return p;
    }  
    // 找到插入位置，同时更新子树
    int mid = (l + r) >> 1;
    if (pos <= mid) tree[p].l = insert(tree[u].l, dat, pos, l, mid);
    else tree[p].r = insert(tree[u].r, dat, pos, mid + 1, r);
    return p;
}
```

节点和区间的查询和普通线段树是基本一样的。这里需要注意题目要求查询哪个历史操作的值，并从相应的根节点开始向下递归查找。

## 模板两题

### 洛谷 P3919 [模板] 可持久化线段树 1（可持久化数组）

题目地址：[P3919](https://www.luogu.com.cn/problem/P3919)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

> 如题，你需要维护这样的一个长度为 $ N $ 的数组，支持如下几种操作
>
> 1. 在某个历史版本上修改某一个位置上的值
> 2. 访问某个历史版本上的某一位置的值
>
> 此外，每进行一次操作（**对于操作2，即为生成一个完全一样的版本，不作任何改动**），就会生成一个新的版本。版本编号即为当前操作的编号（从1开始编号，版本0表示初始状态数组）
>
> **输入格式：**
>
> 输入的第一行包含两个正整数 $ N, M $， 分别表示数组的长度和操作的个数。
>
> 第二行包含$ N $个整数，依次为初始状态下数组各位的值（依次为 $ a_i $，$ 1 \leq i \leq N $）。
>
> 接下来$ M $行每行包含3或4个整数，代表两种操作之一（$ i $为基于的历史版本号）：
>
> 1. 对于操作1，格式为 $ v_i~1~loc_i~value_i $，即为在版本 $ v_i $ 的基础上，将 $ a_{{loc}_i} $ 修改为 $ {value}_i $。
> 2. 对于操作2，格式为 $v_i~2~loc_i$，即访问版本 $ v_i $ 中的 $ a_{{loc}_i} $ 的值，注意：**生成一样版本的对象应为 $v_i$**。
>
> **输出格式：**
>
> 输出包含若干行，依次为每个操作2的结果。
>
> **数据范围：**
>
> 对于 100% 的数据：$ 1 \leq N, M \leq {10}^6, 1 \leq {loc}_i \leq N, 0 \leq v_i < i, -{10}^9 \leq a_i, {value}_i  \leq {10}^9$

就是上边的模板，拿来用即可。

```cpp
#include <bits/stdc++.h>
#define N 1000010
using namespace std;

struct HJTTree {
    int l, r;
    int dat;
} tree[N << 5];
int idx = 0, root[N];
int a[N];

int build(int l, int r) {
    int p = ++idx;
    if (l == r) {
        tree[p].dat = a[l];
        return p;
    }
    int mid = (l + r) >> 1;
    tree[p].l = build(l, mid);
    tree[p].r = build(mid + 1, r);
    return p;
}

int clone(int u) {
    int p = ++idx;
    tree[p] = tree[u];
    return p;
}

int insert(int u, int pos, int dat, int l, int r) {
    int p = clone(u);
    if (l == r) {
        tree[p].dat = dat;
        return p;
    }
    int mid = (l + r) >> 1;
    if (pos <= mid) tree[p].l = insert(tree[u].l, pos, dat, l, mid);
    else tree[p].r = insert(tree[u].r, pos, dat, mid + 1, r);
    return p;
}

int query(int idx, int pos, int l, int r) {
    if (l == r) return tree[idx].dat;
    int mid = (l + r) >> 1;
    if (pos <= mid) return query(tree[idx].l, pos, l, mid);
    return query(tree[idx].r, pos, mid + 1, r);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; i++) cin >> a[i];
    int tot = 0;
    root[0] = build(1, n);
    while (m--) {
        int ver, pos, op;
        cin >> ver >> op >> pos;
        if (op == 1) {
            int dat;
            cin >> dat;
            root[++tot] = insert(root[ver], pos, dat, 1, n);
        } else {
            cout << query(root[ver], pos, 1, n) << endl;
            root[++tot] = root[ver];
        }
    }
    return 0;
}
```

### 洛谷 P3834 [模板] 可持久化线段树 2

题目地址：[P3834](https://www.luogu.com.cn/problem/P3834)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

> 给定 $n$ 个整数构成的序列 $a$，将对于指定的闭区间 $[l, r]$ 查询其区间内的第 $k$ 小值。
>
> **输入格式：**
>
> 第一行包含两个整数，分别表示序列的长度 $n$ 和查询的个数 $m$。
> 第二行包含 $n$ 个整数，第 $i$ 个整数表示序列的第 $i$ 个元素 $a_i$。
> 接下来 $m$ 行每行包含三个整数 $ l, r, k$ , 表示查询区间 $[l, r]$ 内的第 $k$ 小值。
>
> **输出格式：**
>
> 对于每次询问，输出一行一个整数表示答案。
>
> **数据范围：**
>
> 对于 ${100\%}$ 的数据，满足 ${1 \leq n,m \leq 2\times 10^5}$，${0\le a_i \leq 10^9}$，${1 \leq l \leq r \leq n}$，${1 \leq k \leq r - l + 1}$。

~~这才是可持久化线段树的标准应用~~。这道题有很多种做法，最经典的是可持久化线段树，此外还有归并树、划分树、树套树（线段树套平衡树）。

此时维护另外一个变量 $s_{i,j}$，代表值落在 $[i,j]$ 之间的数的个数。在递归过程中，查看 $s_{l,mid}$ 和 $s_{mid+1,r}$ 与 $k$ 的大小关系。如果 $s_{l,mid}\geq k$，证明待查询数字在左区间内，递归到左区间；否则该数字在右区间，递归到右区间查找第 $k-s_{l,mid}$ 大数即可。这类似于[二叉搜索树的排名查询](https://justpureh2o.cn/articles/61585/#%E6%8E%92%E5%90%8D%E6%9F%A5%E8%AF%A2rank-query)操作。

如果只考虑右区间，即查询 $[1,r]$ 内的第 $k$ 大数，我们可以限定主席树的起始查找下标实现查询。但是我们加入了左区间，变成了 $[l,r]$，就不好搞了。但是当我们按照链式插入（为每个点单独分配一个根节点和副本树）数据时，它满足一个可减性，这意味着我们可以用类似前缀和的方式来处理任意区间。那么此时的 $s_{l,mid}$ 就可以用 $R$ 子树记录的 $s_{l,mid}$ 减去 $L-1$ 子树的 $s_{l,mid}$ 得到。

```cpp
#include <bits/stdc++.h>
#define N 200010
using namespace std;

struct HJTTree {
#define leftSubtree(idx) (tree[tree[idx].l])
#define rightSubtree(idx) (tree[tree[idx].r])
    int l, r;
    int cnt;
} tree[N << 5];
int idx = 0, root[N];
int a[N];
vector<int> num;

int find(int x) {
    return lower_bound(num.begin(), num.end(), x) - num.begin();
}

void pushup(int idx) {
    tree[idx].cnt = (leftSubtree(idx).cnt + rightSubtree(idx).cnt);
}

int build(int l, int r) {
    int p = ++idx;
    if (l == r) return p;
    int mid = (l + r) >> 1;
    tree[p].l = build(l, mid);
    tree[p].r = build(mid + 1, r);
    return p;
}

int clone(int u) {
    int p = ++idx;
    tree[p] = tree[u];
    return p;
}

int insert(int u, int pos, int l, int r) {
    int p = clone(u);
    if (l == r) {
        tree[p].cnt++;
        return p;
    }
    int mid = (l + r) >> 1;
    if (pos <= mid) tree[p].l = insert(tree[u].l, pos, l, mid);
    else tree[p].r = insert(tree[u].r, pos, mid + 1, r);
    pushup(p);
    return p;
}

int query(int l, int r, int L, int R, int k) {
    if (l == r) return l;
    int mid = (l + r) >> 1;
    int left = leftSubtree(R).cnt - leftSubtree(L).cnt;
    if (left >= k) return query(l, mid, tree[L].l, tree[R].l, k);
    return query(mid + 1, r, tree[L].r, tree[R].r, k - left);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        a[i] = x;
        num.push_back(x);
    }
    sort(num.begin(), num.end());
    num.erase(unique(num.begin(), num.end()), num.end());
    root[0] = build(0, num.size() - 1);
    for (int i = 1; i <= n; i++) root[i] = insert(root[i - 1], find(a[i]), 0, num.size() - 1);
    while (m--) {
        int l, r, k;
        cin >> l >> r >> k;
        cout << num[query(0, num.size() - 1, root[l - 1], root[r], k)] << endl;
    }
    return 0;
}
```
