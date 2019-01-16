export function getFileName(path: string)  {
  if (!path) {
    return path;
  }
  console.log(path);
  const splitArray = path.split("/");
  return splitArray[splitArray.length - 1];
}

export function getCodeMirrorMode(file: string) {
  file = getFileName(file);

  if (file.endsWith('.css')) {
    return 'css';
  }
  if (file.endsWith('.js')) {
    return 'js';
  }
  if (file.endsWith('.tex')) {
    return 'tex';
  }
  if (file.endsWith('.tex')) {
    return 'textile';
  }
  if (file.toLowerCase() === 'makefile') {
    return 'cmake';
  }
  return 'gfm';
}
