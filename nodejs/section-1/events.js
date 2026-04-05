class EventEmitter {
  listerners = {};

  addEvent(eventName, fn) {
    this.listerners[eventName] = this.listerners[eventName] || [];
    this.listerners[eventName].push(fn);
  }

  on(eventName, fn) {
    this.addEvent(eventName, fn);
    return true;
  }

  removeEvent(eventName) {
    delete this.listerners[eventName];
  }
  off(eventName, fn) {
    if (!this.listerners[eventName]) return;
    this.listerners[eventName] = this.listerners[eventName].filter(
      (listener) => listener !== fn
    );
  }

  emit(eventName, ...args) {
    if (!this.listerners[eventName]) return false;
    const listerners = this.listerners[eventName];
    for (let i = 0; i < listerners.length; i++) {
      const fn = listerners[i];
      fn(...args);
    }
    return true;
  }
}
