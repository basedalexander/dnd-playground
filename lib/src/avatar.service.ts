export class AvatarService {

    public posX: number;
    public posY: number;

    private elem: HTMLElement;

    public setElement(element: HTMLElement): void {
        if (this.elem) {
            this.reset();
        }

        this.elem = <HTMLElement>element.cloneNode(true);

        document.body.appendChild(this.elem);

        delete this.elem.id;
        this.elem.style.zIndex = '9999';
        this.elem.style.position = 'absolute';
        this.elem.style.pointerEvents = 'none';
    }

    public get active(): boolean {
        return !!this.elem;
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

    public reset(): void {
        this.elem.parentNode.removeChild(this.elem);
        this.elem = null;
    }
}

export let avatarService: AvatarService = new AvatarService();