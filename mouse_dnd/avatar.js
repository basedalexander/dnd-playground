
class Avatar {
    constructor(element) {
        this.element = element;
        this.initialState = this.createInitialState(element);
        this.setAdditionalStyles();
    }

    createInitialState(el) {
        return {
            parentNode: el.parentNode,
            nextSibling: el.nextSibling,
            position: el.position || '',
            left: el.left || '',
            top: el.top || '',
            zIndex: el.zIndex || ''
        }
    }
    
    setAdditionalStyles() {
        // >=IE10
        this.element.style.pointerEvents = 'none';
    }
    removeAdditionalStyles() {
        this.element.style.pointerEvents = '';
    }

    hide() {
        this.element.style.display = 'none';
    }
    show() {
        this.element.style.display = '';
    }

    rollback() {
        let initialState = this.initialState;
        initialState.parentNode.insertBefore(avatar, initialState.nextSibling);
        this.backupStyles();
        this.removeAdditionalStyles();

    }

    backupStyles() {
        let element = this.element;
        let initialState = this.initialState;
        element.style.position = initialState.position;
        element.style.left = initialState.left;
        element.style.top = initialState.top;
        element.style.zIndex = initialState.zIndex;
    }
}

class DropPreview {
    constructor(element) {
        return element.cloneNode(true);
    }
}