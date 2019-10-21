import * as express from "express";
const app = express();
import * as config from "./config";
import {Game} from "./game";
import {Position} from "./objects/position";

let port: number = 7666;
app.set("port", port);

let users: any = {};
let counter: number = 1;

const http = require("http").Server(app);
app.use(express.static(__dirname + "/../web"));

http.listen(port, function() {
    console.log("listening on *:" + port);
});

let io = require("socket.io")(http);

io.on("connection", function(socket: any) {
    console.log(new Date().toISOString() + " ID " + socket.id + " connected.");

    users[socket.id] = {
        in: null,
        player: null
    };

    socket.join("waiting");

    socket.on("shot", function(position: object) {
        let pos = new Position(position);
        let game = users[socket.id].in,
            opponent;

        if (game !== null) {
            if (game.current === users[socket.id].player) {
                opponent = game.current === config.players.player ? config.players.opponent : config.players.player;

                if (game.shoot(pos)) {
                    check(game);

                    io.to(socket.id).emit("update", game.state(users[socket.id].player, opponent));
                    io.to(game.getPlayer(opponent)).emit("update", game.state(opponent, opponent));
                }
            }
        }
    });

    socket.on("mark", function(index: number) {
        let game = users[socket.id].in,
            opponent;

        if (game !== null) {
            if (game.current === users[socket.id].player) {
                opponent = game.current === config.players.player ? config.players.opponent : config.players.player;

                if (game.mark(index)) {
                    io.to(socket.id).emit("update", game.state(users[socket.id].player, opponent));
                    io.to(game.getPlayer(opponent)).emit("update", game.state(opponent, opponent));
                }
            }
        }
    });

    socket.on("leave", function() {
        if (users[socket.id].in !== null) {
            leave(socket);

            socket.join("waiting");
            join();
        }
    });

    socket.on("disconnect", function() {
        console.log(new Date().toISOString() + " ID " + socket.id + " disconnected.");

        leave(socket);

        delete users[socket.id];
    });

    join();
});

function join() {
    let players = clients("waiting");

    if (players.length >= 2) {
        let game = new Game(counter++, players[config.players.player].id, players[config.players.opponent].id);

        players[config.players.player].leave("waiting");
        players[config.players.opponent].leave("waiting");
        players[config.players.player].join("game" + game.id);
        players[config.players.opponent].join("game" + game.id);

        users[players[config.players.player].id].player = 0;
        users[players[config.players.opponent].id].player = 1;
        users[players[config.players.player].id].in = game;
        users[players[config.players.opponent].id].in = game;

        io.to("game" + game.id).emit("join", game.id);

        io.to(players[config.players.player].id).emit("update", game.state(0, 0));
        io.to(players[config.players.opponent].id).emit("update", game.state(1, 1));

        console.log(new Date().toISOString() + " " + players[config.players.player].id + " and " + players[config.players.opponent].id + " have joined game ID " + game.id);
    }
}

function leave(socket: any) {
    if (users[socket.id].in !== null) {
        console.log(new Date().toISOString() + " ID " + socket.id + " left game ID " + users[socket.id].in.id);

        socket.broadcast.to("game" + users[socket.id].in.id).emit("notification", {
            message: "Opponent has left the game"
        });

        if (users[socket.id].in.status !== config.status.gameover) {
            users[socket.id].in.abort(users[socket.id].player);
            check(users[socket.id].in);
        }

        socket.leave("game" + users[socket.id].in.id);

        users[socket.id].in = null;
        users[socket.id].player = null;

        io.to(socket.id).emit("leave");
    }
}

function check(game: any) {
    if (game.status === config.status.gameover) {
        console.log(new Date().toISOString() + " Game ID " + game.id + " ended.");
        io.to(game.getWinner()).emit("gameover", true);
        io.to(game.getLoser()).emit("gameover", false);
    }
}

function clients(room: string) {
    let clients = [];

    for(let id in io.sockets.adapter.rooms[room].sockets){
        clients.push(io.sockets.connected[id]);
    }
    
    return clients;
}