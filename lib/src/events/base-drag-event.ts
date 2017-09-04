import { DragDataService, dragDataService } from '../drag-data.service';
import { AvatarService, avatarService } from '../avatar.service';

export class BaseDragEvent extends Event {

    private dragDataService: DragDataService;
    private avatarService: AvatarService;

    constructor(type: string) {
        super(type, {
            'bubbles': true,
            'cancelable': true
        });

        this.dragDataService = dragDataService;
        this.avatarService = avatarService;
    }

    public setDragData(data: any): void {
        this.dragDataService.setData(data);
    }
    public getDragData(): any {
        return this.dragDataService.getData();
    }

    public setAvatarElement(element: HTMLElement): void {
        this.avatarService.setElement(element);
    }
}