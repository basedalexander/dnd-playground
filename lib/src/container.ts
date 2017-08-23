export interface IContainerSettings {
    sortable?: boolean;
    droppable?: boolean;
    copy?: boolean;
    rememberLastShadow?: boolean;
    containerAttribute?: string;
}

export class Container {
    private element: HTMLElement;
    private sortable: boolean = true;
    private droppable: boolean = true;
    private copy: boolean = false;
    private rememberLastShadow: boolean = false;
    private containerAttribute: string;

    constructor(private element: Element, settings?: IContainerSettings) {
        this.applySettings(settings);
        this.prepareElement(this.element);
    }

    // todo cleanup states
    public clear(): void {
        this.backupElement();
        this.element = null;
    }

    private prepareElement(element: HTMLElement): void {
        element.setAttribute(this.containerAttribute, '');
    }
    private backupElement(): void {
        this.element.removeAttribute(this.containerAttribute);
    }

    private applySettings(settings: IContainerSettings): void {
        if (!settings) { return; }

        Object.keys(settings).forEach((key: string) => {
            if (this.hasOwnProperty(key)) {
                this[key] = settings[key];
            }
        });
    }
}