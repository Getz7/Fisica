
const fps = 60; // Fotogramas por segundo
let ball = null; 
let traces = []; // Rastro de posiciones
let count = 0; 
let g = 9.8; // Gravedad inicial
let simulationRunning = false; // Estado de la simulación
let time = 0; 

// Clase Ball que representa la pelota
class Ball {
  constructor(x, y, mass, radius, forceMagnitude = 0, angle = 0) {
    this.mass = mass;
    this.radius = radius; // Radio para dibujarla
    this.x = x; // Posición X inicial
    this.y = y; // Posición Y inicial

    this.vx = 0; // Velocidad en X
    this.vy = 0; // Velocidad en Y

    this.ax = 0; // Aceleración en X
    this.ay = 0; // Aceleración en Y

    // Si hay fuerza inicial, la aplicamos automáticamente al crear la bola
    if (forceMagnitude > 0) {
      angleMode(DEGREES); 
      const fx = forceMagnitude * cos(angle); // Calculamos Fx
      const fy = -forceMagnitude * sin(angle); // Calculamos Fy (negativo porque Y crece hacia abajo)
      this.applyForce(fx, fy); 

      // Eliminamos la fuerza inicial tras 1 segundo (opcional)
      setTimeout(() => {
        this.applyForce(-fx, -fy);
      }, 1000);
    }
  }

  // Método para aplicar una fuerza
  applyForce(fx, fy) {
    this.ax += fx / this.mass; 
    this.ay += fy / this.mass;
  }

  // Actualizamos la física (posición y velocidad)
  update() {
    const dt = 1 / fps;

    this.vx += this.ax * dt;
    this.vy += this.ay * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  // Detectamos colisión con el suelo
  checkCollision() {
    if (this.y + this.radius >= height) {
      this.y = height - this.radius; 
      this.vx = 0;
      this.vy = 0;
      return true;
    }
    return false;
  }

  // Dibujamos la bola y sus vectores de velocidad y aceleración
  draw() {
    ellipse(this.x, this.y, this.radius * 2);

    // Línea azul de velocidad
    push();
    stroke(0, 0, 255);
    strokeWeight(2);
    line(this.x, this.y, this.x + this.vx, this.y + this.vy);
    pop();

    // Línea amarilla de aceleración
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

// Inicia la simulación cuando se presiona el botón
function startSimulation() {
  time = 0;
  traces = [];
  count = 0;
  simulationRunning = true;

  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = "";

  // Obtenemos los valores ingresados por el usuario
  const mass = parseFloat(document.getElementById('massInput').value);
  const forceMagnitude = parseFloat(document.getElementById('forceMagnitudeInput').value);
  const angle = parseFloat(document.getElementById('angleInput').value);
  g = parseFloat(document.getElementById('gravityInput').value);

  // Validación de inputs
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

  
  ball = new Ball(20, height - 20, mass, 20, forceMagnitude, angle);


  ball.applyForce(0, ball.mass * g);
}


function draw() {
  background('#AEDFF7');

  if (simulationRunning && ball) {
    time += 1 / fps;
  }

  // Mensaje inicial si no se ha comenzado
  if (!simulationRunning) {
    fill('rgb(0, 0, 0)');
    textSize(20);
    text("Presione 'Empezar' para ver la simulación ", width / 2 - 120, height / 2);
    return;
  }

  // Dibujamos las trazas del recorrido
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

    // Detectamos si choca con el suelo
    if (ball.checkCollision()) {
      simulationRunning = false;
      fill(255, 0, 0);
      textSize(32);
      text("Colisión detectada!", width / 2 - 250, height / 2);
    }

    // Mostramos información en pantalla
    fill(0);
    textSize(16);
    text(`Tiempo : ${time.toFixed(0)} s`, 10, 100);
    text(`Posición X: ${ball.x.toFixed(0)} px`, 10, 20);
    text(`Posición Y: ${ball.y.toFixed(0)} px`, 10, 40);
    text(`Velocidad X: ${ball.vx.toFixed(0)} px/s`, 10, 60);
    text(`Velocidad Y: ${ball.vy.toFixed(0)} px/s`, 10, 80);

    // Guardamos trazas cada segundo
    if (++count === fps) {
      count = 0;
      traces.push(new Ball(ball.x, ball.y, ball.mass, ball.radius));
    }
  }
}
