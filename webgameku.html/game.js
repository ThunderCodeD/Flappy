const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.style.backgroundColor = "#70c5ce"; 

let bird = {
  x: 50,
  y: 150,
  radius: 15,
  gravity: 0.6,
  lift: -10,
  velocity: 0
};

let pipes = [];
let score = 0;
let gameOver = false;

function drawBird() {
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();


  ctx.beginPath();
  ctx.arc(bird.x + 5, bird.y - 5, 4, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(bird.x + 5, bird.y - 5, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();


  ctx.beginPath();
  ctx.moveTo(bird.x - 10, bird.y);
  ctx.lineTo(bird.x - 20, bird.y + 10);
  ctx.lineTo(bird.x - 5, bird.y + 5);
  ctx.fillStyle = "#888";
  ctx.fill();
  ctx.closePath();


  ctx.beginPath();
  ctx.moveTo(bird.x + bird.radius, bird.y);
  ctx.lineTo(bird.x + bird.radius + 8, bird.y - 4);
  ctx.lineTo(bird.x + bird.radius + 8, bird.y + 4);
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.closePath();
}

function drawPipes() {
  ctx.fillStyle = "green";
  for (let pipe of pipes) {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);
  }
}

function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
    gameOver = true;
  }

  for (let pipe of pipes) {
    pipe.x -= 1.5;

    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + pipe.width &&
      (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottomY)
    ) {
      gameOver = true;
    }

    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      score++;
      pipe.passed = true;
    }
  }

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 10, 50);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  drawScore();

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 100, 300);
    ctx.font = "20px Arial";
    ctx.fillText("Tekan Spasi untuk restart", 90, 340);
    return;
  }

  update();
  requestAnimationFrame(draw);
}

function newPipe() {
  const gap = 180; 
  const top = Math.random() * (canvas.height - gap - 100) + 20;
  pipes.push({
    x: canvas.width,
    width: 100, 
    top: top,
    bottomY: top + gap,
    passed: false
  });
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  draw();
}

setInterval(newPipe, 2000);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (gameOver) {
      resetGame();
    } else {
      bird.velocity = bird.lift;
    }
  }
});

draw();
