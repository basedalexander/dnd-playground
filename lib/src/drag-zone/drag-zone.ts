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
        console.log('hide dragged');
        this.draggedElement.style.display = 'none';
    }
    public showDraggedElement(): void {
        this.draggedElement.style.display = '';
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