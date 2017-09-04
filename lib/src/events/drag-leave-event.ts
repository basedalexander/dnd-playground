import { BaseDragEvent } from './base-drag-event';

export class DragLeaveEvent extends BaseDragEvent  {
    constructor() {
        super('dr-dragleave');
    }
}