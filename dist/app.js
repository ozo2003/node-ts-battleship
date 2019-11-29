"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class app {
    constructor() {
        this.app = express_1.default();
        this.app.use(express_1.default.static(__dirname + "/../web"));
    }
}
exports.default = app;
//# sourceMappingURL=app.js.map