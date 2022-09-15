class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05; //friction gives the 'grippy' or 'bouncy' feel when moving forward and backward
    this.angle = 0; //this prevents speed exceeding max speed when moving diagonally...think 'Unit Circle'!

    this.sensor = new Sensor(this); //passing car to the sensor

    this.controls = new Controls();
  }

  update(roadBorders) {
    this.#move();
    this.sensor.update(roadBorders);
  }

  /*
   * Private method dedicated to handling all car movement
   */
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
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle); //think of unit circle with 0 on top -- to reverse like a real car does

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();

    ctx.restore();

    this.sensor.draw(ctx); //car has ability to draw its own sensor
  }
}
