const exec = require("child_process").exec;

export default function spawnGit(command: any, options: any, callback: any) {
  exec("git  " + command, options, callback);
}
