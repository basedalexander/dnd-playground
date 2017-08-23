import { attribute2Selector, class2Selector } from './utils';
import { CLASSES, MOUSE_LEFT_CODE } from './constants';
import { DndService } from "./dnd-service";
import { IDragZoneFactory } from "./drag-zone/drag-zone-factory";
import { DragZone } from "./drag-zone/drag-zone";
import { Avatar } from "./avatar";
import { DropZone } from "./drop-zone";
import { Container, IContainerSettings } from './container';

export class Manager {

    private dragging: boolean = false;

    private avatar: Avatar;
    private dragData: any;

    private dragZone: Container;
    private dropZone: Container;

    private containers: Map<Element, Container> = new Map();

    private containerAttribute: string = 'dg-container';

    public registerContainer(containerElement: HTMLElement, settings?: IContainerSettings): void {
        if (this.containers.has(containerElement)) {
            throw new Error(`Container ${containerElement.tagName} already exists`);
        }
        settings = settings ? settings : {};
        settings.containerAttribute = this.containerAttribute;

        this.containers.set(containerElement, new Container(containerElement, settings));
    }
    public unregisterContainer(containerElement: HTMLElement): void {
        let container: Container = this.containers.get(containerElement);

        if (container) {
            container.clear();
            this.containers.delete(containerElement);
        }
    }

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
        let cssSelector: string = attribute2Selector(this.containerAttribute + ' < *');
        return element.closest(cssSelector);
    }

    private isDraggable(element: Element): boolean {
        let cssSelector: string = attribute2Selector(this.containerAttribute + ' < *');
        let closestDraggableElement = element.closest(cssSelector);
        return !!closestDraggableElement;
    }

    private onMouseDown(ev: MouseEvent) {
        if (ev.which !== MOUSE_LEFT_CODE) { return; }

        this.dndService.rememberDown(ev);
    }

    private onMouseMove(event: MouseEvent) {
        if (this.dragging) {
            this.continueDragging(event);
            return;
        }

        if (!this.isMouseDown()) { return; }
        if (this.isUnintendedDrag(event)) { return; }

        let draggable: boolean = this.isDraggable(this.dndService.downElem);

        if (draggable) {
            event.preventDefault();

            this.startDragging();
            this.continueDragging(event);
        }
    }

        startDragging(): void {
        this.dragging = true;

        // find container in which dragging occurs
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

    private isMouseDown(): boolean {
        return !!this.dndService.downElem;
    }
}