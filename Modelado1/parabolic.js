const fps = 60;
let ball = null;
let traces = [];
let count = 0;
let g = 9.8;
let simulationRunning = false;
let time = 0;

class Ball {
  constructor(x, y, mass, radius, forceMagnitude = 0, angle = 0) {
    this.mass = mass;
    this.radius = radius;
    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.ax = 0;
    this.ay = 0;

    // Si hay fuerza inicial, la aplicamos automáticamente
    if (forceMagnitude > 0) {
      angleMode(DEGREES);
      const fx = forceMagnitude * cos(angle);
      const fy = -forceMagnitude * sin(angle);
      this.applyForce(fx, fy);

      // Si quieres quitar la fuerza luego de 1 segundo como antes
      setTimeout(() => {
        this.applyForce(-fx, -fy);
      }, 1000);
    }
  }

  applyForce(fx, fy) {
    this.ax += fx / this.mass;
    this.ay += fy / this.mass;
  }

  update() {
    const dt = 1 / fps;

    this.vx += this.ax * dt;
    this.vy += this.ay * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  checkCollision() {
    if (this.y + this.radius >= height) {
      this.y = height - this.radius;
      this.vx = 0;
      this.vy = 0;
      return true;
    }
    return false;
  }

  draw() {
    ellipse(this.x, this.y, this.radius * 2);

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
  let canvas = createCanvas(1760, 700);
  canvas.id('simulationCanvas');
  document.getElementById('startButton').addEventListener('click', startSimulation);
}

function startSimulation() {
  time = 0;
  traces = [];
  count = 0;
  simulationRunning = true;
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = "";

  const mass = parseFloat(document.getElementById('massInput').value);
  const forceMagnitude = parseFloat(document.getElementById('forceMagnitudeInput').value);
  const angle = parseFloat(document.getElementById('angleInput').value);
  g = parseFloat(document.getElementById('gravityInput').value);

  if (isNaN(mass) || mass <= 0) {
    errorDiv.textContent = "Error: La masa debe ser un número mayor a 0.";
    return;
  }
  if (isNaN(g) || g <= 0) {
    errorDiv.textContent = "Error: La gravedad debe ser un número mayor a 0.";
    return;
  }
  if (isNaN(forceMagnitude) || forceMagnitude <= 0) {
    errorDiv.textContent = "Error: La magnitud de la fuerza debe ser un número mayor a 0.";
    return;
  }
  if (isNaN(angle)) {
    errorDiv.textContent = "Error: El ángulo debe ser un número.";
    return;
  }

  angleMode(DEGREES);

  // Creamos la bola con fuerza inicial y ángulo
  ball = new Ball(20, height - 20, mass, 20, forceMagnitude, angle);

  ball.applyForce(0, ball.mass * g);
}

function draw() {
  background('#AEDFF7');
  if (simulationRunning && ball) {
    time += 1 / fps;
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
