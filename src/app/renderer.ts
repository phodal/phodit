const showdown = require('showdown');
const {ipcRenderer} = require('electron');

const converter = new showdown.Converter({
  tables: true
});

ipcRenderer.on('phodit.open.one-file', (event: any, arg: any) => {
  let $input = document.getElementById('input');
  let $output = document.getElementById('output');

  $input.innerText = arg;
  $output.innerHTML = converter.makeHtml(arg);
});
