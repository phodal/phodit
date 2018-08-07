# Phodit

> a personal markdown editor with electron for Phodal

<p align="center">
  <img width="128" height="128" src="./assets/imgs/icons/png/128x128.png">
</p> 

Screenshots

![Screenshots](./docs/phodit-ss.jpg)

Features
---

 - support for git markdown project
 - Terminal integration
 - tree navigator
 - fullscreen support
 - preview markdown
 - code highlight support
 - search by: Google, Baidu, WIKI, Zhihu, Github
 - **Phodal's blog relative search**
 
Tech Stack
---

 - Stencil.js + Web Components -> Terminal Header
 - SimpleMDE + CodeMirror -> Editor
 - React.js -> TreeView
 - xterm -> Terminal
 - marked -> Markdown Parser
 - highlight.js -> Code Highlight
 - lunr -> search engine 
 - Angular -> Rename box
 
Goal
---

 - 支持基于 Git 和 Markdown 的写作模式
 - 支持微信公众号编辑器
 - 各式语法高亮
 - 导出 Word 和 PDF（考虑 Pandoc）
 - Markdown Slide 预览及更高级效果
 - 一键发布到各个平台的自动化脚本

### 技术细节

 - 国际化支持
 - WebComponents 内建
 - 微前端架构 
 - Web Worker

### Setup

#### Electron

```
yarn install 
yarn build:app
```

#### Components

```
yarn install
yarn build
```

License
---

[![Phodal's Idea](https://brand.phodal.com/shields/idea-small.svg)](https://ideas.phodal.com/)

© 2018 A [Phodal Huang](https://www.phodal.com)'s [Idea](https://github.com/phodal/ideas).  This code is distributed under the MIT license. See `LICENSE` in this directory.
