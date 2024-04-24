let height = window.innerHeight;
let width = window.innerWidth;
canvas.height = height;
canvas.width = width;
window.addEventListener("resize", (e) => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.height = height;
  canvas.width = width;
});

var popup = document.createElement("div");
const rematch = document.createElement("p");
makePopupMenu();
var matchOver = false;
var gamepause = false;
var timer = beginCounter();
const FLOOR = 0.84;

class ObjectSprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    frames = 1,
    frameSpeed,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frames = frames;
    this.currentframe = 0;
    this.frameSpeed = frameSpeed;
    this.offset = offset;
  }
  draw(width, height) {
    if (
      this.health == 0 &&
      Math.floor(this.currentframe) == this.frames - 2 &&
      matchOver == true
    ) {
      this.currentframe = this.frames - 2;
    } else {
      this.updateFrames();
    }
      c.drawImage(
        this.image,
        Math.floor(this.currentframe) * (this.image.width / this.frames),
        0,
        this.image.width / this.frames,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y + this.offset.y,
        (width / this.frames) * this.scale,
        height * this.scale
      );
  }
  updateFrames() {
    if (this.currentframe < this.frames - 1) {
      this.currentframe += this.frameSpeed;
    } else {
      this.currentframe = 0;
    }
  }
}

class CharacteSprite extends ObjectSprite {
  constructor({
    position,
    velocity,
    color,
    weapon,
    sprites,
    imageSrc,
    scale = 1,
    frames = 1,
    frameSpeed,
    offset,
  }) {
    super({
      offset,
      position,
      imageSrc,
      scale,
      frames,
      frameSpeed,
    });
    this.velocity = velocity;
    this.color = color;
    this.lastKey;
    this.weapon = weapon;
    this.isAttacking = false;
    this.health = 100;
    this.sprites = sprites;
    this.scale = scale;
    this.frames = frames;
    this.currentframe = 0;
    this.frameSpeed = frameSpeed;
    for (const sprite in this.sprites) {
      this.sprites[sprite].img = new Image();
      this.sprites[sprite].img.src = this.sprites[sprite].src;
    }
  }
  switchFrame(action) {
    if (
      this.image == this.sprites.death.img &&
      this.currentframe < this.frames - 1
    ) {
      return;
    }
    if (
      this.image == this.sprites.attack.img &&
      this.currentframe < this.frames - 1
    ) {
      return;
    }
    if (
      this.image == this.sprites.takehit.img &&
      this.currentframe < this.frames - 1
    ) {
      return;
    }
    switch (action) {
      case 0: //idle
        if (this.image !== this.sprites.idle.img) {
          this.image = this.sprites.idle.img;
          this.frames = this.sprites.idle.frames;
          this.currentframe = 0;
        }
        break;
      case 1: // run
        if (this.image !== this.sprites.run.img) {
          this.image = this.sprites.run.img;
          this.frames = this.sprites.run.frames;
          this.currentframe = 0;
        }
        break;
      case 2: // jump
        if (this.image !== this.sprites.jump.img) {
          this.image = this.sprites.jump.img;
          this.frames = this.sprites.jump.frames;
          this.currentframe = 0;
        }
        break;
      case 3: // fall
        if (this.image !== this.sprites.fall.img) {
          this.image = this.sprites.fall.img;
          this.frames = this.sprites.fall.frames;
          this.currentframe = 0;
        }
        break;
      case 4: // attack
        if (this.image !== this.sprites.attack.img) {
          this.image = this.sprites.attack.img;
          this.frames = this.sprites.attack.frames;
          this.currentframe = 0;
        }
        break;
      case 5: // takehit
        if (this.image !== this.sprites.takehit.img) {
          this.image = this.sprites.takehit.img;
          this.frames = this.sprites.takehit.frames;
          this.currentframe = 0;
        }
        break;
      case 6: // death
        if (this.image !== this.sprites.death.img) {
          this.image = this.sprites.death.img;
          this.frames = this.sprites.death.frames;
          this.currentframe = 0;
        }
        break;
    }
  }
  attack() {
    this.isAttacking = true;
    this.switchFrame(4);
  }

  update() {
    this.weapon.position.x = this.position.x + this.weapon.offsetX;
    this.weapon.position.y = this.position.y + this.weapon.offsetY;

    this.draw(this.image.width, -this.image.height);
    if (
      this.position.x + this.velocity.x >= 0 &&
      this.position.x + CHAR_WIDTH + this.velocity.x <= window.innerWidth
    ) {
      this.position.x += this.velocity.x;
    }
    if (this.position.y + this.velocity.y >= height * FLOOR) {
      this.velocity.y = 0;
      this.position.y = height * FLOOR;
    } else this.velocity.y += GRAVITY;
    this.position.y += this.velocity.y;
  }
}

function makePopupMenu() {
  rematch.innerText = "Play Y to Play Again";
  popup.appendChild(document.createTextNode("new menu"));
  document.body.appendChild(popup);
  popup.appendChild(rematch);
  popup.style.display = "none";
  popup.classList.add("message")
}

function gameReset(winner) {
  matchOver = true;
  popup.style.display = "block";
  popup.firstChild.nodeValue = `${winner}`;
  clearInterval(timer);
}

function collision(rect1, rect2) {
  return (
    rect1.weapon.position.x < rect2.position.x + CHAR_WIDTH &&
    rect1.weapon.position.x + rect1.weapon.width > rect2.position.x &&
    rect1.position.y + rect1.weapon.offsetY >= rect2.position.y + CHAR_HEIGHT &&
    rect1.position.y + rect1.weapon.offsetY + rect1.weapon.height <=
      rect2.position.y
  );
}
function beginCounter(i = 60) {
  // var i = 60;
  return setInterval(() => {
    if (i == 0) {
      if (player.health > enemy.health) {
        gameReset("Player Won");
      } else if (player.health < enemy.health) {
        gameReset("Enemy Won");
      } else {
        gameReset("It's a Draw");
      }
    }
    document.querySelector(".timer").innerHTML = `${i--}`;
  }, 1000);
}
