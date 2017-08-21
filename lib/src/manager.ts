import { class2Selector } from './utils';
import { CLASSES, MOUSE_LEFT_CODE } from './constants';
import { DndService } from "./dnd-service";
import { IDragZoneFactory } from "./drag-zone/drag-zone-factory";
import { DragZone } from "./drag-zone/drag-zone";
import { Avatar } from "./avatar";

export class Manager {

    private dragging: boolean = false;
    private dragZone: DragZone;
    private avatar: Avatar;
    private dragData: any;

    constructor(
        private dndService: DndService,
        private dragZoneFactory: IDragZoneFactory
    ) {
        this.addListeners();
    }

    private addListeners(): void {
        document.addEventListener('mousedown', e => this.onMouseDown(e));
        document.addEventListener('mousemove', e => this.onMouseMove(e));
        document.addEventListener('mouseup', e => this.onMouseUp(e));
    }

    private findDraggableElement(element: Element): Element {
        let cssSelector: string = class2Selector(CLASSES.DRAGGABLE);
        return element.closest(cssSelector);
    }

    private onMouseDown(e: MouseEvent) {
        if (e.which !== MOUSE_LEFT_CODE) { return; }
        
        let draggableElem: Element = this.findDraggableElement(<Element>e.target);
    
        if (draggableElem) {
            e.stopPropagation();
            e.preventDefault();
        
            this.dndService.downElem = draggableElem;
            this.dndService.downX = e.pageX;
            this.dndService.downY = e.pageY;
        }
    }

    private onMouseMove(event: MouseEvent) {
        if (this.dragging) {
            this.continueDragging(event);
            return;
        }

        if (!this.dndService.downElem) { return; }

        if (this.isUnintendedDrag(event)) { return; }

        this.dragging = true;

        this.dragZone = this.dragZoneFactory.create(this.dndService.downElem);
        this.dragZone.showBeingDragged();

        // ask user for custom avatar
        this.avatar = new Avatar(this.dndService.downElem);
        // ask user for custom data
        this.dragData = {};

        this.avatar.move(event.pageX, event.pageY);

        // if dropZone already exists or doesn't
        let dropElem: Element = this.findDropElement(event.target);
        if (dropElem) {
            this.dropZone = new DropZone(dropElem);
        }

        // create dragzone
        // create avatar
        // create data
        // move avatar
        // look for dragzone
    }

    private isUnintendedDrag(event: MouseEvent): boolean {
        const limit = 2;
        
            let xDiff = Math.abs(this.dndService.downX - event.pageX);
            if (xDiff > 3) {
                return true;
            }
        
            let yDiff = Math.abs(this.dndService.downY - event.pageY);
            if (yDiff > 3) {
                return true;
            }
        
            return false;
    }

    private continueDragging(e: MouseEvent): void {
        // move avatar
        // look for drag zone
        // indicate drop zone if needed
    }

    private onMouseUp(event: MouseEvent) {
        if (this.dragZone) {
            // drop
            // remove avatar
            // remove drag zone
            // ...
        } 
        else {
            // dragzone rollback
            // dragavatar remove
        }
    }
}