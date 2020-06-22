const os = require("os");
const pty = require("node-pty");
const Terminal = require("xterm").Terminal;

export function createTerminal(path?: string) {
  // Initialize node-pty with an appropriate shell
  const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
  });

  // Initialize xterm.js and attach it to the DOM
  const xterm = new Terminal();
  xterm.open(document.getElementById("terminal"));

  // Setup communication between xterm.js and node-pty
  xterm.on("data", (data: any) => {
    ptyProcess.write(data);
  });
  ptyProcess.on("data", function(data: any) {
    xterm.write(data);
  });

  ptyProcess.write("git status \n");
}
