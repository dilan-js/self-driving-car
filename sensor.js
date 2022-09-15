//sensor is attached to the car, so constructor takes car in as parameter
class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 10;
    this.rayLength = 150; //sensors have a range, after which they don't work
    this.raySpread = Math.PI / 4; //45 degrees span for rays
    this.rays = [];

    this.sensorReadings = []; //telling if there is a border or not, how far is it
  }

  update(roadBorders, traffic) {
    this.#castRays();
    this.sensorReadings = [];

    for (let i = 0; i < this.rayCount; i++) {
      this.sensorReadings.push(
        this.#getReadings(this.rays[i], roadBorders, traffic)
      );
    }
  }

  //We only have 2 borders, so 1 ray can only touch both borders if car goes off screen
  //However, with traffic, could cause issues
  //Find closest border and use that as reading
  #getReadings(ray, roadBorders, traffic) {
    let touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      //if null i.e. segments don't intersect, no reading
      if (touch) {
        touches.push(touch);
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      const polygon = traffic[i].polygon;
      for (let j = 0; j < polygon.length; j++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          polygon[j],
          polygon[(j + 1) % polygon.length]
        );
        if (value) {
          touches.push(value);
        }
      }
    }

    if (touches.length == 0) {
      return null;
    } else {
      //return all the offsets of all the touches
      const offsets = touches.map((touch) => touch.offset);
      //find minimum offset b/c that's closest collision
      const minOffset = Math.min(...offsets);
      return touches.find((touch) => touch.offset == minOffset); //returns the reading with min we found
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      //lerp gives value between A & B depending on t
      // max value for i = raycount -1 in this case
      // if rayCount = 1, then would throw error, division by 0, so set default
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
      let end = this.rays[i][1];
      if (this.sensorReadings[i]) {
        end = this.sensorReadings[i];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      //changed index to 1 -- draws ray from tip of where ray 'could be' to endpoint -- shows extension of collision path
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
