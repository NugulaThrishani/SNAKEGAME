// Snake Game Implementation
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('highScore');

    // Game settings
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let speed = 7; // Game speed (updates per second)
    
    // Game state
    let snake = [{x: 10, y: 10}];
    let velocityX = 0;
    let velocityY = 0;
    let food = {x: 15, y: 15};
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameLoop = null;
    let isGameRunning = false;
    let isPaused = false;

    highScoreDisplay.textContent = highScore;

    // Initialize game
    function init() {
        drawGame();
    }

    // Draw everything
    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Move snake
        if (isGameRunning && !isPaused) {
            moveSnake();
        }

        // Draw snake
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#2c3e50' : '#11998e';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            
            // Draw eyes on head
            if (index === 0) {
                ctx.fillStyle = 'white';
                ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + 4, 4, 4);
                ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 4, 4, 4);
            }
        });

        // Draw food
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Move snake
    function moveSnake() {
        const head = {x: snake[0].x + velocityX, y: snake[0].y + velocityY};

        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }

        // Check self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        snake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = score;
            generateFood();
            
            // Increase speed slightly
            if (score % 50 === 0 && speed < 15) {
                speed++;
                clearInterval(gameLoop);
                gameLoop = setInterval(drawGame, 1000 / speed);
            }
        } else {
            snake.pop();
        }
    }

    // Generate food at random position
    function generateFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        
        // Make sure food doesn't spawn on snake
        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            generateFood();
        }
    }

    // Game over
    function gameOver() {
        isGameRunning = false;
        clearInterval(gameLoop);
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            highScoreDisplay.textContent = highScore;
        }
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    // Start game
    function startGame() {
        if (!isGameRunning) {
            snake = [{x: 10, y: 10}];
            velocityX = 1;
            velocityY = 0;
            score = 0;
            speed = 7;
            scoreDisplay.textContent = score;
            generateFood();
            isGameRunning = true;
            isPaused = false;
            
            gameLoop = setInterval(drawGame, 1000 / speed);
            
            startBtn.disabled = true;
            pauseBtn.disabled = false;
        }
    }

    // Pause/Resume game
    function togglePause() {
        if (isGameRunning) {
            isPaused = !isPaused;
            pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
        }
    }

    // Reset game
    function resetGame() {
        isGameRunning = false;
        isPaused = false;
        clearInterval(gameLoop);
        snake = [{x: 10, y: 10}];
        velocityX = 0;
        velocityY = 0;
        score = 0;
        speed = 7;
        scoreDisplay.textContent = score;
        generateFood();
        drawGame();
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        pauseBtn.textContent = 'Pause';
    }

    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (!isGameRunning || isPaused) return;
        
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (velocityY !== 1) {
                    velocityX = 0;
                    velocityY = -1;
                }
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (velocityY !== -1) {
                    velocityX = 0;
                    velocityY = 1;
                }
                e.preventDefault();
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (velocityX !== 1) {
                    velocityX = -1;
                    velocityY = 0;
                }
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (velocityX !== -1) {
                    velocityX = 1;
                    velocityY = 0;
                }
                e.preventDefault();
                break;
        }
    });

    // Direction button controls
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    upBtn.addEventListener('click', function() {
        if (!isGameRunning || isPaused) return;
        if (velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
        }
    });

    downBtn.addEventListener('click', function() {
        if (!isGameRunning || isPaused) return;
        if (velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
        }
    });

    leftBtn.addEventListener('click', function() {
        if (!isGameRunning || isPaused) return;
        if (velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
        }
    });

    rightBtn.addEventListener('click', function() {
        if (!isGameRunning || isPaused) return;
        if (velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
        }
    });

    // Button event listeners
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetGame);

    // Initialize
    init();
    console.log('Snake Game loaded! Press Start to begin.');
});
