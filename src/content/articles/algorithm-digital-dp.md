---
slug: '3140'

category: oi算法
published: 2024-09-04T20:16:09.758691+08:00
tags:
- oi
- 算法
- 搜索算法
- 动态规划
title: 记忆化搜索 数位DP
updated: 2024-09-13T19:58:59.397+08:00
---
## 数位DP 简介

数位DP是一种基于按位枚举的计数类DP。一般来说，当题目要求对所有符合特殊性质的数字计数（且这些性质可以转化到数位上讨论）、对给定区间内的合法数做统计、数据范围中出现了超大的上界时，就可以考虑使用数位DP来进行求解。

数位DP的时间复杂度基本上是 $\mathcal O(D\lg n)$ 级别的，其中 $D$ 为状态数，可以看作是记忆化搜索数组每一维上界的总乘积。因此在大多数情况下它能做得很好。

## 数位DP 基本实现

数位DP运用了前缀和的思想，假设代求区间为 $[L,R]$，它的基本思路是求出 $[1,L-1]$ 内的方案数，再求出 $[1,R]$ 内的方案数，答案就是后者减去前者。

其次，数位DP还支持搜索记忆化。具体来说就是把搜索时的传参记录下来，方便后期调用。由于不同数的上界（或枚举到的前导零）状态不甚相同，故当前数较为特殊时（顶上界/存在前导零）不进行记忆化。

基本模板如下（代码来自 [P2657 windy 数](https://www.luogu.com.cn/problem/P2657)）：

```cpp
int dfs(int pos, int pre, bool limit, bool zero) {
    //  当前位置 上一个数  是否顶上界 是否有前导零
    int sum = 0;
    if (pos < 0) return 1; // 当前符合要求，是一种合法解
    if (!limit && pre >= 0 && f[pos][pre] != -1) return f[pos][pre]; // 记忆化剪枝
    for (int i = 0; i <= (limit ? num[pos] : 9); i++) { // 顶上界就只能最大枚举到上界当前位的数
        if (abs(i - pre) < 2) continue; // 判断合法性
        if (!i && zero) sum += dfs(pos - 1, -2, limit && i == num[pos], true); // 当前是前导零
        else sum += dfs(pos - 1, i, limit && i == num[pos], false); // 不为前导零
    }
    if (!limit && !zero) f[pos][pre] = sum; // 加入记忆化
    return sum;
}
```

注意到程序的整体复杂度与记忆化数组的维度有关，因此把无用的参数尽可能省去会提高运行效率（因题而异，但基本上都是省去判断前导零和前一个数的状态）

## 数位DP 经典例题

例题按照难度升序排序。

> [!WARNING]
> 受限于篇幅，仅在第一题给出完整代码，其余题目只会给出部分核心代码

### 洛谷 P1708 [入门赛 #21] 星云 hard ver.

题目地址：[P1708](https://www.luogu.com.cn/problem/P1708)

题目难度：<span data-luogu data-yellow>普及/提高-</span>

> 定义星云数为位数不大于 $n$ 且各数位之和不超过 $k$ 的正整数，给定 $n,k$，求星云数的个数。
>
> 共 $T$ 组测试数据
>
> 对于 ${100\%}$ 的数据，${1 \leq T \leq 10^5}$，${1 \leq n \leq 7}$，${1 \leq k \leq 100}$。

~~当时比赛时没想出来该怎么搞，下来发现原来正解是打表吗？？？不，肯定不是，这道题就是数位DP！建议升绿。~~

考虑到 $n,k$ 都很小，打表确实可行。但是既然这道题给你说的都这么明显了，那咱们就用数位DP来做。

题目转化成，求 $[1,10^n-1]$ 内符合要求的数的数量。因此记忆化搜索维护一个当前的数位和，在搜索终点时判断是否小于等于 $k$，或者途中判断，都是可行的。注意到数的前导零不会产生影响、也无需记录上一步选择的数字，我们可以把记忆化压缩至三维的。

```cpp
#include <bits/stdc++.h>
#define N 10
#define K 110
using namespace std;

typedef long long ll;

int f[N][K];
vector<int> num;
int k;
int power10[10] = {1, 10, 100, 1000, 10000, 100000, 1000000, 10000000};

int dfs(int pos, bool limit, int tot) {
    if (pos < 0) return tot > 0 && tot <= k;
    if (tot > k) return 0;
    if (!limit && f[pos][tot] >= 0) return f[pos][tot];
    int sum = 0;
    for (int i = 0; i <= (limit ? num[pos] : 9); i++) {
        sum += dfs(pos - 1, limit & (i == num[pos]), tot + i);
    }
    if (!limit) f[pos][tot] = sum;
    return sum;
}

int calc(int x) {
    num.clear();
    int tmp = x;
    while (tmp) {
        num.push_back(tmp % 10);
        tmp /= 10;
    }
    memset(f, -1, sizeof f);
    return dfs(num.size() - 1, true, 0);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n >> k;
        cout << calc(power10[n] - 1) << endl;
    }
    return 0;
}
```

### 洛谷 P2602 [ZJOI2010] 数字计数

题目地址：[P2657](https://www.luogu.com.cn/problem/P2602)

题目难度：<span data-luogu data-green>普及+/提高</span>

> 给定两个正整数 $a$ 和 $b$，求在 $[a,b]$ 中的所有整数中，每个数码(digit)各出现了多少次。
>
> 对于 ${100\%}$ 的数据，保证 ${1\le a\le b\le 10^{12}}$。

考虑对于每一次记忆化搜索，只搜索 $[0,9]$ 内其中某个数的出现次数。因此在整个范围内搜索 ${10}$ 次并分别输出答案即可。由于前导零不能算作 ${0}$ 的出现次数，因此需要加入前导零的判断。

```cpp
ll dfs(int pos, int pre, bool limit, bool zero, int cnt, int target) {
    //  位置    上一个数    顶上界      前导零   出现次数    搜索目标
    if (pos < 0) return cnt;
    if (!limit && !zero && f[pos][pre][cnt][target] >= 0) return f[pos][pre][cnt][target];
    ll sum = 0;
    for (int i = 0; i <= (limit ? num[pos] : 9); i++) {
        if (!i && zero) sum += dfs(pos - 1, i, limit & (i == num[pos]), true, 0, target);
        else sum += dfs(pos - 1, i, limit & (i == num[pos]), false, cnt + (i == target), target);
    }
    if (!limit && !zero) f[pos][pre][cnt][target] = sum;
    return sum;
}
```

其实不用记录上一个数也是没问题的，因为历史遗留问题没删罢了。

### 洛谷 P2657 [SCOI2009] windy 数

题目地址：[P2657](https://www.luogu.com.cn/problem/P2657)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

题目来源：<span data-luogu data-region>四川</span>&nbsp;&nbsp;<span data-luogu data-date>2009</span>&nbsp;&nbsp;<span data-luogu data-source>各省省选</span>

> 不含前导零且相邻两个数字之差至少为 $2$ 的正整数被称为 windy 数。windy 想知道，在 $a$ 和 $b$ 之间，包括 $a$ 和 $b$ ，总共有多少个 windy 数？
>
> 对于全部的测试点，保证 ${1 \leq a \leq b \leq 2 \times 10^9}$。

对于当前所填的数位，能进入下层循环的充要条件是它和前一个填入的数的绝对值大于等于 ${2}$。只需要在枚举当前为所填数字时加入判断即可，这也预示着我们的状态中就需要额外添加一维用来记录前一个填入的数。

特殊地，如果当前是前导零，那么下一个填入的非零数将作为数字的开头，应该是不受绝对值限制的。

```cpp
int dfs(int pos, int pre, bool limit, bool zero) {
    // 当前位置  上一个数    顶上界      前导零
    int sum = 0;
    if (pos < 0) return 1;
    if (!limit && pre >= 0 && f[pos][pre] != -1) return f[pos][pre];
    for (int i = 0; i <= (limit ? num[pos] : 9); i++) {
        if (abs(i - pre) < 2) continue; // 绝对值之差必须大于等于2
        if (!i && zero) sum += dfs(pos - 1, -2, limit && i == num[pos], true); // 当前为前导零，下一位不受限制，填入小于等于-2或大于等于12的数均可
        else sum += dfs(pos - 1, i, limit && i == num[pos], false);
    }
    if (!limit && !zero) f[pos][pre] = sum;
    return sum;
}
```

### 洛谷 P4124 [CQOI2016] 手机号码

题目地址：[P4124](https://www.luogu.com.cn/problem/P4124)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

题目来源：<span data-luogu data-region>重庆</span>&nbsp;&nbsp;<span data-luogu data-date>2016</span>&nbsp;&nbsp;<span data-luogu data-source>各省省选</span>

> 一个符合要求的电话号码必须同时包含以下两个条件：号码中要出现至少 $3$ 个相邻的相同数字；号码中不能同时出现 $8$ 和 $4$。
>
> 手机号码一定是 ${11}$ 位数，且不含前导的 $0$。请你统计出 $[L,R]$ 区间内所有满足条件的号码数量。$L$ 和 $R$ 也是 $11$ 位的手机号码。
>
> 数据范围：${10^{10}\leq L\leq R<10^{11}}$。

考虑加入维度，一个用来判定电话号码中是否出现 ${4}$、一个判断 ${8}$ 的存在，此时再来维护“三个相邻的相同数字”这一条件，用一个布尔值来判断是否已经有三个及以上的相邻数字，此时再加一个最长连续长度，每次判断是否大于等于 ${3}$ 即可。

由于计算时涉及到前缀和相减，当下界卡在 ${10^{10}}$ 上时可能就错了。最好的方法是先用代码求解一遍取值为 ${10^{10}-1}$ 时的结果，特判并减去这个特殊值即可。

```cpp
ll dfs(int pos, int pre, bool limit, bool zero, bool _4, bool _8, bool cont, int last) {
    //  位置    前一个数    顶上界      前导零     出现4    出现8  是否三数连续 当前连续数
    if (_4 & _8) return 0;
    if (pos < 0) return cont;
    if (!limit && pre >= 0 && f[pos][pre][last][_4][_8][cont] >= 0) return f[pos][pre][last][_4][_8][cont];
    ll sum = 0;
    for (int i = 0; i <= (limit ? num[pos] : 9); i++) {
        if (!i && zero) sum += dfs(pos - 1, -1, limit & i == num[pos], true, _4, _8, false, 0);
        else sum += dfs(pos - 1, i, limit & i == num[pos], false, _4 | i == 4, _8 | i == 8, cont | (i == pre ? last + 1 >= 3 : false), i == pre ? last + 1 : 1);
    }
    if (!limit && !zero) f[pos][pre][last][_4][_8][cont] = sum;
    return sum;
}

ll calc(ll x) {
    num.clear();
    ll tmp = x;
    while (tmp) {
        num.push_back(tmp % 10);
        tmp /= 10;
    }
    if (num.size() < 11) return 485218848ll; // 特判
    memset(f, -1, sizeof f);
    return dfs(num.size() - 1, -2, true, true, false, false, false, 0);
}
```

### 洛谷 P4317 花神的数论题

题目地址：[P4317](https://www.luogu.com.cn/problem/P4317)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

> 设  $\text{sum}(i)$  表示  $i$  的二进制表示中  $1$  的个数。给出一个正整数  $N$  ，花神要问你  $\prod_{i=1}^{N}\text{sum}(i)$ ，也就是  $\text{sum}(1)\sim\text{sum}(N)$  的乘积。结果对 $10000007$ 取模。
>
> 对于 ${100\%}$ 的数据，${1\le N\le 10^{15}}$。

乍看还不太好想，但是当我们把数字变为二进制表示后，最多也只有 ${50}$ 位。一般地，对于任意 $x\in[1,\lceil\log_2 N\rceil]$，我们求出二进制表示下恰好包含 $x$ 个 ${1}$ 的数的总数，假设结果记作 $f(x)$，那么最终答案就会是 $\prod\limits_{i=1}^{\lceil\log_2 N\rceil}x^{f(x)}$，此时使用快速幂维护即可。

```cpp
ll dfs(int pos, bool pre, bool limit, int cnt, int target) {
    //  位置    前一个数    顶上界    填入1的个数 要求的1的个数
    if (pos < 0) return cnt == target;
    if (!limit && f[pos][cnt][pre] >= 0) return f[pos][cnt][pre];
    ll sum = 0;
    for (int i = 0; i <= (limit ? num[pos] : 1); i++) {
        sum += dfs(pos - 1, i, limit & i == num[pos], cnt + i, target);
    }
    if (!limit) f[pos][cnt][pre] = sum;
    return sum;
}
```

### 洛谷 P4127 [AHOI2009] 同类分布

题目地址：[P4127](https://www.luogu.com.cn/problem/P4127)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

题目来源：<span data-luogu data-region>安徽</span>&nbsp;&nbsp;<span data-luogu data-date>2009</span>&nbsp;&nbsp;<span data-luogu data-source>各省省选</span>

> 给出两个数$a,b$，求出$[a,b]$中各位数字之和能整除原数的数的个数。
>
> 对于所有的数据，${1 ≤ a ≤ b ≤ 10^{18}}$

根据题目所给的数据范围，最大可能的数位和仅为 ${18\times9=162}$。于是考虑枚举这个数位和，同时维护一个当前数模这个数位和的余数，一个数符合要求当且仅当填完所有数之后余数为 ${0}$。末尾填数的过程可以看作把原数乘 ${10}$ 再加上当前的数，余数也可以通过乘十加上当前数再取模得到。

```cpp
ll dfs(int pos, int cur, ll now, bool limit, int m) {
    //  位置   当前数位和 当前余数   顶上界  枚举的数位和
    if (pos < 0) return cur == m && now == 0;
    if (!limit && f[pos][now][cur] >= 0) return f[pos][now][cur];
    ll sum = 0;
    for (int i = 0; i <= (limit ? num[pos] : 9); i++) {
        sum += dfs(pos - 1, cur + i, (now * 10 + i) % m, limit & i == num[pos], m);
    }
    if (!limit) f[pos][now][cur] = sum;
    return sum;
}
```

### 洛谷 P6218 [USACO06NOV] Round Numbers S

题目地址：[P6218](https://www.luogu.com.cn/problem/P6218)

题目难度：<span data-luogu data-blue>提高+/省选-</span>

题目来源：<span data-luogu data-source>USACO</span>&nbsp;&nbsp;<span data-luogu data-date>2006</span>

> 如果一个正整数的二进制表示中，$0$ 的数目不小于 $1$ 的数目，那么它就被称为「圆数」。请你计算，区间 $[l,r]$ 中有多少个「圆数」。
>
> 对于 ${100\%}$ 的数据，${1\le l,r\le 2\times 10^9}$。

（二进制下）维护当前填了多少个 ${0}$ 和多少个 ${1}$，同时注意前导零对数位统计上的影响即可。一个数合法当且仅当 ${0}$ 的个数大于等于 ${1}$ 的个数。

```cpp
int dfs(int pos, bool pre, int _0, int _1, bool limit, bool zero) {
    //   位置    上一个数   0的个数 1的个数    顶上界      前导零
    if (pos < 0) return _0 >= _1 && _0; // 必须填过0，以防前导零带来错误
    if (!limit && !zero && f[pos][_0][_1][pre] >= 0) return f[pos][_0][_1][pre];
    int sum = 0;
    for (int i = 0; i <= (limit ? num[pos] : 1); i++) {
        sum += dfs(pos - 1, i, !i & zero ? 0 : _0 + !i, !i & zero ? 0 : _1 + i, limit & i == num[pos], zero & !i);
    }
    if (!limit && !zero) f[pos][_0][_1][pre] = sum;
    return sum;
}
```

### CF 55D Beautiful Numbers

题目地址：[CF 55D](https://www.luogu.com.cn/problem/CF55D)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

> Volodya 认为一个数字 $x$ 是美丽的，当且仅当 $x\in\mathbb{Z^+}$ 并且对于 $x$ 的每一个非零位上的数 $y$，都有 $y|x$。你需要帮助他算出在区间 $[l,r]$ 中有多少个数是美丽的。
>
> $t$ 组数据。${1\le t\le 10,1\le l\le r\le 9\times 10^{18}}$。保证 $l,r$ 都是整数，且 $r$ 的十进制表示小于等于 ${1000}$ 位。

感觉跟刚刚切掉的“同类分布”这道题很像，但是这道题要求每一位上的数都整除原数。我们引入一个很有趣的数学常识。

> [!NOTE]
> 某个数若能被若干个数整除，那么这个数也一定能被它们的最小公倍数整除。

因为它们的最小公倍数的因子一定能够完全包含这些数，因此结论显然是成立的。那么我们可以维护一个已填入的所有非零数的最小公倍数，解合法当且仅当最终的数字能被这个最小公倍数整除。但是这样就还得维护当前拼出的数，这显然不现实（$r\leq9\times10^{18}$），转而寻找替代方案。

注意到填入的数字最多把 $[0,9]$ 都选一遍（${0}$ 不计入最小公倍数）。无论如何，每个数位都只能是一个区间内的数字。最坏情况下把 $[0,9]$ 都选进数中，此时所有数位的最小公倍数就是 ${2520}$。也就是说，只要我们拼出来的数能够被 ${2520}$ 整除，那么无论每一位上是多少，它都是合法的。于是可以效仿“同类分布”这道题，采用记录余数的方法来判别。此时记忆化维度仍然过高，又注意到 ${2520}$ 的因数仅有 ${48}$ 个，于是将每个因数离散化存在一个数组中，不难发现，维护的最小公倍数永远都是 ${2520}$ 的某个因子。至此，我们就做完了这道题。

```cpp
ll dfs(int pos, bool limit, int m, int lcm) {
    //  位置      顶上界     余数  最小公倍数
    if (pos < 0) return m % lcm == 0;
    if (!limit && f[pos][m][fac[lcm]] >= 0) return f[pos][m][fac[lcm]];
    ll sum = 0;
    for (int i = 0; i <= (limit ? num[pos] : 9); i++) {
        // 若该位非零，则更新最小公倍数；反之不更新
        sum += dfs(pos - 1, limit & (i == num[pos]), (m * 10 + i) % 2520, i ? std::lcm(i, lcm) : lcm);
    }
    if (!limit) f[pos][m][fac[lcm]] = sum;
    return sum;
}

void init() {
    // 离散化因子
    int idx = 0;
    for (int i = 1; i <= 2520; i++) {
        if (2520 % i == 0) {
            fac[i] = ++idx;
        }
    }
}
```

### 洛谷 P3413 SAC#1 萌数

题目地址：[P3413](https://www.luogu.com.cn/problem/P3413)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

> 定义萌数为满足“存在长度至少为 $2$ 的回文子串”的数。请求出 $l$ 到 $r$ 内有多少个萌数。答案对 ${1000000007}$（${10^9+7}$）取模。
>
> 对于全部的数据，$n \le 1000$，$l < r$。

这道题如果遍历整个数去判断是否存在回文会非常难办，因此想个办法来简化这一过程。注意到我们其实只关注数字中是否出现符合要求的回文串，而不关心这个回文串有多少。当一个串是回文串时，两个端点同时向内收缩一个字符得到的子串也同样是一个回文串。因此其实只用分两种最简情况讨论即可，因为其他情况都可以被转化为这两种情况。

第一种是长度恰好为 ${2}$ 的回文串，也就是前后两个数相同。此时只需要维护前一个数的情况就好；第二种是长度为 ${3}$ 的回文串，显然首尾需相同，中间任意填。此时就需要额外维护前第二个数的情况。

注意由于答案输出需要取模，而数位DP又涉及到减法，为了避免负数取模出错，故在差后加上一个模数再整体取模。并且注意到读入数据特大，因此写一个高精度减一的函数来预处理 $l$。

```cpp
ll dfs(int pos, int pre, int pre2, bool limit, bool zero, bool ok) {
    //  位置    前一个数  再前一个    顶上界      前导零   是否是萌数
    if (pos < 0) return ok;
    if (!limit && !zero && f[pos][pre][pre2][ok] >= 0) return f[pos][pre][pre2][ok];
    ll sum = 0;
    for (int i = 0; i <= (limit ? num[pos] : 9); i++) {
        if (!i && zero) sum = (sum + dfs(pos - 1, 10, 10, limit & (i == num[pos]), true, false)) % MOD;
        else sum = (sum + dfs(pos - 1, i, pre, limit & (i == num[pos]), false, ok | (i == pre | i == pre2))) % MOD; // 要么是长度为2，要么长度为3
    }
    if (!limit && !zero) f[pos][pre][pre2][ok] = sum;
    return sum;
}

void init(string &s) {
    // 高精度
    for (size_t i = s.length() - 1; ~i; i--) {
        if (s[i] > '0') {
            s[i]--;
            break;
        }
        s[i] = '9';
    }
}
```

### 洛谷 P6371 [COCI2006-2007 #6] V

题目地址：[P6371](https://www.luogu.com.cn/problem/P6371)

题目难度：<span data-luogu data-purple>省选/NOI-</span>

题目来源：<span data-luogu data-source>COCI Croatian</span>&nbsp;&nbsp;<span data-luogu data-date>2007</span>

> 使用给定的数字，组成一些在 $[A,B]$ 之间的数使得这些数每个都能被 $X$ 整除。
>
> 对于 ${100\%}$ 的数据，保证 ${1\le X\lt 10^{11}}$，${1\le A\le B\lt 10^{11}}$。

我们已经解决了很多关于整除的数位DP了，状态设计感觉还挺简单，预处理能填的数字，然后从备选能填的数字中选数来填，维护模数即可。由于状态普通数组存不下（万一模数会很大），考虑使用 STL 来处理这个点。填数时有一个细节是，如果备选数字中没有给 ${0}$，但是我们仍然可以用 ${0}$ 来当前导零占位，如果不判会 WA 一个点。

然后我们成功 MLE/TLE 了，这是因为我们记录了太多无用且为 ${0}$ 的状态。也就是说我们需要找到一个方法来加速无解情况的判断，无解其实就是最终的模数不为 $0$。如果不是全 ${0}$，那么要让模数为 ${0}$，只有在当前的数大于等于给定模数时才能做到。

假设当前位置为 $pos$，当前的模数为 $m$，要求被 $X$ 整除。我们大胆假设一个特殊情况——后面的 $pos$ 位全填 ${0}$。那么当全填上 ${0}$ 后，模数就应该是 $t=m\times10^{pos}\bmod X$。要想最终模数为 ${0}$，那么至少就应该让模数增加 $X-t$，那么当剩下的位全填 ${9}$ 都还小于这个标准时，那么铁定无解，判断即可。

```cpp
ll dfs(int pos, bool limit, bool zero, ll m, ll x) {
    //  位置      顶上界      前导零    模数  题目中的X
    if (pos < 0) return !zero && m == 0;
    if (!limit && !zero && f.count((PILL) {pos, m})) return f[(PILL) {pos, m}];
    ll sum = 0;
    // 无解特判部分
    ll check = m, tmp = 0;
    for (int i = 1; i <= pos + 1; i++) check = check * 10ll % x;
    check = (x - check + x) % x;
    for (int i = 1; i <= pos + 1; i++) {
        tmp = tmp * 10 + candidates.back();
        if (tmp > check) break;
    }
    if (tmp < check) return 0;
    for (int i: candidates) {
        if (limit && i > num[pos]) break;
        if (!i && zero) sum += dfs(pos - 1, limit & (i == num[pos]), true, 0, x);
        else if (!allowZero && !i) continue; // 不为前导零，但是不允许填零
        else sum += dfs(pos - 1, limit & (i == num[pos]), false, (m * 10 % x + i) % x, x);
    }
    if (!limit && !zero) f[(PILL) {pos, m}] = sum;
    return sum;
}
```
