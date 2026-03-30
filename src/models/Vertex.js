//src/models/Vertex.js
class Vertex {
  constructor(x, y, z = null, color = "#ffffff") {
    this.id = crypto.randomUUID(); // FIXED
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;

    this.prev = null;
    this.next = null;
  }

  clone() {
    const copy = new Vertex(this.x, this.y, this.z, this.color);
    copy.id = this.id; // preserve ID
    return copy;
  }
}

export default Vertex;