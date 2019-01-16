# Phodit

> a personal markdown editor with electron for Phodal

<p align="center">
  <img width="128" height="128" src="./assets/imgs/icons/png/256x256.png">
</p> 

Screenshots

![Screenshots](./docs/phodit.jpg)

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
 - fold title
 - wechat publish format
 - slides support (by reveal.js)
 
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
 - Reveal.js -> Slide
 
Goal
---

 - 一键发布到各个平台的自动化脚本
 - 支持微信公众号编辑器

### 技术细节

 - 国际化支持
 - WebComponents 内建
 - 微前端架构 
 - Web Worker

### Setup

requirements: ``pandoc``, ``node.js``

Submodule 

```
git submodule init
git submodule update
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

## FAQ

### Node.js issues

Question:

```
App threw an error during load
Error: The module '/Users/phodal/repractise/phodit/node_modules/nodejieba/build/Release/nodejieba.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 57. This version of Node.js requires
NODE_MODULE_VERSION 64. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
    at process.module.(anonymous function) [as dlopen] (ELECTRON_ASAR.js:160:31)
    at Object.Module._extensions..node (internal/modules/cjs/loader.js:722:18)
    at Object.module.(anonymous function) [as .node] (ELECTRON_ASAR.js:160:31)
    at Module.load (internal/modules/cjs/loader.js:602:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:541:12)
    at Function.Module._load (internal/modules/cjs/loader.js:533:3)
    at Module.require (internal/modules/cjs/loader.js:640:17)
    at require (internal/modules/cjs/helpers.js:20:18)
    at Object.<anonymous> (/Users/phodal/repractise/phodit/node_modules/nodejieba/index.js:1:172)
    at Object.<anonymous> (/Users/phodal/repractise/phodit/node_modules/nodejieba/index.js:58:3)
```

Solution: ``electron-rebuild``

Run:

```
./node_modules/.bin/electron-rebuild -p -t "dev,prod,optional"
```


## License

[![Phodal's Idea](https://brand.phodal.com/shields/idea-small.svg)](https://ideas.phodal.com/)

© 2018~2019 A [Phodal Huang](https://www.phodal.com)'s [Idea](https://github.com/phodal/ideas).  This code is distributed under the MIT license. See `LICENSE` in this directory.
