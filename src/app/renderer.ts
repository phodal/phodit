import './menu';
import {createEvent} from "./utils/event.util";

require('devtron').install();

const {ipcRenderer,} = require('electron');


let simplemde = new (window as any).SimpleMDE({
  spellChecker: false,
  autosave: {
    enabled: true,
    uniqueId: "phodit",
    delay: 1000,
  },
  element: document.getElementById('input-section')
});

// window.document.addEventListener('phodit.tree.open', (data) => {
//   console.log(data);
// });


ipcRenderer.on('phodit.open.one-file', (event: any, arg: any) => {
  simplemde.value(arg);
});

ipcRenderer.on('client.save.file', () => {
  ipcRenderer.send('phodit.save.file', simplemde.value());
});

ipcRenderer.on('phodit.open.path', (event: any, arg: any) => {
  createEvent('phodit.tree.open', arg);
});

window.document.addEventListener('tree.pub.open', (event: any) => {
  ipcRenderer.send('phodit.open.file', JSON.parse(event.detail).filename);
});
