import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'interact-bar',
  templateUrl: './interact-bar.component.html',
  styleUrls: ['./interact-bar.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class InteractBar implements AfterViewInit {
  @Input() filename = '';
  @Output() action = new EventEmitter<string>();
  renameModel = {
    name: this.filename
  };

  ngAfterViewInit(): void {
    this.renameModel.name = this.filename;
  }

  onSubmit() {
    if (!this.renameModel.name) {
      return;
    }
    this.action.emit(this.renameModel.name);
  }


}
