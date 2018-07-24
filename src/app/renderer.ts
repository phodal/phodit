import {IFileOpen} from "../common/interface/IFileOpen";
import "./menu.right";
import {createEvent} from "./utils/event.util";
import {markdownRender} from "./utils/markdown.utils";
import {getCodeMirrorMode} from "./utils/file.utils";
import {EventConstants} from "../common/constants/event.constants";

require("devtron").install();

const {ipcRenderer} = require("electron");

let currentFile: string;
let isCurrentFileTemp = false;

const simplemde = new (window as any).SimpleMDE({
  spellChecker: false,
  autosave: {
    enabled: true,
    uniqueId: "phodit",
    delay: 1000,
  },
  promptTexts: {
    link: 'link',
    image: 'image'
  },
  renderingConfig: {
    codeSyntaxHighlighting: true
  },
  element: document.getElementById("input-section"),
});

// 打开帮助
window.document.addEventListener(EventConstants.CLIENT.OPEN_GUIDE, (data) => {
  ipcRenderer.send(EventConstants.PHODIT.OPEN_GUIDE, simplemde.value());
});

// 全屏
window.document.addEventListener(EventConstants.CLIENT.FULL_SCREEN, (data) => {
  document.getElementById('input').classList.add('full-screen');
  ipcRenderer.send(EventConstants.PHODIT.FULL_SCREEN);
});

// 取消全屏
window.document.addEventListener(EventConstants.CLIENT.UN_FULL_SCREEN, (data) => {
  document.getElementById('input').classList.remove('full-screen');
  ipcRenderer.send(EventConstants.PHODIT.UN_FULL_SCREEN);
});

// 展示 SIDE
window.document.addEventListener(EventConstants.CLIENT.HIDDEN_SIDE, () => {
  document.getElementById('tree-view').setAttribute('style', "display: none;");
});

// 隐藏 SIDE
window.document.addEventListener(EventConstants.CLIENT.SHOW_SIDE, () => {
  document.getElementById('tree-view').setAttribute('style', "display: block;");
});

// 发起获取自动完成请求
window.document.addEventListener(EventConstants.CLIENT.GET_SUGGEST, (data: any) => {
  ipcRenderer.send(EventConstants.PHODIT.GET_SUGGEST, data.detail);
});

// 返回获取自动完成请求
ipcRenderer.on(EventConstants.PHODIT.SUGGEST_SEND, (event: any, arg: any) => {
  createEvent(EventConstants.PHODIT.SUGGEST_TO_EDITOR, arg);
});

// 打开文件
ipcRenderer.on(EventConstants.PHODIT.OPEN_ONE_FILE, (event: any, arg: IFileOpen) => {
  currentFile = arg.file;
  simplemde.codemirror.setOption("mode", getCodeMirrorMode(currentFile));
  isCurrentFileTemp = arg.isTempFile;
  simplemde.value(arg.data);
});

// 保存文件
ipcRenderer.on(EventConstants.CLIENT.SAVE_FILE, () => {
  ipcRenderer.send(EventConstants.PHODIT.SAVE_FILE, {
    isTempFile: isCurrentFileTemp,
    data: simplemde.value(),
  });
});

// 打开某一目录
ipcRenderer.on(EventConstants.PHODIT.OPEN_PATH, (event: any, arg: any) => {
  document.getElementById('tree-view').setAttribute('style', "display: block");

  createEvent("phodit.tree.open", arg);
});

// 改变临时文件的状态
ipcRenderer.on(EventConstants.TEMP_FILE_STATUS, (event: any, arg: any) => {
  isCurrentFileTemp = arg.isTempFile;
});

// 打开左侧树型文件
window.document.addEventListener(EventConstants.CLIENT.TREE_OPEN, (event: any) => {
  let file = JSON.parse(event.detail).filename;
  currentFile = file;
  ipcRenderer.send(EventConstants.PHODIT.OPEN_FILE, file);
});

// 返回 Markdown 渲染结果
window.document.addEventListener(EventConstants.CLIENT.SEND_MARKDOWN, (event: any) => {
  const data = markdownRender(event.detail, currentFile);
  createEvent(EventConstants.CLIENT.GET_RENDERER_MARKDOWN, data);
});
