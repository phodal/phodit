import {exec} from "child_process";

export default function spawnPandoc(command: any, options: any, callback: any) {
  exec("pandoc " + command, options, callback);
}
