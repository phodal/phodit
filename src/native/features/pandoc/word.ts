import spawnPandoc from "./spawn-pandoc";

export default function html(path: string) {
  spawnPandoc(`-s ${path} -t html5 -o index.html`, {}, function(err: any, stdout: any, stdrr: any) {
    if (err) {
      return;
    }
    console.log(stdout.trim());

    return stdout.trim();
  });

}
