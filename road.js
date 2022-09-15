class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1000000; //innate JS infinity causes some issues so using explicit value
    this.top = -infinity;
    this.bottom = infinity;
  }

  //returns for different line indices, an offset of laneWidth away from
  // middle of first lane
  // we do Math.min to place car in right-most lane even if I specify I want it to be placed
  // further to the right (prevents car placed outside road)
  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }

  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    //drawing lines for lanes using linear interpolation
    for (let i = 0; i <= this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);
      if (i > 0 && i < this.laneCount) {
        ctx.setLineDash([20, 20]); //the dash will be 20px, then break for 20px etc.
      } else {
        ctx.setLineDash([]); //this is for borders
      }
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
  }
}
