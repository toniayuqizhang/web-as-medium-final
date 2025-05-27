// GLOBAL SYNC ENABLED VERSION
const { Engine, Render, World, Bodies, Body, Events, Vertices } = Matter;

let engine, world;
let shapes = [];
let currentShape = [];
let thoughts = [];
let rockAlphas = [];
let thoughtAlphas = [];
let maxShapes = 100;
let ground, leftWall, rightWall;
let isDrawing = false;
let inputPopupVisible = false;
let hoveredIndex = -1;
let pendingTimestamp = "";
let pendingShape = null;

const API_URL = "https://rockpile-backend.onrender.com";

function setup() {
    createCanvas(windowWidth, windowHeight);
    engine = Engine.create();
    world = engine.world;
    Matter.Runner.run(engine);

    ground = Bodies.rectangle(windowWidth, windowHeight, width * 2, 20, { isStatic: true });
    leftWall = Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true });
    rightWall = Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true });
    World.add(world, [ground, leftWall, rightWall]);

    createThoughtInputPopup();
    fetchRocks();
    setInterval(fetchRocks, 5000);
}

function draw() {
    background(255);

    hoveredIndex = -1;
    for (let i = 0; i < shapes.length; i++) {
        if (isMouseInsideShape(shapes[i])) {
            hoveredIndex = i;
            break;
        }
    }

    for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];
        const targetAlpha = (hoveredIndex !== -1 && i !== hoveredIndex) ? 0 : 255; //fade
        rockAlphas[i] = lerp(rockAlphas[i] || 255, targetAlpha, 0.07); // transition

        fill(0, rockAlphas[i]);
        beginShape();
        for (let v of shape.vertices) vertex(v.x, v.y);
        endShape(CLOSE);
    }

    if (isDrawing && currentShape.length > 0) {
        fill(0);
        beginShape();
        for (let v of currentShape) vertex(v.x, v.y);
        endShape();
    }

    drawThoughtGrid();
}

function isMouseInsideShape(shape) {
    return Matter.Vertices.contains(shape.vertices, { x: mouseX, y: mouseY });
}

function mousePressed() {
    isDrawing = true;
    currentShape = [];
}

function mouseDragged() {
    if (isDrawing) currentShape.push({ x: mouseX, y: mouseY });
}

function mouseReleased() {
    if (isDrawing && currentShape.length > 2) {
        let closedShape = [...currentShape, currentShape[0]];
        let centroidX = currentShape.reduce((sum, v) => sum + v.x, 0) / currentShape.length;
        let centroidY = currentShape.reduce((sum, v) => sum + v.y, 0) / currentShape.length;
        let body = Bodies.fromVertices(centroidX, centroidY, [closedShape], {
            restitution: 0.008, friction: 1.8, density: 1.9,
        });

        if (body && body.vertices) {
            World.add(world, body);
            shapes.push(body);
            pendingShape = closedShape;
            const hash = shapeHash(pendingShape);
            justSentHashes.add(hash);
            setTimeout(() => justSentHashes.delete(hash), 1000000);
            promptThought(new Date().toLocaleString());
        }
    }
    isDrawing = false;
    currentShape = [];
}

function promptThought(timestamp) {
    pendingTimestamp = timestamp;
    document.getElementById('thought-text').value = "";
    document.getElementById('thought-popup').style.display = 'block';
    inputPopupVisible = true;
}

function submitThought() {
    let text = document.getElementById('thought-text').value.trim();
    if (text !== "" && pendingShape) {
        const payload = {
            shape: pendingShape,
            thought: text,
            timestamp: pendingTimestamp,
        };

        fetch(`${API_URL}/rocks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }).catch(console.error);

        thoughts.push({ message: text, timestamp: pendingTimestamp });
        pendingShape = null;
    }

    document.getElementById('thought-popup').style.display = 'none';
    inputPopupVisible = false;
}

let seenHashes = new Set();
let justSentHashes = new Set();

function shapeHash(shape) {
    return shape.map(p => `${Math.round(p.x)},${Math.round(p.y)}`).join('|');
}


function fetchRocks() {
    const todayStr = getLocalDateString();
    let rocksTodayCount = 0;

    fetch(`${API_URL}/rocks`)
        .then(res => res.json())
        .then(data => {
            for (let item of data) {
                const shape = item.shape;
                const hash = shapeHash(shape);
                const rockDateStr = getLocalDateString(new Date(item.timestamp));

                if (rockDateStr === todayStr) {
                    rocksTodayCount++;

                    if (!seenHashes.has(hash) && !justSentHashes.has(hash)) {
                        const centroidX = shape.reduce((sum, v) => sum + v.x, 0) / shape.length;
                        const centroidY = shape.reduce((sum, v) => sum + v.y, 0) / shape.length;
                        const body = Bodies.fromVertices(centroidX, centroidY, [shape], {
                            restitution: 0.008, friction: 1.8, density: 1.9,
                        });

                        if (body && body.vertices) {
                            World.add(world, body);
                            shapes.push(body);
                            rockAlphas.push(255);
                            thoughtAlphas.push(255);
                            thoughts.push({ message: item.thought, timestamp: item.timestamp });
                            seenHashes.add(hash);
                        }
                    }
                }
            }

            console.log(`✅ Loaded ${rocksTodayCount} rocks for today (${todayStr})`);
        })
        .catch(console.error);
}




function drawThoughtGrid() {
    let spacingY = 120;
    let columnWidth = 300;
    let padding = 20;

    let colCount = 2;
    if (windowWidth >= 1600) colCount = 6;
    else if (windowWidth >= 1400) colCount = 5;
    else if (windowWidth >= 1200) colCount = 4;
    else if (windowWidth >= 1000) colCount = 3;

    textSize(13);
    textFont('Times New Roman');
    noStroke();

    let xStart = padding;
    let yStart = padding;
    let x = xStart;
    let y = yStart;
    let col = 0;

    for (let i = 0; i < thoughts.length; i++) {
        let t = thoughts[i];
        const targetAlpha = (hoveredIndex !== -1 && i !== hoveredIndex) ? 0 : 255; //fade 2
        thoughtAlphas[i] = lerp(thoughtAlphas[i] || 255, targetAlpha, 0.08); //transition

        fill(0, thoughtAlphas[i]);
        // text(`${t.timestamp}\n${t.message}`, x, y, columnWidth - padding, spacingY);

        text(`◼ ${t.timestamp}
            ${t.message}`, x, y, columnWidth - padding, spacingY);
            

        y += spacingY;

        if (y > height - spacingY) {
            y = yStart;
            col++;
            if (col >= colCount) break;
            x = xStart + col * columnWidth;
        }
    }
}

function createThoughtInputPopup() {
    let inputDiv = createDiv('').id('thought-popup').style('display', 'none');
    inputDiv.style('position', 'absolute');
    inputDiv.style('top', '50%');
    inputDiv.style('left', '50%');
    inputDiv.style('transform', 'translate(-50%, -50%)');
    inputDiv.style('padding', '20px');
    inputDiv.style('background', '#fff');
    inputDiv.style('box-shadow', '0px 0px 15px rgba(0,0,0,0.2)');
    inputDiv.style('z-index', '1000');

    inputDiv.html(`
      <p>What are you thinking about?</p>
      <textarea id="thought-text" rows="4" cols="30"></textarea><br>
      <button onclick="submitThought()">Submit</button>
    `);
}



// START CLOCK SCRIPT

Number.prototype.pad = function(n) {
    var r = this.toString();
    while (r.length < n) r = "0" + r;
    return r;
};

  
  function updateClock() {
    var now = new Date();
    var milli = now.getMilliseconds(),
      sec = now.getSeconds(),
      min = now.getMinutes(),
      hou = now.getHours(),
      mo = now.getMonth(),
      dy = now.getDate(),
      yr = now.getFullYear();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var tags = ["mon", "d", "y", "h", "m", "s", "mi"],
      corr = [months[mo], dy, yr, hou.pad(2), min.pad(2), sec.pad(2), milli];
    for (var i = 0; i < tags.length; i++)
      document.getElementById(tags[i]).firstChild.nodeValue = corr[i];
  }
  
  function initClock() {
    updateClock();
    window.setInterval("updateClock()", 1);
  }
  
  // END CLOCK SCRIPT

  window.onload = function() {
    initClock();
  };
  


  let isInfoMode = false;

  document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-btn");
    const infoText = document.getElementById("info-text");
    const clockElements = [
        ...["mon", "d", "y", "h", "m", "s", "mi"].map(id => document.getElementById(id)),
        ...Array.from(document.getElementsByClassName("pun"))
      ];

    toggleBtn.addEventListener("click", () => {
      isInfoMode = !isInfoMode;
  
      // Toggle visibility of clock numbers
      clockElements.forEach(el => el.style.display = isInfoMode ? "none" : "inline");
  
      // Toggle info text and button label
      infoText.style.display = isInfoMode ? "flex" : "none";
      toggleBtn.textContent = isInfoMode ? "CLOCK" : "INFO";
    });
  });
  
  



  let currentDateStr = getLocalDateString();


  function getLocalDateString(date = new Date()) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }







function clearRocksForNewDay() {
  // Clear Matter.js bodies from world
  shapes.forEach(shape => World.remove(world, shape));

  // Reset arrays
  shapes = [];
  thoughts = [];
  rockAlphas = [];
  thoughtAlphas = [];
  seenHashes.clear();
  justSentHashes.clear();
}

function checkForNewDay() {
  const newDateStr = getLocalDateString();
  if (newDateStr !== currentDateStr) {
    currentDateStr = newDateStr;
    clearRocksForNewDay();
  }
}

// Check every minute (60000 ms)
setInterval(checkForNewDay, 60000);

//new code to manually clear the rocks
// document.addEventListener("keydown", function (event) {
//     if (event.ctrlKey && event.shiftKey && event.code === "KeyC") {
//       console.log("🧼 Manual clear triggered.");
//       clearRocksForNewDay();
//     }
//   });