---
slug: '17536'

category: 博客搭建
published: 2024-02-15T09:52:57.521119+08:00
image: https://pic.imgdb.cn/item/65cd8ca29f345e8d034f412f.png
tags:
- 博客
- qexo
- 后端
title: Hexo云后台——Qexo搭建教程
updated: 2024-08-24T21:25:33.354+08:00
---
> [!INFO]
> 在开始之前，首先你需要有一个自己的域名（官方提供的 `github.io` 域名不算在内，确保你必须能够亲自更改 DNS 解析设置），并已经在博客仓库设置的 Pages 选项卡中绑定自己的域名。

本文使用 PostgreSQL+Vercel+Github Actions 部署云端后台及实现自动更新推送等功能。建议在阅读本文的同时查询[官方文档](https://www.oplog.cn/qexo)以获得最保险的效果。

## 部署 Qexo 环境

官方提供了四种方式来部署 Qexo 环境，其中一种允许你在本地进行部署，另外三种各自使用了不同网站提供的免费数据库服务。综合考虑操作便捷性和成功率，这里选用 Vercel 提供的免费 PostgreSQL 服务进行部署。

首先点击[这里](https://vercel.com/new/clone?repository-url=https://github.com/am-abudu/Qexo)进入 Vercel 的仓库克隆界面。建议新建一个私有仓库进行 Qexo 仓库的克隆工作，第一次操作时你需要授权 Vercel 登录你的 Github 账号，在新跳出的浏览器窗口里按顺序授权即可。

设置好仓库名称后，点击 `Create` 创建，下边会有一个 `Deploy` 界面。Vercel 在创建和更改仓库时会自动进行一次部署，因此创建完毕后部署将会自动启动，并且这第一次部署是一定会失败的。因为 Qexo 所依赖的数据库还没有配置。因此点击网页左上角的三角形符号，或者点[这里](https://vercel.com/dashboard)快捷进入你的项目管理页面。不出意外的话，界面将是这个样子：

![](https://pic.imgdb.cn/item/65cd75059f345e8d0314b216.png)

（我这里是已经配置好了 Qexo）

然后我们开始配置 PostgreSQL 数据库，在 `Storage` 界面可以申请，点击右上角 `Create Database`并选择`Postgres`，Vercel 的免费 PostgreSQL 数据库仅限创建一个，如果你先前没有配置过——点击 `Continue`进入数据库连接配置，在`Connect`界面选择地区为`Washington DC`或者`USA (east)`。创建完毕后，在 `Storage`选项卡里选择进入你创建的数据库配置界面。在左侧边栏点击`Project`，接着点击 `Connect Project`：

![](https://pic.imgdb.cn/item/65cd78019f345e8d031b8c58.png)

选择自己想要部署 Qexo 的仓库即可，接着回到项目管理界面，点击部署用的仓库。在 `Settings` 里面选择 `Domains` 域名选项，添加自己购买的域名。

> [!WARNING]
> 不要将域名直接指向到主页地址，如果你购买的主域名是 abcd.xyz，务必绑定到它的子域名例如 admin.abcd.xyz，而不能直接绑定到 abcd.xyz！

当你添加了一个目标域名后，Vercel 会自动对填入的域名进行 DNS 检查，若第一次配置，大概率会出现以下报错信息：

![](https://pic.imgdb.cn/item/65cd7e2f9f345e8d032acc60.png)

此时你需要打开自己域名的DNS解析设置，添加一个A解析：主机记录为 `@`，记录值为 `76.76.21.21`。补充一句，这个IP地址指向 `vercel.app` 的域名服务器，然而这个域名已经处于DNS污染的状态，无法访问。Vercel的临时备用方案是将IP改成 `76.223.126.88`，事实证明到现在这个方案还是有效的。

配置完部署域名后，转到顶端选项卡 `Deployment` 中点击 `Redeploy` 开始二次部署。一般等待一分钟左右无报错信息即可完成部署。

如果你使用的是 `MongoDB`，有可能在二次部署开始三到四分钟后接收到部署失败的信息。如果失败信息里出现了类似于 `handshake failed` 的握手失败信息时，建议放弃该方法（很可能是国内墙掉了MongoDB的连接接口导致部署时无法访问）并转而使用上边介绍的PostgreSQL法重新部署。

查看其他部署具体步骤，见[官方文档——部署](https://www.oplog.cn/qexo/start/build.html)；若部署时遇到报错，可以进入[官方文档——常见问题](https://www.oplog.cn/qexo/start/questions.html)排错。

## 初始化 Qexo

### Github 配置

部署完毕后，切换到绑定的域名，本例中我们转到 `admin.abcd.xyz`。如果没有出现 Qexo 的初始化配置界面，试着转到 `admin.abcd.xyz/init/`。如果你使用 Hexo，并在 Github 上托管，在 Github 的配置界面，你会看到这几项：

![](https://pic.imgdb.cn/item/65cd80789f345e8d0330a703.png)

（这是已经配置好的 Qexo 的设置界面，只是我将填写的内容删去了，但是项目是完全一致的）

Github 密钥这一项，你需要在[Github设置](https://github.com/settings/tokens)中申请。右上角选择 `Generate New Token`，有两个选项，选择 `classic`。接着完成身份验证。改变如下几项：

![](https://pic.imgdb.cn/item/65cd81e59f345e8d033410e3.png)

`Note` 必填，作为这个token的使用目的；`Expiration` 是生效期限，安全起见建议设置一个较短的期限，然后定时重置，重新配置Qexo设置，这里我选择的是永久有效；在下边的生效条目里，保证 `repo` 下的复选框全部勾选，建议同时勾选 `workflow`，但官方不建议给出所有权限。这么做的目的是保证Qexo有足够权限访问Github API从而在线修改Github博客源码的内容。

申请完毕后复制下来，出于安全，Github仅在token初次创建完毕后给出复制选项，所以尽快保存，并填入初始化界面的“Github 密钥”文本框中。

然后在Github里新建仓库，用于存放博客源码。接着在本地转到你的博客源码文件夹中（就是你执行 `hexo clean & hexo g & hexo d` 的文件夹），右键点击 `git bash here`，依次键入以下的代码：

1. （“查看”里勾选“显示隐藏的文件”后，若源码目录下没有名为 `.git` 的文件夹，有则跳过该步骤）`git init`
2. 复制仓库的网页地址，例：`https://github.com/<username>/<repo>`
3. 输入 `git remote add <name> https://github.com/<username>/<repo>.git`（这里的 `<name>` 任取，但保证先前未创建过，且不与已经存在的 `<name>` 重复，否则将可能不会上传当前的文件夹）
4. 输入 `git pull <name> master`，`master` 可更改，但保证和新建仓库的主branch同名
5. 输入 `git add .`（注意有个点）
6. 输入 `git commit -m "Commit内容"`（内容可更改，但需要用半角双引号包裹起来）
7. 输入 `git push <name> master`（ `master` 保持前后一致即可）

如果是第一次上传，按顺序执行以下七步操作；如果已经上传过了，想要提交一些个人的更改，执行第四到第七步即可。“Github 仓库”这一项就填刚刚创建并上传的源码仓库，格式是 `<username>/<repo>`（例：`mynameisabcd/BlogSourceCode`）。

“项目分支”填源代码仓库的主要分支，一般是 `master`；“博客路径”留空即可。

若使用Gitlab，或者想要通过本地进行初始化，见[官方文档](https://www.oplog.cn/qexo/configs/provider.html)。

### Vercel 配置

“VERCEL_TOKEN”一项，需要在[这里](https://vercel.com/account/tokens)生成。

![](https://pic.imgdb.cn/item/65cd88989f345e8d0344c1cf.png)

同样是填写 token 名称、生效范围（这里选择 `xxx's projetcs`）和生效期限（建议期限短些）。完毕后点击 `Create` 生成密钥，也是需要尽快复制下来，粘贴到“VERCEL_TOKEN”里。

“PROJECT_ID”则需要回到Vercel对应的项目的 `Settings` 里，在 `General` 选项卡中向下翻到 `Project ID` 并复制内容，粘贴到 `PROJECT_ID` 中就完成 Vercel 配置了。

接下来你还需要设置管理员账号密码，设置完毕后就可以从 `admin.abcd.xyz` 快捷进入管理界面了。

### Github Actions 自动部署

脚本如下，将如下代码复制到路径 `.github/workflows/main.yml` 文件中，如果不存在则新建并复制内容。

```yaml
name: 自动部署 Hexo

on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]

    steps:
      - name: 开始运行
        uses: actions/checkout@v2
        with:
          submodules: true
  
      - name: 安装Pandoc
        uses: nikeee/setup-pandoc@v1
  
      - name: 设置 Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: 安装 Hexo CI
        run: |
          export TS='Asia/Shanghai'
          npm install hexo-cli -g

      - name: 缓存
        uses: actions/cache@v1
        id: cache-dependencies
        with:
          path: node_modules
          key: ${{runner.OS}}-${{hashFiles('**/package-lock.json')}}
  
      - name: 安装依赖插件
        run: |
          # Install Plugins with 'npm install'
  
      - name: 安装插件
        if: steps.cache-dependencies.outputs.cache-hit != 'true'
        run: |
          npm install
  
      - name: 配置SSH私钥
        env:
          HEXO_DEPLOY_PRIVATE_KEY: ${{secrets.GIT_PRI}}
        run: |
          mkdir -p ~/.ssh/
          echo "$HEXO_DEPLOY_PRIVATE_KEY" > ~/.ssh/id_rsa 
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts  

      - name: 部署博客
        run: | 
          # 以防万一有些遗留代码还是没删
          # hexo clean 以下的代码都是必需的，不可删去
          git config --global credential.helper store
          git config --global init.defaultBranch master
          git config --global user.name "${{secrets.GIT_NAME}}"
          git config --global user.email "${{secrets.GIT_EMAIL}}" 
          git config --global user.password "${{secrets.GIT_PSW}}"
          hexo clean
          hexo g -d
          cd ./public
          git init
          git add .
          git commit -m 'Update'
          git push --force --quiet 'https://${{secrets.GH_TOKEN}}@github.com/${{secrets.GH_REF}}' master
```

## 常见问题

> Q：出现“node deprecated.js”、“Cannot find module 'hexo' from XXX”怎么解决？

将 `Node.js` 的版本更新一下，建议至少在 18 以上。具体在工作流文件的开头修改：

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x] # 修改此处数字，建议至少为18，推荐20
```

> Q：自动部署时 Actions 报错“fatal: could not read Username for https://github.com/XXX/XXX”怎么办？

首先检查一下你的工作流文件是否已经正确配置，看一下有没有在进行提交操作之前给 git 设置对应的用户名和密码。如果已经设置了用户名和密码，且问题依旧存在，则考虑将 `_config.yml` 文件的部署选项改成如下形式：

```yaml
# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: git
  repo: https://<Your Github Token>@github.com/<Your Username>/<Your Username>.github.io.git
  branch: master
```

通过先前生成的 token 来访问仓库。

> Q：我的博客使用 Pandoc 渲染器来渲染数学公式，渲染器又需要依赖本地安装的 Pandoc 程序来渲染，如何为在线部署添加 Pandoc 支持？

在工作流的靠前位置添加一个配置 Pandoc 的工作即可：

```yaml
- name: 安装Pandoc
  uses: nikeee/setup-pandoc@v1
```

