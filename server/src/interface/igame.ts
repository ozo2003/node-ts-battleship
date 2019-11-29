import { IPlayer } from "./iplayer";

export interface IGame {
    id: number;
    current: number;
    winner: number | null;
    status: number;
    players: IPlayer[];
}