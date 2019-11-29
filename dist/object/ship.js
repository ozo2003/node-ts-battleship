"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coordinate_1 = require("./coordinate");
class Ship {
    constructor(size) {
        this.size = 0;
        this.hits = 0;
        this.vertical = true;
        this.size = size;
        this.coordinate = new coordinate_1.Coordinate(0, 0);
    }
    sunk() {
        return this.hits >= this.size;
    }
}
exports.Ship = Ship;
//# sourceMappingURL=ship.js.map