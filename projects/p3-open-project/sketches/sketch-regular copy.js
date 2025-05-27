window.sketchRegular = (p) => {
    let textInput, sizeSlider;
    let textToDraw = "Cellular";
    let fontSize = 300;
    let font;
  
    p.preload = () => {
      font = p.loadFont('fonts/Cellular-Regular.ttf');
    };
  
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.noLoop();
      p.textFont(font);
      p.textAlign(p.CENTER, p.CENTER);
  
      textInput = document.getElementById("textInput");
      sizeSlider = document.getElementById("distortionSlider");
  
      textInput.addEventListener("input", () => {
        textToDraw = textInput.value || " ";
        p.redraw();
      });
  
      sizeSlider.addEventListener("input", () => {
        p.redraw();
      });
    };
  
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      p.redraw();
    };
  
    p.draw = () => {
      p.background(240);
  
      let distortion = parseFloat(sizeSlider.value); // 0–30
      let strokeW = p.map(distortion, 0, 30, 0.1, 20); // Map slider to 0.1–10px stroke
  
      p.fill(0);
      p.stroke(0);
      p.strokeWeight(strokeW);
      p.textSize(fontSize);
      p.text(textToDraw, p.width / 2, p.height / 2.2);
    };
  };
  