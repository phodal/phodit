import spawnPandoc from "./spawn-pandoc";
import {shell} from "electron";
import * as fs from "fs";

export default function pdf(path: string) {
  let htmlPath = path.replace(/\.md/, '.html');
  let pdfPath = path.replace(/\.md/, '.pdf');
  spawnPandoc(`-s ${path} -o ${htmlPath}`, {}, function(err: any, stdout: any, stdrr: any) {
    if (err) {
      console.error(err);
      return;
    }

    spawnPandoc(`-s ${htmlPath} -o ${pdfPath}`, {}, function (err: any, stdout: any, stdrr: any) {
      if (err) {
        console.error(err);
        return;
      }

      fs.unlink(htmlPath, () => {});
      shell.openPath(pdfPath).then(() => {})
      return stdout.trim();
    });
  });
}
