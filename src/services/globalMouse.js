class Mouse {
  constructor() {
    this.mouseX = 0;
    this.mouseY = 0;
    this.intersectionListeners = {};
    window.addEventListener('mousemove', this.updateMouse);
  }

  addIntersectionListener = (name, domRef, onEntry, onLeave) => {
    setTimeout(() => {
      this.intersectionListeners[name] = {
        intersects: (mouseX, mouseY) => {
          const rect = domRef.getBoundingClientRect();
          return (
            this.mouseX >= rect.left &&
            this.mouseX <= rect.right &&
            this.mouseY >= rect.top &&
            this.mouseY <= rect.bottom
          );
        },
        isInside: false,
        onEntry,
        onLeave
      };
    }, 500);
  };

  updateMouse = evt => {
    const { clientX, clientY } = evt;
    this.mouseX = clientX;
    this.mouseY = clientY;

    Object.keys(this.intersectionListeners).forEach(key => {
      const listener = this.intersectionListeners[key];

      if (listener.intersects() && !listener.isInside) {
        this.intersectionListeners[key].isInside = true;
        listener.onEntry();
      }

      if (!listener.intersects() && listener.isInside) {
        this.intersectionListeners[key].isInside = false;
        listener.onLeave();
      }
    });
  };
}

export default new Mouse();
