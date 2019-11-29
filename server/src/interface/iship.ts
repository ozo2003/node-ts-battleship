import { ICoordinate } from "./icoordinate";

export interface IShip {
    size: number;
    hits: number;

    vertical: boolean;

    coordinate: ICoordinate;
}
