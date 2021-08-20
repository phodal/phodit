import {Component, State, h} from '@stencil/core';

@Component({
  tag: 'phodit-header',
  styleUrl: 'phodit-header.css'
})
export class PhoditHeader {
  @State() showCloseHeader = false;

  componentDidLoad() {
    var that = this;
    window.document.addEventListener('phodit.editor.git.commit', function () {
      that.showCloseHeader = true;
    })
  }

  handleClick() {
    var event = new CustomEvent("phodit.editor.hidden.terminal", {});
    window.document.dispatchEvent(event);
  }

  render() {
    if (this.showCloseHeader) {
      return (<div id="phodit-editor">
        <span class="close-button" onClick={this.handleClick}>
          <i class="fa fa-close"></i>
        </span>
      </div>);
    }

    return (<div></div>);
  }
}
