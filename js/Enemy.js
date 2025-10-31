class Enemy extends Dog {

    constructor() {
        super();
     this.enemy = document.createElement("div");
        this.enemy.classList.add("dogRun");
        // Busca el contenedor principal del juego (id="container")
        // y añade el <div> del perro dentro de él, haciéndolo visible.
        document.getElementById("container").appendChild(this.enemy);
    }

        status() {
        super.status();
    }


    
}