---
slug: '73902'

category: oi算法
published: 2024-07-14T17:31:36.575031+08:00
image: https://pic.imgdb.cn/item/66939b6ad9c307b7e9afc19a.jpg
tags:
- oi
- 算法
- 数据结构
title: 平衡树 Treap
updated: 2024-07-16T11:16:57.820+08:00
---
书接上回：[二叉搜索树 BST](https://justpureh2o.cn/articles/61585/)。二叉搜索树是本文所讲平衡树的必要前置知识。

## <ruby>平衡树简介<rt>Brief Introduction of Treap</rt></ruby>

平衡树是为了解决普通二叉搜索树（$\texttt{BST}$）时间复杂度退化现象而产生的一种复杂度更为稳定的数据结构（但它仍然属于 $\texttt{BST}$ 的一个子类，因此具备 $\texttt{BST}$ 的所有性质）。在极端的数据面前（具备单调性的数据），$\texttt{BST}$ 会退化成为一个 $\mathcal O(n)$ 的算法。但是通过引入随机化参数，在数学期望的控制下就可以整体上维持二叉树的平衡（左右子树的高度相差不大），从而让复杂度基本稳定在 $\mathcal O(\log n)$ 左右，是极为优秀的算法。一般情况下，我们都会选用平衡树而不是普通的二叉搜索树。

在平衡树中，同时存在着二叉搜索树的性质和堆的性质（Treap = Tree + Heap）。为了让树更加平衡，我们引入一个随机化的值，用来满足平衡树的堆性质。通过引入这么一个随机变量，把原先可能完全有序的序列打乱，让它从期望上尽量接近一棵满二叉树，进而实现稳定时间复杂度的效果。

## <ruby>平衡树的代码实现<rt>Treap Instance</rt></ruby>

### <ruby>如何生成更好的随机数<rt>How to Random Better in CPP</rt></ruby>

大部分人比较清楚的是我们的牢朋友 `srand()` 和 `rand()`，调用前者以设置随机数引擎的随机种子，后者用于生成一个随机数。然而，如果你忘记先使用 `srand()` 设置种子，程序会每一次默认一个固定的种子来生成随机数，这样一来生成出来的随机数就不“随机”了——它们会变成固定的一串序列。不过你也可以凭经验，记住某个种子来达到理想的效果……

那么如何生成更“随机”的随机数呢？标准库里内置了 <ruby>`random_device`<rt>随机设备</rt></ruby>，向系统索取一个随机数；C++同时也内置了一个整数随机数生成算法 `mt19937`（以及它的64位长整型版本 `mt19937_64`，仍然需要人工设置种子），它的全称是<ruby>梅森旋转算法<rt>Mersenne Twister</rt></ruby>，用它们生成随机数的代码如下：

```cpp
// Random device
random_device rd;
unsigned r1 = rd();
// Mersenne Twister
mt19937 mt(seed);
unsigned r2 = mt();
```

使用无符号整型是为了防止溢出问题。

> ![](https://imgsa.baidu.com/forum/w%3D580/sign=d87278feb112c8fcb4f3f6c5cc0192b4/fde7b544ad345982184eef4c04f431adc9ef84e6.jpg)
>
> 据说是无符号整型的溢出问题导致《文明6》中的“~~非~~暴力不合作运动发起人”甘地通常是第一个向整个世界扔核弹的领导人。

### <ruby>基本创建<rt>Deployment Methods</rt></ruby>

$\texttt{Treap}$ 本质上仍然属于 $\texttt{BST}$，基本的结构定义保持不变。平衡树里引入了一个新的随机化变量来让整棵树保持平衡：

```cpp
struct Treap {
// Some macro definitions
#define leftSubtree(idx) (tree[tree[idx].ls])
#define rightSubtree(idx) (tree[tree[idx].rs])
#define NEGAINF_NODE 2
#define POSIINF_NODE 1
    int ls, rs;     // Left and right son
    int dat, rnd;   // Real value and randomized data for zigzags
    int cnt;        // Duplication count
    int size;       // How many nodes are there inside its subtree
} tree[N];
```

全局变量和二叉搜索树基本相同，不同的是引入了一个随机设备 `random_device` 用来生成随机数。

```cpp
int idx = 0, root;
random_device rd;
```

单点创建、建树的思路和二叉搜索树一模一样，只是在创建新点是要赋一个额外的随机化参数。

```cpp
int allocate(int dat, bool on_init = false) {
    idx++;
    tree[idx].dat = dat;
    tree[idx].rnd = rd();  // Randomized param
    tree[idx].cnt = (on_init) ? 0 : 1;
    tree[idx].size = 1;
}

void build() {
    allocate(INF, true);
    allocate(-INF, true);
    tree[1].ls = 2;
    root = 1;
}
```

### <ruby>节点旋转<rt>Node Zigzaging</rt></ruby>

节点的<ruby>左旋<rt>Zag</rt></ruby>和<ruby>右旋<rt>Zig</rt></ruby>可谓是平衡树的看门好戏了~~葡萄糖：我也是~~，这两者都是用来维持平衡树平衡性的利器。接下来介绍两种节点旋转的法则：

#### <ruby>左旋<rt>Zag/Left Rotate</rt></ruby>

看下图（图源 OI Wiki - 二叉搜索树 & 平衡树），节点 $T$ 经历了一轮左旋操作：

![](https://oiwiki.org/ds/images/bst-RR.svg)

从图中我们可以直观地总结出左旋的规则：节点的右孩子向左上旋转成为原节点的父节点，原节点向左下旋转成为一个左孩子，让原先右孩子的左孩子变成原节点的右孩子。在本例中：节点 $T$ 向左下旋转变成左孩子，$R$ 向左上旋转变成父节点，$R$ 的右孩子 $T_2$ 成为 $T$ 的右孩子。

#### <ruby>右旋<rt>Zig/Right Rotate</rt></ruby>

看下图（图源 OI Wiki - 二叉搜索树 & 平衡树），节点 $T$ 经历了一轮右旋操作：

![](https://oiwiki.org/ds/images/bst-LL.svg)

我们也可以总结出右旋的规则：节点的左孩子向右上方旋转变成父节点，原节点向右下转变为一个右孩子，让原先左孩子的右孩子变成原节点的左孩子。本例中：节点 $T$ 向右下旋转变成右孩子，$L$ 向右上转变成父节点，$L$ 的右孩子 $T_3$ 变成 $T$ 的左孩子。

#### <ruby>简记技巧<rt>Jingling</rt></ruby>

从实质角度来讲：

> 左旋拎右左挂右，右旋拎左右挂左。
>
> —— $\ce{AgOH}$

如果还不能理解~~比如我~~，可以看下面这个基于代码的顺口溜：

> 《右旋——输钱》
>
> <ruby>钱赔了<rt>Q P L</rt></ruby>$\qquad$`q = tree[p].ls`
>
> <ruby>赔了前任<rt>P L Q R</rt></ruby>$\qquad$`tree[p].ls = tree[q].rs`
>
> <ruby>穷人贫<rt>Q R P</rt></ruby>$\qquad$`tree[q].rs = p`
>
> <ruby>贫穷<rt>P Q</rt></ruby>$\qquad$`p = q`
>
> 《左旋——还钱》
>
> <ruby>强迫人<rt>Q P R</rt></ruby>$\qquad$`q = tree[p].rs`
>
> <ruby>派人抢了<rt>P R Q L</rt></ruby>$\qquad$`tree[p].rs = tree[q].ls`
>
> <ruby>钱来赔<rt>Q L P</rt></ruby>$\qquad$`tree[q].ls = p`
>
> <ruby>赔钱<rt>P Q</rt></ruby>$\qquad$`p = q`

事实上可以只背一段，对应的另一种旋转的代码就是在保持左右节点不变的情况下（不更改 `ls` 和 `rs` 的位置），把访问下标的 `p` 和 `q` 对调即可。当然 `p = q` 这一句是通用的、`q` 的定义也要稍作变通。

或者你还可以从中序遍历的角度来记忆，我们知道左旋和右旋不改变原树的中序遍历。而对于形如下图的二叉搜索树：

![](https://cdn.luogu.com.cn/upload/image_hosting/esvln4kr.png)

我们可以通过把树压成一条线来获取它的中序遍历序列（如图），因为旋转后父子节点会交换，因此把中序链条拉起来之后要保证原来的子节点（蓝色圆形）要在上边。可以对照例图自行模拟该过程加深记忆。

```cpp
void update(int idx) {
    tree[idx].size = (tree[idx].ls ? leftSubtree(idx).size : 0) + (tree[idx].rs ? rightSubtree(idx) : 0) + tree[idx].cnt;
}

void zig(int &p) {
    // Reference used
    // Right rotate
    int q = tree[p].ls;
    tree[p].ls = tree[q].rs;
    tree[q].rs = p;
    p = q;                      // Switch nodes
    update(tree[q].rs);
    update(q);
}

void zag(int &p) {
    // Left rotate
    int q = tree[p].rs;
    tree[p].rs = tree[q].ls;
    tree[q].ls = p;
    p = q;
    update(tree[q].ls);
    update(q);
}
```

### <ruby>数据插入<rt>Data Insertion</rt></ruby>

基本思路与 $\texttt{BST}$ 相同，唯一不同的是我们需要在创建点的同时维护平衡树的堆性质。在旋转之后，可能变化的值有子树的大小，因此在每次旋转操作后要及时更新。

在这里，我着重实现小根堆平衡树，这意味着层数越小的节点所携带的随机数更小。如果当前插入一个值，需要被插入到左子树中，但是新节点的随机数更小一些，我们就需要把它提到上边去，对应起来就是右旋上去；反之就是左旋。简称：“左大右旋，右大左旋”。因为每次操作后都要更新根节点的数据，因此这里使用 `else if`。

```cpp
void insert(int &idx, int dat) {
    if (!idx) idx = allocate(dat);
    else if (tree[idx].dat == dat) tree[idx].cnt++;
    else if (tree[idx].dat > dat) {
        insert(tree[idx].ls, dat);
        if (leftSubtree(idx).rnd > tree[idx].rnd) zig(idx);
    } else {
        insert(tree[idx].rs, dat);
        if (rightSubtree(idx).rnd > tree[idx].rnd) zag(idx);
    }
    update(idx);
}
```

### <ruby>节点删除<rt>Node Deletion</rt></ruby>

基本思路是把一个节点不断旋转成一个叶子节点，然后直接删去。有如下几种情况：

1. 如果待删去点的重复次数大于 ${1}$，那么减去一。
2. 如果不存在右子树，让左子树替代它，直接把它删除。
3. 如果不存在左子树，让右子树替代它，直接把它删除。
4. 如果出现“左大右小”，则右旋。
5. 如果出现“左小右大”，则左旋。
6. 如果不在以上所有情况中，代表已经到达叶子节点，直接删除。

可以发现前三点与一般的 $\texttt{BST}$ 是一模一样的，后三点就是平衡树的独特之处。

```cpp
void remove(int &idx, int dat) {
    if (!idx) return;
    if (tree[idx].dat == dat) {
        if (tree[idx].cnt > 1) tree[idx].cnt--;                         // CASE 1
        else {
            if (!tree[idx].ls) idx = tree[idx].rs;                      // CASE 2
            else if (!tree[idx].rs) idx = tree[idx].ls;                 // CASE 3
            else if (tree[idx].ls && tree[idx].rs) {
                if (leftSubtree(idx).dat > rightSubtree(idx).dat) {     // CASE 4
                    zig(idx);
                    remove(tree[idx].rs, dat);
                } else if (rightSubtree(idx).rnd > leftSubtree(idx).rnd) {// CASE 5
                    zag(idx);
                    remove(tree[idx].ls, dat);
                }
            } else idx = 0;                                             // CASE 6
        }
    }
    if (tree[idx].dat > dat) remove(tree[idx].ls, dat);
    else remove(tree[idx].rs, dat);
}
```

### <ruby>前驱 & 后继<rt>Precursor & Successor</rt></ruby>

在模板题里，题面没有保证所查询前驱的点一定存在于树之中。原先基于查询目标点，再不断深入子树的方法就不再适用。这里介绍一种新的基于递归全树的方法。

以求前驱为例，需要满足以下几点要求：

1. 如果下标无意义，返回负无穷
2. 如果当前根节点**大于等于**所给值，证明目标点和它的前驱在左子树中，递归查找
3. 否则，当前点就已经满足小于目标点的性质，作为前驱的潜力候选者，与在右子树查找的结果取最大值

这些要求都很简单明了，不再过多解释。

```cpp
int precursor(int idx, int dat) {
    if (!idx) return -INT_MAX;
    if (tree[idx].dat >= dat) return precursor(tree[idx].ls, dat);
    return max(tree[idx].dat, precursor(tree[idx].rs, dat));
}

int successor(int idx, int dat) {
    if (!idx) return INT_MAX;
    if (tree[idx].dat <= dat) return successor(tree[idx].rs, dat);
    return min(tree[idx].dat, successor(tree[idx].ls, dat));
}
```

---

有关排名查询、数值查询的求解代码均与 $\texttt{BST}$ 模板相同，此处不再浪费篇幅。

## <ruby>典例演练<rt>Pratical Examples</rt></ruby>

### 洛谷 P3369 [模板] 普通平衡树

题目地址：[P3369](https://www.luogu.com.cn/problem/P3369)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

> 您需要写一种数据结构（可参考题目标题），来维护一些数，其中需要提供以下操作：
>
> 1. 插入一个数 $x$。
> 2. 删除一个数 $x$（若有多个相同的数，应只删除一个）。
> 3. 定义**排名**为比当前数小的数的个数 $+1$。查询 $x$ 的排名。
> 4. 查询数据结构中排名为 $x$ 的数。
> 5. 求 $x$ 的前驱（前驱定义为小于 $x$，且最大的数）。
> 6. 求 $x$ 的后继（后继定义为大于 $x$，且最小的数）。
>
> 对于操作 3,5,6，**不保证**当前数据结构中存在数 $x$。
>
> **输入格式：**
>
> 第一行为 $n$，表示操作的个数,下面 $n$ 行每行有两个数 $\text{opt}$ 和 $x$，$\text{opt}$ 表示操作的序号（$ 1 \leq \text{opt} \leq 6 $）
>
> **输出格式：**
>
> 对于操作 $3,4,5,6$ 每行输出一个数，表示对应答案。
>
> **数据范围：**
> 对于 ${100\%}$ 的数据，${1}\le n \le 10^5$，$|x| \le 10^7$
>
> 来源：Tyvj1728 原名：普通平衡树
>
> 在此鸣谢

同样是模板题，为了节省篇幅，代码在我的[云剪切板](https://www.luogu.com.cn/paste/g8cycn8n)。

![](https://cdn.luogu.com.cn/upload/image_hosting/n7y2vl9p.png)

~~你怎么知道我调了一整天才调出来的~~

## <ruby>后记 & 鸣谢<rt>Epilogue & Special Thanks</rt></ruby>

和我开始打 $\texttt{BST}$ 是一样的，各种奇奇妙妙的错误那是接二连三……最后发现是自己被 OI Wiki 上的一段“不合情势的代码”给误导了。或许那段代码在编写者那里就可以轻松通过，但是在我这就不一定行，显然是普通二叉树的数据太水，错误代码也可以通过。

在这里仍然需要致谢：

* 耗费一下午对拍造数据的—— <span><a href="https://www.luogu.com/user/663949"><img src="https://cdn.luogu.com.cn/upload/usericon/663949.png?x-oss-process=image/resize,lift_m,w_25/quality,q_50/circle,r_25"></a></span> <span style="color:#F39C11">**DWHJHY**

参考资料：

[1] DWHJHY.树堆-TREAP [EB/OL] .[https://www.luogu.com/article/ugcagegy](https://www.luogu.com/article/ugcagegy), 2024-4-17/2024-7-15

[2] Brailliant11001.入门平衡树——Treap [EB/OL] .[https://www.luogu.com/article/tyvidvb6](https://www.luogu.com/article/tyvidvb6), 2024-2-1/2024-7-15
