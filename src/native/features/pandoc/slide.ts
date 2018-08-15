import spawnPandoc from "./spawn-pandoc";
import {shell} from "electron";

export default function slide(path: string) {
  let newPath = path.replace(/\.md/, '.html');
  return new Promise(function (resolve, reject) {
    spawnPandoc(` -t revealjs -s ${path} -o ${newPath} -V theme=simple`, {}, function (err: any, stdout: any, stdrr: any) {
      if (err) {
        reject(err);
        return;
      }

      stdout.trim();
      resolve(newPath);
    });
  });
}
