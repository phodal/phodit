import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'interact-bar',
  templateUrl: './interact-bar.component.html',
  styleUrls: ['./interact-bar.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
// tslint:disable-next-line:component-class-suffix
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
