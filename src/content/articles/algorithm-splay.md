---
slug: '63979'

category: oi算法
published: 2024-07-16T08:56:53.164906+08:00
image: https://cdn.luogu.com.cn/upload/image_hosting/ey7wedg9.png
tags:
- oi
- 算法
- 数据结构
title: 伸展树 Splay
updated: 2024-07-18T14:46:53.678+08:00
---
上回书说到：[平衡树](https://justpureh2o.cn/articles/73902)。

## <ruby>伸展树简介<rt>An Indroduction to Splay</rt></ruby>

由 $\texttt{Daniel Sleator}$ 和 $\texttt{Robert Tarjan}$ 于 ${1985}$ 年提出的一种数据结构。后者证明了路径压缩的并查集的时间复杂度、求解 $\texttt{SCC}$ 强连通分量的其中一种方法也以他的名字命名。

$\texttt{Splay}$ 是一种二叉搜索树，与平衡树类似，它也可以通过“旋转”进行自我平衡。通过“<ruby>伸展操作<rt>Splay</rt></ruby>”来将某个节点旋转至根节点来满足二叉搜索树的性质。能够在均摊 $\mathcal O(\log n)$ 的时间复杂度内完成节点的查找、插入和删除操作，并且在极端数据面前也可以保持自身平衡，不至于退化成 $\mathcal O(n)$ 的链状结构（又是薄纱朴素 $\texttt{BST}$ 的一天）。

## <ruby>伸展树的基本操作<rt>Basic Operations of Splay</rt></ruby>

### <ruby>结构定义<rt>Splay Structure</rt></ruby>

与前两个数据结构都不同的是，$\texttt{Splay}$ 多维护了一项“父节点”的信息。因为在伸展树操作过程中，会涉及到将节点向树根转动的操作，这时记录一个父节点就显得非常有必要且方便的了。其余内容和普通的平衡树就相差无几了：

```cpp
struct Splay {
    int s[2];   // 0 for left son, 1 for right son
    int p;      // Father node index
    int dat;    // Value
    int cnt;    // Duplication count
    int size;   // Node count in total
} tree[N];
```

### <ruby>再谈旋转<rt>Zigzagging Pt.II</rt></ruby>

在[平衡树 2.3节](https://justpureh2o.cn/articles/73902/#%E8%8A%82%E7%82%B9%E6%97%8B%E8%BD%ACnode-zigzaging)中，我们探讨了平衡树中左旋右旋的基本规则，并给出了三种简记技巧。在 $\texttt{Splay}$ 中，我们需要对平衡树的旋转操作进行一个更加深入的探讨。

可以发现，左旋和右旋是互为相反操作的。事实上，我们可以把整个旋转操作写成一个函数，通过传参来执行不同类型的旋转。我们只需要指定旋转的节点，至于旋转的取向则由程序自行决定（正确性是有保障的）。我们可以先分别写出左旋和右旋的函数，然后再把它们组合起来，最后别忘了更新父节点、以及上传子树大小（**注意代码顺序**）：

```cpp
void rotate(int x) {
    int y = tree[x].p, z = tree[y].p;           // Father and grandfather
    int sn_pos = (tree[y].s[1] == x);           // Where the son is, 0 left, 1 right
    int fa_pos = (tree[z].s[1] == y);           // Where the father is, 0 left, 1 right
    tree[z].s[fa_pos] = x;                      // Son and father need a swap. If father was on the left previously, the son will be placed as a father on the left
    tree[x].p = z;                              // Update father 1
    tree[y].s[sn_pos] = tree[x].s[sn_pos ^ 1];  // In the mid-traversal order, node B is between X and Y, so it will be linked to the opposite side
    tree[tree[x].s[sn_pos ^ 1]].p = y;          // Update father 2
    tree[x].s[sn_pos ^ 1] = y;                  // After a round of zigzagging, left branch that connects father and son will be switched to the right side
    tree[y].p = x;                              // Update father 3
    update(y);
    update(x);
}
```

### <ruby>树的伸展<rt>To Splay in Splay</rt></ruby>

伸展树的灵魂与核心就在于它可以将任意节点转动到其他节点下面去，这一操作就叫做“<ruby>伸展<rt>Splay</rt></ruby>”。在 $\texttt{Splay}$ 中，每次对节点进行一次操作，就需要把它转动到根节点下面去。~~虽然听起来很玄学~~，这一操作的初衷是对可能接连而来的针对于该节点的访问进行快捷响应。好比你正在刷视频，你突然看了一个平常不常看的类型的视频，对于大数据来说，你的某次访问就预示着你接下来也可能会“沉迷”于此类视频，因而把这类视频的优先级提高，并作出快速响应。在存储了巨量数据的数据库里，把某类键值的优先级提高是常见加快查询速度的方式之一。

对于三个节点 $X,Y,Z$，我们在操作时一般会遇见如下的几种排布方式：

1. 线形，即三个点都伸向相同方向
2. 折线形，伸展方向不相同

对于第一种情况，$\texttt{Tarjan}$ 给出的策略是先转 $Y$ 后转 $X$；第二种情况则转两次 $X$。这样的旋转方式经过证明可以让整个算法的时间复杂度均摊在 $\mathcal O(\log n)$ 左右。

我们定义 $\operatorname{splay}(x,k)$ 为：将节点 $x$ 旋转成 $k$ 的一个子节点，特殊地，如果 $k=0$，就代表将 $x$ 转到根节点下。那么当 $k$ 的子节点不是 $x$ 时，就不断旋转直到符合要求，期间判断三点形态（线形、折线形），然后采取对应的旋转策略即可。

```cpp
void splay(int x, int k) {
    while (tree[x].p != k) {
        int y = tree[x].p, z = tree[y].p;           // Father and grandfather
        int sn_pos = (tree[y].s[1] == x);           // Son direction
        int fa_pos = (tree[z].s[1] == y);           // Father direction
        if (z != k) {
            // More than one rotation to go
            if (sn_pos == fa_pos) rotate(y);        // Linear
            else rotate(x);                         // Broken-linear
        }
        rotate(x);                                  // Anyhow X needs a rotation
    }
    if (!k) root = x;                               // Upgrade as the new root
}
```

### <ruby>前驱&后继<rt>Precursor & Successor</rt></ruby>

为了找前驱/后继，我们就先需要找到带有给定权值的点。将这个点提到根上，方便我们的求解。基本思路和 $\texttt{BST}$ 一样，都是一头走到黑地向子树里面找。

```cpp
void findAndRaise(int idx, int dat) {
    splay(idx);
    if (tree[idx].dat > dat) findAndRaise(tree[idx].s[0], dat);
    else if (tree[idx].dat < dat) findAndRaise(tree[idx].s[1], dat);
}

int precursor(int dat) {
    findAndRaise(root, dat);
    int tmp = root;
    if (tree[tmp].s[0]) {
        tmp = tree[tmp].s[0];
        while (tree[tmp].s[1]) tmp = tree[tmp].s[1];
        return tmp;
    }
    return tmp;
}

int successor(int dat) {
    findAndRaise(root, dat);
    int tmp = root;
    if (tree[tmp].s[1]) {
        tmp = tree[tmp].s[1];
        while (tree[tmp].s[0]) tmp = tree[tmp].s[0];
        return tmp;
    }
    return tmp;
}
```

### <ruby>插入操作<rt>Insertion</rt></ruby>

#### <ruby>单点插入<rt>Node Insertion</rt></ruby>

为了维护节点的父节点信息，这次的插入操作和以往都不太一样。使用类似于深搜的遍历方式一路向下更新，我们的 `allocate` 函数也加入了父节点的初始化：

```cpp
int allocate(int dat, int p) {
    idx++;
    tree[idx].dat = dat;
    tree[idx].p = p;
    tree[idx].cnt = 1;
    tree[idx].size = 1;
    return idx;
}

void insert(int dat) {
    int u = root, p = 0;
    while (u) {
        p = u;
        if (tree[p].dat > dat) u = tree[u].s[0];
        else if (tree[p].dat < dat) u = tree[u].s[1];
        else {
            tree[u].cnt++;
            splay(p);
            return;
        }
    }
    u = allocate(dat, p);
    if (p) {
        // Not first run
        if (tree[p].dat > dat) tree[p].s[0] = u;
        else tree[p].s[1] = u;
    }
    splay(u);
}
```

#### <ruby>区间插入<rt>Sequence Insertion</rt></ruby>

假如我们要把一段序列插入到节点 $Y$ 的后侧，映射到整棵树的中序遍历就是在 $Y$ 后接上这段序列。因为 $\texttt{Splay}$ 整棵树维护的就是原始序列，换句话说，中序遍历就是原序列。那么我们只需要找到 $Y$ 的后继 $Z$，它在中序遍历里就是 $Y$ 的后一个节点，原序列中也是如此。那我们只需要把区间插入到 $Z$ 的左子树（对应中序遍历就是 $Y$ 和 $Z$ 之间的空隙）即可。

```cpp
void insertInterval(int pos, int tot) {
    int l = getIdxByRank(root, pos + 1);
    int r = getIdxByRank(root, pos + 2);
    splay(l);
    splay(r, l);
    int rt = build(0, tot - 1, r);
    tree[r].s[0] = rt;
    update(r);
    update(l);
}
```

### <ruby>删除操作<rt>Deletion</rt></ruby>

#### <ruby>单点删除<rt>Node Deletion</rt></ruby>

基本思路和平衡树一样，依然是把要删除的节点转到叶子上去。只不过在 $\texttt{Splay}$ 中，我们有一个利器——$\operatorname{splay}$ 函数。从而，我们可以把要删除节点的前驱和后继求出来，然后把前驱转到根节点上，再把后继转到前驱下边。这样一来，前驱的右子树是后继，后继的左子树就是待删除节点。根据 $\texttt{Splay}$ 中序遍历的不变性，此时待删除节点成为了一个叶子节点，直接删除（置零）即可。

```cpp
void removeNode(int idx, int dat) {
    int pre = precursor(dat);
    int suc = successor(dat);
    splay(pre);
    splay(suc, pre);
    int tar = tree[suc].s[0];
    if (tree[tar].cnt > 1) {
        tree[tar].cnt--;
        splay(tar);
    } else tree[suc].s[0] = 0;
}
```

#### <ruby>区间删除<rt>Sequence Deletion</rt></ruby>

单点删除是区间删除的一个特殊版本（$L=R$）。我们找到区间左端点 $L$ 的前驱 $L-1$，以及右端点 $R$ 的后继 $R+1$。旋转前驱到根，再旋转后继到前驱下边。与单点删除相同，这个区间对应的树就是后继的左子树。直接删除即可。

```cpp
void removeInterval(int pos, int tot) {
    int l = getIdxByRank(root, pos);
    int r = getIdxByRank(root, pos + tot + 1);
    splay(l);
    splay(r, l);
    gc(tree[r].s[0]);
    tree[r].s[0] = 0;
    update(r);
    update(l);
}
```

---

有关排名查询和数值查询的内容与平衡树相同，故直接给出。注意 $\operatorname{splay}$ 操作不要写到开头去了。

```cpp
int getRankByData(int idx, int dat) {
    if (!idx) return 1;
    if (tree[idx].dat > dat) return getRankByData(tree[idx].s[0], dat) + 1;
    return getRankByData(tree[idx].s[1], dat) + (tree[idx].s[0] ? leftSubtree(idx).size : 0) + tree[idx].cnt;
}

int getDataByRank(int idx, int rank) {
    if (!idx) return -INF;
    if (leftSubtree(idx).size >= rank) return getDataByRank(tree[idx].s[0], rank);
    if (leftSubtree(idx).size + tree[idx].cnt >= rank) return tree[idx].dat;
    return getDataByRank(tree[idx].s[1], rank - (tree[idx].s[0] ? leftSubtree(idx).size : 0) - tree[idx].cnt);
}
```

## <ruby>伸展树的高级操作<rt>Gorgeous Operations of Splay</rt></ruby>

我们虽然将 $\texttt{Splay}$ 归入平衡树之中（平衡树又归于 $\texttt{BST}$ 之内），但是在一般情况下，**伸展树是不满足二叉搜索树性质的**。具体表现在进行过多次旋转之后。但是，在不停的变换之中，有一样东西是从始至终一直不变的——中序遍历。伸展树的中序遍历就是原序列，根据这个性质，人们提出了不同花样的伸展树玩法……

### <ruby>区间翻转<rt>Sequence Flipping</rt></ruby>

在开始之前，我们首先要明白区间翻转在 $\texttt{Splay}$ 里的呈现是怎样的。显然，翻转前后，伸展树的中序遍历是相反的，那就可以画出如下对比图：

![](https://cdn.luogu.com.cn/upload/image_hosting/32tnwwf1.png)

可以发现，这个序列翻转了，在图中的表现就是交换树的左右儿子。我们类比线段树，可以引入一个懒标记来记录区间翻转操作。当然这里的标记打法和线段树略有不同：

> 给 $x$ 打标记的时候 $x$ 这个点的左右儿子还没换，这与线段树的 lazytag 不同。线段树在 $x$ 上打标记，表示 $x$ 已经修改过了，将要修改儿子的贡献。
> 
> ——樱雪喵 《Splay 详细图解 & 轻量级代码实现》

那如何找到区间 $[L,R]$ 所在子树呢？其实你已经学过了，就在前边的区间删除中，分别找到左右端点的前驱和后继，然后旋转到一起，后继的左子树就是 $[L,R]$。为了防止找不到前驱和后继，我们在整个序列的一头一尾分别插入两个点，以防访问出错，我们的边界节点恰好就能做到这一点！

如果要进行如上的翻转操作，整个代码中就要加入下传标记的操作。在所有有关查找的地方加入标记下传即可。

```cpp
void pushdown(int idx) {
    if (tree[idx].tag) {
        swap(tree[idx].s[0], tree[idx].s[1]);
        leftSubtree(idx).tag ^= 1;
        rightSubtree(idx).tag ^= 1;
        tree[idx].tag = 0;
    }
}
```

在查询排名和数值的时候下传标记即可。

### <ruby>启发式合并<rt>Heuristic Merging</rt></ruby>

$\texttt{Splay}$ 的合并就是单纯的将其中一棵树的每个点插入另一棵树中，但是这样可能会出现效率问题。当你把一个拥有很多节点的树合并到一棵非常小的树中时，由于插入操作的次数取决于插入子树的大小，显然会导致效率浪费。出于节省效率的目的，我们把大小更小的树合并到大小更大的树上去。

在这期间，我们就需要一个并查集来维护每个点所在的子树，把维护根节点的整型换成一个数组（毕竟有很多子树需要维护根节点的值）。在伸展操作（旋转到根节点）时更新根信息即可。

## <ruby>典例演练<rt>Pratical Examples</rt></ruby>

### 洛谷 P3391 [模板] 文艺平衡树

题目地址：[P3391](https://www.luogu.com.cn/problem/P3391)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

> 您需要写一种数据结构（可参考题目标题），来维护一个有序数列。
> 
> 其中需要提供以下操作：翻转一个区间，例如原有序序列是 ${5\ 4\ 3\ 2\ 1}$，翻转区间是 $[2,4]$ 的话，结果是 ${5\ 2\ 3\ 4\ 1}$。
> 
> **输入格式：**
> 
> 第一行两个正整数 $n,m$，表示序列长度与操作个数。序列中第 $i$ 项初始为 $i$。
> 接下来 $m$ 行，每行两个正整数 $l,r$，表示翻转的区间。
> 
> **输出格式：**
> 
> 输出一行 $n$ 个正整数，表示原始序列经过 $m$ 次变换后的结果。
> 
> **数据范围：**
> 
> 对于 ${100\%}$ 的数据，${1 \le n, m \leq 100000} $，${1 \le l \le r \le n}$。

这道题额外涉及到一个知识点，输出树的中序遍历。我们知道中序遍历是按照“左-根-右”的顺序递归输出的，我们只需要判断是否存在左右子树，然后递归输出即可，注意特判首位的边界节点。

代码在[云剪切板](https://www.luogu.com.cn/paste/g8cycn8n)。

### 洛谷 P3224 [HNOI2012] 永无乡

题目地址：[P3224](https://www.luogu.com.cn/problem/P3224)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

题目来源：<span data-luogu data-region>湖南</span>&nbsp;&nbsp;<span data-luogu data-date>2012</span>&nbsp;&nbsp;<span data-luogu data-source>各省省选</span>

> 永无乡包含 $n$ 座岛，编号从 $1$ 到 $n$ ，每座岛都有自己的独一无二的重要度，按照重要度可以将这 $n$ 座岛排名，名次用 $1$  到 $n$ 来表示。某些岛之间由巨大的桥连接，通过桥可以从一个岛到达另一个岛。如果从岛 $a$ 出发经过若干座（含 $0$ 座）桥可以 到达岛 $b$ ，则称岛 $a$ 和岛 $b$ 是连通的。
> 
> 现在有两种操作：
> 
> `B x y` 表示在岛 $x$ 与岛 $y$ 之间修建一座新桥。
> 
> `Q x k` 表示询问当前与岛 $x$ 连通的所有岛中第 $k$ 重要的是哪座岛，即所有与岛 $x$ 连通的岛中重要度排名第 $k$ 小的岛是哪座，请你输出那个岛的编号。
> 
> **输入格式：**
> 
> 第一行是用空格隔开的两个整数，分别表示岛的个数 $n$ 以及一开始存在的桥数 $m$。
> 
> 第二行有 $n$ 个整数，第 $i$ 个整数表示编号为 $i$ 的岛屿的排名 $p_i$。
> 
> 接下来 $m$ 行，每行两个整数 $u, v$，表示一开始存在一座连接编号为 $u$ 的岛屿和编号为 $v$ 的岛屿的桥。
> 
> 接下来一行有一个整数，表示操作个数 $q$。
> 
> 接下来 $q$ 行，每行描述一个操作。每行首先有一个字符 $op$，表示操作类型，然后有两个整数 $x, y$。
> 
> - 若 $op$ 为 `Q`，则表示询问所有与岛 $x$ 连通的岛中重要度排名第 $y$ 小的岛是哪座，请你输出那个岛的编号。
> - 若 $op$ 为 `B`，则表示在岛 $x$ 与岛 $y$ 之间修建一座新桥。
> 
> **输出格式：**
> 
> 对于每个询问操作都要依次输出一行一个整数，表示所询问岛屿的编号。如果该岛屿不存在，则输出 $-1$ 。
> 
> **数据范围：**
> 
> - 对于 ${20\%}$ 的数据，保证 $n \leq 10^3$, $q \leq 10^3$。
> - 对于 ${100\%}$ 的数据，保证 ${1 \leq m \leq n \leq 10^5}$, ${1 \leq q \leq 3 \times 10^5}$，$p$ 为一个 ${1 \sim n}$ 的排列，$op \in \{\texttt Q, \texttt B\}$，${1 \leq u, v, x, y \leq n}$。

这道题就要运用到我们上边所讲的启发式合并。重定义我们的 $\operatorname{splay}(x, dest,k)$ 为把节点 $x$ 旋转到编号 $dest$ 的树的 $k$ 号点下（默认 $k=0$ 即旋转到根）；以及插入函数 $\operatorname{insert}(dest,dat,uid)$ 为把权值和原编号（合并操作会增加新点，为了保证下标稳定故初始化时记录）分别为 $dat,uid$ 的点插入到 $dest$ 号树下。那么每一次合并，我们只需要判断合并的两点是否已经在同一棵树下、两棵树哪一棵的大小更大（启发式），然后用一个深搜遍历小树，把小树里的点递归插入（复制）到大树里面即可。注意操作时用 `root` 数组包裹的地方，理解为重。

代码在[云剪切板](https://www.luogu.com.cn/paste/t6o1ydk1)中。

### 洛谷 P2042 [NOI2005] 维护数列

题目地址：[P2042](https://www.luogu.com.cn/problem/P2042)

题目难度：<span data-luogu data-purple>省选/NOI</span>

题目来源：<span data-luogu data-source>NOI</span>&nbsp;&nbsp;<span data-luogu data-date>2005</span>

> 请写一个程序，要求维护一个数列，支持以下 $6$ 种操作：
> 
> | 编号 |     名称     |                              格式                              | 说明                                                                                                        |
| :--: | :----------: | :------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------- |
|  1  |     插入     | $\operatorname{INSERT}\ posi \ tot \ c_1 \ c_2 \cdots c_{tot}$ | 在当前数列的第$posi$ 个数字后插入 $tot$ 个数字：$c_1, c_2 \cdots c_{tot}$；若在数列首插入，则 $posi$ 为 $0$ |
|  2  |     删除     |              $\operatorname{DELETE} \ posi \ tot$              | 从当前数列的第$posi$ 个数字开始连续删除 $tot$ 个数字                                                        |
|  3  |     修改     |          $\operatorname{MAKE-SAME} \ posi \ tot \ c$          | 从当前数列的第$posi$ 个数字开始的连续 $tot$ 个数字统一修改为 $c$                                            |
|  4  |     翻转     |             $\operatorname{REVERSE} \ posi \ tot$             | 取出从当前数列的第$posi$ 个数字开始的 $tot$ 个数字，翻转后放入原来的位置                                    |
|  5  |     求和     |             $\operatorname{GET-SUM} \ posi \ tot$             | 计算从当前数列的第$posi$ 个数字开始的 $tot$ 个数字的和并输出                                                |
|  6  | 求最大子列和 |                    $\operatorname{MAX-SUM}$                    | 求出当前数列中和最大的一段子列，并输出最大和                                                                |
> 
> **输入格式：**
> 
> 第一行包含两个整数 $N$ 和 $M$，$N$ 表示初始时数列中数的个数，$M$ 表示要进行的操作数目。
> 
> 第二行包含 $N$ 个数字，描述初始时的数列。以下 $M$ 行，每行一条命令，格式参见问题描述中的表格。
> 
> **输出格式：**
> 
> 对于输入数据中的 $\operatorname{GET-SUM}$ 和 $\operatorname{MAX-SUM}$ 操作，向输出文件依次打印结果，每个答案（数字）占一行。
> 
> **数据范围：**
> 
> - 你可以认为在任何时刻，数列中至少有 $1$ 个数。
> - 输入数据一定是正确的，即指定位置的数在数列中一定存在。
> - 对于 ${50\%}$ 的数据，任何时刻数列中最多含有 ${3 \times 10^4}$ 个数。
> - 对于 ${100\%}$ 的数据，任何时刻数列中最多含有 ${5 \times 10^5}$ 个数，任何时刻数列中任何一个数字均在 $[-10^3, 10^3]$ 内，${1 \le M \le 2 \times 10^4}$，插入的数字总数不超过 ${4 \times 10^6}$。
> 
> 题面由 @syksykCCC 提供。

这道题需要我们复习一下之前线段树的知识，[这篇博客](https://www.luogu.com/article/4qwcw951)介绍了线段树求解区间最大子列的方法。

代码在[云剪贴板](https://www.luogu.com.cn/paste/t6o1ydk1)。

## <ruby>后记&鸣谢<rt>Epilogue & Special Thanks</rt></ruby>

整整一天都花在调题对拍上了，做P2042的时候头发都掉了不少，不过总算是结束伸展树了。再加上你谷爆发了一次[逆天的DDoS事件](https://lglg.top/857171)、还有那么多人在抢[R166666666](https://www.luogu.com.cn/record/166666666)，我连题目都进不去，旁边的某位孩子评测了10分钟才出结果……真应了大佬一句话——“暑假的猴子最多”……

参考资料：

[1] Brailliant11001.高贵的伸展树——Splay [EB/OL]. [https://www.luogu.com/article/2zmvdtov](https://www.luogu.com/article/2zmvdtov), 2024-2-20/2024-7-16

[2] 樱雪喵.Splay 详细图解 & 轻量级代码实现 [EB/OL]. [https://www.cnblogs.com/ying-xue/p/17122409.html](https://www.cnblogs.com/ying-xue/p/17122409.html), 2023-9-10/2024-7-16

[3] 小蒟蒻yyb.Splay入门解析【保证让你看不懂（滑稽）】 [EB/OL] [https://www.cnblogs.com/cjyyb/p/7499020.html](https://www.cnblogs.com/cjyyb/p/7499020.html), 2017-9-9/2024-7-16

[4] Brailliant11001.从零开始掌握线段树大法 [EB/OL]. [https://www.luogu.com/article/4qwcw951](https://www.luogu.com/article/4qwcw951), 2023-12-30/2024-7-17

