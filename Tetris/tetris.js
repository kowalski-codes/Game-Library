// Simple Tetris Game

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(24, 24);

const scoreElem = document.getElementById('score');
const restartBtn = document.getElementById('restart');

const ROWS = 20;
const COLS = 10;

const COLORS = [
    null,
    '#FF0D72', // T
    '#0DC2FF', // I
    '#0DFF72', // S
    '#F538FF', // Z
    '#FF8E0D', // L
    '#FFE138', // J
    '#3877FF'  // O
];

const SHAPES = {
    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0]
    ],
    'O': [
        [2,2],
        [2,2]
    ],
    'L': [
        [0,0,3],
        [3,3,3],
        [0,0,0]
    ],
    'J': [
        [4,0,0],
        [4,4,4],
        [0,0,0]
    ],
    'I': [
        [0,5,0,0],
        [0,5,0,0],
        [0,5,0,0],
        [0,5,0,0]
    ],
    'S': [
        [0,6,6],
        [6,6,0],
        [0,0,0]
    ],
    'Z': [
        [7,7,0],
        [0,7,7],
        [0,0,0]
    ]
};

function arenaSweep() {
    let rowCount = 1;
    let scoreAdd = 0;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) continue outer;
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        scoreAdd += rowCount * 10;
        rowCount *= 2;
    }
    player.score += scoreAdd;
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (
                m[y][x] !== 0 &&
                (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0
            ) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) matrix.push(new Array(w).fill(0));
    return matrix;
}

function createPiece(type) {
    switch(type) {
        case 'T': return SHAPES['T'];
        case 'O': return SHAPES['O'];
        case 'L': return SHAPES['L'];
        case 'J': return SHAPES['J'];
        case 'I': return SHAPES['I'];
        case 'S': return SHAPES['S'];
        case 'Z': return SHAPES['Z'];
    }
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = COLORS[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                context.strokeStyle = "#222";
                context.strokeRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#222';
    context.fillRect(0, 0, COLS, ROWS);
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        resetPlayer();
        arenaSweep();
        updateScore();
        if (collide(arena, player)) {
            // Game Over
            gameOver();
        }
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let running = true;

function update(time = 0) {
    if (!running) return;
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    scoreElem.textContent = 'Score: ' + player.score;
}

function resetPlayer() {
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (COLS / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        running = false;
        gameOver();
    }
}

function gameOver() {
    running = false;
    scoreElem.textContent = 'Game Over! Score: ' + player.score;
}

function restartGame() {
    for (let y = 0; y < arena.length; ++y) {
        arena[y].fill(0);
    }
    player.score = 0;
    running = true;
    updateScore();
    resetPlayer();
    lastTime = performance.now();
    update();
}

document.addEventListener('keydown', event => {
    if (!running) return;
    if (event.key === 'ArrowLeft') {
        playerMove(-1);
    } else if (event.key === 'ArrowRight') {
        playerMove(1);
    } else if (event.key === 'ArrowDown') {
        playerDrop();
    } else if (event.key === 'ArrowUp') {
        playerRotate(1);
    } else if (event.key === ' ') {
        // Hard drop
        while (!collide(arena, player)) {
            player.pos.y++;
        }
        player.pos.y--;
        playerDrop();
    }
});

restartBtn.addEventListener('click', restartGame);

const arena = createMatrix(COLS, ROWS);
const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0
};

restartGame();
