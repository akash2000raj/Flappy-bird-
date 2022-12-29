const cvs = document.getElementById('canvas');

const ctx = cvs.getContext('2d');
//const score = document.getElementById('score');


let frames = 0;
// image portion -------------
const sprite = new Image();
sprite.src = "bg.png";

const grounds = new Image();
grounds.src = "ground.png";

const birds = new Image();
birds.src = "bird.png";
const tamplet = new Image();
tamplet.src = "tamplet.png";

const play = new Image();
play.src = "play.png";

// degree 
const deg = Math.PI / 180;
// game state--

const state = {
  current: 0,
  getready: 0,
  game: 1,
  gameover: 2

}
//------audio portion -------

const scoregain = new Audio();
scoregain.src = "point.aac";

const die = new Audio();
die.src = "die.aac";

const collision = new Audio();
collision.src = "Drop Fork.mp3";

const up = new Audio();
up.src = "up.aac";

const fly = new Audio();
fly.src = "fly.aac";


const jungle = new Audio();
jungle.src = "jungle.mp3";
//---------control game----------


cvs.addEventListener("click", statefind);


function statefind(evt) {

  switch (state.current) {
    case state.getready:
      {

        state.current = state.game;
        break;
      }

    case state.game:
      {
        bird.flap();



        break;

      }
    case state.gameover:
      {

        let rect = cvs.getBoundingClientRect();
        let clickX = evt.clientX - rect.left;
        let clickY = evt.clientY - rect.top;
        if (clickX >= playbtn.x && clickX <= playbtn.x + playbtn.w && clickY >= playbtn.y && clickY <= playbtn.y + playbtn.h) {

          bird.speedreset();
          pipes.reste();

          state.current = state.getready;
        }

        break;

      }
  }





}

function getMedalRank()
{
if(scores.value>0&&scores.value<=10)
{
  return 0;
}
else if(scores.value>10&&scores.value<=20)
{
return 1;
}
else if(scores.value>20&&scores.value<=40)
{
return 2;
}
else{
return 3;

}

}



//  --------------- display score on canvas ---------- 
const scores = {


  best: parseInt(localStorage.getItem("best")) || 0,
  value: 0,
  madel_ranks: [
    {
      sx:383,//silver 1
      sy:128,
      sw:24,
      sh:24
    },
   
    {
      sx:213, // silver 2
      sy:76,
      sw:24,
      sh:24
    },
    {
      sx:383,
      sy:153,
      sw:24,
      sh:24// gold 1
    },{
      sx:212,//  gold 2
      sy:100,
      sw:24,
      sh:24
    }
    
    ],
  
  draws: function () {

    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = '#000';


    if (state.current == state.game) {

      ctx.lineWidth = 2;
      ctx.font = "45px  bolder";
      ctx.fillText(this.value, (cvs.width / 2) - 10, 50);
      ctx.strokeText(this.value, (cvs.width / 2) - 10, 50);



    }

    else if (state.current == state.gameover) {

      ctx.font = "25px  bolder";
      ctx.fillText(this.value, 200, 268);
      ctx.strokeText(this.value, 200, 268);
      ctx.fillText(this.best, 198, 299);
      ctx.strokeText(this.best, 198, 299);

      if(scores.value>0)
      {
             let rank=  getMedalRank();
             let medal_display = this.madel_ranks[rank];
       ctx.drawImage(tamplet,medal_display.sx,medal_display.sy,medal_display.sw,medal_display.sh,84,256,35,35);

      }



    }

  }
  ,

  update: function () {




  }



}
//--name 
 const myname={

x:cvs.width-310,
y:cvs.height-200,

draws: function(){

if(state.current==state.getready)
{
  
  ctx.font =" 25px bolder";
  ctx.fillStyle = "#000";
  ctx.strokeStyle="blue";
 /* ctx.fillText("orginal Author : Dong Nguyen",this.x,this.y);
  ctx.strokeText("orginal Author : Dong Nguyen",this.x,this.y);
  ctx.fillText("Recreated by : Akash raj",this.x+30,this.y+40);
  ctx.strokeText("Recreated by : Akash raj",this.x+30,this.y+40);*/


}


}



 }



//-----------------specifications of images------------
const playbtn = {
  x: 90,
  y: 330,
  w: 120,
  h: 40

}

const bg = {


  x: 0,
  y: 0,
  w: cvs.width - 50,
  h: cvs.height,

  draws: function () {

    ctx.drawImage(sprite, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.x + this.w, this.y, this.w, this.h);




  }
  ,

  playbg : function()
  {
 
    if(state.current==state.game)
    {

     jungle.play();
    }
else 
{
  jungle.pause();
  jungle.load();
}


  }


}


const pipes = {

  bottom: {
    sx: 179,
    sy: 2,
    h: 161,
    w: 27

  }
  ,
  top: {
    sx: 151,
    sy: 2,
    h: 161,
    w: 27
  }
  ,
  h: 400,
  w: 56,

  maxYpos: -151,
  position: [],
  gap: 100,
  dx: 2,
  freq: 100,

  draws: function () {

    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];

      let topY = p.y;
      let bottomY = p.y + this.gap + this.h;


      ctx.drawImage(tamplet, this.bottom.sx, this.bottom.sy, this.bottom.w, this.bottom.h, p.x, bottomY, this.w, this.h)

      ctx.drawImage(tamplet, this.top.sx, this.top.sy, this.top.w, this.top.h, p.x, topY, this.w, this.h);
    }
  }
  ,
  update: function () {

    if (state.current !== state.game) return;


    if (frames % this.freq == 0) {
      this.position.push(

        {
          x: cvs.width,
          y: this.maxYpos * (Math.random() + 1)

        }

      );


    }


    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];


      let bottompipeYpos = p.y + this.gap + this.h;

      //top pipe collision 

      if (bird.x +bird.radius > p.x && bird.x-bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y -bird.radius < p.y + this.h) {
        state.current = state.gameover;
        collision.play();
      }
      //bottom collision------
      if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y - bird.radius > bottompipeYpos && bird.y + bird.radius < bottompipeYpos + this.h) {
        state.current = state.gameover;
        collision.play();
      }
      p.x -= this.dx;


      if (p.x + this.w <= 0) {
        this.position.shift();
        scoregain.play();
        scores.value++;
        scores.best = Math.max(scores.value, scores.best);

        localStorage.setItem("best", scores.best);



      }
      

      if (scores.value >= 20) {
        this.dx = 4;
        this.freq = 50;

      }
      else if (scores.value >= 50) {
        this.dx = 6;
        this.freq = 25;

      }
    

    }


  }

  ,
  reste: function () {

    this.position = [];
    scores.value = 0;
    this.dx = 2;
    this.freq = 100;
    ground.dx = 2;
    die.muted=false;
  
  },



}








const ground = {


  x: 0,
  y: 400,
  w: 220,
  h: 90,
  dx: 2,
  draws: function () {

    ctx.drawImage(grounds, this.x, this.y, this.w, this.h);


    ctx.drawImage(grounds, this.x + this.w, this.y, this.w, this.h);


  }
  ,
  update: function () {
    if (state.current == state.game) {
      this.x = (this.x - this.dx) % (this.w / 2);

    }
    if (scores.value >= 20) {
      this.dx = 4;

    }
    else if (scores.value >= 50) {
      this.dx = 6;
      this.freq = 40;

    }

  }
}


const bird = {

  animation: [
    { sx: 0, sy: 0 },
    { sx: 35, sy: 0 },
    { sx: 70, sy: 0 },
    { sx: 35, sy: 0 }
  ],
  radius: 15,
  x: 50,
  y: 200,
  w: 35,
  h: 26,
  frame: 0,
  gravity: 0.25,
  jump: 4.6,
  speed: 0,
  rotation: 0,
  draws: function () {

    let birdlen = this.animation[this.frame];
    ctx.save();
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation);
    ctx.drawImage(birds, birdlen.sx, birdlen.sy, this.w, this.h, - this.w / 2, - this.w / 2, this.w, this.h);
    ctx.restore();
  },
  flap: function () {

    this.speed = -this.jump;
    up.play();


  },
  update: function () {
    if (state.current == state.getready) {
      this.period = 10;
      fly.play();
    }
    else {
      this.period = 5;
    }

    if (frames % this.period == 0) {
      this.frame++;
    }

    this.frame = this.frame % this.animation.length;

    if (state.current == state.getready) {
      this.y = 200;
      this.rotation = 0 * deg;
    }
    else {

      this.speed += this.gravity;
      this.y += this.speed;
      if (this.y >= cvs.height - ground.h) {
        this.y = (cvs.height - ground.h) - 6;
        die.muted=true;
        
        state.current = state.gameover;
      }

    }
    
    if (this.speed >= this.jump) {

      this.rotation = 90 * deg;
      this.frame = 1;
      die.play();

    }
    else if (state.current == state.getready) {
      this.rotation = 0 * deg;
    }
    else {
      this.rotation = -25 * deg;
    }

    if (this.y < 14) {

      this.rotation = 90 * deg;
     this.y = 14;
      collision.play();
      state.current = state.gameover;

    }




  }
  ,

  speedreset: function () {

    this.speed = 0;
  }



}

const getready = {
  sx: 251,
  sy: 67,
  sh: 28,
  sw: 96,
  x: 90,
  y: 80,
  w: 120,
  h: 40,

  draws: function () {
    if (state.current == state.getready) {
      ctx.drawImage(tamplet, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);


      //ctx.drawImage(,this.x+this.w,this.y,this.w,this.h);
    }

  }

}
const intruct1 = {
  sx: 366,
  sy: 70,
  sh: 21,
  sw: 63,
  x: 90,
  y: 180,
  w: 120,
  h: 40,

  draws: function () {
    if (state.current == state.getready) {
      ctx.drawImage(tamplet, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);

    }
    //ctx.drawImage(,this.x+this.w,this.y,this.w,this.h);


  }
}
const intruct2 = {
  sx: 386,
  sy: 38,
  sh: 34,
  sw: 22,
  x: 128,
  y: 115,
  w: 50,
  h: 75,

  draws: function () {
    if (state.current == state.getready) {
      ctx.drawImage(tamplet, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);


      //ctx.drawImage(,this.x+this.w,this.y,this.w,this.h);
    }

  }
}

const flappy = {
  sx: 149,
  sy: 196,
  sh: 32,
  sw: 101,
  x: 60,
  y: 20,
  w: 201,
  h: 50,

  draws: function () {
    if (state.current == state.getready) {
      ctx.drawImage(tamplet, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);

    }
    //ctx.drawImage(,this.x+this.w,this.y,this.w,this.h);


  }
}

const gameover = {
  sx: 149,
  sy: 170,
  sh: 29,
  sw: 101,
  x: 70,
  y: 160,
  w: 160,
  h: 60,

  draws: function () {
    if (state.current == state.gameover) {
      ctx.drawImage(tamplet, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);


      //ctx.drawImage(,this.x+this.w,this.y,this.w,this.h);
    }

  }
}

const scoreboard = {
  sx: 258,
  sy: 192,
  sh: 64,
  sw: 117,
  x: 60,
  y: 220,
  w: 180,
  h: 100,

  draws: function () {
    if (state.current == state.gameover) {
      ctx.drawImage(tamplet, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);


      //ctx.drawImage(,this.x+this.w,this.y,this.w,this.h);
    }

  }
}


const plays = {
  sx: 219,
  sy: 214,
  sh: 156,
  sw: 416,
  x: 90,
  y: 330,
  w: 120,
  h: 40,

  draws: function () {
    if (state.current == state.gameover) {
      ctx.drawImage(play, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h);


      //ctx.drawImage(,this.x+this.w,this.y,this.w,this.h);

    }
  }
}


//----------------- main functions section------------
function draw() {

  ctx.fillStyle = "#70c5ce";

  ctx.fillRect(0, 0, cvs.width, cvs.height);
  bg.draws();
  pipes.draws();
  ground.draws();
  bird.draws();
  getready.draws();
  intruct1.draws();
  intruct2.draws();
  flappy.draws();
  plays.draws();
  scoreboard.draws();
  gameover.draws();
  scores.draws();
  myname.draws();
  bg.playbg();
}

function loop() {

  draw();
  update();

  frames++;

  requestAnimationFrame(loop);

}

loop();


function update() {

  bird.update();
  ground.update();
  pipes.update();


}
