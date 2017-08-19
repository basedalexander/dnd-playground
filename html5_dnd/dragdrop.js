(function (window) {

    function dragrop(containers) {
        containers.forEach(c => attachDragListeners(c));
    }

    const DROP_CLASSES = {
        PREVIEW: 'drag-preview'
    }
    
    let dragService = {
        draggedNode: null,
        setDraggedNode(node) {
            this.draggedNode = node;
        },
        getDraggedNode() {
            return this.draggedNode;
        },
        isDragged() {
            return !!this.draggedNode;
        }
    }

    function attachDragListeners (container) {
        container.addEventListener('dragstart', containerDragStartHandler);
        container.addEventListener('dragover', containerDragOverHandler);
        container.addEventListener('dragend', containerDragEndHandler);
    }
    
    function containerDragStartHandler (ev) {
        ev.stopPropagation();
    
        dragService.setDraggedNode(ev.target);
        ev.target.classList.add(DROP_CLASSES.PREVIEW);
    }
    function containerDragOverHandler (ev) {
        ev.preventDefault();
        ev.stopPropagation();
    
        if (ev.target === ev.currentTarget) {
            return;
        }
    
        let draggedNode = dragService.getDraggedNode();
        
        let target = ev.target;
        if (target === draggedNode) {
            return;
        }

        let rect = target.getBoundingClientRect();
        let mid = rect.top + ((rect.bottom - rect.top)/2);
    
        if (ev.pageY < mid) {
            target.parentNode.insertBefore(draggedNode, target);
        } else {
            let nextSibling = target.nextSibling;
            nextSibling ? (target.parentNode.insertBefore(draggedNode, nextSibling)) : (target.parentNode.appendChild(draggedNode));
        }
    }
    
    function containerDragEndHandler (ev) {
        ev.preventDefault();
        ev.stopPropagation();
    
        dragService.setDraggedNode(null);
        ev.target.classList.remove(DROP_CLASSES.PREVIEW);
    }

    window.dragdrop = dragrop;
})(window)