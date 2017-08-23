export class DragZone {
    private draggedElement: HTMLElement;

    constructor(draggedElement: Element) {
        this.draggedElement = <HTMLElement>draggedElement;
        this.showBeingDragged();
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

    public getDraggedElement(): Element {
        return this.draggedElement;
    }

    public kill(): void {
        this.removeDraggedElement();
    }

    public rollback(): void {
        this.showDraggedElement();
        this.showNotBeignDragged();
        this.draggedElement = null;
    }

    public removeDraggedElement(): void {
        this.draggedElement.parentNode.removeChild(this.draggedElement);
        this.draggedElement = null;
    }
}