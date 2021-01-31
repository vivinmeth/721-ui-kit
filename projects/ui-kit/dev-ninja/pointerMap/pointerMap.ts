
export type Pointer = [string, any];

export enum PTR {
  POINTER,
  INSTANCE
}

// @dynamic
export class PointerMap{
  // @ts-ignore - static private property
  static #Global = new Map<any, any>();
  pointers = [];
  #map: Map<string, any>;


  constructor(private isScoped:boolean = false, private inGlobal: boolean = true) {
    this.#map = new Map<string, any>();
    this.#map.set('lastPointer', undefined);
    if(this.isScoped && inGlobal){
      PointerMap.#Global.set(this, this.#map);
      console.log(PointerMap.#Global);
    }
  }

  createInstance(inst: any): any{
    let pointerTuple = this.createPointer(inst);
    return pointerTuple[PTR.INSTANCE];
  }

  createPointer(inst: any): Pointer{
    let pointer: Pointer;
    const pointerID: string = Math.random().toString();
    pointer = [pointerID, inst];
    this.#setPointer(pointer);
    return pointer;
  }

  getInstance(pointerID: string){
    return this.#map.get(pointerID);
  }

  createEmptyPointer(){
    return Math.random().toString()
  }

  useEmptyPointer(pointerID: string, Inst: any){
    let pointer: Pointer;
    pointer = [pointerID, Inst];
    this.#setPointer(pointer);
    return pointer;
  }

  getPointer(pointerID: string){
    let pointer: Pointer;
    pointer = [pointerID, this.getInstance(pointerID)];
    return pointer
  }

  printGlobalMap(){
    console.log("PointerMap[Global] -> ",PointerMap.#Global)
  }

  getLastPointer(){
    return this.#map.get('lastPointer');
  }

  #setLastPointer = (pointerID: string) => {
    this.#map.set('lastPointer', pointerID);
  }

  #setPointer = (pointer:Pointer): void => {
    this.#map.set(pointer[PTR.POINTER], pointer[PTR.INSTANCE]);
    this.#setLastPointer(pointer[PTR.POINTER]);
    this.pointers.push(pointer[PTR.POINTER]);
    if(!this.isScoped && this.inGlobal){
      PointerMap.#setPointer(pointer);
    }
    console.log(PointerMap.#Global)
  };

  static getPointer(pointerID: string, scope?: PointerMap){
    if(scope){
      return PointerMap.getScope(scope).get(pointerID);
    }
    return PointerMap.#Global.get(pointerID);
  }

  static getScope(scope: PointerMap){
    return PointerMap.#Global.get(scope);
  }

  static getLastPointer(scope?: PointerMap){
    if(scope){
      return PointerMap.getScope(scope).get('lastPointer');
    }
    else{
      return PointerMap.#Global.get('lastPointer');
    }
  }

  // @ts-ignore - static private property
  static #setLastPointer = (pointerID: string) => {
    PointerMap.#Global.set('lastPointer', pointerID);
  }

  // @ts-ignore - static private property
  static #setPointer = (pointer: Pointer): void =>{
    PointerMap.#Global.set(pointer[PTR.POINTER], pointer[PTR.INSTANCE]);
    PointerMap.#setLastPointer(pointer[PTR.POINTER]);
  }

  static clear(pointerMapInst): void{
    console.log('Clearing', pointerMapInst);
    if(pointerMapInst.inGlobal){
      if(pointerMapInst.isScoped){

        console.log("Deleting:", PointerMap.#Global.get(pointerMapInst), PointerMap.#Global.delete(pointerMapInst));
      }
      }else{
        for (const pointerId in pointerMapInst.pointers){
          PointerMap.#Global.delete(pointerId);
          if(PointerMap.getLastPointer() === pointerId) {
            PointerMap.#setLastPointer('null');
          }
        }

    }
    console.log("Clear complete ->",PointerMap.#Global);

  }



}
//
// let ptrMap = new PointerMap();
// let ptrMap2 = new PointerMap(true);
// let evH = ptrMap2.createInstance((ev?:string): void => {
//     console.log(ev,"Handled!");
// });
// let evH1 = ptrMap.createPointer(() => {});
