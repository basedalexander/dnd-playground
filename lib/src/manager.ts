import { string2CssSelector } from './utils';
import { CLASSES, MOUSE_LEFT_CODE } from './constants';

export class Manager {
    private self: Manager;

    constructor(private dndSerice: DndService) {
        this.self = this;
        this.addListeners();
    }

    private addListeners(): void {
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    private onMouseDown(e: MouseEvent) {
        if (e.which !== MOUSE_LEFT_CODE) { return; }
        
            let cssSelectorDraggable = string2CssSelector(CLASSES.DRAGGABLE);
            let draggableElem = e.target.closest(cssSelectorDraggable);
        
            if (!draggableElem) { return; }
        
            e.stopPropagation();
            e.preventDefault();
        
            self.dndService.dragElem = draggableElem;
            self.dndService.downX = e.pageX;
            self.dndService.downY = e.pageY;
    }

    private onMouseMove(event: MouseEvent) {
        
    }

    private onMouseUp(event: MouseEvent) {
        
    }
}