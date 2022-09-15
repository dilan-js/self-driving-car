const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 300;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 300;
const cars = generateCars(N);
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "NPC", 2),
  new Car(road.getLaneCenter(0), -10, 30, 50, "NPC", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "NPC", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "NPC", 2),
  new Car(road.getLaneCenter(1), -800, 30, 50, "NPC", 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, "NPC", 2),
  new Car(road.getLaneCenter(2), -5, 30, 50, "NPC", 2),
];
let bestCar = cars[0];
if (localStorage.getItem("dilansBestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("dilansBestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

animate();

function save() {
  localStorage.setItem("dilansBestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("dilansBestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "MAIN_CHARACTER_AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  //creating new array with only y-values
  //finding most promising car moving forward
  //centers canvas on car that is moving forward
  const bestCar = cars.find(
    (car) => car.y == Math.min(...cars.map((c) => c.y))
  );

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "purple");
  }
  carCtx.globalAlpha = 0.14;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();
  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
