class Enemy extends Dog {

    constructor() {
        super();
     this.enemy = document.createElement("div");
        this.enemy.classList.add("dogRun");
        document.getElementById("container").appendChild(this.enemy);
    }

        status() {
        super.status();
    }


    
}