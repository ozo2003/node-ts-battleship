"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ship {
    constructor(size) {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.hits = 0;
        this.vertical = true;
        this.size = size;
    }
    sunk() {
        return this.hits >= this.size;
    }
}
exports.Ship = Ship;
