export class Ship {
    public x: number = 0;
    public y: number = 0;

    public size: number = 0;
    public hits: number = 0;

    public vertical: boolean = true;

    constructor(size: number) {
        this.size = size;
    }

    public sunk() {
        return this.hits >= this.size;
    }
}
