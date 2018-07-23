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
    let matches = text.match(imgRegexGlobal);
    if (matches && matches.length > 0) {
      matches.forEach(function (image: any) {
        const originImage = image;
        if (imgRegex.test(image)) {
          let result = imgRegex.exec(image);
          let newFilePath = getFileRelativePath(that.file, result[1]);
          image = image.replace(/\(([^)]+)\)/, '(' + newFilePath + ')');
          text = text.replace(originImage, image);
        }
      });
    }
    return text;
  };

  codeHighlight(text: string) {
    if (!this.marked) {
      return text;
    }
    const tok = this.marked.lexer(text);
    text = this.marked.parser(tok);
    text = text.replace(/<pre><code>(.*)<\/code><\/pre>/ig, '<pre class="prettyprint">$1</pre>');
    return text;
  }
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

  const markdownImprove = new MarkdownImprove(file);
  text = markdownImprove.fixedImagePath(text);
  let results =  marked(text);
  results = markdownImprove.codeHighlight(results);
  return results;
}

function removeLastDirectoryPartOf(path: string) {
  let splitArray = path.split('/');
  if (!path) {
    return path;
  }
  splitArray.pop();
  return (splitArray.join('/'));
}

function getFileRelativePath(path: string, imgFilePath: string) {
  return `${removeLastDirectoryPartOf(path)}/${imgFilePath}`;
}
