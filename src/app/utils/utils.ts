const marked = require("marked");

class MarkdownImprove {
  private file: string;

  constructor(file: string) {
    this.file = file;
  }

  public fixedImagePath (text: any) {
    console.log(this.file);
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

  const markdownImprove = new MarkdownImprove(file);
  text = markdownImprove.fixedImagePath(text);
  return marked(text);
}
