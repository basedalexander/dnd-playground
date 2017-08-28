export class Avatar {

    public posX: number;
    public posY: number;

    private elem: HTMLElement;

    constructor(elem: HTMLElement) {
        this.elem = <HTMLElement>elem.cloneNode(true);
        this.init();
    }

    private init(): void {
        document.body.appendChild(this.elem);
        this.elem.style.zIndex = '9999';
        this.elem.style.position = 'absolute';
        this.elem.style.pointerEvents = 'none';
    }

    public move(x: number, y: number): void {
        this.elem.style.left = x + 'px';
        this.elem.style.top = y + 'px';

        this.posX = x;
        this.posY = y;
    }

    public hide(): void {
        this.elem.hidden = true;
    }

    public show(): void {
        this.elem.hidden = false;
    }

    public kill(): void {
        this.elem.parentNode.removeChild(this.elem);
    }
}