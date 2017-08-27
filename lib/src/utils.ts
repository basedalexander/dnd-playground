let containerAttribute: string = 'dg-container'; // todo

export let class2Selector = function(str: string): string {
    return `.${str}`;
};

export let attribute2Selector = function(str: string): string {
    return `[${str}]`;
};

export let cloneElement = function(el: Element): Element {
    return <Element> el.cloneNode(true);
};

export let getInsertBeforeSibling = function(element: Element, event: MouseEvent): Element {
    let rect = element.getBoundingClientRect();
    let mid = rect.top + ((rect.bottom - rect.top)/2);

    if (event.pageY < mid) {
        return element;
    } else {
        return <Element> element.nextElementSibling;
    }
};

export function isWithinContainer(element: Element): boolean {
    let cssSelector: string = attribute2Selector(containerAttribute)  + ' > *';
    let closestDraggableElement = element.closest(cssSelector);
    return !!closestDraggableElement;
}

export function findClosestDraggableElement(element: Element): Element {
    let cssSelector: string = attribute2Selector(containerAttribute)  + ' > *';
    return element.closest(cssSelector);
}

export function findContainerElement(element: Element): Element {
    let cssSelector: string = attribute2Selector(containerAttribute);
    return element.closest(cssSelector);
}