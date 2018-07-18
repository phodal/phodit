import spawnGit from './spawn-git';

export default function gitStatus(path: string) {
  spawnGit('status', {cwd: path}, function (err: any, stdout: any, stdrr: any) {
    if (err) {
      return;
    }
    console.log(stdout.trim());

    return stdout.trim();
  });
};
