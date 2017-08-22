export class DropZone {
    
    private containerElement: Element;
    private shadowElement: Element;
    private shadowNextSibling: Element;

    constructor(private containerElem: Element) {
        this.shadowElement = null;
        this.shadowNextSibling = null;
    }

    createShadow(fromElem: Element): HTMLElement {
        let shadow = <HTMLElement> this.cloneElement(fromElem);
        shadow.style.opacity = '0.2';
        return shadow;
    }

    showShadow(event: any, forElement: Element): void {
        this.shadowElement = this.createShadow(forElement);
        
        if (this.containerElement !== event.target) {
            let closestChild = event.target.closest('.droppable > *');
            this.shadowNextSibling = this.getInsertBeforeSibling(closestChild, event);
        }

        this.containerElem.insertBefore(this.shadowElement, this.shadowNextSibling);
    }

    private getInsertBeforeSibling(element: Element, event: MouseEvent): Element {
        let rect = element.getBoundingClientRect();
        let mid = rect.top + ((rect.bottom - rect.top)/2);
    
        if (event.pageY < mid) {
            return element;
        } else {
            return <Element> element.nextSibling;
        }
    }

    hideShadow(): void {
        this.shadowElement.parentElement.removeChild(this.shadowElement);
        this.shadowElement = null;
        this.shadowNextSibling = null;
    }

    drop(elem: Element): void {
        this.containerElem.insertBefore(elem, this.shadowNextSibling);
        this.hideShadow();
    }

    kill(): void {
        console.log('dropzone kill needed implementation');
    }

    private cloneElement(el: Element): Element {
        return <Element> el.cloneNode();
    }
}