import { BrowserModule } from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';

import { InteractBar } from './interact-bar.component';
import {createCustomElement} from "@angular/elements";

@NgModule({
  declarations: [InteractBar],
  imports: [BrowserModule],
  entryComponents: [InteractBar]
})
export class AppModule {
  constructor(private injector: Injector) {
    const interactBar = createCustomElement(InteractBar, { injector });
    customElements.define('interact-bar', interactBar);
  }

  ngDoBootstrap() {}
}
