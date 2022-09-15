const canvas = document.getElementById("myCanvas");
canvas.width = 200;

//We want to draw a car on the canvas
//To draw on the canvas, we need drawing 2D drawing context
//It will contain all the methods we need to draw what we want
const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "MAIN_CHARACTER");
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "NPC", 2)];

animate();

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  car.update(road.borders, traffic);
  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);

  road.draw(ctx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx, "purple");
  }
  car.draw(ctx, "green");

  ctx.restore();
  requestAnimationFrame(animate);
}
