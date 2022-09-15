//sensor is attached to the car, so constructor takes car in as parameter
class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 1;
    this.rayLength = 150; //sensors have a range, after which they don't work
    this.raySpread = Math.PI / 4; //45 degrees span for rays
    this.rays = [];
  }

  update() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      //lerp gives value between A & B depending on t
      // max value for i = raycount -1 in this case
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      //see how I created borders -- consistency in our array builders
      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.stroke();
    }
  }
}
