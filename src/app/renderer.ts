const showdown = require('showdown');
const {ipcRenderer} = require('electron');

const converter = new showdown.Converter();
const text = '# hello, markdown!';
const html = converter.makeHtml(text);

console.log(html);

console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"

ipcRenderer.on('asynchronous-reply', (event: any, arg: any) => {
  console.log(arg) // prints "pong"
});
ipcRenderer.send('asynchronous-message', 'ping');
