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
        return <Element> element.nextSibling;
    }
};