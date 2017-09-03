import { BaseDragEvent } from './base-drag-event';

export class DragMoveEvent extends BaseDragEvent  {
    constructor() {
        super('dr-dragmove');
    }
}