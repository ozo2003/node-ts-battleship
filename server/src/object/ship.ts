import { IShip } from "../interface/iship";
import { ICoordinate } from "interface/icoordinate";
import { Coordinate } from "./coordinate";

export class Ship implements IShip {
    public size: number = 0;
    public hits: number = 0;

    public vertical: boolean = true;

    public coordinate: ICoordinate;

    constructor(size: number) {
        this.size = size;
        this.coordinate = new Coordinate(0, 0);
    }

    public sunk() {
        return this.hits >= this.size;
    }
}
