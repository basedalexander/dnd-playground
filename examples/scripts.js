dragarys.registerContainer(document.getElementById('container1'));
dragarys.registerContainer(document.getElementById('container2'));
dragarys.registerContainer(document.getElementById('container1-1'));
dragarys.registerContainer(document.getElementById('container1-1-1'));

document.addEventListener('dr-dragstart', e => {
    e.setDragData({
        selector: 'descriptor',
        descriptor: {}
    });
});

document.addEventListener('dr-dragover', e => {
    let draggable = e.target.closest('[dg-container] > *');

    if (draggable) {
        draggable.style.border = '3px solid pink';
        return;
    }

    let container = e.target.closest('[dg-container]');
    if (container) {
        container.style.border = '3px solid green';
    }
});

document.addEventListener('dr-dragleave', e => {
    let draggable = e.target.closest('[dg-container] > *');

    if (draggable) {
        draggable.style.border = '';
        return;
    }

    let container = e.target.closest('[dg-container]');
    if (container) {
        container.style.border = '';
    }
});

document.addEventListener('dr-drop', e => {
    e.preventDefault();

    console.log('data dropped ', e.getDragData());
    console.log('to parent ', e.targetElement);
    console.log('before ', e.beforeElement);
});
