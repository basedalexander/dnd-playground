import { attribute2Selector } from './utils';
import { MOUSE_LEFT_CODE } from './constants';
import { DndService } from "./dnd-service";
import { Avatar } from "./avatar";
import { Container, IContainerSettings } from './container';

export class Manager {

    private dragging: boolean = false;

    private avatar: Avatar;
    private dragData: any;

    private sourceContainer: Container;
    private targetContainer: Container;

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
        private dndService: DndService
    ) {
        this.addListeners();
    }

    private addListeners(): void {
        document.addEventListener('mousedown', e => this.onMouseDown(e));
        document.addEventListener('mousemove', e => this.onMouseMove(e));
        document.addEventListener('mouseup', e => this.onMouseUp());
    }

    private isWithinContainer(element: Element): boolean {
        let cssSelector: string = attribute2Selector(this.containerAttribute)  + ' > *';
        let closestDraggableElement = element.closest(cssSelector);
        return !!closestDraggableElement;
    }

    private findClosestDraggableElement(element: Element): Element {
        let cssSelector: string = attribute2Selector(this.containerAttribute)  + ' > *';
        return element.closest(cssSelector);
    }

    private findContainerElement(element: Element): Element {
        let cssSelector: string = attribute2Selector(this.containerAttribute);
        return element.closest(cssSelector);
    }

    private findContainerByChildElement(element: Element): Container {
        let cssSelector: string = attribute2Selector(this.containerAttribute);
        let containerElement = element.closest(cssSelector);

        return this.containers.get(containerElement);
    }

    private onMouseDown(ev: MouseEvent) {
        if (ev.which === MOUSE_LEFT_CODE) {
            this.dndService.rememberDown(ev);
        }
    }

    private onMouseMove(event: MouseEvent) {
        if (this.dragging) {
            event.preventDefault();

            this.continueDragging(event);
            return;
        }

        if (!this.isMouseDown()) { return; }
        if (this.isUnintendedDrag(event)) { return; }

        let withinContainer: boolean = this.isWithinContainer(this.dndService.downElem);

        if (withinContainer) {
            event.preventDefault();

            this.startDragging();
            this.continueDragging(event);
        }
    }

    private startDragging(): void {
        this.dragging = true;

        // find container in which dragging occurs
        this.sourceContainer = this.findContainerByChildElement(this.dndService.downElem);
        let draggedElement = <HTMLElement> this.findClosestDraggableElement(this.dndService.downElem);
        this.sourceContainer.setDraggedElement(draggedElement);
        this.sourceContainer.showBeingDragged();

        this.avatar = new Avatar(this.dndService.downElem); // todo request from user
        this.dragData = {}; // todo request from user
    }

    private continueDragging(event: MouseEvent): void {
        this.avatar.move(event.pageX, event.pageY);
        
        let containerElement: Element = this.findContainerElement(<Element>event.target);
        
        if (containerElement) {
            this.targetContainer = this.containers.get(containerElement); // todo clean up previous target container
            let draggedElement = this.sourceContainer.getDraggedElement();
            this.targetContainer.showShadow(event, draggedElement);
        } else {
            this.onOverOutsideOfDropZone();
        }
    }

    private onOverOutsideOfDropZone(): void {
        this.sourceContainer.showDraggedElement();

        if (this.targetContainer) {
            this.targetContainer.removeShadow();
        }
    }

    private isUnintendedDrag(event: MouseEvent): boolean {
        const limit = 2;
        
        let xDiff = Math.abs(this.dndService.downX - event.pageX);
        let yDiff = Math.abs(this.dndService.downY - event.pageY);
        
        return (xDiff <= limit) && (yDiff <= limit);
    }

    private onMouseUp() {
        if (this.dragging) {
            this.dragging = false;

            this.avatar.kill();
            this.avatar = null;

            if (this.targetContainer) {
                this.targetContainer.removeShadow();
            }

            this.sourceContainer.recoverDraggedElement();
        }

        this.dndService.reset();
    }

    private isMouseDown(): boolean {
        return !!this.dndService.downElem;
    }
}