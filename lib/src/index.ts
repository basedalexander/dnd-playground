import { Manager } from './manager';
import { DndService } from "./dnd-service";
import { dragZoneFactory } from "./drag-zone/drag-zone-factory";

let dndService = new DndService();

let manager = new Manager(
    dndService,
    dragZoneFactory
);