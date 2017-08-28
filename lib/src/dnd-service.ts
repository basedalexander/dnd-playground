export class DndService {
    public downElem: HTMLElement;
    public downX: number;
    public downY: number;

    public rememberDown(ev: MouseEvent): void {
        this.downElem = <HTMLElement> ev.target;
        this.downX = ev.pageX;
        this.downY = ev.pageY;
    }

    public reset(): void {
        this.downElem = null;
        this.downX = null;
        this.downY = null;
    }
}