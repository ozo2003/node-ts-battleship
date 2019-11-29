import { IShip } from "./iship";

export interface IPlayer {
    id: string;
    shots: [number];
    grid: [number];
    ships: [IShip];
}
