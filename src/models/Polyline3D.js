//src/models/Polyline3D.js
import Vertex from "./Vertex";

class Polyline3D {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    // ➕ Add vertex (with Z)
    addVertex(x, y, z = 0) {
        const newVertex = new Vertex(x, y, z);

        if (!this.head) {
            this.head = this.tail = newVertex;
        } else {
            this.tail.next = newVertex;
            newVertex.prev = this.tail;
            this.tail = newVertex;
        }

        this.size++;
    }

    // 🔁 Get all vertices
    getVertices() {
        const vertices = [];
        let current = this.head;

        while (current) {
            vertices.push(current);
            current = current.next;
        }

        return vertices;
    }

    // ❌ Remove vertex
    removeVertex(vertex) {
        if (!vertex) return;

        if (this.head === this.tail) {
            this.head = this.tail = null;
        }

        else if (vertex === this.head) {
            this.head = this.head.next;
            if (this.head) this.head.prev = null;
        }

        else if (vertex === this.tail) {
            this.tail = this.tail.prev;
            if (this.tail) this.tail.next = null;
        }

        else {
            vertex.prev.next = vertex.next;
            vertex.next.prev = vertex.prev;
        }

        this.size--;
    }

    // 🔍 Empty check
    isEmpty() {
        return this.size === 0;
    }

    // 🧹 Clear
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    insertAfter(vertex, x, y, z = null) {
        if (!vertex) return;

        const newVertex = new Vertex(x, y, z);

        const nextNode = vertex.next;

        vertex.next = newVertex;
        newVertex.prev = vertex;

        if (nextNode) {
            newVertex.next = nextNode;
            nextNode.prev = newVertex;
        } else {
            this.tail = newVertex;
        }

        this.size++;
    }
}

export default Polyline3D;