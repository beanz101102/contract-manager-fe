export const getTouchPosition = (touch: Touch) => ({
  clientX: touch.clientX,
  clientY: touch.clientY,
  movementX: 0,
  movementY: 0
});

export const preventScrollOnTouch = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    e.preventDefault();
  }
};
