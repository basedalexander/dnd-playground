import { DragZone } from "./drag-zone";

export interface IDragZoneFactory {
    create(element: Element): DragZone;
}

export let dragZoneFactory = {
    create(element: Element): DragZone {
        return new DragZone(element);
    }
}