class extendDrawBar {
  constructor(opt) {
    const ctrl = this;
    ctrl.draw = opt.draw;
    ctrl.buttons = opt.buttons || [];
    ctrl.onAddOrig = opt.draw.onAdd;
    ctrl.onRemoveOrig = opt.draw.onRemove;
    
    // Filter out the delete and marker buttons from the default controls
    ctrl.draw.options.controls.point = false; // Disable marker button
    ctrl.draw.options.controls.trash = false; // Disable delete button
  }
  
  onAdd(map) {
    const ctrl = this;
    ctrl.map = map;
    ctrl.elContainer = ctrl.onAddOrig(map);
    ctrl.buttons.forEach((b) => {
      ctrl.addButton(b);
    });
    return ctrl.elContainer;
  }
  
  onRemove(map) {
    const ctrl = this;
    ctrl.buttons.forEach((b) => {
      ctrl.removeButton(b);
    });
    if (ctrl.onRemoveOrig && map !== 'off') {
      ctrl.onRemoveOrig(map);
    }
  }
  
  addButton(opt) {
    const ctrl = this;
    const elButton = document.createElement('button');
    elButton.className = 'mapbox-gl-draw_ctrl-draw-btn';
    if (opt.classes instanceof Array) {
      opt.classes.forEach((c) => {
        elButton.classList.add(c);
      });
    }
    elButton.addEventListener(opt.on, opt.action);
    elButton.title = opt.title;
    ctrl.elContainer.appendChild(elButton);
    opt.elButton = elButton;
  }
  
  removeButton(opt) {
    opt.elButton.removeEventListener(opt.on, opt.action);
    opt.elButton.remove();
  }
}
export default extendDrawBar;