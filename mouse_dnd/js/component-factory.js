class ComponentFactory {
    constructor() {
        this.registry = new Map();
        this.COMPONENT_CLASS = 'component';
    }

    register(selector, factory) {
        this.registry.set(selector, factory)
    }

    create(selector) {
        let factory = this.registry.get(selector);
        let newElement =  factory();
        newElement.classList.add(this.COMPONENT_CLASS);
        return newElement;
    }
}

let plugins = [
    { selector: 'input', factory: () => document.createElement('input') },
    { selector: 'button', factory: () => document.createElement('button') },
    { selector: 'select', factory: () => document.createElement('select') },
    { selector: 'checkbox', factory: () => document.createElement('checkbox') },
    { selector: 'file', factory: () => document.createElement('input')},
]

let componentFactory = new ComponentFactory();
plugins.forEach(p => componentFactory.register(p.selector, p.factory));
