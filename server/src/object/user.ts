import { Game } from "./game";
import { IUser } from "interface/iuser";

export class User implements IUser {
    public game: Game;
    public player: number;

    constructor(game: Game, player: number) {
        this.game = game;
        this.player = player;
    }
}
