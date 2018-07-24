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
  element: document.getElementById("input-section"),
});

window.document.addEventListener(EventConstants.CLIENT.OPEN_GUIDE, (data) => {
  ipcRenderer.send(EventConstants.PHODIT.OPEN_GUIDE, simplemde.value());
});

window.document.addEventListener(EventConstants.CLIENT.FULL_SCREEN, (data) => {
  ipcRenderer.send(EventConstants.PHODIT.FULL_SCREEN);
});

window.document.addEventListener(EventConstants.CLIENT.UN_FULL_SCREEN, (data) => {
  ipcRenderer.send(EventConstants.PHODIT.UN_FULL_SCREEN);
});

window.document.addEventListener(EventConstants.CLIENT.GET_SUGGEST, (data: any) => {
  ipcRenderer.send(EventConstants.PHODIT.GET_SUGGEST, data.detail);
});

ipcRenderer.on(EventConstants.PHODIT.SUGGEST_SEND, (event: any, arg: any) => {
  createEvent(EventConstants.PHODIT.SUGGEST_TO_EDITOR, arg);
});

ipcRenderer.on(EventConstants.PHODIT.OPEN_ONE_FILE, (event: any, arg: IFileOpen) => {
  currentFile = arg.file;
  simplemde.codemirror.setOption("mode", getCodeMirrorMode(currentFile));
  isCurrentFileTemp = arg.isTempFile;
  simplemde.value(arg.data);
});

ipcRenderer.on(EventConstants.CLIENT.SAVE_FILE, () => {
  ipcRenderer.send(EventConstants.PHODIT.SAVE_FILE, {
    isTempFile: isCurrentFileTemp,
    data: simplemde.value(),
  });
});

ipcRenderer.on(EventConstants.PHODIT.OPEN_PATH, (event: any, arg: any) => {
  createEvent("phodit.tree.open", arg);
});

ipcRenderer.on(EventConstants.TEMP_FILE_STATUS, (event: any, arg: any) => {
  isCurrentFileTemp = arg.isTempFile;
});

window.document.addEventListener(EventConstants.CLIENT.TREE_OPEN, (event: any) => {
  ipcRenderer.send(EventConstants.PHODIT.OPEN_FILE, JSON.parse(event.detail).filename);
});

window.document.addEventListener(EventConstants.CLIENT.SEND_MARKDOWN, (event: any) => {
  const data = markdownRender(event.detail, currentFile);
  createEvent(EventConstants.CLIENT.GET_RENDERER_MARKDOWN, data);
});
