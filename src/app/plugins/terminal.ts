let os = require('os');
let pty = require('node-pty');
let Terminal = require('xterm').Terminal;

export function createTerminal(path?: string) {
  // Initialize node-pty with an appropriate shell
  const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: path || process.cwd(),
    env: process.env
  });

  // Initialize xterm.js and attach it to the DOM
  const xterm = new Terminal();
  xterm.open(document.getElementById('terminal'));

  // Setup communication between xterm.js and node-pty
  xterm.on('data', (data: any) => {
    ptyProcess.write(data);
  });
  ptyProcess.on('data', function (data: any) {
    xterm.write(data);
  });

  ptyProcess.write('git status \n');
}
