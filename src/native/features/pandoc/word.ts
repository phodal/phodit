import spawnPandoc from "./spawn-pandoc";
import {shell} from "electron";

export default function word(path: string) {
  let newPath = path.replace(/\.md/, '.docx');
  spawnPandoc(`-s ${path} -o ${newPath}`, {}, function(err: any, stdout: any, stdrr: any) {
    if (err) {
      return;
    }

    shell.openItem(newPath);
    return stdout.trim();
  });

}
