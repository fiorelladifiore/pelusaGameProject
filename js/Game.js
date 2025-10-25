"use strict";

let runner = new Runner();

const startBtn = document.getElementById('start-btn');
const menu = document.getElementById('menu');
const game = document.getElementById('container');
const pauseMenu = document.getElementById('pause-menu');
const resumeBtn = document.getElementById('resume-btn');
const exitBtn2 = document.getElementById('exit-btn2');

let gamePaused = false;
let gameLoopInterval;
let enemyTimeout; // usamos timeouts en vez de intervalos
let obsTimeout;

//menu 
startBtn.addEventListener('click', () => {
  menu.style.display = 'none';
  game.style.display = 'block';
  iniciarJuego();
});

resumeBtn.addEventListener('click', () => {
  reanudarJuego();
});

exitBtn2.addEventListener('click', () => {
  pauseMenu.style.display = 'none';
  game.style.display = 'none';
  menu.style.display = 'flex';
  detenerJuego();
});

// ------------------- CONTROLES -------------------
document.addEventListener('keydown', (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    if (!gamePaused) runner.jump();
  }

  if (event.key === "a") {
    event.preventDefault();
    if (!gamePaused) runner.hurt();
  }

  if (event.key === "d") {
    event.preventDefault();
    if (!gamePaused) runner.death();
  }

  if (event.key === "p") {
    alternarPausa();
  }
});

document.addEventListener("click", () => {
  if (!gamePaused) runner.roll();
});


function iniciarJuego() {
  detenerJuego(); // limpia cualquier timeout/intervalo viejo
  gameLoopInterval = setInterval(gameLoop, 50);

  // arrancamos la cadena recursiva de timeouts
  scheduleEnemy();
  scheduleObstacle();
}

function detenerJuego() {
  clearInterval(gameLoopInterval);
  if (enemyTimeout) clearTimeout(enemyTimeout);
  if (obsTimeout) clearTimeout(obsTimeout);
  enemyTimeout = null;
  obsTimeout = null;
}

// programador recursivo para enemigos (tiempos aleatorios)
function scheduleEnemy() {
  // delay aleatorio entre 4s y 10s (4000 - 10000 ms)
  const delay = Math.random() * 6000 + 4000;
  enemyTimeout = setTimeout(() => {
    // si no está en pausa, creamos el enemigo
    if (!gamePaused) {
      new Enemy();
    }
    // siempre reprogramamos la siguiente ejecución (si está detenido, la cadena se rompe en detenerJuego())
    scheduleEnemy();
  }, delay);
}

// programador recursivo para obstáculos (ejemplo entre 2s y 6s)
function scheduleObstacle() {
  const delay = Math.random() * 4000 + 2000; // 2000 - 6000 ms
  obsTimeout = setTimeout(() => {
    if (!gamePaused) {
      new Obstacle();
    }
    scheduleObstacle();
  }, delay);
}

function gameLoop() {
  if (gamePaused) return;
  // lógica principal: colisiones, puntuación, etc.
}

// ------------------- PAUSA -------------------
function alternarPausa() {
  if (gamePaused) {
    reanudarJuego();
  } else {
    pausarJuego();
  }
}

function pausarJuego() {
  gamePaused = true;
  pauseMenu.style.display = 'flex';

  // opcional: cancelar timeouts para que no se sigan programando durante la pausa
  if (enemyTimeout) {
    clearTimeout(enemyTimeout);
    enemyTimeout = null;
  }
  if (obsTimeout) {
    clearTimeout(obsTimeout);
    obsTimeout = null;
  }

  // Detiene animaciones CSS
  document.querySelectorAll('*').forEach(el => {
    el.style.animationPlayState = 'paused';
  });
}

function reanudarJuego() {
  gamePaused = false;
  pauseMenu.style.display = 'none';

  // reprogramamos las cadenas recursivas (si estaban canceladas)
  if (!enemyTimeout) scheduleEnemy();
  if (!obsTimeout) scheduleObstacle();

  // Reanuda animaciones CSS
  document.querySelectorAll('*').forEach(el => {
    el.style.animationPlayState = 'running';
  });
}
