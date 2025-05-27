window.sketchRegenerate = (p) => {
    let font;
    let dots = [];
    let textInput, radiusSlider;
    let textToDraw = "Cellular";
    let fontSize = 200;
    let buffer;
    let scaleFactor = 4;
    let threshold = 1.4;
    let metaballRadius = 30;
    let lastRadius = -1;
    let lastText = "";
  
    p.preload = () => {
      font = p.loadFont("fonts/Cellular-Regular.ttf");
    };
  
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.noLoop();
  
      // Use slider to control metaballRadius now
      radiusSlider = document.getElementById("distortionSlider");
      textInput = document.getElementById("textInput");
  
      buffer = p.createGraphics(p.width / scaleFactor, p.height / scaleFactor);
      buffer.pixelDensity(1);
  
      textInput.addEventListener("input", () => {
        textToDraw = textInput.value || " ";
        regenerateDots();
        p.redraw();
      });
  
      radiusSlider.addEventListener("input", () => {
        let r = parseFloat(radiusSlider.value);
        if (r !== lastRadius) {
          lastRadius = r;
          metaballRadius = r;
          p.redraw();
        }
      });
  
      metaballRadius = parseFloat(radiusSlider.value); // Initialize once
      lastRadius = metaballRadius;
      regenerateDots();
    };
  
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      buffer = p.createGraphics(p.width / scaleFactor, p.height / scaleFactor);
      buffer.pixelDensity(1);
      regenerateDots();
      p.redraw();
    };
  
    p.draw = () => {
      drawMetaballs();
      p.image(buffer, 0, 0, p.width, p.height);
      addNoise(10);
    };
  
    function regenerateDots() {
      dots = [];
      textToDraw = textInput.value || " ";
      fontSize = 300;
  
      let bounds;
      let maxTextWidth = p.width * 0.9;
  
      while (true) {
        bounds = font.textBounds(textToDraw, 0, 0, fontSize);
        if (bounds.w > maxTextWidth && fontSize > 10) {
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
        dots.push(p.createVector(p.width / 2 + pt.x, p.height / 2 + pt.y));
      }
    }
  
    function drawMetaballs() {
      let w = buffer.width;
      let h = buffer.height;
      buffer.loadPixels();
  
      for (let i = 0; i < buffer.pixels.length; i += 4) {
        buffer.pixels[i] = 240;
        buffer.pixels[i + 1] = 240;
        buffer.pixels[i + 2] = 240;
        buffer.pixels[i + 3] = 255;
      }
  
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          let px = x * scaleFactor;
          let py = y * scaleFactor;
          let sum = 0;
  
          for (let i = 0; i < dots.length; i++) {
            let dx = px - dots[i].x;
            let dy = py - dots[i].y;
            let d = Math.sqrt(dx * dx + dy * dy);
            if (d < 1) d = 1;
            sum += metaballRadius / (d * d);
          }
  
          if (sum > threshold) {
            let idx = 4 * (x + y * w);
            buffer.pixels[idx] = 0;
            buffer.pixels[idx + 1] = 0;
            buffer.pixels[idx + 2] = 0;
            buffer.pixels[idx + 3] = 255;
          }
        }
      }
  
      buffer.updatePixels();
    }
  };
  

  function addNoise(amount = 30) {
    p.loadPixels();
    for (let i = 0; i < p.pixels.length; i += 4) {
      let n = p.random(-amount, amount);
      p.pixels[i] += n;
      p.pixels[i + 1] += n;
      p.pixels[i + 2] += n;
    }
    p.updatePixels();
  }
  