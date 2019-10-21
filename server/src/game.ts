import * as config from "./config";
import {Player} from "./player";

export class Game {
    public id: number;
    public current: number;
    public winner: any;
    public status: number;
    public players: any;

    constructor(id: number, p1: any, p2: any){
        this.id = id;
        this.current = Math.floor(Math.random() * 2);
        this.winner = null;
        this.status = config.status.progress;
        this.players = [new Player(p1), new Player(p2)];
    }

    getPlayer(player: any) {
        return this.players[player].id;
    }

    getWinner() {
        if (this.winner === null) {
            return null;
        }
        return this.players[this.winner].id;
    }

    getLoser() {
        if (this.winner === null) {
            return null;
        }

        return this.players[this.winner === config.players.player ? config.players.opponent : config.players.player].id;
    }

    switch() {
        this.current = this.current === config.players.player ? config.players.opponent : config.players.player;
    }

    abort(player: any) {
        this.status = config.status.gameover;
        this.winner = player === config.players.player ? config.players.opponent : config.players.player;
    }

    shoot(position: any) {
        let opponent = this.current === config.players.player ? config.players.opponent : config.players.player,
            index = position.y * config.grid.rows + position.x;

        if (this.players[opponent].shots[index] === 0 && this.status === config.status.progress) {
            if (!this.players[opponent].shoot(index)) {
                this.switch();
            }
            if (this.players[opponent].remaining() <= 0) {
                this.status = config.status.gameover;
                this.winner = opponent === config.players.player ? config.players.opponent : config.players.player;
            }
            return true;
        }
        return false;
    }

    mark(index: number) {
        let opponent = this.current === config.players.player ? config.players.opponent : config.players.player;
        this.players[opponent].shots[index] = 1;

        return true;
    }

    state(player: any, owner: any) {
        return {
            turn: this.current === player,
            index: player === owner ? config.players.player : config.players.opponent,
            grid: this.getGrid(owner, player !== owner)
        };
    }

    getGrid(player: any, hide: boolean) {
        return {
            shots: this.players[player].shots,
            ships: hide ? this.players[player].getSunk() : this.players[player].ships
        };
    }
}