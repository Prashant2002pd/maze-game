let cols, rows;
let size = 40;

let grid = [];
let stack = [];
let current;
let source;
let start;
let end;
let path = [];
let flag = 0;
let isstarted = false;
let button;
function setup() {
  let canvas = createCanvas(600, 600);
  cols = floor(width / size);
  rows = floor(height / size);
  centerCanvas();
  // frameRate(10);
  function centerCanvas() {
    const x = (windowWidth - width) / 2; // Calculate the x position
    const y = (windowHeight - height) / 2; // Calculate the y position
    canvas.position(x, y); // Set the position of the canvas
  }
  for (let i = 0; i < rows; i++) {
    let temp = [];
    for (let j = 0; j < cols; j++) {
      let cell = new Cell(i, j);
      temp.push(cell);
    }
    grid.push(temp);
  }
  current = grid[0][0];
  source = grid[0][0];

  start = grid[0][0];
  end = grid[rows - 1][cols - 1];

  button = document.getElementById("button");
  button.addEventListener("click", function () {
    isstarted = !isstarted;
  });
}

function draw() {
  background(0);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j].show();
    }
  }

  source.highlight(0, 255, 0, 100);
  end.highlight(255, 0, 0, 100);

  if (isstarted) {
    let next;
    if (current) {
      current.visited = true;
      current.highlight(0, 200, 0, 100);
      next = current.checkNeighbors();
    }
    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else if (flag == 0) {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          grid[i][j].visited = false;
        }
      }
      current = null; // Stop maze generation
      isstarted = false;
      button.innerHTML = "Start Path Finding";
      if (flag == 0) {
        flag = 1;
      }
    }
    if (flag == 1) {
      if (start) {
        start.visited = true;
        start.highlight(0, 200, 0, 100);
      }

      if (start && start !== end) {
        let neighbor = start.getNeighbors(); // Use getValidNeighbor method

        if (neighbor) {
          neighbor.visited = true;
          path.push(neighbor);
          start = neighbor;
        } else {
          path.pop();
          start = path[path.length - 1];
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;

  this.checkNeighbors = function () {
    let neighbors = [];
    let top = grid[i - 1] && grid[i - 1][j];
    let right = grid[i][j + 1];
    let bottom = grid[i + 1] && grid[i + 1][j];
    let left = grid[i][j - 1];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      let r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  };

  this.getNeighbors = function () {
    let neighbors = [];
    let top = grid[this.i - 1] && grid[this.i - 1][this.j];
    let right = grid[this.i][this.j + 1];
    let bottom = grid[this.i + 1] && grid[this.i + 1][this.j];
    let left = grid[this.i][this.j - 1];
    if (top && !this.walls[0] && !top.visited) {
      this.walls[0];
      neighbors.push(top);
    }
    if (right && !this.walls[1] && !right.visited) {
      this.walls[1];
      neighbors.push(right);
    }
    if (bottom && !this.walls[2] && !bottom.visited) {
      this.walls[2];
      neighbors.push(bottom);
    }
    if (left && !this.walls[3] && !left.visited) {
      this.walls[3];
      neighbors.push(left);
    }
    if (neighbors.length > 0) {
      return neighbors[0];
    } else {
      return undefined;
    }
  };

  this.highlight = function (r, g, b, o) {
    let x = this.j * size;
    let y = this.i * size;
    noStroke();
    fill(r, g, b, o);
    rect(x, y, size, size);
  };

  this.show = function () {
    let x = this.j * size;
    let y = this.i * size;

    stroke(255);
    if (this.walls[0]) {
      line(x, y, x + size, y);
    }
    if (this.walls[1]) {
      line(x + size, y, x + size, y + size);
    }
    if (this.walls[2]) {
      line(x + size, y + size, x, y + size);
    }
    if (this.walls[3]) {
      line(x, y + size, x, y);
    }

    if (this.visited && path.includes(this)) {
      noStroke();
      fill(0, 100, 0, 100);
      rect(x, y, size, size);
    }
  };
}

function removeWalls(a, b) {
  let x = a.j - b.j;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  let y = a.i - b.i;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
