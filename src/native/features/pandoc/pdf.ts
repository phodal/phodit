import spawnPandoc from "./spawn-pandoc";
import {shell} from "electron";

export default function pdf(path: string) {
  let newPath = path.replace(/\.md/, '.pdf');
  spawnPandoc(`-s ${path} -o ${newPath}`, {}, function(err: any, stdout: any, stdrr: any) {
    if (err) {
      console.error(err);
      return;
    }

    shell.openItem(newPath);
    return stdout.trim();
  });

}
