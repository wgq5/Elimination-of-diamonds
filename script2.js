// Canvas Variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fps = 24;
let frameInterval;
let gameon = false;
let score = 0;
let bestScore = 0;
let localScore = window.localStorage.getItem('score');
if (localScore != null) {
  bestScore = localScore;
  document.getElementById("best-score").innerHTML = bestScore;
}
console.log(localScore);
// window.localStorage.setItem('name', 'Obaseki Nosa');


let bulletArray = [];
let villanArray = [];
let player = {
  x: canvas.width / 2 - 30 / 2,
  y: canvas.height - 70,
  s: 20,
  w: 30,
  h: 30,
  l: 0,
  moveLeft: false,
  moveRight: false,
  isShooting: false


  // Keyboard Variables
};
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;
// const SPACE_BAR = 32;

let keyPress = event => {
  if (gameon == false) {
    startGame();
    return;
  }
  const keyPressed = event.keyCode;

  if (keyPressed === LEFT_KEY) {
    player.moveLeft = true;
  }
  if (keyPressed === UP_KEY) {
    if (player.isShooting != true) {
      newBullet(player, -1);
      player.isShooting = true;
    }
  }
  if (keyPressed === RIGHT_KEY) {
    player.moveRight = true;
  }
  if (keyPressed === DOWN_KEY) {
  }
};

keyRelease = event => {
  const keyPressed = event.keyCode;
  if (keyPressed === LEFT_KEY) player.moveLeft = false;
  if (keyPressed === UP_KEY) player.isShooting = false;
  if (keyPressed === RIGHT_KEY) player.moveRight = false;
  if (keyPressed === DOWN_KEY) return;
};

movePlayer = () => {
  if (player.moveLeft == true) {
    if (player.x - player.s < 0) {
      return;
    }
    player.x = player.x - player.s;
  }
  if (player.moveRight == true) {
    if (player.x + player.s + player.w > canvas.width) {
      return;
    }
    player.x = player.x + player.s;
  }
};

newBullet = (shooter, direction) => {
  let bullet = {
    x: shooter.x - 5 + shooter.w / 2,
    y: shooter.y - 20,
    w: 10,
    h: 20,
    s: 15,
    d: direction };

  bulletArray.push(bullet);
  // console.log(bulletArray);
};

moveBullets = () => {
  for (let i = 0; i < bulletArray.length; i++) {
    bulletArray[i].y = bulletArray[i].y + bulletArray[i].s * bulletArray[i].d;
    if (bulletArray[i].y < 0 || bulletArray[i].y > canvas.height)
    bulletArray.splice(i, 1);
  }
};

let villanInt = 124;
let villanIncrement = 0;
let prevVillan = 0;
let maxVillanSpeed = 4;

makeVillans = () => {
  if (villanIncrement > prevVillan + villanInt || villanIncrement == 0) {
    let villanSize = Math.floor(Math.random() * 3) + 1;
    let villan = {
      x:
      Math.floor(Math.random() * (canvas.width - 50 * villanSize * 2)) +
      villanSize,
      y: 0,
      w: 50 * villanSize,
      h: 50 * villanSize,
      speed: maxVillanSpeed - villanSize,
      size: villanSize };

    prevVillan = villanIncrement;
    villanArray.push(villan);
    // console.log(villanArray);
  }
  villanIncrement++;
  if (villanIncrement % 200 == 0 && villanInt > 20) {
    maxVillanSpeed=maxVillanSpeed+5;
    villanInt = villanInt - 10;
    // levelUp();
  }
};

moveVillans = () => {
  for (let i = 0; i < villanArray.length; i++) {
    villanArray[i].y = villanArray[i].y + villanArray[i].speed;
    if (villanArray[i].y + villanArray[i].h > canvas.height) {
      villanArray.splice(i, 1);
      lostLife();
    }
  }
};

checkVillanCollision = () => {
  if (villanArray.length == 0 || bulletArray.length == 0) return;
  for (let i = 0; i < villanArray.length; i++) {
    for (let j = 0; j < bulletArray.length; j++) {
      if (
      villanArray[i].x < bulletArray[j].x &&
      villanArray[i].x + villanArray[i].w >
      bulletArray[j].x + bulletArray[j].w &&
      villanArray[i].y < bulletArray[j].y &&
      villanArray[i].y + villanArray[i].h > bulletArray[j].y &&
      bulletArray[j].d != 1)
      {
        villanArray[i].size--;
        villanArray[i].w = 50 * villanArray[i].size;
        villanArray[i].h = 50 * villanArray[i].size;
        villanArray[i].x =
        villanArray[i].x + (50 * villanArray[i].size + 1) / 2;
        villanArray[i].speed = maxVillanSpeed - villanArray[i].size;
        //
        bulletArray.splice(j, 1);
        score++;
        document.getElementById("score").innerHTML = score;
      }
    }
    if (villanArray[i].size <= 0) villanArray.splice(i, 1);
  }
};

redFlash = false;
lostLife = () => {
  player.l = player.l - 0.1;
  if (player.l <= 0) endGame();
  redFlash = true;
  setTimeout(() => {
    redFlash = false;
  }, 50);
};
// levelUp = () =>{
// var title = document.getElementById("levelup-title");
// title.classList.remove("hide");
// setTimeout(()=>{
//   title.classList.add("hide");
// },1500);
// }
// Draw game
draw = () => {
  drawPlayer(player);
  drawGround();
  drawHealth(player);

  bulletArray.forEach(drawBullets);
  villanArray.forEach(drawVillan);

  if (redFlash == true) drawRedFlash();
};

drawPlayer = self => {
  ctx.fillStyle = "aqua";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "aqua";
  ctx.beginPath();
  ctx.rect(player.x, player.y, player.w, player.h);
  ctx.fill();
};
drawGround = () => {
  ctx.fillStyle = "green";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "green";
  ctx.beginPath();
  ctx.rect(0, canvas.height - 20, canvas.width, 20);
  ctx.fill();
};
drawHealth = self => {
  ctx.fillStyle = "red";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "red";
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width * player.l, 5);
  ctx.fill();
};

drawBullets = self => {
  ctx.fillStyle = "pink";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "pink";
  ctx.beginPath();
  ctx.rect(self.x, self.y, self.w, self.h);
  ctx.fill();
};

drawVillan = self => {
  ctx.fillStyle = "orange";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "orange";
  ctx.beginPath();
  ctx.rect(self.x, self.y, self.w, self.h);
  ctx.fill();
};

drawRedFlash = () => {
  ctx.fillStyle = "red";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "red";
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();
};

function gameOver(result) {}


// Frame Changes
frame = () => {
  frameInterval = setTimeout(function () {
    //Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    moveBullets();

    makeVillans();
    moveVillans();

    checkVillanCollision();
    //Check If Collect Power
    // checkCollectPower();
    //Check Collide Opponent
    // checkCollideOpp();
    //Check collide Self
    // checkCollideSelf();

    draw();
    if (gameon == true) {
      requestAnimationFrame(frame);
    }
  }, 1000 / fps);
};

draw();

function startGame() {

  var screens = document.getElementsByClassName("extra-screen");
  for (var i = 0; i < screens.length; i++) {
    screens[i].classList.add("hide");
  }
  score = 0;
  document.getElementById("score").innerHTML = score;
  let recTitle = document.getElementById("new-record");
  recTitle.classList.add("hide");
  bulletArray = [];
  villanArray = [];
  player = {
    x: canvas.width / 2 - 30 / 2,
    y: canvas.height - 70,
    s: 20,
    w: 30,
    h: 30,
    l: 1,
    moveLeft: false,
    moveRight: false,
    isShooting: false };

  villanInt = 124;
  villanIncrement = 0;
  prevVillan = 0;
  maxVillanSpeed = 4;
  gameon = true;
  frame();
}

function endGame() {
  gameon = false;
  clearInterval(frameInterval);
  var title = document.getElementById("lose-title");
  title.classList.remove("hide");
  if (score > bestScore * 1) {
    window.localStorage.setItem('score', score);
    bestScore = score;
    document.getElementById("best-score").innerHTML = bestScore;
    var recTitle = document.getElementById("new-record");
    recTitle.classList.remove("hide");
  }

}

document.addEventListener("keydown", keyPress);
document.addEventListener("keyup", keyRelease);