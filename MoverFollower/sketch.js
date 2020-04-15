/*
 * Click and draw lines to follow.
 * TODO: get mover to goto each cone
 *
 */

class Cone {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.touched = false;
    this.radius = 12;
  }
  update() {
    //if collision
  }
  show() {
    stroke(255);
    strokeWeight(2);
    fill(255, 114, 33);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }

  intersects(obj) {
    let d = dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
    if (d < obj.radius + this.radius) {
      return true;
    } else {
      return false;
    }
  }

  edge() {
    return [this.pos, this.radius];
  }
  collected() {
    return this.touched;
  }
}

class Mover {
  constructor(x, y, speed, id) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.speed = speed;
    this.vel.setMag(this.speed);
    this.radius = 16;
    this.steerAngle = radians(20); //20 degree
    this.goal = 0;
    this.id = id;
  }

  intersects(obj) {
    let d = dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
    print(`d: ${d}, r+r: ${obj.radius + this.radius}`);
    if (d < obj.radius + this.radius) {
      return true;
    } else {
      return false;
    }
  }

  update(pathVector) {
    this.vel = p5.Vector.sub(pathVector, this.pos);
    this.vel.setMag(this.speed);
    this.pos.add(this.vel);
    // console.log(
    //   `h : { m: ${this.vel.mag().toFixed(2)}, r: ${this.vel
    //     .heading()
    //     .toFixed(2)}, d: ${degrees(this.vel.heading()).toFixed(2)}}`
    // );
  }

  show() {
    push();
    stroke(255);
    strokeWeight(2);
    fill(255, 100);
    rect(this.pos.x - 8, this.pos.y - 8, 16, 16);
    textSize(8);
    text(this.id, this.pos.x, this.pos.y);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
    translate(this.pos.x, this.pos.y);
    let scale = p5.Vector.mult(this.vel, 20);
    scale.setMag(40);
    push();
    rotate(this.vel.heading());
    arc(
      0,
      0,
      this.radius + 24,
      this.radius + 24,
      -1 * this.steerAngle,
      this.steerAngle,
      PIE
    );
    pop();
    line(0, 0, scale.x, scale.y);
    pop();
  }
}

let movers = [];
let path = [];
let cones = [];
let idx = 0;

function setup() {
  createCanvas(600, 400);

  for (let ii = 0; ii < 3; ii++) {
    //be aware of speed zero!!!! 0*0 is no speed
    movers[ii] = new Mover(random(width), random(height), random(6), ii);
  }
}

function draw() {
  let pv;
  background(0);
  textSize(32);
  text("Click to Drop Cones", 10, 30);

  ellipse(mouseX, mouseY, 8);

  if (mouseIsPressed) {
    if (cones.length === 0) {
      trackCone = new Cone(mouseX, mouseY);
      cones.push(trackCone);
    } else {
      trackCone = new Cone(mouseX, mouseY);
      //check if previous cone intersets with current cone
      if (!cones[cones.length - 1].intersects(trackCone)) {
        cones.push(trackCone);
      }
    }
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

  //they all get a new pv instead of their own pv
  //each needs to collect and go
  for (let jj = 0; jj < movers.length; jj++) {
    //if there are cones
    if (cones.length > 0) {
      //intersect next cone by number  not
      if (movers[jj].intersects(cones[movers[jj].goal])) {
        if (movers[jj].goal < cones.length - 1) {
          movers[jj].goal++;
          pv = cones[movers[jj].goal].pos;
        } else {
          movers[jj].goal = 0;
          pv = cones[movers[jj].goal].pos;
          //uncollect
          for (let ii = 0; ii < cones.length; ii++) {
            cones[ii].touched = false;
          }
        }
      }
      pv = cones[movers[jj].goal].pos;
     // movers[jj].update(pv);

    } else {
      pv = createVector(mouseX, mouseY);
    }
    movers[jj].update(pv);
    movers[jj].show();
  }
 
}
