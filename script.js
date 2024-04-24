const c = canvas.getContext("2d");
const CHAR_HEIGHT = -130;
const CHAR_WIDTH = 65;
const GRAVITY = 4;
const DAMAGE = 20;
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

const background = new ObjectSprite({
  frames: 1,
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./background.png",
  frameSpeed: 0,
});


const shop = new ObjectSprite({
  frames: 6,
  scale: 3,
  position: {
    x: width * 0.6,
    y: height * FLOOR,
  },
  imageSrc: "./shop.png",
  frameSpeed: 0.3,
});

const player = new CharacteSprite({
  weapon: {
    position: {
      x: 0,
      y: 0,
    },
    width: 150,
    height: 50,
    offsetX: CHAR_WIDTH + 20,
    offsetY: -100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  position: {
    x: 100,
    y: height,
  },
  offset: {
    x: 225,
    y: 200,
  },
  sprites: {
    idle: {
      src: "./mak/Idle.png",
      frames: 8,
    },
    attack: {
      src: "./mak/Attack1.png",
      frames: 6,
    },
    death: {
      src: "mak/Death.png",
      frames: 6,
    },
    jump: {
      src: "./mak/Jump.png",
      frames: 2,
    },
    fall: {
      src: "./mak/Fall.png",
      frames: 2,
    },
    takehit: {
      src: "./mak/Takehit.png",
      frames: 4,
    },
    run: {
      src: "./mak/Run.png",
      frames: 8,
    },
  },
  imageSrc: "./mak/Idle.png",
  frames: 8,
  scale: 2.5,
  frameSpeed: 0.5,
});

const enemy = new CharacteSprite({
  weapon: {
    position: {
      x: 0,
      y: 0,
    },
    width: 130,
    height: 50,
    offsetX: -170,
    offsetY: -100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  position: {
    x: 500,
    y: height,
  },
  offset: {
    x: 225,
    y: 185,
  },
  imageSrc: "./kenji/Idle.png",
  frames: 4,
  frameSpeed: 0.3,
  scale: 2.5,
  sprites: {
    idle: {
      src: "./kenji/Idle.png",
      frames: 4,
    },
    attack: {
      src: "./kenji/Attack1.png",
      frames: 4,
    },
    death: {
      src: "./kenji/Death.png",
      frames: 7,
    },
    jump: {
      src: "./kenji/Jump.png",
      frames: 2,
    },
    fall: {
      src: "./kenji/Fall.png",
      frames: 2,
    },
    takehit: {
      src: "./kenji/Takehit.png",
      frames: 3,
    },
    run: {
      src: "./kenji/Run.png",
      frames: 8,
    },
  },
});


window.addEventListener("keypress", (e) => {
  switch (e.key) {
    case "y":
    case "Y":
      if (matchOver && gamepause == false) {
        timer = beginCounter();
        player.health = 100;
        enemy.health = 100;
        player.switchFrame(0);
        enemy.switchFrame(0);
        popup.style.display = "none";
        matchOver = false;
      }
      break;
    case "p":
    case "P":
      if (matchOver == false && gamepause == false) {
        matchOver = true;
        gamepause = true;
        clearInterval(timer);
        popup.firstChild.nodeValue = "Paused";
        rematch.innerHTML = "Press P to play Resume";
        popup.style.display = "block";
      } else if (gamepause == true) {
        matchOver = false;
        gamepause = false;
        popup.style.display = "none";
        rematch.innerHTML = "press Y to play again";
        timer = beginCounter(
          Number(document.querySelector(".timer").innerHTML) - 1
        );
      }
  }
});

function animate() {
  window.requestAnimationFrame(animate);
  background.draw(width, height);
  shop.draw(shop.image.width, -shop.image.height);
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  // plyaer
  if (player.health > 0) {
    if (keys.a.pressed && player.lastKey === "a") {
      player.velocity.x = -10;
      player.switchFrame(1);
    } else if (keys.d.pressed && player.lastKey === "d") {
      player.velocity.x = 10;
      player.switchFrame(1);
    } else if (player.velocity.y < 0) {
      player.switchFrame(2);
    } else if (player.velocity.y > 0) {
      player.switchFrame(3);
    } else {
      player.switchFrame(0);
    }
  }
  //enemy
  if (enemy.health > 0) {
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
      enemy.velocity.x = -10;
      enemy.switchFrame(1);
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
      enemy.velocity.x = 10;
      enemy.switchFrame(1);
    } else if (enemy.velocity.y < 0) {
      enemy.switchFrame(2);
    } else if (enemy.velocity.y > 0) {
      enemy.switchFrame(3);
    } else {
      enemy.switchFrame(0);
    }
  }
  //collision - detecting attack
  if (matchOver == false) {
    // enemy taking hit
    if (
      collision(player, enemy) &&
      player.isAttacking &&
      Math.floor(player.currentframe) == 4
    ) {
      enemy.health -= DAMAGE;
      if (enemy.health < 0) enemy.health = 0;
      document.documentElement.style.setProperty("--enemy-health", enemy.health);
      if (enemy.health == 0) {
        enemy.switchFrame(6);
        gameReset("Player Won");
      } else {
        enemy.switchFrame(5);
      }
      player.isAttacking = false;
    }

    // player taking hit
    if (
      collision(enemy, player) &&
      enemy.isAttacking &&
      Math.floor(enemy.currentframe) == 2
    ) {
      player.health -= DAMAGE;
      if (player.health < 0) player.health = 0;
      document.documentElement.style.setProperty("--player-health", player.health);
      if (player.health == 0) {
        player.switchFrame(6);
        gameReset("Enemy Won");
      } else {
        player.switchFrame(5);
      }
      enemy.isAttacking = false;
    }

  }
  if (Math.floor(player.currentframe) == 4) {
    player.isAttacking = false;
  }
  if (Math.floor(enemy.currentframe) == 2) {
    enemy.isAttacking = false;
  }
}
animate();

window.addEventListener("keydown", (event) => {
  // player
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      if (player.position.y == height * FLOOR && player.health > 0) {
        player.velocity.y = -60;
      }
      break;
    case " ":
      player.attack();
      break;
  }
  // enemy
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      if (enemy.position.y == height * FLOOR && enemy.health > 0) {
        enemy.velocity.y = -60;
      }
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});
window.addEventListener("keyup", (e) => {
  // player
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      if (keys.a.pressed) {
        player.lastKey = "a";
      }
      break;
    case "a":
      keys.a.pressed = false;
      if (keys.d.pressed) {
        player.lastKey = "d";
      }
      break;
  }
  // enemy keys
  switch (e.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      if (keys.ArrowLeft.pressed) {
        enemy.lastKey = "ArrowLeft";
      }
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      if (keys.ArrowRight.pressed) {
        enemy.lastKey = "ArrowRight";
      }
      break;
  }
});
