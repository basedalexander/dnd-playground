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
    e.preventDefault();

    dndService.dragElem = draggableElem;
    dndService.downX = e.pageX;
    dndService.downY = e.pageY;
});

document.addEventListener('mousemove', e => {
    if (!dndService.dragElem) { return; }

    if (!dndService.avatar) {
        if (!dragStarted(e.pageX, e.pageY)) { return; }

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

function moveAvatar(e) {
    let avatar = dndService.avatar.element;
    avatar.style.left = e.pageX + 'px';
    avatar.style.top = e.pageY + 'px';
}

function startDrag(e) {
    avatar = dndService.avatar.element;
    document.body.appendChild(avatar);
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';

}

function processMouseOver(e) {
    let underlyingDroppable = e.target.closest(string2CssSelector(CLASSES.DROPPABLE));

    if (!underlyingDroppable) {
        if (dndService.dropPreview.parentNode) {
            dndService.dropPreview = dndService.dropPreview.parentNode.removeChild(dndService.dropPreview);
        }

        return;
    }

    let insertBeforeElem = null;

    if (underlyingDroppable !== e.target) {
        let closestChild = e.target.closest('.droppable > *');
        insertBeforeElem = getInsertBeforeSibling(closestChild, e);
    }

    insertPreview(underlyingDroppable, insertBeforeElem);
}

function getInsertBeforeSibling(closestChild, e) {
    let rect = e.target.getBoundingClientRect();
    let mid = rect.top + ((rect.bottom - rect.top)/2);

    if (e.pageY < mid) {
        return target;
    } else {
        return target.nextSibling;
    }
}

function insertPreview(droppable, beforeElement) {
    droppable.insertBefore(dndService.dropPreview, beforeElement);
}

function dragStarted(x, y) {
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

    // dndService.avatar.hide();
    let droppable = findDroppable(e);
    // dndService.avatar.show();

    if (droppable) {
        droppable.appendChild(dndService.avatar.element);
        dndService.avatar.backupStyles();   
    } else {
        dndService.avatar.rollback();
    }
}

function findDroppable(e) {
    let element = document.elementFromPoint(e.clientX, e.clientY);
    return element.closest(string2CssSelector(CLASSES.DROPPABLE));
}
