import { BaseDragEvent } from './base-drag-event';

export class DragOverEvent extends BaseDragEvent  {
    constructor() {
        super('dr-dragover');
    }
}