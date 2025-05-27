window.sketchMutate = (p) => {
  let font;
  let basePoints = [];

  let distortionSlider;
  let textInput;

  let textToDraw = "Cellular";
  let fontSize = 200;

  p.preload = () => {
    font = p.loadFont('fonts/Cellular-Regular.ttf');
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noLoop();

    distortionSlider = document.getElementById("distortionSlider");
    textInput = document.getElementById("textInput");

    textInput.addEventListener("input", () => {
      textToDraw = textInput.value || " ";
      extractBasePoints();
      p.redraw();
    });

    distortionSlider.addEventListener("input", () => {
      p.redraw();
    });

    extractBasePoints();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    extractBasePoints();
    p.redraw();
  };

  p.draw = () => {
    p.background(240);
    let distortion = parseFloat(distortionSlider.value);
    drawDistortedText(p.width / 2, p.height / 2, distortion);
  };

  function extractBasePoints() {
    basePoints = [];

    let targetWidth = p.width * 0.9;
    fontSize = 300;

    let bounds;
    while (true) {
      bounds = font.textBounds(textToDraw, 0, 0, fontSize);
      if (bounds.w > targetWidth && fontSize > 10) {
        fontSize -= 2;
      } else {
        break;
      }
    }

    let x = -bounds.w / 2;
    let y = bounds.h / 2;

    let points = font.textToPoints(textToDraw, x, y, fontSize, {
      sampleFactor: 0.2,
      simplifyThreshold: 0
    });

    for (let pt of points) {
      basePoints.push(p.createVector(pt.x, pt.y));
    }
  }

  function drawDistortedText(cx, cy, distortion) {
    p.noStroke();
    p.fill(0);
    for (let pt of basePoints) {
      let noiseOffset = p.noise(pt.x * 0.02, pt.y * 0.02) * distortion;
      let offsetX = p.random(-noiseOffset, noiseOffset);
      let offsetY = p.random(-noiseOffset, noiseOffset);

      let growth = p.map(distortion, 0, 30, 0, 20);
      let blobSize = p.random(2, growth);

      p.ellipse(cx + pt.x + offsetX, cy + pt.y + offsetY, blobSize, blobSize);
    }
  }
};
