import spawnPandoc from "./spawn-pandoc";
import {shell} from "electron";

export default function slide(path: string) {
  let newPath = path.replace(/\.md/, '.html');
  spawnPandoc(`pandoc -t revealjs -s ${path} -o ${newPath} -V theme=simple`, {}, function(err: any, stdout: any, stdrr: any) {
    if (err) {
      return;
    }

    stdout.trim();
    return newPath;
  });

}
