import { Terminal } from 'xterm';

let term = new Terminal();

term.open(document.getElementById('terminal'));
term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
