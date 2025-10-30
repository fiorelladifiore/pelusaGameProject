"use strict";

let runner = new Runner();

const startBtn = document.getElementById('start-btn'); //boton inicio de juego
const menu = document.getElementById('menu'); //div menu
const game = document.getElementById('container'); //contenedor principal del juego
const pauseMenu = document.getElementById('pause-menu'); //div menu pausa
const resumeBtn = document.getElementById('resume-btn'); //boton para reanudar juego
const exitBtn2 = document.getElementById('exit-btn2'); //boton para salir del juego
const gameOverMenu = document.getElementById('game-over-menu'); //div menu fin de juego
const restartBtn = document.getElementById('restart-btn'); //boton reiniciar
const exitToMenuBtn = document.getElementById('exit-to-menu-btn'); //boton salir al menu principal
const finalScoreDisplay = document.getElementById('final-score'); //puntuacion
const scoreDisplay = document.getElementById('score-display'); //puntuacion



let score = 0;  //puntuacion (hacer luego)
let scoreIntervalId = null;
let gamePaused = false;
let gameLoopInterval;
let spawnIntervalId = null;
let hydrantInterval = null;
let alternar = false;
let vidas = 3;
let delayTimeout15sId = null; // Para el retraso de 15s
let delayTimeout40sId = null;

//constantes para el intervalo de creacion de enemigos/obstaculos
const ENEMY_START_DELAY = 15000;
const DIFICULTY_INTERVAL = 2000;
const MAX_DIFFICULTY_INTERVAL = 1000;
const COLLISION_OFFSET_X = 20; // Ajuste horizontal (izquierda/derecha)
const COLLISION_OFFSET_Y = 10; // Ajuste vertical (arriba/abajo)

// menu 
startBtn.addEventListener('click', () => {
  menu.style.display = 'none';
  game.style.display = 'block';
  iniciarJuego();
});

resumeBtn.addEventListener('click', () => reanudarJuego());

exitBtn2.addEventListener('click', () => {
  pauseMenu.style.display = 'none';
  game.style.display = 'none';
  menu.style.display = 'flex';
  detenerJuego();
});


//gameOver
restartBtn.addEventListener('click', () => {
gameOverMenu.style.display = 'none';
  game.style.display = 'block';
iniciarJuego(); 
});

exitToMenuBtn.addEventListener('click', () => {
gameOverMenu.style.display = 'none';
game.style.display = 'none';
menu.style.display = 'flex';
});

// controles del personaje
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

  if (event.key === "p") alternarPausa();
  });

document.addEventListener("click", () => {
  if (!gamePaused) runner.roll();
});

// funciones del juego


function limpiarJuego() {
    //dDetener todos los temporizadores
    detenerJuego();
    
    //eliminar todos los obstáculos (grifos)
    document.querySelectorAll(".hydrant").forEach(hydrantDiv => {
        hydrantDiv.remove();
    });

    // eliminar todos los enemigos (perros)
    document.querySelectorAll(".dogRun").forEach(dogDiv => {
        dogDiv.remove();
    });
    
    // asegurar que las animaciones de fondo se reanuden
    document.querySelectorAll('*').forEach(el => el.style.animationPlayState = 'running');

    //reiniciar el estado visual del personaje (si es necesario)
    const catDiv = document.getElementById("cat");
    if (catDiv) {
        // qitar cualquier clase de estado final (death, hurt) y asegurar que corre
        catDiv.className = 'run';
    }
}

function iniciarJuego() {
    limpiarJuego(); 
    runner = new Runner();
   gamePaused = false;
    // Reiniciar variables de juego

    score=0;
    iniciarScoreCounter();
    vidas = 3;
    
    actualizarVidas();

    // iniciar loop del juego
    gameLoopInterval = setInterval(gameLoop, 50);

    // 0–15s: solo grifos
    scheduleHydrant();

    // 15s: alterno entre grifos (obstáculos) y perros (enemigos)
 delayTimeout15sId = setTimeout(() => { 
   spawnIntervalId = DIFICULTY_INTERVAL;
     iniciarAlternancia();
   }, ENEMY_START_DELAY);

  // 40s: máxima dificultad
   delayTimeout40sId = setTimeout(() => {
spawnIntervalId = MAX_DIFFICULTY_INTERVAL;
iniciarAlternancia();
  }, 40000);
}



//si el juego no esta pausado, creo el obstáculo
function scheduleHydrant() {
  hydrantInterval = setInterval(() => {
    if (!gamePaused) {
      new Obstacle();
    }
  }, 5000);
}

//crea obstáculos y enemigos alternando cada uno
function iniciarAlternancia() {
  if (hydrantInterval) clearInterval(hydrantInterval);
  if (spawnIntervalId) clearInterval(spawnIntervalId);

  spawnIntervalId = setInterval(() => {
    if (!gamePaused) {
      if (alternar) {
        new Enemy(); // clase Dog
      } else {
        new Obstacle(); // clase Hydrant
      }
      alternar = !alternar;
    }
  }, spawnIntervalId);
}

// game loop

function gameLoop() {
  if (gamePaused) return;

  const catDiv = document.getElementById("cat");
  if (!catDiv) return;

  // Colisiones con enemigos
  document.querySelectorAll(".dogRun").forEach(dogDiv => {
    if (hayColision(catDiv, dogDiv)) {
      perderVida();
      dogDiv.remove();
    }
  });

  // Colisiones con obstáculos
  document.querySelectorAll(".hydrant").forEach(hydrantDiv => {
    if (hayColision(catDiv, hydrantDiv)) {
      perderVida();
      hydrantDiv.remove();
    }
  });
}

// vidas

function perderVida() {
  vidas--;
  actualizarVidas();
  if (vidas <= 0) {
    detenerJuego();
   mostrarGameOver();
  }
}

function mostrarGameOver() {
  detenerJuego();
  game.style.display = 'none';
  gameOverMenu.style.display = 'flex';

    //muestra los puntos
    finalScoreDisplay.textContent = `Puntuación: ${score}`;
}

function actualizarVidas() {
  const vidasDiv = document.getElementById("vidas");
  if(vidas>0){
  vidasDiv.innerHTML = `<img src="imagenes/live.png" alt="Life" class="life-heart">`.repeat(vidas);
  }
}


function hayColision(catDiv, objDiv) {
const catRect = catDiv.getBoundingClientRect();
const objRect = objDiv.getBoundingClientRect();

// Usa los offsets definidos para crear un área de colisión más pequeña
const offsetX = COLLISION_OFFSET_X;
const offsetY = COLLISION_OFFSET_Y;

// Colisión con ajuste:
// Verifica si NO hay colisión y devuelve el resultado negado.
return !(
// Si el borde SUPERIOR del gato está por debajo del borde INFERIOR del objeto 
catRect.top > objRect.bottom - offsetY ||

// Si el borde INFERIOR del gato está por encima del borde SUPERIOR del objeto
catRect.bottom < objRect.top + offsetY ||

// Si el borde IZQUIERDO del gato está a la derecha del borde DERECHO del objeto
catRect.left > objRect.right - offsetX ||

// Si el borde DERECHO del gato está a la izquierda del borde IZQUIERDO del objeto
catRect.right < objRect.left + offsetX
);
}

// pausa

function alternarPausa() {
  if (gamePaused) reanudarJuego();
  else pausarJuego();
}

function pausarJuego() {
  gamePaused = true;
  pauseMenu.style.display = 'flex';
  document.querySelectorAll('*').forEach(el => el.style.animationPlayState = 'paused');
}

function reanudarJuego() {
  gamePaused = false;
  pauseMenu.style.display = 'none';
  document.querySelectorAll('*').forEach(el => el.style.animationPlayState = 'running');
}

function detenerJuego() {
  clearInterval(gameLoopInterval);
  clearInterval(spawnIntervalId);
  clearInterval(hydrantInterval);

  clearTimeout(delayTimeout15sId); // Evita que la rampa de 15s se active más tarde
    clearTimeout(delayTimeout40sId);
  gamePaused = true;
}



/**
 * Inicia el temporizador que incrementa la puntuación constantemente.
 */
function iniciarScoreCounter() {
    // Si ya hay un contador, lo detenemos para evitar múltiples ejecuciones
    if (scoreIntervalId) clearInterval(scoreIntervalId);
    
    // Aumenta la puntuación en 1 cada 100 milisegundos (10 puntos por segundo)
    scoreIntervalId = setInterval(() => {
        if (!gamePaused) {
            score += 1;
            scoreDisplay.textContent = `PUNTOS: ${score}`;
        }
    }, 100); 
}

