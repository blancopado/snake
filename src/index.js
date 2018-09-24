var canvas = document.getElementById("myCanvas");
canvas.width = 300;
canvas.height = 270;

var ctx = canvas.getContext("2d");

var HELPERS = {
  tileSize: 10
};

function Food() {
  this.position = { x: 15, y: 4 };
}

Food.prototype.setPosition = function(snakeBody) {
  this.position.x = Math.floor(Math.random() * 30);
  this.position.y = Math.floor(Math.random() * 27);
  for (var i = 0; i < snakeBody.length; i++) {
    if (
      snakeBody[i].x === this.position.x &&
      snakeBody[i].y === this.position.y
    ) {
      this.setPosition(snakeBody);
    }
  }
};

function Snake() {
  this.body = [{ x: 5, y: 4 }, { x: 4, y: 4 }, { x: 3, y: 4 }];
  this.direction = { x: 1, y: 0 };
  this.isAlive = true;
}

Snake.prototype.move = function() {
  this.body.pop();
  var newHead = {
    x: this.body[0].x + this.direction.x,
    y: this.body[0].y + this.direction.y
  };
  newHead = this.checkBordersColision(newHead);
  this.body.unshift(newHead);
  this.checkBodyColision();
};

Snake.prototype.checkBodyColision = function() {
  for (let i = 1; i < this.body.length; i++) {
    if (
      this.body[0].x === this.body[i].x &&
      this.body[0].y === this.body[i].y
    ) {
      this.isAlive = false;
    }
  }
};

Snake.prototype.checkFoodColision = function(foodPosition) {
  if (this.body[0].x === foodPosition.x && this.body[0].y === foodPosition.y) {
    this.grow();
    return true;
  }
};

Snake.prototype.checkBordersColision = function(newHead) {
  if (newHead.x <= -1) {
    newHead.x = 29;
  } else if (newHead.x >= 30) {
    newHead.x = 0;
  } else if (newHead.y <= -1) {
    newHead.y = 26;
  } else if (newHead.y >= 27) {
    newHead.y = 0;
  }
  return newHead;
};

Snake.prototype.grow = function() {
  var lastIndex = this.body.length - 1;
  var newTail = {
    x: this.body[lastIndex].x,
    y: this.body[lastIndex].y
  };
  this.body.push(newTail);
};

Snake.prototype.setDirection = function(newDirection) {
  this.direction.x = newDirection.x;
  this.direction.y = newDirection.y;
};

var Game = {
  init: function() {
    this.snake = new Snake();
    this.food = new Food();
    this.setControls();
    this.interval = this.startGame();
    this.isPaused = false;
  },

  togglePause: function() {
    if (this.isPaused) {
      this.isPaused = false;
    } else {
      this.isPaused = true;
    }
  },

  setControls: function() {
    this.controlsHandler = this.controls.bind(this);
    document.addEventListener("keydown", this.controlsHandler);
  },

  controls: function(e) {
    if (e.keyCode === 38 && this.snake.direction.y !== 1) {
      // up arrow key
      this.snake.setDirection({ x: 0, y: -1 });
    } else if (e.keyCode === 39 && this.snake.direction.x !== -1) {
      // right arrow key
      this.snake.setDirection({ x: 1, y: 0 });
    } else if (e.keyCode === 40 && this.snake.direction.y !== -1) {
      // down arrow key
      this.snake.setDirection({ x: 0, y: 1 });
    } else if (e.keyCode === 37 && this.snake.direction.x !== 1) {
      // left arrow key
      this.snake.setDirection({ x: -1, y: 0 });
    } else if (e.keyCode === 80) {
      // Pause game
      this.togglePause();
    }
  },

  startInterval: function() {
    var intervalId = setInterval(
      function() {
        if (!this.isPaused) {
          this.snake.move();
          var snakePosition = this.snake.body,
            foodPosition = this.food.position,
            snakeIsAlive = this.snake.isAlive,
            snakeEatsFood = this.snake.checkFoodColision(foodPosition);
          if (!snakeIsAlive) {
            this.clearInterval();
            view.printGameOver();
          } else {
            if (snakeEatsFood) {
              this.food.setPosition(this.snake.body);
            }
            view.clearCanvas();
            view.printFood(foodPosition);
            view.printSnake(snakePosition);
          }
        }
      }.bind(this),
      120
    );
    return intervalId;
  },

  clearInterval: function() {
    this.interval = clearInterval(this.interval);
  },

  startGame: function() {
    this.interval = this.startInterval();
  }
};

var view = {
  clearCanvas: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },
  printSnake: function(snakePosition) {
    for (var i = 0; i < snakePosition.length; i++) {
      ctx.beginPath();
      ctx.rect(
        snakePosition[i].x * HELPERS.tileSize,
        snakePosition[i].y * HELPERS.tileSize,
        HELPERS.tileSize,
        HELPERS.tileSize
      );
      ctx.fillStyle = "#7CFC00";
      ctx.fill();
    }
  },
  printFood: function(foodPosition) {
    ctx.beginPath();
    ctx.rect(
      foodPosition.x * HELPERS.tileSize,
      foodPosition.y * HELPERS.tileSize,
      HELPERS.tileSize,
      HELPERS.tileSize
    );
    ctx.fillStyle = "red";
    ctx.fill();
  },

  printGameOver: function() {
    ctx.font = "bold 35px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#3d9eff";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }
};

Game.init();
