import spawnPandoc from "./spawn-pandoc";
import { shell } from "electron";

export default function pdf(path: string) {
  const pdfPath = path.replace(/\.md/, '.pdf');

  const additional = `--pdf-engine=xelatex -V -VCJKoptions=BoldFont="Hei" -VCJKmainfont="Hei"`;
  spawnPandoc(`-s ${path} -o ${pdfPath} ${additional}`, {}, (err: any, stdout: any, stdrr: any) => {
    if (err) {
      console.error(err);
      return;
    }

    console.info(stdout);
    console.info(stdrr);

    // tslint:disable-next-line:no-empty
    shell.openPath(pdfPath).then(() => {
    })
    return stdout.trim();
  });
}
