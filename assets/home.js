function preload() {
  helvetica_light = loadFont(
    "https://cdn.glitch.global/66e497d9-d0f8-4357-b2ae-33c3e94f0744/HelveticaNeue-Light.otf?v=1739461229409"
  );
  helvetica_regular = loadFont(
    "https://cdn.glitch.global/66e497d9-d0f8-4357-b2ae-33c3e94f0744/HelveticaNeue-Regular.otf?v=1736738849826"
  );
  helvetica_medium = loadFont(
    "https://cdn.glitch.global/66e497d9-d0f8-4357-b2ae-33c3e94f0744/HelveticaNeue-Medium.otf?v=1736738843567"
  );
  helvetica_bold = loadFont(
    "https://cdn.glitch.global/66e497d9-d0f8-4357-b2ae-33c3e94f0744/HelveticaNeue-Bold.otf?v=1736738842443"
  );
}
let margin;
let gutter;
let cornerSize;
let title;

var curCol;
var startRow;
var endRow;

var totalMem;

function setup() {
  uh_oh = loadImage(
    "https://cdn.glitch.global/66e497d9-d0f8-4357-b2ae-33c3e94f0744/uh_oh.png?v=1739474781010"
  );
  title = loadImage(
    "https://cdn.glitch.global/66e497d9-d0f8-4357-b2ae-33c3e94f0744/landing.png?v=1743858303575"
  );
  margin = 15;
  gutter = 15;
  cornerSize = 20;
  createCanvas(windowWidth, 900);
  background(0);
  startRow = -1;
  entries = [];
  textFont(helvetica_regular);
  textSize(14);
  totalMem = 0;
}

function draw() {
  background(255);

  if (width < 1350) { // If the window is too small, show the "uh oh" image
    image(uh_oh, 0, 0);
    return;
  }
  
  drawTicks();
  for (let i = 0; i < entries.length; i++) {
    p = entries[i];
    p.display();
  }
  if (mouseIsPressed) {
    drawTempBlock(curCol, startRow, max(getRow(), 0));
  }
  drawTotalMemory();
}

function drawTotalMemory() {
  let w = width - 2 * margin + gutter;
  var colSize = w / 8;
  fill(33);
  noStroke();
  text(
    `Click and drag to begin. Memory Allocated: ${totalMem} bytes`,
    colSize * 1 + margin,
    height / 32 - 10
  );

  if (
    colSize * 6 <= mouseX &&
    mouseX <= colSize * 8 &&
    height / 32 - 30 <= mouseY &&
    mouseY <= height / 32 - 10
  ) {
    textFont(helvetica_bold);
  }

  text("Start Module", colSize * 6 + margin, height / 32 - 10);

  textFont(helvetica_regular);
}

function getColumn() {
  let w = width - 2 * margin + gutter;
  var colSize = w / 8;
  for (var i = 0; i < 8; i++) {
    if (
      colSize * i <= mouseX &&
      mouseX <= colSize * (i + 1) &&
      mouseY > height / 32
    ) {
      return i;
    }
  }
  return -1;
}

function getRow() {
  for (var j = 0; j < 35; j++) {
    if (
      height / 32 + j * 25 <= mouseY &&
      mouseY <= height / 32 + (j + 1) * 25
    ) {
      return min(j, 29);
    }
  }
  return -1;
}

function mousePressed() {
  var col = getColumn();
  var row = getRow();
  if (col > 0 && row >= 0 && startRow == -1) {
    curCol = col;
    startRow = row;
  }
}

function mouseReleased() {
  let w = width - 2 * margin + gutter;
  var colSize = w / 8;
  var href = "https://www.malloclab.com/pages/welcome.html";
  if (
    colSize * 6 <= mouseX &&
    mouseX <= colSize * 8 &&
    height / 32 - 30 <= mouseY &&
    mouseY <= height / 32
  ) {
    window.open(href, "_self");
  }
  endRow = getRow();
  if (startRow != endRow) createEntry(curCol, startRow, max(getRow(), 0));
  startRow = -1;
  curCol = -1;
}

function createEntry(col, sr, er) {
  entries.push(new Entry(col, sr, er));
}

function drawTicks() {
  var addr = 0;
  stroke(0, 0, 0, 30);
  let w = width - 2 * margin + gutter;
  var colSize = w / 8;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 30; j++) {
      if (i == 0) {
        text(
          `+${addr + 8 * j} bytes`,
          colSize / 2 + margin,
          height / 32 + 5 + j * 25
        );
      } else {
        line(
          colSize * i + margin,
          height / 32 + j * 25,
          colSize * (i + 1),
          height / 32 + j * 25
        );
      }
    }
  }
}

function drawTitle() {
  image(title, 0, 0);
}

function drawTempBlock(c, s, e) {
  blendMode(MULTIPLY);
  fill(241, 162, 69, 50);
  let w = width - 2 * margin + gutter;
  var colSize = w / 8;
  rect(
    colSize * c + margin,
    height / 32 + s * 25,
    colSize - margin,
    (e - s) * 25,
    cornerSize
  );
  blendMode(BLEND);
}

// entries
class Entry {
  constructor(c, s, e) {
    this.c = c;
    this.start = s;
    this.end = e;
    totalMem += abs(e - s) * 8;
  }

  display() {
    blendMode(MULTIPLY);
    fill(241, 162, 69, 150);
    let w = width - 2 * margin + gutter;
    var colSize = w / 8;
    rect(
      colSize * this.c + margin,
      height / 32 + this.start * 25,
      colSize - margin,
      (this.end - this.start) * 25,
      cornerSize
    );
    blendMode(BLEND);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, 900); // Resize canvas to match new window size
}
