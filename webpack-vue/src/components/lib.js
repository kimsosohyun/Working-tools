export function setCursorPos(ctrl, pos) {
  var range;

  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  } else if (ctrl.createTextRange) {
    range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd("character", pos);
    range.moveStart("character", pos);
    range.select();
  }
}

export function transformWidth(val) {
  if (val === "" || val === undefined || val === null) {
    return;
  }
  if (typeof val === "string") {
    if (/^\d*$/.test(val)) {
      //'70'变为'70px'
      return `${val}px`;
    }
    return val; //'70%'
  }

  return `${val}px`; // 70变为'70px'
}