import { BaseDragEvent } from './base-drag-event';

export class DragStartEvent extends BaseDragEvent  {
    constructor() {
        super('dr-dragstart');
    }
}