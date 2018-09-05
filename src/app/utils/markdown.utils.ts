const marked = require("marked");

class MarkdownImprove {
  private file: string;
  private marked: any;

  constructor(file: string, marked?: any) {
    this.file = file;
    this.marked = marked;
  }

  public fixedImagePath(text: any) {
    const imgRegex = /!\[[^\]]+\]\(([^)]+)\)/;
    const imgRegexGlobal = /!\[[^\]]+\]\(([^)]+)\)/gi;
    const that = this;
    const matches = text.match(imgRegexGlobal);
    if (matches && matches.length > 0) {
      matches.forEach(function(image: any) {
        const originImage = image;
        if (imgRegex.test(image)) {
          const result = imgRegex.exec(image);
          const newFilePath = getFileRelativePath(that.file, result[1]);
          image = image.replace(/\(([^)]+)\)/, "(" + newFilePath + ")");
          text = text.replace(originImage, image);
        }
      });
    }
    return text;
  }
}

export function markdownRender(text: string, file: string) {
  // Options list
  // https://marked.js.org/#/USING_ADVANCED.md
  let renderer = new marked.Renderer();
  renderer.listitem = (text: any) => {
    return '<li><p><span style="color: #384452;">' + text + '</span></p></li>\n';
  };

  marked.setOptions({
    renderer: renderer,
    highlight: function(code: string) {
      return require('highlight.js').highlightAuto(code).value;
    },
    footnote: true,
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
  });

  if (file) {
    const markdownImprove = new MarkdownImprove(file);
    text = markdownImprove.fixedImagePath(text);
  }
  return marked(text);
}

export function removeLastDirectoryPartOf(path: string) {
  if (!path) {
    return path;
  }

  const splitArray = path.split("/");
  splitArray.pop();
  return (splitArray.join("/"));
}

function getFileRelativePath(path: string, imgFilePath: string) {
  return `${removeLastDirectoryPartOf(path)}/${imgFilePath}`;
}
