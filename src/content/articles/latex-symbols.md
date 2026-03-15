---
slug: '65533'

published: 2023-11-12T09:23:35+08:00
header-includes: \usepackagechemfig
tags:
- latex
title: Latex常用符号大全
updated: 2024-06-09T23:04:13.954+08:00
---
更新记录：

$\quad{2023.11.12\quad}$ 添加了常用的数学符号，简单的矩阵写法

$\quad2024.05.12\quad$ 添加了由 ![](https://cdn.luogu.com.cn/upload/image_hosting/p31wgc31.png?x-oss-process=image/resize,lift_m,w_30/circle,r_30/quality,q_50) [Lucas2011](https://justpureh2o.cn/articles/8600/) 提供的巨大更新，包含“导言区”、“段落层次”、“矩阵、行列式”以及大部分的宏包使用章节

$\quad2024.06.07\quad$ 添加了 mhchem 和 chemfig 宏包的使用细节

## 导言区

### 页边距&行距

“窄”：`\geometry{left=1.27cm, right=1.27cm, top=1.27cm, bottom=1.27cm}`

“宽”：`\geometry{left=3.18cm, right=3.18cm, top=2.54cm, bottom=2.54cm}`

很合适的行距：`\linespread{1.5}`

### 标题&作者&时间

`\title{-IamTitle-\vspace{-2em}}`

注：`\vspace{-2em}` 是用来缩小标题与正文之间的行距

不想显示作者和时间的话可以留空：

```plaintext
\author{}

\date{}
```

其中时间可以用 `\today` 来表示今天，会在编译时自动填充

注意：请一定要在**正文区**使用 `\maketitle`

### 文章样式

用 `\pagestyle{plain}` 就好

### 特殊转义

空格：`~`（波浪号）

宽分隔符：`\qquad`

## 段落层次

### 大标题&小标题

大标题：`\section{TITLE}` 居中、微软雅黑

小标题：`\subsection{TITLE}` 左对齐、微软雅黑

注：若想去除编号，可以在环境名称后面加 `*`，如：`\subsection*{<人物事迹>}`

### 定理环境 etc.

目前还没用到，所以先空着

## 加粗&下划线&斜体(*Italic*)

### 加粗

在文本环境中使用：`\textbf{}` $\textbf{This~is~a~bold~text.}$

在公式环境中使用：`\bm{}`（见 [后文](#usepackagebm) 介绍`\usepackage{bm}`宏包）

### 斜体

在文本环境中使用：`\textil{}` $\textil{This~is~Italic}$

公式环境本来就是斜体……

### 下划线

在文本环境中使用：`\underline{}` $\underline{This~sentence~contains~underline}$

# 常用命令总结

## 自带基础命令

乘号（叉乘）:  `\times` $\times$

乘号（数量积/点乘）： `\cdot`  $\times$

除号： `\div` $\div$

开方/N次方根： `\sqrt[N]{ABC}` $\sqrt[N]{ABC}$

乘方/N次幂： `A^N` $A^N$

下标： `A_N` $A_N$

约等号： `\approx` $\approx$

加粗约等于：`\thickapprox` $\thickapprox$

不等号： `\neq` $\neq$

恒等号/定义为： `\equiv` $\equiv$

大于号： `\gt` $\gt$

小于号： `\lt` $\lt$

大于等于： `\geq` $\geq$

小于等于： `\leq` $\leq$

远大于： `\gg` $\gg$

远小于： `\ll` $\ll$

正负： `\pm` $\pm$

负正： `\mp` $\mp$

垂直： `\perp` $\perp$

平行： `\parallel` $\parallel$

角/无标记角： `\angle` $\angle$

角/标记角： `\measuredangle` $\measuredangle$

一般全等： `\cong` $\cong$

相似： `\sim` $\sim$

加粗相似：  `\thicksim` $\thicksim$

三角形： `\triangle` $\triangle$

正方形： `\square` $\square$

圆： `\odot` $\odot$

向量：`\overrightarrow{AB}` $\overrightarrow{AB}$

属于： `\in` $\in$

不属于： `\notin` $\notin$

子集： `\subseteqq` $\subseteqq$

真子集：   `\subsetneqq` $\subsetneqq$

真子集/直线在平面上： `\subset` $\subset$

并集： `\cup` $\cup$

交集： `\cap` $\cap$

补集： `\complement{_U^A}` $\complement{_U^A}$

因为： `\because` $\because$

所以： `\therefore` $\therefore$

存在： `\exists` $\exists$

不存在： `\nexists` $\nexists$

任意/对于所有： `\forall` $\forall$

空集： `\varnothing` $\varnothing$

逻辑或： `\cup` $\cup$ 或  `\lor` $\lor$

逻辑与： `\cap` $\cap$ 或  `\land` $\land$

逻辑非： `\lnot` $\lnot$

充分条件/右双箭头： `\Rightarrow` $\Rightarrow$ 大小写敏感

必要条件/左双箭头： `\Leftarrow` $\Leftarrow$ 大小写敏感

充要条件/双向双箭头： `\Leftrightarrow`$\Leftrightarrow$ 大小写敏感

成正比： `\propto` $\propto$

定积分： `\int_{a}^{b}` $\int_{a}^{b}$

多重积分： `\iint_{a}^{b}` $\iint_{a}^{b}$ 及  `\iiint_{a}^{b}` $\iiint_{a}^{b}$

导函数/上撇号： `\prime` $\prime$

求和： `\sum_{i=1}^{n}` $\sum_{i=1}^{n}$

求积： `\prod_{i=1}^{n}` $\prod_{i=1}^{n}$

字母数位/平均数： `\overline{ABCD}` $\overline{ABCD}$

整除符号： `\mid` $\mid$

新定义运算符： `\oplus`  $\oplus$ 及  `\otimes`  $\otimes$ 及  `\ominus` $\ominus$

扰动值： `\tilde{K}` $\tilde{K}$

上箭头：`\uparrow` $\uparrow$

下箭头：`\downarrow` $\downarrow$

无穷大/无限： `\infty` $\infty$

圆周率： `\pi` $\pi$

普朗克常数： `\hbar` $\hbar$

phi：`\phi` $\phi$ 或 `\varphi` $\varphi$

## 分数、矩阵、行列式

分数：`\frac{1}{2}=0.5` $\frac{1}{2}=0.5$

小型分数：`\tfrac{1}{2} = 0.5` $\tfrac{1}{2} = 0.5$

大型分数：`\dfrac{k}{k-1} = 0.5` $\dfrac{k}{k-1} = 0.5$

大小型分数嵌套：

`\dfrac{ \tfrac{1}{2}[1-(\tfrac{1}{2})^n] }{ 1-\tfrac{1}{2} } = s_n`

$$
\dfrac{ \tfrac{1}{2}[1-(\tfrac{1}{2})^n] }{ 1-\tfrac{1}{2} } = s_n
$$

连续分数：

`\cfrac{2}{ c + \cfrac{2}{ d + \cfrac{1}{2} } } = a`

`\qquad`

`\dfrac{2}{ c + \dfrac{2}{ d + \dfrac{1}{2} } } = a`

$$
\cfrac{2}{ c + \cfrac{2}{ d + \cfrac{1}{2} } } = a
\qquad
\dfrac{2}{ c + \dfrac{2}{ d + \dfrac{1}{2} } } = a
$$

二项式分数：`\binom{n}{k}` $\binom{n}{k}$

小型二项式系数：`\tbinom{n}{k}` $\tbinom{n}{k}$

大型二项式系数：`\dbinom{n}{k}` $\dbinom{n}{k}$

矩阵（matrix、vmatrix、Vmatrix、bmatrix、Bmatrix、smallmatrix、pmatrix 环境）:

```plaintext
\begin{matrix}
x & y \\
z & v
\end{matrix}
\qquad  
\begin{vmatrix}
x & y \\
z & v
\end{vmatrix}
\qquad
\begin{Vmatrix}
x & y \\
z & v
\end{Vmatrix}
\qquad
\begin{bmatrix}
0 & \cdots & 0 \\
\vdots & \ddots & \vdots \\ 0 & \cdots & 0
\end{bmatrix}
\begin{Bmatrix}
x & y \\
z & v
\end{Bmatrix}
\qquad
\begin{pmatrix}
x & y \\
z & v
\end{pmatrix}
\qquad
\bigl( \begin{smallmatrix}
a&b\\
c&d
\end{smallmatrix} \bigr)
```

$$
\begin{matrix}
x & y \\
z & v
\end{matrix}
\qquad  
\begin{vmatrix}
x & y \\
z & v
\end{vmatrix}
\qquad
\begin{Vmatrix}
x & y \\
z & v
\end{Vmatrix}
\qquad
\begin{bmatrix}
0 & \cdots & 0 \\
\vdots & \ddots & \vdots \\ 0 & \cdots & 0
\end{bmatrix}
$$

$$
\begin{Bmatrix}
x & y \\
z & v
\end{Bmatrix}
\qquad
\begin{pmatrix}
x & y \\
z & v
\end{pmatrix}
\qquad
\bigl( \begin{smallmatrix}
a&b\\
c&d
\end{smallmatrix} \bigr)
$$

数组（Array 环境）:

```plaintext
\begin{array}{|c||c|||c||||}
a & b & S \\
\hline
0&0&1\\
0&1&1\\
1&0&1\\
1&1&0
\end{array}
```

$$
\begin{array}{|c||c|||c||||}
a & b & S \\
\hline
0&0&1\\
0&1&1\\
1&0&1\\
1&1&0
\end{array}
$$

方程组（Cases 环境）:

```plaintext
\begin{cases}
3x + 5y + z &= 1 \\
7x - 2y + 4z &= 2 \\
-6x + 3y + 2z &= 3
\end{cases}
```

$$
\begin{cases}
3x + 5y + z &= 1 \\
7x - 2y + 4z &= 2 \\
-6x + 3y + 2z &= 3
\end{cases}
$$

多行公式（Align 环境）:

```plaintext
\begin{align}
f(x) & = (a+b)^2 \\
& = a^2+2ab+b^2
\end{align}
```

$$
\begin{align}
f(x) & = (a+b)^2 \\
& = a^2+2ab+b^2
\end{align}
$$

从指定编号开始方程组（Alignat 环境）

```plaintext
\begin{alignat}{2}
f(x) & = (a-b)^2 \\
& = a^2-2ab+b^2
\end{alignat}
```

$$
\begin{alignat}{2}
f(x) & = (a-b)^2 \\
& = a^2-2ab+b^2
\end{alignat}
$$

注：若想去掉公式编号，使用 `align*` 环境

多行公式（左对齐）:

```plaintext
\begin{array}{lcl}
z & = & a \\
f(x,y,z) & = & x + y + z
\end{array}
```

$$
\begin{array}{lcl}
z & = & a \\
f(x,y,z) & = & x + y + z
\end{array}
$$

多行公式（右对齐）:

```plaintext
\begin{array}{lcr}
z & = & a \\
f(x,y,z) & = & x + y + z
\end{array}
```

$$
\begin{array}{lcr}
z & = & a \\
f(x,y,z) & = & x + y + z
\end{array}
$$

## extarrows 宏包

等号上有条件：`\xlongequal{xyz}` :  $\xlongequal{xyz}$

等号下有条件：`\xlongequal[sub]{}` $\xlongequal[sub]{}$

## cancel 宏包

大大的叉：`\xcancel{\frac{abc}{def}}`  : $\xcancel{\dfrac{abc}{def}}$

注：此命令只能在数学模式中使用（即用\$\$包裹时）

## xcolor 宏包

变色：`\textcolor{green}{abcdef}` :  $\textcolor{green}{OK}$

半色调：`\textcolor{<颜色>!<百分数>}`

混合色：`\textcolor{<颜色>!<百分数>!<颜色>}`

## bm 宏包

公式中加粗：`\bm{abc}` $\bm{abc}$

## mhchem, chemfig 宏包

mhchem 宏包主要用来书写较为简单常见的化学方程式，化学方程式主体必须用 `\ce{}` 包裹。并且在该环境下上下标规则与普通的 $\LaTeX$ 语法略有不同。

### 化学式&物态

化学式（水）：$\ce{H2O}$ `\ce{H2O}`

化学式（明矾）：$\ce{KAl(SO4)3\cdot12H2O}$ `\ce{KAl(SO4)3\cdot12H2O}`

离子（铁离子）：$\ce{Fe^{3+}}$ `\ce{Fe^{3+}}`

元素化合价（阿拉伯数字）：$\ce{\overset{+3}{Fe}_2O3}$ `\ce{\overset{+3}{Fe}_2O3}`

元素化合价（罗马字母）：$\ce{Cr^{VI}}$ `\ce{Cr^{VI}}`

核素（铀-235）：$\ce{^235_98U}$ `\ce{^235_98U}`

沉淀（硫酸钡）：$\ce{BaSO4 v}$ `\ce{BaSO4 v}`

气体（氧气）：$\ce{O2 ^}$ `\ce{O2 ^}`

在 mhchem 中，括号和字母后边的连续多位数字默认为下标形式、加减号默认为上标形式，若想使用正常显示的数字，需要加入空格，例如：$\ce{H2O+}$ 对应 `H2O+`；$\ce{H2O +}$ 对应 `\ce{H2O +}` （注意空格）。特殊情况可以使用一般 LaTeX 中的上下标格式强制转换，例如 $\ce{Fe3+}$ 对应 `\ce{Fe3+}`；$\ce{Fe^{3+}}$ 对应 `\ce{Fe^{3+}}`。

**为压缩文章体积，后文所有的 LaTeX 代码均会省略 `\ce{}`**。

### 化学方程式

mhchem 提供了常见的箭头符号，例如：$\ce{<=>}$ 对应 `<=>`，即可逆符号。在箭头上添加上下标条件，一般是在箭头后方紧跟一个 `T[上标][下标]`，例如：$\ce{<=>T[催化剂][高温]}$ 对应 `<=>T[催化剂][高温]`。除开可逆符号外，还有单向箭头、长等号（属于 extarrows 宏包内容）等……具体见下。

简单的方程式（湿法炼铜）：$\ce{Fe +CuSO4=FeSO4 +Cu}$ `Fe +CuSO4=FeSO4 +Cu`

有机化学方程式（乙烯与溴的加成反应）：$\ce{C2H4 +Br2->CH2BrCH2Br}$ `C2H4 +Br2->CH2BrCH2Br`

带条件的有机方程式（制备乙酸乙酯）：$\ce{CH3COOH +CH3CH2OH->T[浓硫酸][\triangle]CH3COOCH2CH3 +H2O}$ `CH3COOH +CH3CH2OH->T[浓硫酸][\triangle] CH3COOCH2CH3 +H2O`

带条件的无机方程式（氨气催化氧化）：$\ce{4NH3 +5O2\xlongequal[\triangle]{Pt} 4NO +6H2O}$ `4NH3 +5O2\xlongequal[\triangle]{Pt} 4NO +6H2O`

可逆反应（氯气部分溶于水）：$\ce{Cl2 +H2O<=>HClO +HCl}$ `CL2 +H2O<=>HClO +HCl`

可逆反应带条件（制氨气）：$\ce{N2 + 3H2 <=>T[催化剂][高温高压] 2NH3}$ `N2 + 3H2 <=>T[催化剂][高温高压] 2NH3`

生成同分异构体的方程式（蔗糖水解）：$\ce{C12H22O11 +H2O->\underset{Glucose}{C6H12O6} +\underset{Fructose}{C6H12O6}}$ `C12H22O11 +H2O->\underset{Glucose}{C6H12O6} +\underset{Fructose}{C6H12O6}`

### 简单的结构式

mhchem 仅对结构式提供较为简单的支持，若想绘制诸如苯环、异丁烷、卟啉这样的复杂结构。则需要引入后文将要介绍的 chemfig 宏包。mhchem 支持的具体如下：

丙烷：$\ce{CH3-CH2-CH3}$ `CH3-CH2-CH3`

乙烯：$\ce{CH2=CH2}$ `CH2=CH2`

乙炔：$\ce{CH#CH}$ `CH#CH`

### 内嵌公式

在 ce 环境中，允许嵌入一层公式，用美元符号包裹。通常在含参方程式中使用。

锂离子二次电池反应式：

$$
\ce{LiCoO2 +C<=>T[充电][放电] Li_{1-$x$}CoO2 +Li_{$x$}C}
$$

`\ce{LiCoO2 +C<=>T[充电][放电] Li_{1-$x$}CoO2 +Li_{$x$}C}`

### 环结构&复杂的结构式

mhchem 提供的简单支持无法满足这类绘制的需求，因此我们引入一个新宏包 chemfig。与前文相同，仍然需要用 chemfig 标签将你想要绘制的化学式包裹起来，为了压缩文章（编辑器已经开始卡了），后文所有的 chemfig 代码均会省略 `\chemfig{}`。

苯环：$\chemfig{*6(-=-=-=)}$
