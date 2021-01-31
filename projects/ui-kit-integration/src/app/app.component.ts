import { Component } from '@angular/core';
import { PointerMapService } from "@vm721/ui-kit";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui-kit-integration';
  ptrmp;
  constructor(private PTRMp: PointerMapService) {
    this.ptrmp = this.PTRMp.create(this);
    this.ptrmp.createInstance(() => {});
    let id = this.ptrmp.getLastPointer();
    console.log(this.PTRMp, this.ptrmp, this.ptrmp.getInstance(id), id);
  }

  log(){
    this.PTRMp.printGlobalMap();
  }

  delete(){
    document.getElementsByClassName('dropdown')[0].remove();
    console.log('removed!');

  }
}
