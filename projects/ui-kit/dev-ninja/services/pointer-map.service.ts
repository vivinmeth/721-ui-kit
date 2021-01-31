import {Injectable} from "@angular/core";

import { PointerMap } from "../pointerMap/pointerMap";


@Injectable({
  providedIn: 'root'
})
export class PointerMapService extends PointerMap{
  #PointerMap;
  constructor() {
    super();
    this.#PointerMap = PointerMap;
  }

  create(scope?){
    return new this.#PointerMap(!!scope);
  }

}
