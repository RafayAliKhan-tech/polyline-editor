// // // src/models/CADHistory.js
class CADHistory {
  constructor(limit = 50) {
    this.undoStack = [];
    this.redoStack = [];
    this.limit = limit;
  }

  // Save state (deep copy via clone)
  push(state) {
    const snapshot = state.map((p) => p.clone());

    this.undoStack.push(snapshot);

    // limit maintain karo
    if (this.undoStack.length > this.limit) {
      this.undoStack.shift();
    }

    // new action ke baad redo clear hota hai
    this.redoStack = [];
  }

  // Undo
  undo(currentState) {
    if (this.undoStack.length === 0) return currentState;

    // current state ko redo stack mein daalo (deep copy)
    const snapshot = currentState.map((p) => p.clone());
    this.redoStack.push(snapshot);

    // last undo state return karo
    return this.undoStack.pop();
  }

  // Redo
  redo(currentState) {
    if (this.redoStack.length === 0) return currentState;

    // current state ko undo stack mein daalo (deep copy)
    const snapshot = currentState.map((p) => p.clone());
    this.undoStack.push(snapshot);

    // redo state return karo
    return this.redoStack.pop();
  }

  // Clear history
  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}

export default CADHistory;