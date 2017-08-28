import { Manager } from './manager';
import { DndService } from "./dnd-service";

let dndService = new DndService();

let manager = new Manager(
    dndService
);

window.dragarys = manager;