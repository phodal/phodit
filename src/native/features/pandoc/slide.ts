import spawnPandoc from "./spawn-pandoc";
const tmp = require("tmp");

export default function slide(path: string) {
  const tmpobj = tmp.fileSync();
  const newPath = tmpobj.name;

  return new Promise(function (resolve, reject) {
    spawnPandoc(` -t revealjs -s ${path} -o ${newPath} -V theme=simple`, {}, function (err: any, stdout: any, stdrr: any) {
      if (err) {
        reject(err);
        return;
      }

      stdout.trim();
      resolve(tmpobj.name);
    });
  });
}
