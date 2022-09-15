class Car {
  constructor(x, y, width, height, controlType, maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05; //friction gives the 'grippy' or 'bouncy' feel when moving forward and backward
    this.angle = 0; //this prevents speed exceeding max speed when moving diagonally...think 'Unit Circle'!
    if (controlType != "NPC") {
      this.sensor = new Sensor(this); //passing car to the sensor
    }
    this.damaged = false; //car is default not damaged

    this.controls = new Controls(controlType);
  }

  update(roadBorders) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders);
    }
  }

  #assessDamage(roadBorders) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polygonsIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    return false;
  }

  //1 point per corner of the car
  #createPolygon() {
    const points = [];
    const radius = Math.hypot(this.width, this.height) / 2;
    //this will give us angle knowing width and height
    const alpha = Math.atan2(this.width, this.height);
    //top right
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
    });
    return points;
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    //capping the speed
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    //in reverse we want the car to be a bit slower
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2; //negative means going backwards
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    //need to account for when we stop or friction will cause car to move
    //by a small value every time
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    //Think 'Unit Circle'!
    //we want car to move in the direction of the angle it is rotated
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx) {
    if (this.damaged) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "black";
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    if (this.sensor) {
      this.sensor.draw(ctx); //car has ability to draw its own sensor
    }
  }
}
