import {EventConstants} from "../common/constants/event.constants";
import {IFileOpen} from "../common/interface/IFileOpen";
import "./key.event";
import "./menu.right";
import {createTerminal} from "./plugins/terminal";
import {createEvent} from "./support/event.util";
import {markdownRender, removeLastDirectoryPartOf} from "./support/markdown.utils";

const {nativeTheme, ipcRenderer} = require("electron");
const swal = require("sweetalert");
const hljs = require("highlight.js");

declare global {
  // tslint:disable-next-line
  interface Window {
    easymde: any;
  }
}

class ClientUI {
  public state = {
    isShowTerminal: false,
    hasCreateTerminal: false,
    currentFile: "",
    isCurrentFileTemp: false,
    isOneFile: false,
    isPath: false,
  };

  public easymde = new (window as any).EasyMDE({
    spellChecker: false,
    autosave: {
      enabled: true,
      uniqueId: "phodit",
      delay: 1000,
    },
    promptTexts: {
      link: "link",
      image: "image",
    },
    minHeight: "500px",
    maxHeight: "100%",
    autoDownloadFontAwesome: false,
    syncSideBySidePreviewScroll: false,
    renderingConfig: {
      singleLineBreaks: false,
      codeSyntaxHighlighting: true
    },
    element: document.getElementById("input-section"),
  });

  public init() {
    (window as any).easymde = this.easymde;
    // @ts-ignore
    const clipboard = new ClipboardJS(".wechat-button");
    this.easymde.codemirror.focus()

    clipboard.on("success", (event: any) => {
      swal({
        title: "Copy Success", icon: "success", dangerMode: true,
        buttons: {
          confirm: {text: "OK"},
        },
      });
      event.clearSelection();
    });
  }

  public updatePos(currentFile: string) {
    const lastPos = localStorage.getItem("line_" + currentFile);
    if (lastPos) {
      const parsedPos = JSON.parse(lastPos);
      this.easymde.codemirror.setCursor(parsedPos.line, parsedPos.ch);
    }
  }

  public bindEvent() {
    const that = this;
    // 打开帮助
    window.document.addEventListener(EventConstants.CLIENT.OPEN_GUIDE, (data) => {
      ipcRenderer.send(EventConstants.PHODIT.OPEN_GUIDE, this.easymde.value());
    });

    // 全屏
    window.document.addEventListener(EventConstants.CLIENT.FULL_SCREEN, (data) => {
      document.getElementById("input").classList.add("full-screen");
      ipcRenderer.send(EventConstants.PHODIT.FULL_SCREEN);
    });

    // 取消全屏
    window.document.addEventListener(EventConstants.CLIENT.UN_FULL_SCREEN, (data) => {
      document.getElementById("input").classList.remove("full-screen");
      ipcRenderer.send(EventConstants.PHODIT.UN_FULL_SCREEN);
    });

    // Terminal show
    window.document.addEventListener(EventConstants.CLIENT.SHOW_TERMINAL, () => {
      if (!this.state.hasCreateTerminal) {
        createTerminal(removeLastDirectoryPartOf(this.state.currentFile));
        this.state.hasCreateTerminal = true;
      }

      this.state.isShowTerminal = !this.state.isShowTerminal;
      if (this.state.isShowTerminal) {
        document.getElementById("terminal-section").setAttribute("style", "display: block;");
      } else {
        document.getElementById("terminal-section").setAttribute("style", "display: none;");
      }
    });

    // Terminal hidden
    window.document.addEventListener(EventConstants.CLIENT.HIDDEN_TERMINAL, () => {
      document.getElementById("terminal-section").setAttribute("style", "display: none;");
    });

    // Toggle Themes
    window.document.addEventListener(EventConstants.CLIENT.TOGGLE_THEME, () => {
      this.toggleTheme(that.easymde.codemirror);
    });

    // ShowSlides
    window.document.addEventListener(EventConstants.CLIENT.SHOW_SLIDES, () => {
      if (!this.state.currentFile) {
        return;
      }
      ipcRenderer.send(EventConstants.PHODIT.SHOW_SLIDES, {
        isTempFile: this.state.isCurrentFileTemp,
        file: this.state.currentFile,
        data: this.easymde.value(),
      });
    });

    // 隐藏 SIDE
    window.document.addEventListener(EventConstants.CLIENT.HIDDEN_SIDE, () => {
      document.getElementById("tree-view").setAttribute("style", "display: none;");
      document.querySelector(".wechat-button").setAttribute("data-clipboard-target", ".editor-preview-side");
    });

    // 展示 SIDE
    window.document.addEventListener(EventConstants.CLIENT.SHOW_SIDE, () => {
      document.querySelector(".wechat-button").removeAttribute("data-clipboard-target");
      if (this.state.isPath) {
        document.getElementById("tree-view").setAttribute("style", "display: block;");
      }
    });

    // 发起获取自动完成请求
    window.document.addEventListener(EventConstants.CLIENT.GET_SUGGEST, (data: any) => {
      ipcRenderer.send(EventConstants.PHODIT.GET_SUGGEST, data.detail);
    });

    // 打开左侧树型文件
    window.document.addEventListener(EventConstants.CLIENT.TREE_OPEN, (event: any) => {
      const file = JSON.parse(event.detail).filename;
      this.state.currentFile = file;
      this.state.isOneFile = true;

      ipcRenderer.send(EventConstants.PHODIT.SAVE_FILE, {
        isTempFile: this.state.isCurrentFileTemp,
        data: this.easymde.value(),
      });
      ipcRenderer.send(EventConstants.PHODIT.OPEN_FILE, file);
    });

    // 返回 Markdown 渲染结果
    window.document.addEventListener(EventConstants.CLIENT.SEND_MARKDOWN, (event: any) => {
      const data = markdownRender(event.detail, this.state.currentFile);
      createEvent(EventConstants.CLIENT.GET_RENDERER_MARKDOWN, data);
    });

    // Pandoc 转换
    window.document.addEventListener(EventConstants.CLIENT.SHOW_WORD, (event: any) => {
      swal({
        title: "Open File", text: "Are you want to Open File", icon: "info", dangerMode: true,
        buttons: {
          cancel: {text: "Cancel", visible: true},
          confirm: {text: "OK"},
        },
      }).then((willDelete: any) => {
        if (willDelete) {
          ipcRenderer.send(EventConstants.PHODIT.SHOW_WORD, this.state.currentFile);
        }
      });
    });

    // Pandoc 转换
    window.document.addEventListener(EventConstants.CLIENT.SHOW_PDF, (event: any) => {
      swal({
        title: "Open File", text: "Are you want to Open File", icon: "info", dangerMode: true,
        buttons: {
          cancel: {text: "Cancel", visible: true},
          confirm: {text: "OK"},
        },
      }).then((willDelete: any) => {
        if (willDelete) {
          ipcRenderer.send(EventConstants.PHODIT.SHOW_PDF, this.state.currentFile);
        }
      });
    });

    // 返回获取自动完成请求
    ipcRenderer.on(EventConstants.PHODIT.SUGGEST_SEND, (event: any, arg: any) => {
      createEvent(EventConstants.PHODIT.SUGGEST_TO_EDITOR, arg);
    });

    // 返回获取自动完成请求
    ipcRenderer.on(EventConstants.PHODIT.TOGGLE_THEME, (event: any, arg: any) => {
      createEvent(EventConstants.CLIENT.TOGGLE_THEME, arg);
    });

    // 打开文件
    ipcRenderer.on(EventConstants.PHODIT.OPEN_ONE_FILE, (event: any, arg: IFileOpen) => {
      this.state.currentFile = arg.file;
      this.state.isOneFile = false;
      this.state.isCurrentFileTemp = arg.isTempFile;
      this.easymde.value(arg.data);
      this.updatePos(arg.file);

      localStorage.setItem("currentFile", arg.file);
    });

    // 保存文件
    ipcRenderer.on(EventConstants.CLIENT.SAVE_FILE, () => {
      ipcRenderer.send(EventConstants.PHODIT.SAVE_FILE, {
        isTempFile: this.state.isCurrentFileTemp,
        data: this.easymde.value(),
      });
    });

    // 打开某一目录
    ipcRenderer.on(EventConstants.PHODIT.OPEN_PATH, (event: any, arg: any) => {
      this.state.isPath = true;
      document.getElementById("tree-view").setAttribute("style", "display: block");

      createEvent("phodit.tree.open", {
        path: arg.path,
        tree: arg.tree,
      });
    });

    // 改变临时文件的状态
    ipcRenderer.on(EventConstants.TEMP_FILE_STATUS, (event: any, arg: any) => {
      this.state.isCurrentFileTemp = arg.isTempFile;
    });
  }

  public setOSTheme() {
    window.localStorage.os_theme = !!nativeTheme && nativeTheme.shouldUseDarkColors;
    if ("__setTheme" in window) {
      (window as any).__setTheme();
    }
  }

  public toggleTheme(codemirror: any) {
    console.log(codemirror);
    if (window.localStorage.os_theme === "dark") {
      window.localStorage.os_theme = "light";
      codemirror.setOption('theme', 'easymde');
    } else {
      window.localStorage.os_theme = "dark";
      codemirror.setOption('theme', 'django');
    }

    (window as any).__setTheme();
  }

  public setupThemes() {
    // tslint:disable-next-line:no-unused-expression
    nativeTheme && nativeTheme.on('updated', function theThemeHasChanged () {
      this.setOSTheme()
    })
  }
}

const client = new ClientUI();
client.init();
client.bindEvent();
client.setupThemes();
