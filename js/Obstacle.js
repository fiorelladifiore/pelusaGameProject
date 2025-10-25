class Obstacle extends Hydrant {

    constructor() {
        super();
     this.obstacle = document.createElement("div");
        this.obstacle.classList.add("hydrant");
        document.getElementById("container").appendChild(this.obstacle);
    }

        status() {
        super.status();
    }

    
}