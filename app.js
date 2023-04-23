
const canvas = document.getElementById("canvas")
   const ctx = canvas.getContext("2d")
   canvas.width =  700
   canvas.height = 500
window.addEventListener('load',(e)=>{
  class Drone {
    constructor(game){
      this.game = game
      this.width = 100
      this.height =100
      this.x = 0
      this.y = this.game.height-100
      this.frameX = 0
      this.frameY = 0
      this.speedY = 0.2
      this.speedX= 0.2
      this.lasers = []
      this.droneImg = document.getElementById('drone')
      this.blast = document.getElementById('blast')
      this.place = document.getElementById('place')
      this.startSound = document.getElementById('startsound')
      this.angle = 0
      this.rotating = false
      this.placeDrone()
    
    }
    update() {
      if (this.game.keys.includes('ArrowUp') ) {
           this.move(this.angle)
      } else if (this.game.keys.includes('ArrowDown') ) {
        //this.speedY = 1
        this.angle = 0 // reset angle to 0 degrees
      } else if (this.game.keys.includes('ArrowLeft')  && !this.rotating) {
        if(this.angle > -180){
          this.rotate(-90)
          this.rotating = true
          window.addEventListener('keyup',()=>{
          this.rotating = false
      })
      this.move(this.angle)}
      } else if (this.game.keys.includes('ArrowRight') && !this.rotating) {
        if(this.angle < 180){
          this.rotate(90)
          this.rotating = true
          window.addEventListener('keyup',()=>{
          this.rotating = false
        })
        this.move(this.angle)}
      } else {
        this.speedY = 0
        this.speedX= 0
      }
      this.y += this.speedY
       this.lasers.forEach(element => {
         element.update()
       })
       this.lasers = this.lasers.filter(e => !e.markdelete)
     
    }
   draw(context){
       this.lasers.forEach(e =>{
       e.draw(context)
    })
   context.save() // save the current context state
   context.translate(this.x + this.width / 2, this.y + this.height / 2) // move the origin to the center of the image
   context.rotate(this.angle * Math.PI / 180) // rotate the image 
   context.drawImage(this.droneImg, -this.width / 2, -this.height / 2, this.width, this.height) // draw the image with the new orientation
   context.restore() 
   }

  placeDrone(){
    this.place.addEventListener('click', ()=>{
     this.x = 0
     this.y = this.game.height-100
     this.angle = 0
     this.startSound.play()


   } )

  }

  
   attack(){
    if (this.game.ammo > 0) {
      this.blast.load()
      const missile = new Missile(this.game, this.x, this.y);
      missile.angle = this.angle; // set missile angle to the drone's angle
      this.lasers.push(missile);
      this.game.ammo--;
      this.blast.play()
    }
    
   }

 
   rotate(degrees) {
    this.angle += degrees
   
  }

  move(angle){
    if(angle === 0 && this.y > this.game.height*0.2 ){
       this.y--
     }else if(angle === -90  && this.x > this.game.width *0.01){
       this.x--
     }else if(angle === 90 && this.x < this.game.width *0.85){
      this.x++
     }else if(angle === 180  && this.y < this.game.height*0.85){
      this.y++
     }else if(angle === -180  && this.y < this.game.height*0.85){
      this.y++
 }
  }
  
  }

  // projectile class
  class  Missile{
    constructor(game, x,y){
      this.game = game
      this.x = this.game.drone.x
      this.y =this.game.drone.y
      this.frameX = 0
      this.frameY = 0
      this.width = 20
      this.height = 5
      this.speed =3
      this.markdelete = false
      this.explosion = document.getElementById('explosion')
      this.spriteWidth = 160
      this.spriteHieght = 220 
      this.missileAngle = this.game.drone.angle
      this.expl = false
    }

    update(){
      // Sprite control
      if(this.frameX < 7){
        this.frameX++
       }else{
        this.frameX = 0
       }
     // movement control 
    if(this.missileAngle === 0 ){
       this.y-=this.speed
      if(this.y < this.game.height * 0.2) this.markdelete =true
       }else if(this.missileAngle === -90){
      this.x-= this.speed
      if(this.x < this.game.width * 0.2) this.markdelete =true
      }else if(this.missileAngle === 90){
      this.x+=this.speed
    // projectile control  
    if(this.x > this.game.width * 0.8) this.markdelete =true
      }else if(this.missileAngle === 180){
       this.y+= this.speed
    if(this.y < this.game.height * 0.2) this.markdelete =true
      }else if(this.missileAngle=== -180){
       this.y+= this.speed
      if(this.y < this.game.height * 0.2) this.markdelete =true
  
     }
    
    }

    draw(context){
    context.fillStyle = 'orange'
     context.beginPath();
    context.arc(this.x+50, this.y + 50, 5, 0, 2*Math.PI);
     context.fill();
      if(this.y < this.game.height * 0.3|| this.x < this.game.width) {
      context.drawImage(this.explosion,this.frameX*this.spriteWidth,0,150,220,this.x,this.y,100,100) 
      }
    }

  }

  // handle input class
  class Handleinpute{
    constructor(game){
      this.game = game
      window.addEventListener("keydown", (e)=>{
         if((e.key === 'ArrowUp' || e.key ==="ArrowDown" || e.key === "ArrowLeft" || e.key ==="ArrowRight") && this.game.keys.indexOf(e.key) === -1){
          this.game.keys.push(e.key)
         }else if(e.key == 'a'){
         this.game.drone.attack()
         }
         
      })

      window.addEventListener("keyup", (e)=>{
        if(this.game.keys.indexOf(e.key) > -1){
         
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1)
        }
   
     })
    }
  }

  // UI class
  class UI{
    constructor(game){
      this.game = game
      this.angle = this.game.drone.angle
      this.x =this. game.drone.x
      this.y = this.game.drone.y
      this.fontSize =20
      this.color ="red"
      this.missileImg = document.getElementById('missile')
      this.report = document.getElementById('report')
      this.data = document.getElementById('myData')
      this.updateDroneInfo()
      this.reportDrone()
    }

    updateDroneInfo() {
      this.angle = this.game.drone.angle;
      this.x = this.game.drone.x;
      this.y = this.game.drone.y;
    }
    

    draw(context){
      // ammo indicator
      context.fillStyle = this.color
      for(let i =0; i< this.game.ammo; i++){
       context.drawImage(this.missileImg,  30*i, 50, 40,40)
      }
      context.font = "15px Arial";
      context.fillText("commands: unticlockwise turn: leftArrow, clockwise turn rightArrow, move: upArrow, Attack: a " , 5, 20); 
      context.font = "20px Arial";
      context.fillText(`Position: ${this.x}, ${this.y}, ${this.direction(this.angle)}` , 200, 50); 
      context.font = "20px Arial";
      context.fillText('Ammo left' , 1, 50); 
    }

// direction method
    direction(angle){
        switch (angle) {
          case 0:
            return 'NORTH';
          case 90: 
          return 'EAST';
          case -90:
            return 'WEST';
            case 180:
              return 'SOUTH';
              case -180:
              return 'SOUTH'
          default: 'SOUTH'
            break;
        }
    }

    reportDrone(){
      this.report.addEventListener('click',(e)=>{
        this.data.innerText = `X: ${this.x} , Y: ${this.y} , F: ${this.direction(this.angle)}`
      })
    }
  }


  //game classs controls the whole game
  class Game{
    constructor(width,height){
      this.width = width,
      this.height = height
      this.drone = new Drone(this)
      this.input = new Handleinpute(this)
      this.ui = new UI(this)
      this.missile = new Missile(this)
      this.keys = []
      this.ammo = 4
      
    }
    update(){
      this.drone.update()
    
      this.ui.updateDroneInfo()
      this.reload()
    }

    draw(context){
      this.drone.draw(context)
      this.ui.draw(context)
      this.outOfammo(context)
    }

    reload(){
      window.addEventListener("keydown",(e)=>{
       if(e.key === 'r'){
        this.ammo= 4
       }
      })
    }

    outOfammo(context){
      if(this.ammo < 1){
      context.fillStyle = 'lightgreen'
      context.font = "20px Arial";
      context.fillText('Out of Ammo , press r to reload' , 1, 80);
      }
    }
    
  }
 
  const game = new Game(canvas.width, canvas.height) 
    function animate(){
      ctx.clearRect(0,0,canvas.width, canvas.height)
       game.update()
       game.draw(ctx)
      requestAnimationFrame(animate)
     }
    animate() 
})

