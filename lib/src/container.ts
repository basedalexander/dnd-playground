import { cloneElement, getNextElementSibling } from './utils';

export interface IContainerSettings {
    sortable?: boolean;
    droppable?: boolean;
    copy?: boolean;
    rememberLastShadow?: boolean;
    containerAttribute?: string;
}

export class Container {
    public containerElement: HTMLElement;
    public draggedElement: HTMLElement;
    public draggedElementOld:HTMLElement;
    public shadowNextSibling: HTMLElement;

    private shadowElement: HTMLElement;
    private containerAttribute: string;

    constructor(element: HTMLElement, settings?: IContainerSettings) {
        this.applySettings(settings);
        this.containerElement = <HTMLElement> element;
        this.assignContainerAttribute(this.containerElement);
    }

    public getOriginalDraggedElement(): HTMLElement {
        return this.draggedElement;
    }
    // Dragged element related methods
    public getDraggedElement(): HTMLElement {
        return this.draggedElementOld;
    }
    public setDraggedElement(element: HTMLElement): void {
        this.draggedElement = element;
        this.draggedElementOld = cloneElement(this.draggedElement);
        this.draggedElementOld.removeAttribute(this.containerAttribute);

        this.styleAsBeingDragged(this.draggedElementOld);
    }
    public removeDraggedElement(): void {
        this.draggedElement.parentNode.removeChild(this.draggedElement);
        this.draggedElement = null;
    }

    private styleAsBeingDragged(element: HTMLElement): void {
        element.style.opacity = '0.5';
    }
    private styleAsNotBeingDragged(element: HTMLElement): void {
        element.style.opacity = '';
    }

    public showBeingDragged(): void {
        this.styleAsBeingDragged(this.draggedElement);
    }
    public showNotBeignDragged(): void {
        this.styleAsNotBeingDragged(this.draggedElement);
    }
    public hideDraggedElement(): void {
        this.draggedElement.style.display = 'none';
    }
    public showDraggedElement(): void {
        this.draggedElement.style.display = '';
    }

    public resetDraggedElement(): void {
        this.showDraggedElement();
        this.showNotBeignDragged();
    }

    public drop(element: HTMLElement): void {
        this.containerElement.insertBefore(element, this.shadowNextSibling);
    }

    // Shadow related methods
    public showShadow(event: any, draggedElement: HTMLElement): Promise<void> {

        if (event.target === this.containerElement) {
            // case 1: we are over container element.
            this.shadowNextSibling = this.findClosestShadowNextSibling(event);
            return this.insertShadow(draggedElement);
        }

        let draggableElement: HTMLElement = this.findDraggableElem(event.target);
        if (draggableElement === this.shadowElement) {
            // case 2: we are over a draggable element,
            // but it happens to be a shadow element.
            return Promise.resolve();
        }

        // case 3: we are over a draggable element.
        this.shadowNextSibling = getNextElementSibling(draggableElement, event);
        return this.insertShadow(draggedElement);
    }

    private findClosestShadowNextSibling(event: MouseEvent): HTMLElement {
        let startingYCoordinate: number = event.pageY;

        let shadowNextSibling: HTMLElement = null;

        while (true) {
            let element = <HTMLElement> document.elementFromPoint(event.pageX, startingYCoordinate);

            if (element === this.containerElement) {
                startingYCoordinate++;
                continue;
            }

            if (this.containerElement.contains(element)) {
                shadowNextSibling = element;
            }

            break;
        }

        return shadowNextSibling;
    }

    private insertShadow(draggedElement: HTMLElement): Promise<void> {
        this.shadowElement = this.shadowElement || cloneElement(draggedElement);
        this.containerElement.insertBefore(this.shadowElement, this.shadowNextSibling);

        return Promise.resolve();
    }

    private findDraggableElem(target: HTMLElement): HTMLElement {
        return <HTMLElement> target.closest(`[${this.containerAttribute}] > *`);
    }

    public removeShadow(): void {
        if (this.shadowElement && this.shadowElement.parentNode) {
            this.shadowElement.parentNode.removeChild(this.shadowElement);

            this.shadowElement = null;
            this.shadowNextSibling = null;
        }
    }

    public clear(): void {
        this.resetDraggedElement();
        this.removeShadow();
        this.removeContainerAttribute();
        this.containerElement = null;
    }

    private assignContainerAttribute(element: HTMLElement): void {
        element.setAttribute(this.containerAttribute, '');
    }
    private removeContainerAttribute(): void {
        this.containerElement.removeAttribute(this.containerAttribute);
    }

    private applySettings(settings: IContainerSettings): void {
        if (!settings) { return; }

        let keys: any = Object.keys(settings);

        keys.forEach((key: string) => {
            this[key] = settings[key];
        });
    }
}