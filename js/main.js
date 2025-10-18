"use strict"

let runner = new Runner();

const startBtn = document.getElementById('start-btn');
    const menu = document.getElementById('menu');
    const game = document.getElementById('container');

    startBtn.addEventListener('click', () => {
      menu.style.display = 'none';  // Oculta el menú
      game.style.display = 'block'; // Muestra el juego
    });

document.addEventListener('keydown', () => {
    if (event.code === "Space") {
        event.preventDefault();
        runner.jump();
    }
});


document.addEventListener("click", () => {
    runner.roll();
});

document.addEventListener('keydown', () => {
    if (event.key === "a") {
        event.preventDefault();
        runner.hurt();
    }
});

document.addEventListener('keydown', () => {
    if (event.key === "d") {
        event.preventDefault();
        runner.death();
    }
});

/* cada 50 milisegundos verifica estado del juego */
setInterval(gameLoop, 50);

setInterval(generarEnemigo, 2000);



function generarEnemigo() {
    let enemy = new Enemy();
}

/**
 * Chequear estado del runner y de los enemigos
 */
function gameLoop() {

    //console.log(runner.status())


}

