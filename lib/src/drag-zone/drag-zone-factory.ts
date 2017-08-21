import { DragZone } from "./drag-zone";

export interface IDragZoneFactory {
    create(element: HTMLElement): DragZone;
}

export let dragZoneFactory = {
    create(element: HTMLElement): DragZone {
        return new DragZone(element);
    }
}