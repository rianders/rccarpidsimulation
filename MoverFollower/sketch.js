/*
* Click and draw lines to follow.
* TODO: get mover to follow line
*
*/

class Mover {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.setMag(2);

  }
  update() {
    let mouse = createVector(mouseX, mouseY);
    this.vel = p5.Vector.sub(mouse, this.pos);
    this.vel.setMag(2);
    this.pos.add(this.vel);
    console.log(`h : { m: ${this.vel.mag().toFixed(2)}, r: ${this.vel.heading().toFixed(2)}, d: ${degrees(this.vel.heading()).toFixed(2)}}`);

  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(255, 100);
    rect(this.pos.x - 8, this.pos.y - 8, 16, 16);
    ellipse(this.pos.x, this.pos.y, 32);
    translate(this.pos.x, this.pos.y);
    let scale = p5.Vector.mult(this.vel, 20);
    line(0, 0, scale.x, scale.y);

  }
}

let mover;
let path = [];

function setup() {
  createCanvas(400, 400);
  mover = new Mover(50, 200);
}

function draw() {
  background(0);
  ellipse(mouseX, mouseY, 8);
  if (mouseIsPressed === true) {
    path.push([mouseX, mouseY, pmouseX, pmouseY]);

  }
  for (let ii = 0; ii < path.length; ii++) {
    line(path[ii][0], path[ii][1], path[ii][2], path[ii][3]);
    ellipse(path[ii][0], path[ii][1], 8);

  }
  mover.update();
  mover.show();

}
