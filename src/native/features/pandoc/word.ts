import spawnPandoc from "./spawn-pandoc";
import {shell} from "electron";

export default function word(path: string) {
  const newPath = path.replace(/\.md/, '.docx');
  spawnPandoc(`-s ${path} -o ${newPath}`, {}, function(err: any, stdout: any, stdrr: any) {
    if (err) {
      console.error(err);
      return;
    }

    shell.openPath(newPath).then(() => {})
    return stdout.trim();
  });

}
