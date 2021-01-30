import {NgModule} from "@angular/core";
import {CommonSASSInjectComponent} from "./components/commonsassinject/commonsassinject.component";

@NgModule({
  declarations:[CommonSASSInjectComponent],
  exports: [CommonSASSInjectComponent]
})
export class CommonSASSModule{ }
