import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'interact-bar',
  templateUrl: './interact-bar.component.html',
  styleUrls: ['./interact-bar.component.css']
})
export class InteractBar {
  @Output() action = new EventEmitter<number>();
  private clicksCt = 0;

  handleClick() {
    this.clicksCt++;
    console.log(this.clicksCt);
    this.action.emit(this.clicksCt);
  }
}
