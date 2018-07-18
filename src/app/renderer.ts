import {getWordLength} from "./utils/utils";
import './menu';
import {createEvent} from "./utils/event.util";
import IpcRenderer = Electron.IpcRenderer;

const showdown = require('showdown');
const {ipcRenderer} = require('electron');

const converter = new showdown.Converter({
  tables: true
});
//
// window.document.addEventListener('phodit.tree.open', (data) => {
//   console.log(data);
// });

ipcRenderer.on('phodit.open.one-file', (event: any, arg: any) => {
  let $input = document.getElementById('input');
  let $output = document.getElementById('output');

  $input.innerText = arg;
  $output.innerHTML = converter.makeHtml(arg);
  console.log(`length ${getWordLength($output.innerText)}`)
});

ipcRenderer.on('phodit.open.path', (event: any, arg: any) => {
  console.log(arg);
  createEvent('phodit.tree.open', arg);
});

window.document.addEventListener('tree.pub.open', (event: any) => {
  ipcRenderer.send('phodit.open.file', JSON.parse(event.detail).filename);
});
