import {
  Directive,
  ElementRef,
  OnInit,
  AfterViewInit,
  Renderer2,
  HostListener,
  HostBinding,
  Input,
  OnDestroy
} from '@angular/core';

import { PointerMapService } from "../../dev-ninja/services/pointer-map.service";
import { PointerMap } from "../../dev-ninja/pointerMap/pointerMap";


enum ToggleModes{
    AUTO= 'auto',
    OPEN= 'open',
    CLOSE= 'close'
}

enum EventListenerModes{
    ADD=  'add',
    REMOVE= 'remove'
}

enum OriginSides {
    LEFT= 'left',
    RIGHT= 'right'
}

@Directive({
    selector: '[commonDropdown]'
})
export class DropdownDirective implements OnInit, AfterViewInit, OnDestroy {
    dropdownElem: HTMLElement;
    dropdownContentElem: Element;
    dropdownOpen: boolean = false;
    @Input() DropdownContentElemRef: HTMLElement;
    @Input() DropdownOriginSide: string = OriginSides.LEFT;
    @Input() DropdownClass: string = 'dropdown';
    @Input() DropdownContentClass: string = 'dropdown__content';
    @Input() DropdownOpenClass: string = 'dropdown__content_--show';
    @Input() DropdownLeftOriginClass: string = 'dropdown__content--left';
    @Input() DropdownRightOriginClass: string= 'dropdown__content--right'

    domEventListenerHandlersMap: PointerMap;



    constructor(private dropdownElemRef: ElementRef, private renderer: Renderer2, private pointerMap: PointerMapService) {
        this.dropdownElem = this.dropdownElemRef.nativeElement
        this.domEventListenerHandlersMap = this.pointerMap.create(true);

    }

    ngOnInit(): void{
        this.renderer.addClass(this.dropdownElem, this.DropdownClass);
        this.renderer.addClass(this.DropdownContentElemRef, this.DropdownContentClass);

        if(this.DropdownOriginSide === OriginSides.RIGHT){
            this.renderer.addClass(this.DropdownContentElemRef, this.DropdownRightOriginClass);
        }
        else if(this.DropdownOriginSide === OriginSides.LEFT){
            this.renderer.addClass(this.dropdownElem, this.DropdownLeftOriginClass);
        }
        else{
            console.warn("----- Dropdown Directive Setup Failed -----");
            console.error('Error: DropdownDirective.DropdownOriginSide was not recognised.')
            console.info(
                `Current OriginSide Set:${this.DropdownOriginSide}`,
                '\nAllowed OriginSides:',
                {
                    [OriginSides.LEFT]: 'Will add the DropdownLeftOriginClass to DropdownContentElement. [DEFAULT (if not set)]',
                    [OriginSides.RIGHT]: 'Will add the DropdownRightOriginClass to DropdownContentElement.'
                }
            );
            console.warn("----- ----- -----");
        }
    }

    ngAfterViewInit(): void{
        this.dropdownContentElem= this.DropdownContentElemRef;
        this.dropdownOpen = this.dropdownContentElem.classList.contains(this.DropdownOpenClass);
        // console.log('The Elements', this.dropdownElem, this.dropdownContentElem);
    }

    ngOnDestroy(): void {
      PointerMapService.clear(this.domEventListenerHandlersMap);
    }

  @HostListener('click') onDropdownClick(event: Event) {
        // console.log("Binded:", this.DropdownContentElemRef);
        // console.log('dropdown clicked on', event, this.dropdownElem, this.dropdownContentElem);
        this.toggleDropdown();
        // console.log("EventListenerHandlers:", this.domEventListenerHandlers);
    }

    getContentElem(parent_elem: HTMLElement): Element{
        for (let i=0; i<parent_elem.children.length; i++){
            if(parent_elem.children[i].classList.contains(this.DropdownContentClass)){
                return parent_elem.children[i];
            }
        }
    }



    OutsideClickHandler(thisArg:this, mode=EventListenerModes.ADD, EID?:string){

        let EventID: string;
        let clickOutsidetoCloseHandler: any;
        if (EID){
          EventID = EID;
          clickOutsidetoCloseHandler = this.domEventListenerHandlersMap.getPointer(EID);
        }
        else{
          EventID = this.domEventListenerHandlersMap.createEmptyPointer();
          clickOutsidetoCloseHandler = this.domEventListenerHandlersMap.useEmptyPointer( EventID,
            (ev: Event) => {

              if(!thisArg.dropdownElem.contains(ev.target as HTMLElement) && !thisArg.dropdownContentElem.contains(ev.target as HTMLElement)){
                console.log(EventID,"-->clicked outside:", this.dropdownElem, this.dropdownContentElem, ev.target, thisArg.dropdownElem.contains(ev.target as HTMLElement), thisArg.dropdownContentElem.contains(ev.target as HTMLElement));
                thisArg.toggleDropdown(ToggleModes.CLOSE, EventID);
              }
            }
          );
        }

        console.log('OutsideClickHandler ->', mode, EventID, clickOutsidetoCloseHandler);

        if(mode === EventListenerModes.ADD){

            document.addEventListener('click', clickOutsidetoCloseHandler[1]);
        }
        else if (mode === EventListenerModes.REMOVE){
            document.removeEventListener('click', clickOutsidetoCloseHandler[1]);
        }
    }


    toggleDropdown(mode:string=ToggleModes.AUTO, EID?:string){
        if(mode !== ToggleModes.AUTO){
            if(mode === ToggleModes.CLOSE){
                //e.classList.remove('dropdown__content_--show');
                //document.removeEventListener('click', closeOnClickOutsideHandler);
                this.renderer.removeClass(this.dropdownContentElem, this.DropdownOpenClass);
                // console.log("Dropdown closed!", this.dropdownElem, this.dropdownContentElem, this.DropdownContentElemRef.classList.contains(this.DropdownOpenClass));
                this.OutsideClickHandler(this, EventListenerModes.REMOVE, EID);
            }
            else if(mode === ToggleModes.OPEN){
                //e.classList.add('dropdown__content_--show');
                //document.addEventListener('click', closeOnClickOutsideHandler);
                this.renderer.addClass(this.dropdownContentElem, this.DropdownOpenClass);
                // console.log("Dropdown Opened!", this.dropdownElem, this.dropdownContentElem, this.DropdownContentElemRef.classList.contains(this.DropdownOpenClass));
                this.OutsideClickHandler(this, EventListenerModes.ADD);
            }
            else{
                console.warn("----- Dropdown Toggle Failed -----");
                console.error('Error: DropdownDirective.toggleDropdown() was called with unrecognized mode.')
                console.info(
                    `Current Mode Passed:${mode}`,
                    '\nAllowed Modes:',
                    {
                        [ToggleModes.AUTO]: 'Automatically determines dropdown state and toggles the state. [DEFAULT (if not passed)]',
                        [ToggleModes.OPEN]: 'Sets Dropdown state to OPEN [--force].',
                        [ToggleModes.CLOSE]: 'Sets Dropdown state to CLOSE [--force].'
                    }
                );
                console.warn("----- ----- -----");
            }
        }
        else{
            // console.log("----- Dropdown Toggle -----");
            this.dropdownOpen = this.dropdownContentElem.classList.contains(this.DropdownOpenClass);
            // console.log("Dropdown open:", this.dropdownOpen);
            if(this.dropdownOpen){
                // console.log("Closing Dropdown!");
                this.toggleDropdown(ToggleModes.CLOSE);
            }
            else{
                // console.log("Opening Dropdown!");
                this.toggleDropdown(ToggleModes.OPEN);
            }

        }
        this.dropdownOpen = this.dropdownContentElem.classList.contains(this.DropdownOpenClass);
    }

    isNode(o: any): boolean{
        return (
            typeof Node === "object" ? o instanceof Node :
                o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
        );
    }

    //Returns true if it is a DOM element
    isElement(o: any): boolean{
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
        );
    }

}
