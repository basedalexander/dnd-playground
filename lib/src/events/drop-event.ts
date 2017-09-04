import { BaseDragEvent } from './base-drag-event';

export class DropEvent extends BaseDragEvent  {
    public targetElement: HTMLElement;
    public beforeElement: HTMLElement;

    constructor() {
        super('dr-drop');
    }
}