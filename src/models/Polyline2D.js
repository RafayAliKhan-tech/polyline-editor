// //src/models/Polyline2D.js
import Vertex from "./Vertex";

class Polyline2D {
  constructor(id = null) {
    this.id = id || crypto.randomUUID(); // better unique id
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  addVertex(x, y, z = null, color = "#ffffff") {
    const v = new Vertex(x, y, z, color);

    if (!this.head) {
      this.head = this.tail = v;
    } else {
      this.tail.next = v;
      v.prev = this.tail;
      this.tail = v;
    }

    this.size++;
    return v;
  }

  insertAfter(vertex, x, y, z = null, color = "#ffffff") {
    if (!vertex) return null;

    const newV = new Vertex(x, y, z, color);

    const next = vertex.next;
    vertex.next = newV;
    newV.prev = vertex;

    if (next) {
      newV.next = next;
      next.prev = newV;
    } else {
      this.tail = newV;
    }

    this.size++;
    return newV;
  }

  getVertices() {
    const result = [];
    let current = this.head;

    while (current) {
      result.push(current);
      current = current.next;
    }

    return result;
  }

  findVertexById(id) {
    let current = this.head;

    while (current) {
      if (current.id === id) return current;
      current = current.next;
    }

    return null;
  }

  removeVertexById(id) {
    let current = this.head;

    while (current) {
      if (current.id === id) {
        if (this.head === this.tail) {
          // single node
          this.head = this.tail = null;
        } else if (current === this.head) {
          // remove head
          this.head = current.next;
          if (this.head) this.head.prev = null;
        } else if (current === this.tail) {
          // remove tail
          this.tail = current.prev;
          if (this.tail) this.tail.next = null;
        } else {
          // middle node
          current.prev.next = current.next;
          current.next.prev = current.prev;
        }

        this.size--;
        return true;
      }

      current = current.next;
    }

    return false;
  }

  clone() {
    const copy = new Polyline2D(this.id);
    let current = this.head;

    while (current) {
      const vCopy = copy.addVertex(
        current.x,
        current.y,
        current.z,
        current.color
      );

      vCopy.id = current.id; // preserve ID (IMPORTANT for history)

      current = current.next;
    }

    return copy;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
}

export default Polyline2D;