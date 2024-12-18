let cursors = [];
let followCursor;
let buttons = []
let buttonFlags = []
let extraButtons = []
let extraButtonFlags = []
let bigDiv = {};
let topRect = {}; 
let bottomRect = {}; 

let buttonWidth = 100;
let buttonHeight = 100;
let gridRows = 5;
let gridCols = 5;
let padding = 7 

let gridWidth
let gridHeight
let reloadButton;
let skipButton;

let winningPercentage = 0.75;

let currentPercentage
let percentage 
let coloredCount

let startFlag = false
let checkmarkFlag = false

let cursorFlag = true 

function preload() {
  cursor = loadImage('assets/default.svg');
  refreshImg = loadImage('assets/refresh.svg');
  headphoneImg = loadImage('assets/headphones.svg');
  infoImg = loadImage('assets/info.svg');

  captcha = loadImage('assets/recaptcha2.svg')
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  smooth()
  const numCursors = 0
  gridWidth= gridCols * (buttonWidth + padding) - padding;
  gridHeight = gridRows * (buttonHeight + padding) - padding;

  let bigDivWidth = gridWidth + padding * 2;
  let bigDivHeight = gridHeight + 300; 

  let scaleFactor = 1;
  if (bigDivHeight > height || bigDivWidth > width) {
    scaleFactor = min(
      (height) / bigDivHeight,
      (width - 100) / bigDivWidth
    );
  }

  bigDiv = {
    x: (width - bigDivWidth) / 2,
    y: (height - bigDivHeight) / 2,
    width: bigDivWidth,
    height: bigDivHeight,
  };
  topRect = {
    x: bigDiv.x + padding,
    y: bigDiv.y + padding,
    width: bigDiv.width- 2*padding,
    height: (bigDiv.height-2*padding - gridHeight)/ 1.5,
  };
  bottomRect = {
    x: bigDiv.x+padding,
    y: bigDiv.y + topRect.height + gridHeight +3*padding,
    width: bigDiv.width-2*padding,
    height: (bigDiv.height -topRect.height- gridHeight + 2*padding) / 1.5
  };

  bigDivWidth = gridWidth + padding * 2;
  bigDivHeight = gridHeight + 300 * scaleFactor*2;

  buttonWidth *= scaleFactor;
  buttonHeight *= scaleFactor;
  padding *= scaleFactor;


  let buttonStartX = bigDiv.x + (bigDiv.width - gridWidth) / 2 + buttonWidth / 2;
  let buttonStartY = topRect.y + topRect.height + buttonHeight / 2 + padding;
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      let x = buttonStartX + col * (buttonWidth + padding);
      let y = buttonStartY + row * (buttonHeight + padding);
      buttons.push({ x: x, y: y, width: buttonWidth, height: buttonHeight });
      buttonFlags.push(false);
    }
  }

  extraButtons.push({ x: width / 2, y: 100, width: 200, height: 100 });
  extraButtonFlags.push(false);

  reloadButton = {x:bigDiv.width + bigDiv.width/1.71 + padding/4, y:bottomRect.y +5.65*padding, width:100, height:65}

  checkMarkButton = {x:width/2 - 125,y:height/2,width:40,height:40}
  // rect(-125, 0, 40, 40,2,2,2,2)  


  for (let i = 0; i < numCursors; i++) {
    cursors.push(new Cursor(width, height));
  }

  followCursor = new FollowCursor(width, height);
}

function draw() {
  background(255);

  if (!startFlag) {
    rectMode(CENTER);
    translate(width / 2, height / 2);

    rect(0, 0, 350, 100, 5, 5, 5, 5);

    textAlign(CENTER, CENTER);
    textSize(23);
    text("I'm not a robot", -20, 0);

    if (checkmarkFlag) {
      push();
      stroke(0, 200, 0);
      strokeWeight(5);
      noFill();
      translate(-5, 0);
      line(-135, -10, -125, 10);
      line(-125, 10, -100, -25);


      pop();
    } else {
      rect(-125, 0, 40, 40, 2, 2, 2, 2);
    }

    image(captcha, +100, -20, 52, 50);
  }
  else {

  noCursor()

  for (let i = 0; i < buttons.length; i++) {
    drawButtonGrid(buttons[i],' ', buttonFlags[i]);
  }

  drawUI()

  let coloredCount = countColoredButtons();
  percentage = (coloredCount / buttons.length) * 100;

    cursors.forEach((cursor) => {
      cursor.draw();
    });
    followCursor.draw();
  }
}

function drawUI() {

  rectMode(CORNER)
  noFill();
  strokeWeight(2)
  stroke(0,0,0,100);
  rect(bigDiv.x, bigDiv.y, bigDiv.width, bigDiv.height);

  fill(80,170,255)	
  noStroke();
  rect(topRect.x, topRect.y, topRect.width, topRect.height);

  fill(255);
  rect(bottomRect.x, bottomRect.y, bottomRect.width, bottomRect.height);

  textAlign(LEFT, CENTER);
  textStyle(BOLD)
  textSize(25);
  fill(255);
  text(`Fill at least ${winningPercentage * 100}% to continue`, (topRect.x + 7*padding), topRect.y + padding + topRect.height/3 - 2*padding);
  textSize(50);
  text(`${round(percentage)}%`,(topRect.x + 7*padding),topRect.y+topRect.height/2+3*padding);
  

  textStyle(NORMAL)
  textSize(15);
  fill(80,170,255)	
  textAlign(CENTER, CENTER);
  fill(255)

  let coloredCount = countColoredButtons();
  fill(255)

  if (coloredCount >= buttons.length * winningPercentage) {
    rect(topRect.x-padding/2,topRect.y+topRect.height,gridWidth+padding,gridHeight+2*padding)
    fill(0)
    textSize(25)
    text("Good enough,\n you are probably human", topRect.x + topRect.width/2, topRect.y + topRect.height + padding + gridHeight/2)
  }

  reloadButton = {
    x: bigDiv.x + bigDiv.width - reloadButton.width / 2 - padding,
    y: bigDiv.y + bigDiv.height - reloadButton.height / 2 - 2*padding,
    width: 100,
    height: 65
  };

  drawButton(reloadButton, "Reload", false);
  drawButton(reloadButton, (coloredCount >= buttons.length * winningPercentage)?"Reload":'',false )

  tint(255, 100);
  image(refreshImg, bigDiv.x +10, reloadButton.y - 26.5, 50, 50);
  image(headphoneImg, bigDiv.x + 70, reloadButton.y - 24.5, 45, 45);
  image(infoImg, bigDiv.x + 130, reloadButton.y - 25.5, 48, 48);
  noTint()
}

function drawButton(button, buttonText, buttonFlag) {
  rectMode(CENTER);
  fill(80,170,255)
  rect(button.x, button.y, button.width, button.height, 3, 3, 3, 3);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20)
  text(buttonText, button.x, button.y);
}

function drawButtonGrid(button, buttonText, buttonFlag) {
  rectMode(CENTER);
  fill(buttonFlag ? color(0,250,0) : color(200,200,200));

  rect(button.x, button.y, button.width, button.height, 2, 2, 2, 2);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(30);
  text(buttonText, button.x, button.y);
}

function countColoredButtons() {
  let count = 0;
  for (let i = 0; i < buttonFlags.length; i++) {
    if (buttonFlags[i]) {
      count++;
    }
  }
  return count;
}

function isInsideButton(x, y, button) {
  return x > button.x - button.width / 2 &&
         x < button.x + button.width / 2 &&
         y > button.y - button.height / 2 &&
         y < button.y + button.height / 2;
}

function isCursorOverButton(button) {
  for (let cursor of cursors) {
    if (isInsideButton(cursor.x, cursor.y, button)) {

      return true;
    }
  }
  return false;
}

function mouseMoved() {
  const movement = { x: movedX, y: movedY };
  cursors.forEach((cursor) => {
    cursor.move(movement);
  });

  if (followCursor) {
    followCursor.move({ x: mouseX, y: mouseY });
  }
}

function mousePressed() {
  let coloredCount = countColoredButtons();

  if (isInsideButton(mouseX, mouseY, checkMarkButton)) {
    checkmarkFlag = true
    setTimeout(() => {
      console.log('test')
      startFlag = true;
    }, 1000)
  }

  if (coloredCount >= buttons.length * winningPercentage) {
    if (isInsideButton(mouseX, mouseY, reloadButton) || isCursorOverButton(reloadButton)) {
      window.location.reload();
    }
    return;
  }

  if (cursors.length < 30 && startFlag && cursorFlag)  {
    cursors.push(new Cursor(width, height, mouseX, mouseY));
    } else {
      console.log('max')
    }

  for (let i = 0; i < extraButtons.length; i++) {
    if (isInsideButton(mouseX, mouseY, extraButtons[i]) || isCursorOverButton(extraButtons[i])) {
      extraButtonFlags[i] = !extraButtonFlags[i];
    }
  }


  if (startFlag) {
    for (let i = 0; i < buttons.length; i++) {
      if (isInsideButton(mouseX, mouseY, buttons[i]) || isCursorOverButton(buttons[i])) {
        buttonFlags[i] = !buttonFlags[i];
      }
    }
  }
}


function keyPressed() {
  if (keyCode === 32) { 
    cursorFlag = !cursorFlag
    console.log('Cursors', cursorFlag)
  }
  if (!cursorFlag) {
    cursors.splice(0, cursors.length);
  }
  
}