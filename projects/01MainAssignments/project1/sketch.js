let message = "interactiondesign";
let mouseRadius = 100;
let targetRadius = 100;
let bigWordPixels = [];
let logoImg;
let imgAspectRatio;
let imgWidth, imgHeight;
let blurAmount = 0
let targetBlurAmount = 0;


function preload() {
  font = loadFont('assets/Neue-HaasGroteskDispW0496BlkIt.otf');
  logoImg = loadImage('assets/logo_slim_square.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  textAlign(CENTER, CENTER);
  textFont(font);
  pixelDensity(1)


  gridSpacing = min(windowWidth, windowHeight) / 60;

  console.log(gridSpacing)

  imgAspectRatio = logoImg.height / logoImg.width;

  imgWidth = windowWidth>1000? 1200 : gridSpacing * 45;
  imgHeight = imgWidth

  logoImg.resize(windowWidth,windowHeight)
  logoImg.pixelDensity(1)
  logoImg.loadPixels();
}

function draw() {
  background(255)
  let index = 0;

  mouseRadius = lerp(mouseRadius, targetRadius, 0.2);
  blurAmount = lerp(blurAmount, targetBlurAmount, 0.1);

    for (let y = gridSpacing / 2; y < height; y += gridSpacing) {
      for (let x = gridSpacing / 2; x < width; x += gridSpacing) {
        let letter = message[index % message.length];
        fill(0)

        let distance = dist(mouseX, mouseY, x, y);
        let size = gridSpacing/width;

        let imgX = constrain(
          floor(map(x, (width - imgWidth) / 2, (width + imgWidth) / 2, 0, logoImg.width)),
          0,
          logoImg.width - 1
        );
        let imgY = constrain(
          floor(map(y, (height - imgHeight) / 2, (height + imgHeight) / 2, 0, logoImg.height)),
          0,
          logoImg.height - 1
        );

        let pixelIndex = (imgY * logoImg.width + imgX) * 4;
        let r = logoImg.pixels[pixelIndex];
        let g = logoImg.pixels[pixelIndex + 1];
        let b = logoImg.pixels[pixelIndex + 2];


          //inside the radius
          if (distance < mouseRadius) {
            if (r < 128 && g < 128 && b < 128) {
              size += map(distance, 0, mouseRadius, 10, 8) 
            } else {
              if (mouseRadius < 500) {
              size = map(distance/2, 0, mouseRadius, 0, 8);
              } else {
                size = map(distance/3, 0, mouseRadius, 0, 8);
              }
            }

          //outside the radius
          } else {
            size += 4;
          }

        textSize(size * 4);
        text(letter, x, y - (textAscent() + textDescent()) / 4);
        index++;
    }
  }

}

function mousePressed() { 
  targetRadius = 550;
}

function mouseReleased() { 
  targetRadius = 100;
}
