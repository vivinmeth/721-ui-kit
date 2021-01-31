import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonUIModule, CommonSASSModule, NatoursSASSModule, DevNinjaModule } from '@vm721/ui-kit';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonUIModule,
    CommonSASSModule,
    NatoursSASSModule,
    DevNinjaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
