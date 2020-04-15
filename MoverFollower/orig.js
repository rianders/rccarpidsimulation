/*
 * Click and draw lines to follow.
 * TODO: get mover to goto each cone
 *
 */

class Cone {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.touched = false;
    this.radius = 24;
  }
  update() {
    //if collision
  }
  show() {
    stroke(255);
    strokeWeight(2);
    fill(255, 114, 33);
    ellipse(this.pos.x, this.pos.y, this.radius);
  }
  edge() {
    return [this.pos, this.radius];
  }
  collected() {
    return this.touched;
  }

}

class Mover {
  constructor(x, y, speed) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.speed = speed;
    this.vel.setMag(this.speed);
    this.radius = 32;
    this.steerAngle = radians(20); //20 degree

  }
  update(pathVector) {
    //let mouse = createVector(mouseX, mouseY);
    this.vel = p5.Vector.sub(pathVector, this.pos);
    this.vel.setMag(this.speed);
    this.pos.add(this.vel);
    console.log(`h : { m: ${this.vel.mag().toFixed(2)}, r: ${this.vel.heading().toFixed(2)}, d: ${degrees(this.vel.heading()).toFixed(2)}}`);

  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(255, 100);
    rect(this.pos.x - 8, this.pos.y - 8, 16, 16);
    ellipse(this.pos.x, this.pos.y,  this.radius);
    translate(this.pos.x, this.pos.y);
    let scale = p5.Vector.mult(this.vel, 20);
    scale.setMag(40);
    push();
    rotate(this.vel.heading());
    arc(0, 0, this.radius+8, this.radius+8, -1 * this.steerAngle, this.steerAngle, PIE);
    pop();
    line(0, 0, scale.x, scale.y);
  }
}

let mover;
let movers = [];
let pv;
let path = [];
let cones = [];
let idx = 0;

function setup() {
  createCanvas(400, 400);
  mover = new Mover(50, 200, 2);
}

function draw() {
  background(0);
  textSize(32);
  text('Click to Drop Cones', 10, 30);
  ellipse(mouseX, mouseY, 8);
  if (mouseIsPressed) {
    trackCone = new Cone(mouseX, mouseY);
    cones.push(trackCone);
    path.push([mouseX, mouseY, pmouseX, pmouseY]);
  }

  for (let ii = 0; ii < cones.length; ii++) {
    cones[ii].show();
    textSize(8);
    text(ii, cones[ii].pos.x, cones[ii].pos.y);
  }

  /* for (let ii = 0; ii < path.length; ii++) {
     line(path[ii][0], path[ii][1], path[ii][2], path[ii][3]);
     ellipse(path[ii][0], path[ii][1], 8);

   }
   */

  // if cone and not touched continue to cone
  if (cones.length > 0) {
    print("cone exist");
    print(`idx: ${idx}`);
    print(`cones.length : ${cones.length} , p: ${cones[idx].pos}`);
    pv = cones[idx].pos;
    let d = dist(mover.pos.x, mover.pos.y, cones[idx].edge()[0].x, cones[idx].edge()[0].y);
    print(`d: ${d}, cedge: ${cones[idx].edge()[1]}`);
    if (d < (cones[idx].edge()[1] + 16)) {
      cones[idx].touched = true;
    }
    if (cones[idx].collected()) {
      print("collected");
      if (idx < cones.length - 1) {
        idx++;
      } else {
        idx = 0;
        //uncollect
        for (let ii = 0; ii < cones.length; ii++) {
          cones[ii].touched = false;
        }
      }
    }
  } else {
    pv = createVector(mouseX, mouseY);
  }
  mover.update(pv);
  mover.show();

}