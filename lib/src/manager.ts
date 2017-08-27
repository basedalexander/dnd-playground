import { attribute2Selector, findClosestDraggableElement, findContainerElement, isWithinContainer } from './utils';
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

    constructor(private dndService: DndService) {
        this.addListeners();
    }

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

    private addListeners(): void {
        document.addEventListener('mousedown', e => this.onMouseDown(e));
        document.addEventListener('mousemove', e => this.onMouseMove(e));
        document.addEventListener('mouseup', e => this.onMouseUp());
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

        let withinContainer: boolean = isWithinContainer(this.dndService.downElem);

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
        let draggedElement = <HTMLElement> findClosestDraggableElement(this.dndService.downElem);
        this.sourceContainer.setDraggedElement(draggedElement);
        this.sourceContainer.showBeingDragged();

        this.avatar = new Avatar(this.dndService.downElem); // todo request from user
        this.dragData = {}; // todo request from user
    }

    private continueDragging(event: MouseEvent): void {
        this.avatar.move(event.pageX, event.pageY);
        let targetContainer: Container = this.findContainerByChildElement(<Element>event.target);
        
        if (targetContainer) {
            this.dragMoveInsideContainer(targetContainer, event);
        } else {
            this.dragMoveOutsideContainer();
        }
    }
    private dragMoveInsideContainer(targetContainer: Container, event: MouseEvent): void {
        this.targetContainer = targetContainer;
        this.targetContainer.showShadow(event, this.sourceContainer);
    }

    private dragMoveOutsideContainer(): void {
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