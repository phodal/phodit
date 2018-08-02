import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'interact-bar',
  templateUrl: './interact-bar.component.html',
  styleUrls: ['./interact-bar.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class InteractBar {
  @Input() label;
  @Output() action = new EventEmitter<number>();
  private clicksCt = 0;

  handleClick() {
    this.clicksCt++;
    this.action.emit(this.clicksCt);
  }
}
