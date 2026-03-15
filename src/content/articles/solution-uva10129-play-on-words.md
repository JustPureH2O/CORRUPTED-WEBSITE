---
slug: '8982'

category: 题解
published: 2024-08-06T19:15:50.777003+08:00
image: https://pic.imgdb.cn/item/6648a851d9c307b7e9dc3e75.jpg
tags:
- 题解
- 图论
title: UVA10129 - Play On Words 题解
updated: 2024-08-06T20:10:11.679+08:00
---
> [!DONE]
> 您已获得最佳的阅读体验！

题目地址：[UVA10129](https://www.luogu.com.cn/problem/UVA10129)

初见感觉和 [SP2885 WORDRING](https://www.luogu.com.cn/problem/SP2885) 很像，只不过本题不需要让拼出的“龙”首尾字符相同，而且也不用计算最大平均权——只需要判断是否存在合法的“龙”即可。但是这两道题的建图思路是相同的——对于一个字符串，我们真正关心的是它的第一个和最后一个字符。于是把它的开头和结尾的字母挑出来，在它们间连一条有向边，就可以代表这个字符串。

此时我们需要做的就是判断是否存在一个路径，使得从某个端点出发，每条边均只经过一次，最终到达终点。惊奇地发现，这就是在有向图上判断是否存在欧拉路径。判断依据如下：

1. 有向图上所有点的入度都等于出度：该图存在欧拉路径，起点和终点任意。
2. 有向图上有且仅有两个点的入度相差 ${1}$，其余点的入度均等于出度：该图存在欧拉路径，入度比出度大 ${1}$ 的点是终点；出度比入度大 ${1}$ 的是起点。

但是这道题又有些许不同……根据题目要求，当所有的字符串都串联起来时，才能叫有解。如果某个连通块内存在欧拉路径，但是存在孤立点（字符串没有被选上），也不能算作有解。因此我们还需要额外维护一个数据，起到存储每个字符串所属路径的作用。并查集能够很好地做到这一点！注意到并不是每个字母都能被用到（出现在字符串首/尾），需要再开一个数组存储该字母是否出现。

对并查集感到生疏的可以左转 [P3367 [模板] 并查集](https://www.luogu.com.cn/problem/P3367)。**注意多测清空！**

```cpp
#include <bits/stdc++.h>
#define N 100010
using namespace std;

int indeg[30], outdeg[30];
bool st[30];
int p[30];

int find(int x) {
    // 并查集找祖先
    if (p[x] != x) p[x] = find(p[x]);
    return p[x];
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int t;
    cin >> t;
    while (t--) {
        // 多测清空！多测清空！多测清空！
        memset(indeg, 0, sizeof indeg);
        memset(outdeg, 0, sizeof outdeg);
        memset(st, false, sizeof st);
        for (int i = 0; i < 26; i++) p[i] = i;
        bool OK = true; // 是否能构成合法路径

        int n;
        string s;
        cin >> n;
        for (int i = 1; i <= n; i++) {
            cin >> s;
            const int head = s[0] - 'a';
            const int tail = s[s.length() - 1] - 'a';
            indeg[tail]++;
            outdeg[head]++;
            st[head] = true;
            st[tail] = true;
            p[find(head)] = find(tail);
        }
        bool flag = true; // 是否每个点的入度都等于出度
        int cntS = 0, cntT = 0; // 起点数、终点数
        for (int i = 0; i < 26; i++) {
            if (indeg[i] != outdeg[i]) {
                flag = false; // 不满足第一条判别依据
                if (outdeg[i] - indeg[i] == 1) cntS++; 
                else if (indeg[i] - outdeg[i] == 1) cntT++;
                else {
                    OK = false; // 两条均不满足
                    break;
                };
            }
        }
        if (!flag && (cntT != 1 || cntS != 1)) OK = false; // 一张图只允许存在一个起点和终点
        int cur = -1;
        for (int i = 0; i < 26; i++) {
            if (st[i]) { // 该字母出现过
                if (cur == -1) cur = find(i); // 当前位于哪个连通块内
                else if (cur != find(i)) { // 出现不属于同一个连通块的情况，无解
                    OK = false;
                    break;
                }
            }
        }
        cout << (OK ? "Ordering is possible." : "The door cannot be opened.") << endl;
    }
    return 0;
}
```

$\texttt{TH\textcolor{green}{E}~\textcolor{green}{E}ND}$
