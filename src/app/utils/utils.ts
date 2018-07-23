const marked = require("marked");

class MarkdownImprove {
  private file: string;

  constructor(file: string) {
    this.file = file;
  }

  static fixedImagePath(text: any) {
    const imgRegex = /!\[[^\]]+\]\(([^)]+)\)/gi;
    let matches = text.match(imgRegex);
    if (matches && matches.length > 0) {
      for(let index in matches) {
        let image = matches[index];
        if (imgRegex.test(image)) {
          // https://stackoverflow.com/questions/4724701/regexp-exec-returns-null-sporadically/21123303
          let result = null;
          result = image.match(result);
          console.log(image, imgRegex, result);
          // index.replace(pathRegex, );
          // const replacedImage = image.replace(imgRegex, 'hello.png');
          // text = text.replace(imgRegex, replacedImage);
        }
      }
    }
    return text;
  };
}

export function markdownRender(text: string, file: string) {
  let markedOptions;
  if (this.options && this.options.renderingConfig && this.options.renderingConfig.markedOptions) {
    markedOptions = this.options.renderingConfig.markedOptions;
  } else {
    markedOptions = {};
  }

  if (this.options && this.options.renderingConfig && this.options.renderingConfig.singleLineBreaks === false) {
    markedOptions.breaks = false;
  } else {
    markedOptions.breaks = true;
  }

  if (this.options && this.options.renderingConfig && this.options.renderingConfig.codeSyntaxHighlighting === true) {
    let hljs = this.options.renderingConfig.hljs || (window as any).hljs;
    if (hljs) {
      markedOptions.highlight = function (code: string) {
        return hljs.highlightAuto(code).value;
      };
    }
  }

  marked.setOptions(markedOptions);

  text = MarkdownImprove.fixedImagePath(text);
  return marked(text);
}

function removeLastDirectoryPartOf(path: string) {
  let splitArray = path.split('/');
  splitArray.pop();
  return (splitArray.join('/'));
}

function getFileRelativePath(path: string, imgFilePath: string) {
  return removeLastDirectoryPartOf(path) + imgFilePath;
}
