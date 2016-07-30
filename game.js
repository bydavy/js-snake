const board_size = 40;

var $board;
var game_loop_interval_id;
var snake;
var direction;
var food;
var eat;

function initializeHtml() {
    $board = $('#board');
    initializeBoardHtml(board_size, board_size);

    $('#restart').click(function () {
        startGame();
    });
}

function initializeBoardHtml(x, y) {
    var str = "";
    for (var i = 0; i < y; i++) {
        str += "<div class='row'>";
        for (var j = 0; j < x; j++) {
            str += "<div></div>";
        }
        str += "</div>";
    }
    $board.html(str);
}

function getCell(x, y) {
    $rows = $board.children();
    $row = $rows.eq(y);
    $cells = $row.children();
    return $cells.eq(x);
}

function initializeSnake(x, y) {
    snake.push([x, y]);
    snake.push([x - 1, y]);
    snake.push([x - 2, y]);
}

function moveSnake() {
    if (!eat) {
        snake.splice(snake.length - 1, 1);
    }
    newHead = snake[0].slice();
    switch (direction) {
        case "up":
            newHead[1] = newHead[1] - 1;
            break;
        case "down":
            newHead[1] = newHead[1] + 1;
            break;
        case "left":
            newHead[0] = newHead[0] - 1;
            break;
        case "right":
            newHead[0] = newHead[0] + 1;
            break;
    }
    newHead[1] = keepInBounds(newHead[1]);
    newHead[0] = keepInBounds(newHead[0]);
    snake.unshift(newHead);
}

function keepInBounds(value) {
    value = value % board_size;
    if (value < 0) {
        value = value + board_size;
    }

    return value;
}

function collide() {
    var sorted_snake = snake.slice().sort();
    for (var i = 0; i < sorted_snake.length - 1; i++) {
        item1 = sorted_snake[i];
        item2 = sorted_snake[i + 1];
        if (item1[0] == item2[0] && item1[1] == item2[1]) {
            return true;
        }
    }

    return false;
}

function eatFood() {
    eat = false;

    if (food == null) {
        return;
    }

    $.each(snake, function (index, item) {
        if (item[0] == food[0] && item[1] == food[1]) {
            eat = true;
            food = null;
            return false;
        }
    });
}

function newFood() {
    if (food == null) {
        x = Math.floor(Math.random() * board_size);
        y = Math.floor(Math.random() * board_size);
        food = [x, y];
    }
}

function clearBoard() {
    $.each($board.children(), function (index, row) {
        $.each($(row).children(), function (index, div) {
            $(div).removeClass();
        });
    });
}

function drawSnake() {
    $.each(snake, function (index, item) {
        $cell = getCell(item[0], item[1]);
        if (index === 0) {
            $cell.addClass('snake-head');
        } else {
            $cell.addClass('snake-body');
        }
    });
}

function drawFood() {
    $cell = getCell(food[0], food[1]);
    $cell.addClass('food');
}

function startGame() {
    stopGame();

    // Reset game state
    snake = [];
    initializeSnake(board_size / 2, board_size / 2);
    direction = "right";
    food = null;
    eat = false;

    // Start game loop
    game_loop_interval_id = setInterval(gameLoop, 90/*ms*/);
}

function stopGame() {
    if (game_loop_interval_id != undefined) {
        clearInterval(game_loop_interval_id);
        delete game_loop_interval_id;
    }
}

function gameLoop() {
    moveSnake();
    if (collide()) {
        stopGame();
        return;
    }
    eatFood();
    newFood();

    clearBoard();
    drawSnake();
    drawFood();
}

$(document).keydown(function (event) {
    switch (event.key) {
        case "ArrowUp":
            if (direction != "down") {
                direction = "up";
            }
            break;
        case "ArrowDown":
            if (direction != "up") {
                direction = "down";
            }
            break;
        case "ArrowLeft":
            if (direction != "right") {
                direction = "left";
            }
            break;
        case "ArrowRight":
            if (direction != "left") {
                direction = "right";
            }
            break;
    }
});

$('document').ready(function () {
    initializeHtml();
    startGame();
});
