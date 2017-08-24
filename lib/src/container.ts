import { cloneElement, getInsertBeforeSibling } from './utils';

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
    private shadowElement: HTMLElement;
    private shadowNextSibling: HTMLElement;

    private sortable: boolean = true;
    private droppable: boolean = true;
    private copy: boolean = false;
    private containerAttribute: string;

    private revertOnSpill: boolean = true;

    constructor(element: Element, settings?: IContainerSettings) {
        this.applySettings(settings);
        this.containerElement = <HTMLElement> element;
        this.prepareContainerElement(this.containerElement);
    }

    // Dragged element related methods
    public getDraggedElement(): Element {
        return this.draggedElement;
    }
    public setDraggedElement(element: HTMLElement): void {
        this.draggedElement = element;
    }
    public removeDraggedElement(): void {
        this.draggedElement.parentNode.removeChild(this.draggedElement);
        this.draggedElement = null;
    }

    public showBeingDragged(): void {
        this.draggedElement.style.opacity = '0.5'; // todo add customisation
    }
    public showNotBeignDragged(): void {
        this.draggedElement.style.opacity = '';
    }
    public hideDraggedElement(): void {
        this.draggedElement.style.display = 'none';
    }
    public showDraggedElement(): void {
        this.draggedElement.style.display = '';
    }
    public recoverDraggedElement(): void {
        this.showDraggedElement();
        this.showNotBeignDragged();
    }

    // Shadow related methods
    public showShadow(event: any, draggedElement: Element): void {
        // case 1: we are over container element
        if (event.target === this.containerElement) {
            this.shadowElement = this.shadowElement || <HTMLElement> cloneElement(draggedElement);
            this.shadowNextSibling = null;
            this.containerElement.insertBefore(this.shadowElement, this.shadowNextSibling);
            return;
        }

        let draggableElement: Element = event.target.closest(`[${this.containerAttribute}] > *`);

        // case 2: we are over active shadow element
        if (draggableElement === this.shadowElement) {
            return;
        }

        // case 3: we are over dragged element
        if (draggableElement === draggedElement) {
            this.removeShadow();
            return;
        }

        // case 4: we are over one of the draggable elements of container
        let nextShadowSibling = getInsertBeforeSibling(draggableElement, event);
        this.containerElement.insertBefore(this.shadowElement, nextShadowSibling);
    }

    public removeShadow(): void {
        if (this.shadowElement && this.shadowElement.parentNode) {
            this.shadowElement.parentNode.removeChild(this.shadowElement);
            this.shadowNextSibling = null;
        }
    }

    // todo cleanup states
    public clear(): void {
        this.revertContainerElement();
        this.containerElement = null;
    }

    private prepareContainerElement(element: HTMLElement): void {
        element.setAttribute(this.containerAttribute, '');
    }
    private revertContainerElement(): void {
        this.containerElement.removeAttribute(this.containerAttribute);
    }

    private applySettings(settings: IContainerSettings): void {
        if (!settings) { return; }

        Object.keys(settings).forEach((key: string) => {
            this[key] = settings[key];
        });
    }
}