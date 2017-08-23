export class DndService {
    public downElem: Element;
    public downX: number;
    public downY: number;

    public rememberDown(ev: MouseEvent): void {
        this.downElem = <Element> ev.target;
        this.downX = ev.pageX;
        this.downY = ev.pageY;
    }

    public reset(): void {
        this.downElem = null;
        this.downX = null;
        this.downY = null;
    }
}