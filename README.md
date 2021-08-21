# Phodit - 私人定制的 Markdown 编辑器

[![Build Status](https://travis-ci.org/phodal/phodit.svg?branch=master)](https://travis-ci.org/phodal/phodit) ![GitHub package.json version](https://img.shields.io/github/package-json/v/phodal/phodit?style=plastic) [![Markdown Improve](https://img.shields.io/badge/markdown--improve-Phodal-blue.svg)](https://github.com/phodal/markdown-improve)

> 一个基于 Electron 的私人定制的 Markdown 编辑器

<p align="center">
  <img width="128" height="128" src="./assets/imgs/icons/png/256x256.png">
</p> 

Screenshots

![Screenshots](./docs/phodit.jpg)

Features
---

 - **标题折叠**
 - 支持所见所得模式
 - 编写时图片
 - 语法高亮
 - 集成 Terminal 
 - markdown 实时预览
 - 工程管理
 - 支持使用 Git 来编写 markdown 项目
 - 支持全屏
 - 语法高亮
 - 编辑器主题切换
 - 导出支持（pdf、docx）
 - 右键选择搜索: Google, Baidu, WIKI, Zhihu, Github
 - 微信公众号排版支持
 - 支持 Slide 编写(by reveal.js)
 - `.md` 和 `.markdown` 文件关联打开
 
Tech Stack
---

Phodit 是一个使用**微前端架构**开发的 Electron 应用：

 - React.js -> TreeView
 - Angular -> Rename box
 - Stencil.js + Web Components -> Terminal Header
 
相应的技术栈有：
 
 - SimpleMDE + CodeMirror -> Editor
 - xterm -> Terminal
 - marked -> Markdown Parser
 - highlight.js -> Code Highlight
 - Reveal.js -> Slide

### Setup

requirements: ``node.js``

Submodule 

```
git submodule init
git submodule update
```

```
npm install --python=python2.7
```

```
yarn install 
yarn build:app
```

[setup nodejieba in Windows](https://github.com/yanyiwu/nodejieba)

#### Components

Name       |    Path                | Stacks 
-----------|------------------------|--------
 editor    |  ./editor              | SimpleMDE
 header    |  ./component/header    | Stencil.js
 interact  |  ./component/interact   | Angular
 tree-view |  ./component/tree-view | React

Setup && build

```
yarn install
yarn build
```

## License

[![Phodal's Idea](https://brand.phodal.com/shields/idea-small.svg)](https://ideas.phodal.com/)

© 2018~2021 A [Phodal Huang](https://www.phodal.com)'s [Idea](https://github.com/phodal/ideas).  This code is distributed under the MIT license. See `LICENSE` in this directory.
