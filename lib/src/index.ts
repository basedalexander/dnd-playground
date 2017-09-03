import { Manager } from './manager';
import { DndService } from "./dnd-service";
import { avatarService } from './avatar.service';
import { dragDataService } from './drag-data.service'; // todo switch to di/singleton or some shit

let dndService = new DndService();

let manager = new Manager(
    dndService,
    avatarService,
    dragDataService
);

window['dragarys'] = manager;