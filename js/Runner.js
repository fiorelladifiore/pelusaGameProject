class Runner extends Cat {

    constructor() {
        super();
        this.cat = document.getElementById("cat");
        this.isJumping = false;
         this.isRolling = false;
          this.isLanding = false;
           this.isToRun = false;
           this.isDead = false;
    }

    status() {
        return this.cat.getBoundingClientRect();
    }

    run() {
        this.clean();
        this.cat.classList.add("run");
    }

     hurt() {
        this.clean();
        this.cat.classList.add("hurt");
        this.cat.addEventListener("animationend", this.handleHurtEnd);
    }

  //evento para manejar cuando termine cualquier animación del gato qué hacer como siguiente
  //remover el listener para evitar bucles infinitos
     handleHurtEnd = (e) => {
       this.cat.removeEventListener("animationend", this.handleHurtEnd);
        this.toRun();
     }


    jump() {
        if (this.isJumping) return;
        this.isJumping = true;
        this.clean();
        this.cat.classList.add("jump");
        this.cat.addEventListener("animationend", this.handleJumpEnd);
    }

    roll() {
        if (this.isJumping || this.isRolling) return; // evita superposición
        this.isRolling = true;
        this.clean();
        this.cat.classList.add("roll");

        this.cat.addEventListener("animationend", this.handleRollEnd);
    }

     handleRollEnd = (e) => {
       this.cat.removeEventListener("animationend", this.handleRollEnd);
    this.isRolling = false;
    this.toRun();
     }

    death(){// evita superposición
        this.isDead = false;
        this.clean();
        this.cat.classList.add("death");
           this.clean();
           this.isDead = true;
    this.toRun();
    }

     handleDeathEnd = (e) => {
    
    this.isDead = true;
 
        
    }

      toRun() {
        this.isToRun = true;
        this.clean();
        this.cat.classList.add("toRun");
        this.cat.addEventListener("animationend", this.handleToRunEnd);
    }

    handleToRunEnd = (e) => {
            this.cat.removeEventListener("animationend", this.handleToRunEnd);
            this.isToRun= false;
            this.run();
        
    }
    

    handleJumpEnd = (e) => {
        if (e.animationName === "jump") {
            this.cat.removeEventListener("animationend", this.handleJumpEnd);
            this.fall();
        }
    }

    fall() {
        this.clean();
        this.cat.classList.add("fall");
        this.cat.addEventListener("animationend", this.handleFallEnd);
    }

    handleFallEnd = (e) => {
        if (e.animationName === "fall") {
            this.cat.removeEventListener("animationend", this.handleFallEnd);
            this.isJumping = false;
            this.land();
        }
    }

    land() {
        this.clean();
        this.cat.classList.add("land");
        this.cat.addEventListener("animationend", this.handleLandEnd);
    }

    handleLandEnd = (e) => {
        if (e.animationName === "land") {
            this.cat.removeEventListener("animationend", this.handleLandEnd);
            this.isLanding= false;
            this.run();
        }
    }

    clean() {
        this.cat.classList.remove("run", "jump", "fall", "roll", "land", "toRun", "hurt");
    }
}