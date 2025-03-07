const fps = 60;
let ball = null;
let traces = [];
let count = 0;
let g = 9.8;
let simulationRunning = false;
let time=0;
class Ball {
  constructor(x, y, mass, radius) {
    this.mass = mass;
    this.radius = radius;
    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;
 
    this.ax = 0;
    this.ay = 0;
  }

  applyForce(fx, fy) {
    this.ax += fx / this.mass;
    this.ay += fy / this.mass;
  }

  update() {
    const dt = 1 / fps;

    // Update velocidades
    this.vx += this.ax * dt;
    this.vy += this.ay * dt;

    // Update posiciones
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
  checkCollision() {
    if (this.y + this.radius >= height) {
      this.y = height - this.radius; 
      this.vx = 0;
      this.vy = 0;
      return true; // Colision detectada
    }
    return false;
  }
  draw() {
    ellipse(this.x, this.y, this.radius * 2);

    //Lineas de guia
    push();
    stroke(0, 0, 255);
    strokeWeight(2);
    line(this.x, this.y, this.x + this.vx, this.y + this.vy);
    pop();

    push();
    stroke(255, 204, 0);
    strokeWeight(2);
    line(this.x, this.y, this.x + this.ax * 100, this.y + this.ay * 100);
    pop();
  }
}

function setup() {
  frameRate(fps);
  let canvas = createCanvas(2000, 810);
  canvas.id('simulationCanvas');
  document.getElementById('startButton').addEventListener('click', startSimulation);
}

function startSimulation() {
  time =0;
  traces = [];
  count = 0;
  simulationRunning = true;
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = "";
  const mass = parseFloat(document.getElementById('massInput').value);
  const forceX = parseFloat(document.getElementById('forceXInput').value);
  const forceY = parseFloat(document.getElementById('forceYInput').value);
  g = parseFloat(document.getElementById('gravityInput').value);
  if (isNaN(mass) || mass <= 0) {
    errorDiv.textContent = "Error: La masa debe ser un número mayor a 0.";
    return;
  }
  if (isNaN(g) || g <= 0) {
    errorDiv.textContent = "Error: La gravedad debe ser un número mayor a 0.";
    return;
  }
  ball = new Ball(20, height - 20, mass, 20);

  // Fuerza de gravedad
  ball.applyForce(0, ball.mass * g);

  // Fuerza Inicial
  ball.applyForce(forceX, forceY);

 
  setTimeout(() => {
    ball.applyForce(-forceX, -forceY);
  }, 1500);
}

function draw() {
  background('#AEDFF7');
  if(simulationRunning && ball){
    time +=1/fps;
  }
  if (!simulationRunning) {
    fill('rgb(0, 0, 0)');
    textSize(20);
    text("Presione 'Empezar' para ver la simulación ", width / 2 - 120, height / 2);
    return;
  }
  for (const trace of traces) {
    push();
    fill("#fFfafa");
    trace.draw();
    pop();
  }
  if (ball) {
    fill('rgb(225, 231, 168)');
    ball.update();
    ball.draw();
    if (ball.checkCollision()) {
      simulationRunning = false;
      fill(255, 0, 0);
      textSize(32);
      text("Colisión detectada!", width / 2 - 250, height / 2);
    }
    fill(0);
    textSize(16);
    text(`Tiempo : ${time.toFixed(0)} s`, 10, 100);
    text(`Posición X: ${ball.x.toFixed(0)} px`, 10, 20);
    text(`Posición Y: ${ball.y.toFixed(0)} px`, 10, 40);
    text(`Velocidad X: ${ball.vx.toFixed(0)} px/s`, 10, 60);
    text(`Velocidad Y: ${ball.vy.toFixed(0)} px/s`, 10, 80);
    if (++count === 60) {
      count = 0;
      traces.push(new Ball(ball.x, ball.y, ball.mass, ball.radius));
    }
  }
  
}
