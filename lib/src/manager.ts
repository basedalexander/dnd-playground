import { class2Selector } from './utils';
import { CLASSES, MOUSE_LEFT_CODE } from './constants';
import { DndService } from "./dnd-service";
import { IDragZoneFactory } from "./drag-zone/drag-zone-factory";
import { DragZone } from "./drag-zone/drag-zone";
import { Avatar } from "./avatar";
import { DropZone } from "./drop-zone";

export class Manager {

    private dragging: boolean = false;
    private dragZone: DragZone;
    private avatar: Avatar;
    private dragData: any;
    private dropZone: DropZone;

    // settings
    private rememberLastDropShadow: boolean = false;

    constructor(
        private dndService: DndService,
        private dragZoneFactory: IDragZoneFactory
    ) {
        this.addListeners();
    }

    private addListeners(): void {
        document.addEventListener('mousedown', e => this.onMouseDown(e));
        document.addEventListener('mousemove', e => this.onMouseMove(e));
        document.addEventListener('mouseup', e => this.onMouseUp());
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

        this.startDragging();
        this.continueDragging(event);
    }

    startDragging(): void {
        this.dragging = true;
        this.dragZone = this.dragZoneFactory.create(this.dndService.downElem);
        this.avatar = new Avatar(this.dndService.downElem); // todo request from user
        this.dragData = {}; // todo request from user
    }

    private continueDragging(event: MouseEvent): void {
        this.avatar.move(event.pageX, event.pageY);
        
        let dropElem: Element = this.findDropElement(<Element>event.target);
        
        if (dropElem) {
            this.dropZone = this.dropZone || new DropZone(dropElem);
            this.dropZone.showShadow(event, this.dragZone.getDraggedElement());
            this.dragZone.hideDraggedElement();
        } else {
            this.onOverOutsideOfDropZone();
        }
    }

    // TODO: Complex logic, refactoring
    private onOverOutsideOfDropZone(): void {
        if (this.rememberLastDropShadow) {
            if (!this.dropZone) {
                this.dragZone.showDraggedElement();
            }
            // do nothing
        } else {
            if (this.dropZone) {
                this.dropZone.kill();
                this.dropZone = null;
            }
            this.dragZone.showDraggedElement();
        }
    }

    private findDropElement(startFromElem: Element): Element {
        return startFromElem.closest('.droppable');
    }

    private isUnintendedDrag(event: MouseEvent): boolean {
        const limit = 2;
        
        let xDiff = Math.abs(this.dndService.downX - event.pageX);
        let yDiff = Math.abs(this.dndService.downY - event.pageY);
        
        return (xDiff <= limit) && (yDiff <= limit);
    }

    private onMouseUp() {
        if (this.dragZone) {
            if (this.dropZone) {
                this.dropZone.drop(this.dragZone.getDraggedElement());
                this.dropZone = null;

                this.dragZone.kill();
            } else {
                this.dragZone.rollback();
            }

            this.dragZone = null;

            this.avatar.kill();
            this.avatar = null;

            this.dragging = false;
        }

        this.dndService.reset();
    }
}