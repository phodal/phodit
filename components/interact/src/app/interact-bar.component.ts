import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'interact-bar',
  templateUrl: './interact-bar.component.html',
  styleUrls: ['./interact-bar.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class InteractBar {
  @Input() label;
  @Output() action = new EventEmitter<any>();
  private clicksCt = 0;
  renameModel = {
    name: ''
  };

  onSubmit() {
    console.log(this.renameModel.name);
    if (!this.renameModel.name) {
      return;
    }
    this.action.emit(this.renameModel.name);
  }
}
