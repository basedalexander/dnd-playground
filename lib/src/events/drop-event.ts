import { BaseDragEvent } from './base-drag-event';

export class DropEvent extends BaseDragEvent  {
    constructor() {
        super('dr-drop');
    }
}