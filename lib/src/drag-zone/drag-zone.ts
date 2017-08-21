export class DragZone {
    private draggedElement: HTMLElement;

    constructor(draggedElement: HTMLElement) {
        this.draggedElement = draggedElement;
    }

    public showBeingDragged(): void {
        this.draggedElement.style.opacity = '0.5'; // todo add customisation
    }
    public showNotBeignDragged(): void {
        this.draggedElement.style.opacity = '';
    }

    public hideDraggedElement(): void {
        this.draggedElement.hidden = true;
    }
    public showDraggedElement(): void {
        this.draggedElement.hidden = false;
    }

    public getDraggedElement(): Element {
        return this.draggedElement;
    }

    public rollback(): void {
        this.showDraggedElement();
        this.showNotBeignDragged();
    }

    public removeDraggedElement(): void {
        this.draggedElement.parentNode.removeChild(this.draggedElement);
    }
}