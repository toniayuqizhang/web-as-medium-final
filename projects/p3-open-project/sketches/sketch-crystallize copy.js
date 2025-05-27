window.sketchCrystallize = (p) => {
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
      drawCrystallizedText(p.width / 2, p.height / 2, distortion);
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
        simplifyThreshold: 0.4
      });
  
      for (let pt of points) {
        basePoints.push(p.createVector(pt.x, pt.y));
      }
    }
  
    function drawCrystallizedText(cx, cy, distortion) {
      p.noFill();
      p.stroke(0);
  
      p.beginShape();
      for (let pt of basePoints) {
        let dx = p.random(-distortion, distortion);
        let dy = p.random(-distortion, distortion);
        p.vertex(cx + pt.x + dx, cy + pt.y + dy);
      }
      p.endShape(p.CLOSE);
  
      for (let pt of basePoints) {
        if (p.random(1) < 0.5) {
          growBlobbyBranches(cx + pt.x, cy + pt.y);
        }
      }
    }
  
    function growBlobbyBranches(x, y) {
      let branchLength = 5;
      let numBranches = 10;
  
      for (let i = 0; i < numBranches; i++) {
        let angle = p.random(p.TWO_PI);
        let len = branchLength * p.random(0.5, 2);
        let x1 = x;
        let y1 = y;
        let x2 = x1 + len * p.cos(angle);
        let y2 = y1 + len * p.sin(angle);
  
        p.strokeWeight(p.random(1, 2));
        p.noFill();
        p.beginShape();
        p.curveVertex(x1, y1);
        p.curveVertex(x1 + p.random(-len * 0.3, len * 0.3), y1 + p.random(-len * 0.3, len * 0.3));
        p.curveVertex(x2, y2);
        p.curveVertex(x2 + p.random(-len * 0.3, len * 0.3), y2 + p.random(-len * 0.3, len * 0.3));
        p.endShape();
      }
    }
  };
  