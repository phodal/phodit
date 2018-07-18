import {getWordLength} from "./utils/utils";
import './menu';

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
  console.log(`length ${getWordLength($output.innerText)}`)
});

ipcRenderer.on('phodit.open.path', (event: any, arg: any) => {
  console.log(arg);
});
