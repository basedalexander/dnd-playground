const CLASSES = {
    DRAGGABLE: 'draggable',
    DROPPABLE: 'droppable',
    SELECTOR: 'dragselector'
};

const MOUSE_LEFT_CODE = 1;

let dndService = {
    avatar: null,
    dropPreview: null,
    dragElem: null,
    downX: null,
    downY: null,
    reset() {
        this.avatar = null;
        this.dragElem = null;
        this.downX = null;
        this.downY = null;
        this.dropPreview = null;
    }
};

document.addEventListener('mousedown', e => {
    if (e.which !== MOUSE_LEFT_CODE) { return; }

    let cssSelectorDraggable = string2CssSelector(CLASSES.DRAGGABLE);
    let draggableElem = e.target.closest(cssSelectorDraggable);

    if (!draggableElem) { return; }

    e.stopPropagation();

    dndService.dragElem = draggableElem;
    dndService.downX = e.pageX;
    dndService.downY = e.pageY;
});

document.addEventListener('mousemove', e => {
    if (!dndService.dragElem) { return; }

    if (!dndService.avatar) {
        if (!checkDragStarted(e.pageX, e.pageY)) { return; }

        dndService.avatar = new Avatar(dndService.dragElem);
        dndService.dropPreview = new DropPreview(dndService.dragElem);

        startDrag(e);
        moveAvatar(e);

        processMouseOver(e);
    } else {
        moveAvatar(e);
        processMouseOver(e);
    }

    e.preventDefault();
});

function startDrag(e) {
    dndService.avatar.init();
}
function moveAvatar(e) {
    dndService.avatar.move(e.pageX, e.pageY);
}

function processMouseOver(e) {
    if (e.target === dndService.dropPreview) {
        return;
    }
    let droppable = e.target.closest(string2CssSelector(CLASSES.DROPPABLE));

    if (!droppable) {
        removeDropPreview(); // TODO move to DropView class
        return;
    }

    let insertBeforeElem = null;
    if (droppable !== e.target) {
        let closestChild = e.target.closest('.droppable > *');
        insertBeforeElem = getInsertBeforeSibling(closestChild, e);
    }
    insertPreview(droppable, insertBeforeElem);
}

function getInsertBeforeSibling(element, e) {
    let rect = element.getBoundingClientRect();
    let mid = rect.top + ((rect.bottom - rect.top)/2);

    if (e.pageY < mid) {
        return element;
    } else {
        return element.nextSibling;
    }
}

function insertPreview(droppable, beforeElement) {
    droppable.insertBefore(dndService.dropPreview, beforeElement);
}

function checkDragStarted(x, y) {
    const limit = 3;

    let xDiff = Math.abs(dndService.downX - x);
    if (xDiff > 3) {
        return true;
    }

    let yDiff = Math.abs(dndService.downY - y);
    if (yDiff > 3) {
        return true;
    }

    return false;
}

document.addEventListener('mouseup', e => {
    if (dndService.avatar) {
        finishDrag(e);
    }
    dndService.reset();
});

function finishDrag(e) {
    let droppable = findDroppable(e);

    if (droppable) {
        let insertBeforeElem = null;

        if (droppable !== e.target) {
            let closestChild = e.target.closest('.droppable > *');
            insertBeforeElem = getInsertBeforeSibling(closestChild, e);
        }
    
        droppable.insertBefore(dndService.avatar.element, insertBeforeElem);
        dndService.avatar.backupStyles(); // TODO don't use original draggable element for avatar
    } else {
        dndService.avatar.rollback();
    }

    removeDropPreview();
}

function removeDropPreview() {
    if (dndService.dropPreview.parentNode) {
        dndService.dropPreview = dndService.dropPreview.parentNode.removeChild(dndService.dropPreview);
    }
}
function findDroppable(e) {
    let element = document.elementFromPoint(e.clientX, e.clientY);
    return element.closest(string2CssSelector(CLASSES.DROPPABLE));
}
