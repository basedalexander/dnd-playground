export class DndService {
    downElem: Element;
    downX: number;
    downY: number;

    public reset(): void {
        this.downElem = null;
        this.downX = null;
        this.downY = null;
    }
}