let config = {
    progress: 1,
    gameover: 2
};

const Game = (function() {
    let canvas: any = [],
        context: any = [],
        grid: any = [],
        width = 361,
        border = 1,
        rows = 10,
        space = (width - border * rows - border) / rows,
        turn = false,
        status: number,
        hover = { x: -1, y: -1 },
        player = 0,
        opponent = 1;

    canvas[player] = document.getElementById("canvas-grid1");
    canvas[opponent] = document.getElementById("canvas-grid2");
    context[player] = canvas[player].getContext("2d");
    context[opponent] = canvas[opponent].getContext("2d");

    canvas[opponent].addEventListener("mousemove", function(e: any) {
        let pos = coordinates(e, canvas[opponent]);
        hover = square(pos.x, pos.y);
        draw(1);
    });

    canvas[opponent].addEventListener("mouseout", function(e: any) {
        hover = { x: -1, y: -1 };
        draw(1);
    });

    canvas[opponent].addEventListener("click", function(e: any) {
        if (turn) {
            let pos = coordinates(e, canvas[1]);
            shot(square(pos.x, pos.y));
        }
    });

    function square(x: number, y: number) {
        return {
            x: Math.floor(x / (width / rows)),
            y: Math.floor(y / (width / rows))
        };
    }

    function coordinates(event: any, canvas: any) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: Math.round(((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width),
            y: Math.round(((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height)
        };
    }

    function init() {
        let i;

        status = config.progress;

        grid[player] = {
            shots: [rows * rows],
            ships: []
        };

        grid[opponent] = {
            shots: [rows * rows],
            ships: []
        };

        for (i = 0; i < rows * rows; i++) {
            grid[player].shots[i] = 0;
            grid[opponent].shots[i] = 0;
        }

        $("#turn-status")
            .removeClass("my-turn")
            .removeClass("opponent-turn")
            .removeClass("winner")
            .removeClass("loser");

        draw(player);
        draw(opponent);
    }

    function update(player: any, state: any) {
        grid[player] = state;
        draw(player);
    }

    function doTurn(state: any) {
        if (status !== config.gameover) {
            turn = state;

            if (turn) {
                $("#turn-status")
                    .removeClass("opponent-turn")
                    .addClass("my-turn")
                    .html("It's your turn!");
            } else {
                $("#turn-status")
                    .removeClass("my-turn")
                    .addClass("opponent-turn")
                    .html("Waiting for opponent.");
            }
        }
    }

    function gameover(winner: boolean) {
        status = config.gameover;
        turn = false;

        if (winner) {
            $("#turn-status")
                .removeClass("opponent-turn")
                .removeClass("my-turn")
                .addClass("winner")
                .html('You won! <a href="#" class="btn-leave-game">Play again</a>.');
        } else {
            $("#turn-status")
                .removeClass("opponent-turn")
                .removeClass("my-turn")
                .addClass("loser")
                .html('You lost. <a href="#" class="btn-leave-game">Play again</a>.');
        }
        $(".btn-leave-game").click(leave);
    }

    function draw(index: number) {
        fixAround(index);
        drawSquares(index);
        drawShips(index);
        drawMarks(index);
    }

    function drawSquares(index: number) {
        let x, y;

        context[index].fillStyle = "#232323";
        context[index].fillRect(0, 0, width, width);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < rows; j++) {
                x = j * (space + border) + border;
                y = i * (space + border) + border;

                context[index].fillStyle = "#ffffff";

                if (j === hover.x && i === hover.y && index === 1 && grid[index].shots[i * rows + j] === 0 && turn) {
                    context[index].fillStyle = "#4477FF";
                }

                context[index].fillRect(x, y, space, space);
            }
        }
    }

    function drawShips(index: number) {
        let ship, shipWidth, shipLength;

        context[index].fillStyle = "#232323";

        for (let i = 0; i < grid[index].ships.length; i++) {
            ship = grid[index].ships[i];

            let x = ship.x * (space + border) + border;
            let y = ship.y * (space + border) + border;
            shipWidth = space;
            shipLength = space * ship.size + border * (ship.size - 1);

            if (!ship.vertical) {
                context[index].fillRect(x, y, shipLength, shipWidth);
            } else {
                context[index].fillRect(x, y, shipWidth, shipLength);
            }
        }
    }

    function drawMarks(index: number) {
        let squareX, squareY;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < rows; j++) {
                squareX = j * (space + border) + border;
                squareY = i * (space + border) + border;

                if (grid[index].shots[i * rows + j] === 1) {
                    context[index].fillStyle = "#FF0000";
                    context[index].fillRect(squareX, squareY, space, space);
                } else if (grid[index].shots[i * rows + j] === 2) {
                    context[index].fillStyle = "#00FF00";
                    context[index].fillRect(squareX, squareY, space, space);
                }
            }
        }
    }

    function fixAround(index: number) {
        let ship;

        for (let i = 0; i < grid[index].ships.length; i++) {
            ship = grid[index].ships[i];
            if (ship.hits >= ship.size) {
                for (let x = 0; x < rows; x++) {
                    for (let y = 0; y < rows; y++) {
                        if (x == ship.x && y == ship.y) {
                            for (let n = 0; n < ship.size; n++) {
                                let number;
                                if (ship.vertical) {
                                    number = (y + n) * rows + x;
                                } else {
                                    number = y * rows + (x + n);
                                }

                                mark(index, number);
                            }
                        }
                    }
                }
            }
        }
    }

    function mark(index: number, element: number) {
        if (turn) {
            getAdjacent(element).forEach(function(element) {
                if (grid[index].shots[element] == 0) {
                    grid[index].shots[element] = 1;
                    markIndex(element);
                }
            });
        }
    }

    function getAdjacent(index: number) {
        let adjacent = [];

        adjacent.push(index - rows, index + rows);

        index % rows !== 0 && adjacent.push(index - 1);
        (index + 1) % rows !== 0 && adjacent.push(index + 1);

        return adjacent;
    }

    return {
        init: init,
        update: update,
        doTurn: doTurn,
        gameover: gameover
    };
})();
