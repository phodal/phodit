import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'interact-bar',
  templateUrl: './interact-bar.component.html',
  styleUrls: ['./interact-bar.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class InteractBar {
  @Input() set filename(value: string) {
    this.renameModel.name = value;
  }

  @Output() action = new EventEmitter<string>();
  renameModel = {
    name: this.filename
  };

  onSubmit() {
    if (!this.renameModel.name) {
      return;
    }
    this.action.emit(this.renameModel.name);
  }


}
