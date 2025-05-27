window.sketchBreak = (p) => {
    let font;
    let basePoints = [];
  
    let textInput, distortionSlider;
    let textToDraw = "Cellular";
    let fontSize = 250;
  
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
        let rawSlider = parseFloat(distortionSlider.value);
        let ellipseWidth = p.map(rawSlider, 0, 30, 5, 60);  // adjust this mapping as desired
        let ellipseHeight = 10;
        drawEllipticalText(p.width / 2, p.height / 2, ellipseWidth, ellipseHeight);
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
  
    function drawEllipticalText(cx, cy, ellipseWidth, ellipseHeight) {
      p.fill(0);
      p.stroke(0);
      p.strokeWeight(1);
  
      for (let pt of basePoints) {
        let noiseOffset = p.noise(pt.x * 0.02, pt.y * 0.02) * 3;
        let offsetX = p.random(-1, 1);
        let offsetY = p.random(-1, 1);
  
        p.ellipse(cx + pt.x + offsetX, cy + pt.y + offsetY, ellipseWidth + noiseOffset, ellipseHeight);
      }
    }
  };
  