<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Barong Run - 8-Bit</title>
    <style>
        body {
            margin: 0;
            background: #222;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
            color: white;
            font-family: 'Courier New', Courier, monospace;
        }
        canvas {
            border: 4px solid #fff;
            background: #87CEEB; /* Sky Blue */
            image-rendering: pixelated;
        }
        .ui {
            position: absolute;
            top: 20px;
            text-align: center;
            pointer-events: none;
        }
    </style>
</head>
<body>

    <div class="ui">
        <h1>BARONG RUN</h1>
        <p>Press SPACE or TAP to Jump</p>
        <h2 id="score">Score: 0</h2>
    </div>
    <canvas id="gameCanvas"></canvas>

<script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');

    canvas.width = 800;
    canvas.height = 400;

    // Game Constants
    const GRAVITY = 0.6;
    let score = 0;
    let gameActive = true;

    // Player Object
    const player = {
        x: 150,
        y: 300,
        width: 40,
        height: 60,
        dy: 0,
        jumpForce: -12,
        grounded: false,
        draw() {
            // Simple 8-bit style drawing
            // Pants (Black)
            ctx.fillStyle = "black";
            ctx.fillRect(this.x + 5, this.y + 40, 30, 20); 
            // Barong (White/Off-white)
            ctx.fillStyle = "#f0f0f0";
            ctx.fillRect(this.x, this.y + 15, 40, 30); 
            // Head (Skin Tone - Bald & Round)
            ctx.fillStyle = "#ffdbac";
            ctx.beginPath();
            ctx.arc(this.x + 20, this.y + 10, 15, 0, Math.PI * 2);
            ctx.fill();
            // Shoes
            ctx.fillStyle = "black";
            ctx.fillRect(this.x + 2, this.y + 55, 12, 8);
            ctx.fillRect(this.x + 26, this.y + 55, 12, 8);
        },
        update() {
            if (this.y + this.height < canvas.height - 20) {
                this.dy += GRAVITY;
                this.grounded = false;
            } else {
                this.dy = 0;
                this.grounded = true;
                this.y = canvas.height - 20 - this.height;
            }
            this.y += this.dy;
            this.draw();
        },
        jump() {
            if (this.grounded) {
                this.dy = this.jumpForce;
            }
        }
    };

    // Mob/Paper Obstacle Object
    const obstacles = [];
    function spawnObstacle() {
        const size = 30;
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 50,
            width: size,
            height: size,
            speed: 5 + (score / 10) // Gets faster
        });
    }

    function drawObstacles() {
        obstacles.forEach((obs, index) => {
            obs.x -= obs.speed;

            // Draw "The Mob" (Cluster of papers)
            ctx.fillStyle = "white";
            ctx.fillRect(obs.x, obs.y, 20, 25); // Paper 1
            ctx.strokeStyle = "#ccc";
            ctx.strokeRect(obs.x, obs.y, 20, 25);

            ctx.fillStyle = "#eee";
            ctx.fillRect(obs.x + 10, obs.y - 10, 20, 25); // Paper 2

            // Collision Detection
            if (
                player.x < obs.x + obs.width &&
                player.x + player.width > obs.x &&
                player.y < obs.y + obs.height &&
                player.y + player.height > obs.y
            ) {
                gameOver();
            }

            // Remove off-screen obstacles
            if (obs.x + obs.width < 0) {
                obstacles.splice(index, 1);
                score++;
                scoreElement.innerText = `Score: ${score}`;
            }
        });
    }

    function gameOver() {
        gameActive = false;
        alert(`Game Over! You were caught by the paperwork. Score: ${score}`);
        location.reload(); 
    }

    // Input handling
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') player.jump();
    });
    canvas.addEventListener('touchstart', () => player.jump());

    // Game Loop
    let frame = 0;
    function animate() {
        if (!gameActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Ground
        ctx.fillStyle = "#654321";
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

        player.update();
        drawObstacles();

        if (frame % 100 === 0) spawnObstacle();

        frame++;
        requestAnimationFrame(animate);
    }

    animate();
</script>
</body>
</html>
