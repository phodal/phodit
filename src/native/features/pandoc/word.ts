import spawnPandoc from "./spawn-pandoc";

export default function html(path: string) {
  let newPath = path.replace(/\.md/, '.docx');
  spawnPandoc(`-s ${path} -o ${newPath}`, {}, function(err: any, stdout: any, stdrr: any) {
    if (err) {
      return;
    }
    console.log(stdout.trim());

    return stdout.trim();
  });

}
