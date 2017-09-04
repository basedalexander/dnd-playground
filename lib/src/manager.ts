import * as utils from './utils';
import { MOUSE_LEFT_CODE } from './constants';
import { DndService } from "./dnd-service";
import { AvatarService } from "./avatar.service";
import { Container, IContainerSettings } from './container';
import { EventEmitter } from './event-emitter/event-emitter';
import { DragStartEvent } from './events/drag-start-event';
import { DragDataService } from './drag-data.service';
import { DropEvent } from './events/drop-event';
import { DragLeaveEvent } from './events/drag-leave-event';
import { DragOverEvent } from './events/drag-over-event';

export class Manager extends EventEmitter {
    private dragging: boolean = false;
    private sourceContainer: Container;
    private targetContainer: Container;
    private containers: Map<HTMLElement, Container> = new Map();
    private containerAttribute: string = 'dg-container';

    constructor(
        private dndService: DndService,
        private avatarService: AvatarService,
        private dragDataService: DragDataService
    ) {
        super();
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
        document.addEventListener('mouseout', e => this.onMouseLeave(e));
    }

    private findContainerByChildElement(element: HTMLElement): Container {
        let cssSelector: string = utils.attribute2Selector(this.containerAttribute);
        let containerElement = <HTMLElement> element.closest(cssSelector);

        return this.containers.get(containerElement);
    }

    private onMouseDown(event: MouseEvent) {
        if (event.which === MOUSE_LEFT_CODE) {
            this.dndService.rememberDown(event);
        }
    }

    private onMouseMove(event: MouseEvent) {
        if (this.dragging) {
            event.preventDefault();

            this.drag(event);
            return;
        }

        if (!this.isMouseDown()) { return; }
        if (this.isUnintendedDrag(event)) { return; }

        let withinContainer: boolean = this.isWithinContainer(this.dndService.downElem);

        if (withinContainer) {
            event.preventDefault();

            this.startDragging(event);
        }
    }

    private onMouseLeave(event: Event): void {
        if (this.dragging) {
            let leaveEvent: DragLeaveEvent = new DragLeaveEvent();
            event.target.dispatchEvent(leaveEvent);
        }
    }

    private onMouseUp() {
        if (this.dragging) {
            this.dragging = false;

            this.avatarService.reset();

            if (this.targetContainer) {

                let dropEvent: DropEvent = new DropEvent();
                dropEvent.targetElement = this.targetContainer.containerElement;
                dropEvent.beforeElement = this.targetContainer.shadowNextSibling;

                const canceled: boolean = !this.targetContainer.containerElement.dispatchEvent(dropEvent);

                this.sourceContainer.resetDraggedElement();

                if (!canceled) {
                    let draggedElement: HTMLElement = this.sourceContainer.getOriginalDraggedElement();
                    this.targetContainer.drop(draggedElement);
                }

                this.dragDataService.reset();
                this.targetContainer.removeShadow();
                this.targetContainer = null;
            } else {
                this.sourceContainer.resetDraggedElement();
            }
        }

        this.dndService.reset();
    }

    private startDragging(event: MouseEvent): void {
        let draggedElement = <HTMLElement> this.findClosestDraggableElement(this.dndService.downElem);

        let startDragEvent: Event = new DragStartEvent();

        const canceled: boolean = !draggedElement.dispatchEvent(startDragEvent);
        if (canceled) {
            this.dndService.reset();
            return;
        }

        this.dragging = true;

        // find container in which dragging occurs
        this.sourceContainer = this.findContainerByChildElement(this.dndService.downElem);
        this.sourceContainer.setDraggedElement(draggedElement);
        this.sourceContainer.showBeingDragged();

        if (!this.avatarService.active) {
            this.avatarService.setElement(this.dndService.downElem);// todo request from user
        }

        this.drag(event);
    }

    private drag(event: MouseEvent): void {
        this.avatarService.move(event.pageX, event.pageY);

        let dragOverEvent: DragOverEvent = new DragOverEvent();
        event.target.dispatchEvent(dragOverEvent);

        let targetContainer: Container = this.findContainerByChildElement(<HTMLElement>event.target);
        if (targetContainer) {
            this.dragMoveInsideContainer(targetContainer, event);
        } else {
            this.dragMoveOutsideContainer();
        }
    }

    private dragMoveInsideContainer(targetContainer: Container, event: MouseEvent): void {
        if (this.targetContainer && this.targetContainer !== targetContainer) {
            this.targetContainer.removeShadow();
        }

        this.targetContainer = targetContainer;
        this.targetContainer.showShadow(event, this.sourceContainer.getDraggedElement())
            .then(() => {
                this.sourceContainer.hideDraggedElement();
            })
    }

    private dragMoveOutsideContainer(): void {
        this.sourceContainer.showDraggedElement();

        if (this.targetContainer) {
            this.targetContainer.removeShadow();
            this.targetContainer = null;
        }
    }

    private isUnintendedDrag(event: MouseEvent): boolean {
        const limit = 2;
        
        let xDiff = Math.abs(this.dndService.downX - event.pageX);
        let yDiff = Math.abs(this.dndService.downY - event.pageY);
        
        return (xDiff <= limit) && (yDiff <= limit);
    }

    private isMouseDown(): boolean {
        return !!this.dndService.downElem;
    }

    private isWithinContainer(element: HTMLElement): boolean {
        return !!this.findClosestDraggableElement(element);
    }

    private findClosestDraggableElement(element: HTMLElement): HTMLElement {
        let cssSelector: string = utils.attribute2Selector(this.containerAttribute)  + ' > *';
        return <HTMLElement> element.closest(cssSelector);
    }
}