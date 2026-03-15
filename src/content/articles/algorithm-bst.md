---
slug: '61585'

category: oi算法
published: 2024-07-14T17:12:05.236184+08:00
image: https://pic.imgdb.cn/item/66939472d9c307b7e9a33104.jpg
tags:
- oi
- 算法
- 数据结构
title: 二叉搜索树 BST
updated: 2024-08-24T14:51:33.373+08:00
---
## <ruby>二叉搜索树简介<rt>A Brief Introduction</rt></ruby>

<ruby>二叉搜索树<rt><b>B</b>inary <b>S</b>earch <b>T</b>ree</rt></ruby>是一种特殊的二叉树，它有如下的性质：

1. 左儿子（如果存在）的节点值比当前节点的值要小
2. 右儿子（如果存在）的节点值比当前节点的值更大
3. 某个节点的左/右子树（如果存在）也为一个二叉搜索树
4. 中序遍历得到的节点值序列是不下降的（属于是推论）

二叉搜索树是很多重要树形数据结构的理论基础，例如<ruby>树堆<rt>Treap</rt></ruby>、<ruby>红-黑树<rt>Red-Black Tree</rt></ruby>、<ruby>伸展树<rt>Splay</rt></ruby>等等。

## <ruby>二叉搜索树的实现<rt>In-Code Practice</rt></ruby>

对于一个树形数据结构，我们首先需要明确它的建树操作，这相当于一栋大楼的基石；其次考虑它的节点操作，即单个点的增加、删除、求值等，相当于盖楼的承重柱，有骨梁的作用；最后是它的应用范围，好比给大楼装上玻璃。我们接下来从以上三个方面实现一个普通的二叉搜索树——

### <ruby>宏定义目录<rt>Macro Index</rt></ruby>

把可能会用到的宏定义函数放在开头：


| 宏名称              | 定义                 | 作用                     |
| ------------------- | -------------------- | ------------------------ |
| `leftSubtree(idx)`  | `tree[tree[idx].ls]` | 获取当前节点的左子树对象 |
| `rightSubtree(idx)` | `tree[tree[idx].rs]` | 类似上边，获取右子树对象 |
| `NEGAINF_NODE`      | `2`                  | 记录负无穷边界节点的下标 |
| `POSIINF_NODE`      | `1`                  | 记录正无穷边界节点的下标 |

### <ruby>$\texttt{BST}$ 基本结构<rt>Basic Structure Definition</rt></ruby>

我们知道二叉树是可能会有左右子节点的，因此需要设计两个变量存储左右子节点 的下标；点的权值也是我们需要关心的；为了应对可能出现的权值重复，我们可以考虑加入一个权值计数，让相同权值的点不会被加入两次；最后为了应对一些题目的要求，维护一个记录子树总点数的变量。结构体看起来大概是这样的：

```cpp
struct BST {
// Some macro definitions, see the table above
#define leftSubtree(idx) (tree[tree[idx].ls])
#define rightSubtree(idx) (tree[tree[idx].rs])
#define NEGAINF_NODE 2
#define POSIINF_NODE 1
    int ls, rs; // Index for left/right sons
    int dat;    // Data carried by the node or simply a node value
    int cnt;    // Count in case there's a duplicated value
    int size;   // Total child nodes
} tree[N];
int root;       // Record the root node index, normally it's 1
```

### <ruby>建树&单点创建<rt>Build & Node Allocating </rt></ruby>

写 $\texttt{BST}$ 有一个不成文的规矩：在建树时加入两个边界节点正无穷和负无穷，其中一个作为树的根节点，选哪个都可以。我选择将正无穷作为根节点，根据定义，负无穷节点应是它的左儿子。特别地，我们称只包含正/负无穷节点的 $\texttt{BST}$ 为空。因此建树只需创建两个无穷节点即可，注意对于初始建立的无穷权节点，实际上是不会包含在 $\texttt{BST}$ 中的，因此设立一个特判，将它们的重复计数设为 ${0}$，否则在计算排名时会出错。

接下来就是单点的创建了。在 $\texttt{BST}$ 中，我们使用类似于链式前向星的方法创建某个点。关键代码如下：

```cpp
int idx = 0, root;

int allocate(int dat, bool on_init = false) {
    idx++;
    tree[idx].dat = dat;
    tree[idx].cnt = (on_init) ? 0 : 1;     // Process duplication count with special judge
    tree[idx].size = 1;                    // Add to subnode count
    return idx;
}

void build() {
    allocate(INF);
    allocate(-INF);
    root = 1;           // Take the first node as root. It's positive infinity
    tree[1].ls = 2;     // According to the passage, negative infinity should be the left son
}
```

为 `allocate()` 函数设返回值大概是它与链式前向星最大的区别点了，后文会讲到设返回值的妙用。

### <ruby>单点查询<rt>Index Query</rt></ruby>

根据开头介绍的 $\texttt{BST}$ 的性质，写这个就非常简单了。主要分以下几个情况考虑（假设目标值为 $N$，当前值为 $v$，不保证是否存在该权值）：

1. 若 $v=N$，即查询到目标节点，返回下标
2. 若 $v<N$，向左子树递归搜索
3. 若 $v>N$，向右子树递归搜索
4. 若下标无意义，返回不存在（表现在下标为 ${0}$）

```cpp
int query(int idx, int dat) {
    if (!idx) return 0;                                            // Nonsense index indicates failure
    if (dat == tree[idx].dat) return idx;                           // Found!
    if (dat > tree[idx].dat) return query(tree[idx].rs, dat);   // Target is greater than current, recurse to right son 
    return query(tree[idx].ls, dat);                            // Recurse to left son
}
```

### <ruby>插入数值<rt>Value Insertion</rt></ruby>

注意：**这和前文所述的单点创建并不等价**。在这一操作中，我们需要关注已有的其他点的权值情况。在 $\texttt{BST}$ 中，是不能出现两个不同的点（下标不同）共享同一份权值的。虽然很多题目会明确指出“本题数据保证不存在权值相同的两个点”，但有时也会出现例外。对于这类例外的题目，前面设立的变量就有用武之地了！

理论上我们可以通过调用 `query()` 函数来快捷得知该权值的存在性，但是实践时一般不采用这种做法。考虑到先前所讲的几大函数都没有对节点之间的从属关系进行更新，又因为插入操作会涉及到节点之间的关系转换，故将更新左右儿子的操作放在此处。

首先还是需要获取该权值理应存放的位置，求解策略跟单点查询相同。只是我们将递归参数“下标”设为引用形式，这样在一层层向上返回时就可以顺便更新父节点的左右儿子下标了。此时单点创建函数的返回值将作为新建点的序号向上传递，一路更新至根节点。

```cpp
void insert(int &idx, int dat) {
    if (!idx) {
        idx = allocate(dat); // Does not exist, then allocate a new node
        return;
    }
    if (tree[idx].dat == dat) {
        tree[idx].cnt++;     // Encounter a duplicated node, add to its count
        return;
    }
    if (tree[idx].dat < dat) insert(tree[idx].rs, dat);
    if (tree[idx].dat > dat) insert(tree[idx].ls, dat);
    tree[idx].size = (tree[idx].ls ? leftSubtree(idx).size : 0) + (tree[idx].rs ? rightSubtree(idx).size : 0) + tree[idx].cnt;        // Recursivly update the tree size
}
```

### <ruby>前驱&后继<rt>Precursor & Successor Node</rt></ruby>

<ruby>前驱<rt>Precursor Node</rt></ruby>：在所有权值小于当前点权的点之中，权值最大的那一个。

<ruby>后继<rt>Successor Node</rt></ruby>：在所有权值大于当前点权的点之中，权值最小的那一个。

以求前驱为例（如果权值是给定值的点不存在，我们默认它的前驱是负无穷）：首先我们需要从根节点开始，向下找到给定权值应该存放的位置。如果找到权值是给定值的点，要保证答案点的权值小于基准点，我们就要先向左子树走（树内权值均小于父节点），接着一直沿右子树（树内权值均大于父节点）走到底即可找到前驱。求后继类似，只是需要先找到基准点的右子树，然后一直沿左子树走到底。

因为查询排名和查询数值都有一步查找对应点的步骤，与查找前驱后继的过程相同，故而可以把二者合一以简化代码（见后文）。

```cpp
int precursor(int idx, int dat) {
    int res = NEGAINF_NODE; // Negative infinity
    while (idx) {
        if (tree[idx].dat == dat) {
            if (tree[idx].ls) { // Ensure that its left subtree exists
                res = tree[idx].ls;
                while (tree[idx].rs) res = tree[res].rs;  
            }
            break;
        }
        if (tree[idx].dat < dat && tree[res].dat < tree[idx].dat) res = idx;
        idx = (dat > tree[idx].dat) ? tree[idx].rs : tree[idx].ls;
    }
    return res;
}

int successor(int idx, int dat) {
    int res = POSIINF_NODE; // Positive infinity
    while (idx) {
        if (tree[idx].dat == dat) {
            if (tree[idx].rs) {
                res = tree[idx].rs;
                while (tree[idx].ls) res = tree[idx].ls;
            }
            break;
        }
        if (tree[idx].dat > dat && tree[res].dat > tree[idx].dat) res = idx;
        idx = (dat > tree[idx].dat) ? tree[idx].rs : tree[idx].ls;
    }
    return res;
}
```

### <ruby>单点删除<rt>Node Deletion</rt></ruby>

在一棵合法的 $\texttt{BST}$ 中，任意节点的子树也都是一棵合法的 $\texttt{BST}$，这启示我们不能鲁莽、暴力地删点，而是要好好理清楚节点之间的关系之后，进行一系列操作，最后删除掉这个节点。

对于某个节点，它可能有如下几种情况：

1. 它是一个叶子节点，可以直接删除。
2. 它在一条链上（只有一个子节点）：删除这个点，同时让它的子节点代替它。
3. 它是一个二叉节点（两个子节点）：考虑提出一种方式把问题简化为以上两种特殊情况。首先找到前驱或者后继，因为前驱和后继均只有一个方向上的子树，简化成第二种情况。我们可以让前驱/后继替换要删除的节点，紧接着把替换过去的原节点删除即可！就好像剪贴覆盖的过程。
4. 如果这个点的重复数量大于一，则减去一个重复数。

```cpp
void remove(int &idx, int dat) {
    if (!idx) return; // Does not exist
    if (tree[idx].dat == dat) {
        if (tree[idx].cnt > 1) tree[idx].cnt--; // Dupliacted, then minus one to its count
        else {
            if (!tree[idx].ls) idx = tree[idx].rs;     // No left subtree, replace it with its left subtree
            else if (!tree[idx].rs) idx = tree[idx].ls; // Vice versa
            else {
                int pre = precursor(idx, dat);   // Find the precursor
                remove(pre, tree[pre].dat);      // Remove precursor
                tree[pre] = tree[idx];           // Replace
                idx = pre;                   
            }
            return;
        }
    }
    if (tree[idx].dat > dat) remove(tree[idx].ls, dat);
    else remove(tree[idx].rs, dat);
}
```

### <ruby>排名查询<rt>Rank Query</rt></ruby>

所谓排名，就是看有多少元素比你当前的元素大/小，所得数目加一的结果。$\texttt{BST}$ 天生的有序性可以帮助我们高效地解决这一点。与数值查询不同，排名查询时给出的权值可能并不存在于任何点之中。我们的基本求解策略如下：

1. 如果需要向右子树扩展查找，则累加左子树大小和当前根节点的重复次数。
2. 如果当前根节点的权值等于给定权值，则累加左子树大小，并**额外加一**。
3. 如果需要向左子树扩展，递归返回向左子树查找的结果。

第一点很好理解：对于根节点，它的左子树所有点权都比根节点的小。此时我们需要查询的点权显然是大于当前根节点的（位于右子树），因而左子树、包括当前根节点在内的所有点都会排在目标点之前，需要累加起来。

第二点告诉我们这样一条消息：当前根节点就是目标节点，所以左子树的所有节点都排在它之前，需要累加。这个情况可以看作第一点的特殊形式，必须注意的是，这里无需再累加当前根节点的重复次数。

对于第三点：因为我们不确定左子树的情况（有大有小），因此无需多虑直接递归进去就好。

```cpp
int getRankByData(int idx, int dat) {
    if (!idx) return 1;
    if (tree[idx].dat == dat) return (tree[idx].ls ? leftSubtree(idx).size : 0) + 1;
    if (tree[idx].dat < dat) return (tree[idx].ls ? leftSubtree(idx).size : 0) + getRankByData(tree[idx].rs, dat);
    return (tree[idx].ls ? leftSubtree(idx).size : 0) + getRankByData(tree[idx].rs, dat);
}
```

### <ruby>数值查询<rt>Data Query</rt></ruby>

题目会给定一个排名，让你获取对应排名的节点权值。与上边排名查询不同的是，这里给出的排名必须有一个对应的点，因为排名是离散的、权值不离散，所以这里需要判断无解的情况。基本分五类讨论：

1. 如果左子树的大小（节点的重复数也计入）大于等于所查询的排名参数 $k$，向左子树递归。
2. 如果左子树的大小在如下范围内（当前根节点重复数为 $c$）：$[k-c,k-1]$，返回当前根节点的权值。
3. 不在以上三类情况中，向右子树递归，参数减去左子树的大小以及当前根节点的重复数。
4. 当前下标无意义，判无解并返回。

首先，左子树是一定小于当前根节点的。如果左子树的大小都超过了排名参数，就代表目标点在左子树内，继续向左子树递归找排名为 $k$ 的点即可。

对于第二点，当前根节点的重复数为 $c$，那么对于根节点这个大集合（相同权值记作不同排名），排名的范围就是 $[k-c,k-1]$。因此一旦满足该关系直接返回。

最后是第三点，因为左子树的大小与根节点重复数的和小于当前排名，代表我们要找的点在右子树。在右子树中它的排名又是多少呢？显然，因为左子树和根节点占去了一部分排名，在右子树中，它的排名就需要减去这二者的和。

第四点属于无解判断，不再赘述。

```cpp
int getDataByRank(int idx, int rank) {
    if (!idx) return -1;
    if (leftSubtree(idx).size >= rank) return getDataByRank(tree[idx].ls, rank);
    if (leftSubtree(idx).size + tree[idx].cnt >= rank) return tree[idx].dat;
    return getDataByRank(tree[idx].rs, rank - (tree[idx].ls ? leftSubtree(idx).size : 0) - tree[idx].cnt);
}
```

## <ruby>典例演练<rt>Pratical Examples</rt></ruby>

### 洛谷 P5076 [深基16.例7] 普通二叉树（简化版）

题目地址：[P5076](https://www.luogu.com.cn/problem/P5076)

题目难度：<span data-luogu data-green>普及+/提高</span>

> 您需要写一种数据结构，来维护一些数（都是绝对值 ${10^9}$ 以内的数）的集合，最开始时集合是空的。其中需要提供以下操作，操作次数 $q$ 不超过 $10^4$：
>
> 1. 定义数 $x$ 的排名为集合中小于 $x$ 的数的个数 $+1$。查询数 $x$ 的排名。**注意 $x$ 不一定在集合里**。
> 2. 查询排名为 $x(x\ge 1)$ 的数。**保证集合里至少有 $x$ 个数**。
> 3. 求 $x$ 的前驱（前驱定义为小于 $x$，且最大的数）。若不存在则输出 $-2147483647$。
> 4. 求 $x$ 的后继（后继定义为大于 $x$，且最小的数）。若不存在则输出 $2147483647$。
> 5. 插入一个数 $x$，本题的数据保证插入前 $x$ 不在集合中。
>
> 保证执行 $1,3,4$ 操作时，集合中有至少一个元素。
>
> **输入格式：**
>
> 第一行是一个整数 $q$，表示操作次数。
>
> 接下来 $q$ 行，每行两个整数 $op,x$，分别表示操作序号以及操作的参数 $x$。
>
> **输出格式：**
>
> 输出有若干行。对于操作 $1,2,3,4$，输出一个整数，表示该操作的结果。

这是一道模板题，套用上边的模板即可（甚至不涉及节点删除）。为了压缩篇幅，代码放在[此处](https://www.luogu.com.cn/paste/g8cycn8n)。

![](https://cdn.luogu.com.cn/upload/image_hosting/8phdj9ut.png)

~~你怎么知道我花了三节晚自习+一个上午过样例、大半个下午调代码？（因为查询数值时没判断是否是边界节点）~~

## <ruby>常见问题<rt>Q & A</rt></ruby>

> Q：为什么初始的两个边界节点需要设置它们的重复计数为 ${1}$？

从实际意义上说，这两个点其实并不参与我们的一系列树上操作。它们只是起到一个防止溢出的作用——好比人体的阑尾，对消化吸收并没有什么帮助，但是它就是长在那个地方~~就是用来发炎的~~，你也不好说什么（doge）。

> Q：$\texttt{BST}$ 的时间复杂度？为什么我用 $\texttt{BST}$ 会超时？

$\texttt{BST}$ 的时间复杂度最好情况下是 $\mathcal O(\log n)$；最坏可能退化成 $\mathcal O(n)$。

由于 $\texttt{BST}$ 的形态与节点的插入顺序相关，如果插入的数据高度有序，最坏情况下整棵树是一条链状结构，会退化成 $\mathcal O(n)$ 的复杂度（相当于开一维数组跑暴力）。为了应对这种左右子树不平衡的问题，人们提出了诸如<ruby>平衡树<rt>Treap</rt></ruby>的数据结构，采用随机化数据来保持左右子树的平衡性，这样一来整体时间复杂度是稳定在 $\mathcal O(\log n)$ 左右的。人们为了让 $\texttt{BST}$ 不被极端数据卡死，提出了平衡树（或树堆），[见下一篇博客](https://justpureh2o.cn/articles/73902)

## <ruby>后记&致谢<rt>Epilogue & Special Thanks</rt></ruby>

在写这篇文章的时候，经历了许多挫折……先是电脑意外关机，写了一千多字的草稿没保存直接没了；然后是注销电脑前望保存草稿，写了那么多，又一下子没了……为了保证代码的正确性，在做P5076的时候硬是顶着莫名的RE和WA把代码调出来了……

当然，调我又臭又长的数据结构代码是需要很大耐心和毅力的（~~以及心理承受能力~~）。这期间需要感谢：

* 花半小时用控制变量法拯救我的RE代码的—— <span><a href="https://www.luogu.com/user/602372"><img src="https://cdn.luogu.com.cn/upload/usericon/602372.png?x-oss-process=image/resize,lift_m,w_25/quality,q_50/circle,r_25"></a></span> <span style="color:#FE4C61">**Brailliant11001**</span>
* 花半小时理解我的代码，提出Hack数据来警示我的—— <span><a href="https://www.luogu.com/user/663949"><img src="https://cdn.luogu.com.cn/upload/usericon/663949.png?x-oss-process=image/resize,lift_m,w_25/quality,q_50/circle,r_25"></a></span> <span style="color:#F39C11">**DWHJHY**</span>
* 花重金买来一大包（450g装）薯片为我们疲惫的大脑补充营养的——<span><a href="https://www.luogu.com/user/1041101"><img src="https://cdn.luogu.com.cn/upload/usericon/1041101.png?x-oss-process=image/resize,lift_m,w_25/quality,q_50/circle,r_25"></a></span> <span style="color:#FE4C61">**Aventurine_Stone**</span>

参考资料：

[1] DWHJHY.二叉搜索树（BST）-BINARY SEARCH TREE [EB/OL]  .[https://www.luogu.com/article/vqr2u9g2](https://www.luogu.com/article/vqr2u9g2) ,2024-4-12/2024-7-14

[2] Brailliant11001.二叉搜索树（BST）[EB/OL] .[https://www.luogu.com/article/zqha49ef](https://www.luogu.com/article/zqha49ef) ,2024-1-31/2024-7-14
