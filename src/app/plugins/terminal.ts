const os = require("os");
const pty = require("node-pty");
const Terminal = require("xterm").Terminal;
const FitAddon = require('xterm-addon-fit').FitAddon;
const WebLinksAddon = require('xterm-addon-web-links').WebLinksAddon;

export function createTerminal(path?: string) {
  // Initialize node-pty with an appropriate shell
  const shell = process.env[os.platform() === "win32" ? "COMSPEC" : "SHELL"];
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 15,
    cwd: path || process.cwd(),
    env: process.env
  });

  // Initialize xterm.js and attach it to the DOM
  const xterm = new Terminal({
    cols: 80,
    rows: 15,
    cursorBlink: true,
  });
  const fitaddon = new FitAddon();
  xterm.loadAddon(fitaddon);
  xterm.loadAddon(new WebLinksAddon());

  xterm.open(document.getElementById("terminal"));
  fitaddon.fit();

  // Setup communication between xterm.js and node-pty
  xterm.onData((data: any) => {
    ptyProcess.write(data);
  });

  ptyProcess.on("data", (data: any) => {
    xterm.write(data);
  });

  ptyProcess.write("git status \n");
}
