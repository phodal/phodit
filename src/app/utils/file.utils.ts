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

  if (file.toLowerCase() === "makefile") {
    return "cmake";
  }

  let format = "gfm";
  if (file.endsWith(".css")) {
    format = "css";
  }
  if (file.endsWith(".js")) {
    format = "js";
  }
  if (file.endsWith(".html")) {
    format = "xml";
  }
  if (file.endsWith(".tex")) {
    format = "tex";
  }
  if (file.endsWith(".tex")) {
    format = "textile";
  }
  if (file.endsWith(".xml")) {
    format = "xml";
  }
  if (file.endsWith(".yml")) {
    format = "yaml";
  }
  return format;
}
