import {getWordLength} from "./utils/utils";
import './menu';
import {createEvent} from "./utils/event.util";
const showdown = require('showdown');
const {ipcRenderer, shell} = require('electron');

let simplemde = new (window as any).SimpleMDE({ element: document.getElementById('input-section') });

const converter = new showdown.Converter({
  tables: true
});
//
// window.document.addEventListener('phodit.tree.open', (data) => {
//   console.log(data);
// });

ipcRenderer.on('phodit.open.one-file', (event: any, arg: any) => {
  simplemde.value(arg);

  let $output = document.getElementById('output');
  $output.innerHTML = converter.makeHtml(simplemde.value());
  console.log(`length ${getWordLength($output.innerText)}`)
});

ipcRenderer.on('phodit.open.path', (event: any, arg: any) => {
  console.log(arg);
  createEvent('phodit.tree.open', arg);
});

window.document.addEventListener('tree.pub.open', (event: any) => {
  ipcRenderer.send('phodit.open.file', JSON.parse(event.detail).filename);
});
