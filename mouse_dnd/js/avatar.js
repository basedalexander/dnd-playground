
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

    init() {
        document.body.appendChild(this.element);
        this.element.style.zIndex = 9999;
        this.element.style.position = 'absolute';
    }

    move(x, y) {
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
    }
    
    setAdditionalStyles() {
        this.element.style.pointerEvents = 'none'; // >=IE10
    }
    removeAdditionalStyles() {
        this.element.style.pointerEvents = '';
    }

    rollback() {
        let initialState = this.initialState;
        initialState.parentNode.insertBefore(this.element, initialState.nextSibling);
        this.backupStyles();
    }

    backupStyles() {
        let element = this.element;
        let initialState = this.initialState;

        element.style.position = initialState.position;
        element.style.left = initialState.left;
        element.style.top = initialState.top;
        element.style.zIndex = initialState.zIndex;

        this.removeAdditionalStyles();
    }
}

class DropPreview {
    constructor(element) {
        let clone = element.cloneNode(true);
        clone.style.opacity = 0.5;
        clone.style.pointerEvents = '';
        return clone;
    }
}