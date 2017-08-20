export let dndService = {
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