import './menu';
import {createEvent} from "./utils/event.util";

const {ipcRenderer, shell} = require('electron');

let simplemde = new (window as any).SimpleMDE({
  spellChecker: false,
  element: document.getElementById('input-section')
});

// window.document.addEventListener('phodit.tree.open', (data) => {
//   console.log(data);
// });

ipcRenderer.on('phodit.open.one-file', (event: any, arg: any) => {
  simplemde.value(arg);
});

ipcRenderer.on('phodit.open.path', (event: any, arg: any) => {
  console.log(arg);
  createEvent('phodit.tree.open', arg);
});

window.document.addEventListener('tree.pub.open', (event: any) => {
  ipcRenderer.send('phodit.open.file', JSON.parse(event.detail).filename);
});
