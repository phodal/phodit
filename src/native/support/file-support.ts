import * as fs from "fs";
import * as path from "path";
const storage = require("electron-json-storage");

export function dirTree(filename: string) {
  let stats;
  try {
    stats = fs.lstatSync(filename);
  } catch (e) {
    storage.remove("storage.last.path");
    return;
  }
  const info: any = {
    filename,
    module: path.basename(filename),
  };

  if (stats.isDirectory()) {
    info.collapsed = true;
    info.children = fs.readdirSync(filename).filter((child: string) => {
      return child !== ".git" && child !== ".DS_Store" && child !== ".idea";
    }).map((child) => dirTree(filename + "/" + child));
  } else {
    info.leaf = true;
  }

  return info;
}
