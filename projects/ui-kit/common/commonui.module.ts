import { NgModule } from '@angular/core';




import { DropdownDirective } from "./directives/dropdown.directive";
import {DevNinjaModule} from "../dev-ninja/dev-ninja.module";


@NgModule({
  declarations: [
    DropdownDirective
  ],
  imports: [
    DevNinjaModule
  ],
  exports: [ DropdownDirective ]
})
export class CommonUIModule { }
