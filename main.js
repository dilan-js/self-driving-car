const canvas = document.getElementById("myCanvas");
canvas.width = 200;

//We want to draw a car on the canvas
//To draw on the canvas, we need drawing 2D drawing context
//It will contain all the methods we need to draw what we want
const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(100, 100, 30, 50);

animate();

function animate() {
  car.update();
  canvas.height = window.innerHeight;
  road.draw(ctx);
  car.draw(ctx);
  requestAnimationFrame(animate);
}
