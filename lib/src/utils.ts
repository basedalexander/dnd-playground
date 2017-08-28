export let attribute2Selector = function(str: string): string {
    return `[${str}]`;
};

export let cloneElement = function(el: HTMLElement): HTMLElement {
    return <HTMLElement> el.cloneNode(true);
};

export let getNextElementSibling = function(element: HTMLElement, event: MouseEvent): HTMLElement {
    let rect: ClientRect = element.getBoundingClientRect();
    let middlePoint: number = rect.top + ((rect.bottom - rect.top)/2);

    if (event.pageY < middlePoint) {
        return element;
    } else {
        return <HTMLElement> element.nextElementSibling;
    }
};