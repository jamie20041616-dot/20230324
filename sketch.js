let seaweeds = [];
const colors = ['#7d84b2', '#8e9dcc', '#d9dbf1', '#f9f9ed', '#dbf4a7'];
let bubbles = [];
let pops = [];
let t = 0;
let popSound;

function preload() {
  soundFormats('mp3');
  popSound = loadSound('pop.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  blendMode(BLEND);
  seaweeds = [];
  bubbles = [];
  pops = [];

  for (let i = 0; i < 80; i++) {
    seaweeds.push({
      x: random(width),
      color: random(colors),
      thickness: random(30, 45), //水草的粗度
      heightRatio: random(0.20, 0.45),
      timeOffset: random(1000),
      noiseFactor: random(0.005, 0.02)
    });
  }
}

function draw() {
  background(227, 242, 253, 255 * 0.3);
  drawSeaweeds();
  handleBubbles();
  t += 0.005;
}

function drawSeaweeds() {
  noFill();
  for (const s of seaweeds) {
    let c = color(s.color);
    c.setAlpha(150);
    stroke(c);
    strokeWeight(s.thickness);

    let points = [];
    const topY = height * (1 - s.heightRatio);
    for (let y = height; y > topY; y -= 10) {
      let xoff = map(noise(y * s.noiseFactor + t + s.timeOffset), 0, 1, -width / 20, width / 20);
      points.push({ x: s.x + xoff, y: y });
    }

    beginShape();
    if (points.length > 0) {
      curveVertex(points[0].x, points[0].y);
      for (const p of points) {
        curveVertex(p.x, p.y);
      }
      curveVertex(points[points.length - 1].x, points[points.length - 1].y);
    }
    endShape();
  }
}

function handleBubbles() {
  // Occasionally create a new bubble
  if (random(1) < 0.1) {
    bubbles.push({
      x: random(width),
      y: height,
      r: random(10, 30),
      popHeight: height - random(height * 0.2, height * 0.8),
      wobbleOffset: random(1000)
    });
  }

  // Update and draw bubbles
  noStroke();
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    b.y -= 1.5; // Move up
    b.x += map(noise(b.y * 0.05 + b.wobbleOffset), 0, 1, -1, 1); // Wobble

    // Check if bubble should pop
    if (b.y < b.popHeight) {
      if (popSound.isLoaded()) {
        popSound.play();
      }
      pops.push({ x: b.x, y: b.y, r: b.r, maxR: b.r * 2.5, life: 1 });
      bubbles.splice(i, 1);
      continue;
    }

    // Draw bubble (main body)
    fill(255, 255, 255, 255 * 0.5);
    ellipse(b.x, b.y, b.r * 2);
    
    // Draw highlight
    fill(255, 255, 255, 255 * 0.8);
    ellipse(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.6);
  }
  
  // Update and draw pops
  noFill();
  for (let i = pops.length - 1; i >= 0; i--) {
    let p = pops[i];
    p.r = lerp(p.r, p.maxR, 0.1);
    p.life -= 0.05;

    if (p.life <= 0) {
      pops.splice(i, 1);
      continue;
    }

    stroke(255, 255, 255, 255 * p.life);
    strokeWeight(2 * p.life);
    ellipse(p.x, p.y, p.r * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}
