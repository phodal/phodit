export function getCodeMirrorMode(file: string) {
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
