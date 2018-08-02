import { BrowserModule } from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {createCustomElement} from "@angular/elements";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    const customButton = createCustomElement(AppComponent, { injector });
    customElements.define('custom-button', customButton);
  }

  ngDoBootstrap() {}
}
