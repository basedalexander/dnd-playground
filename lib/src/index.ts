import { Manager } from './manager';
import { DndService } from "./dnd-service";

let dndService = new DndService();

let manager = new Manager(
    dndService
);


manager.registerContainer(document.getElementById('container1'));
manager.registerContainer(document.getElementById('container2'));