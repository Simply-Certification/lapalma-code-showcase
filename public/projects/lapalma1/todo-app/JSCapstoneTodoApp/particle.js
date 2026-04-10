
/*
usage: 
x,y are x and y coordinates on the viewport(you could get these in response to an onclick event, they
have .x and .y event properties that show where the mouse clicked)

particalLife is time in Milliseconds  before particle dissolves, i.e. 500 is 1/2 second.

particleSpeed is a smaller number multiplied by the speed.
e.g. 1.0 is normal speed, 2.0 is twice as face, 3.0 is three times as fast

particleAngleStart is the starting angle
particleAngleEnd is the ending angle
e.g. anywhere in a circle would be 0, and 360 for those two arguments respectively
e.g. anywhere in the left side of vertical would be 90, and 270 for those two arguments respectively
e.g. anywhere in the right side of vertical would be 270, and 90,  for those two arguments respectively


particleMinSize is the minimum div(particle) size in px.
particleMaxSize is the Maximum div(particle) size in px.
they are randomly generated between that range.
particleColor can be any valid CSS backgroundColor property, if left blank, its random


example usage: 

button.onclick = (event) => { 
     for (let i = 0; i < 30; i++) {
      particle(
        event.x,
        event.y,
        Math.random() * 100,
        Math.random() * 3,
        0,
        360,
        0,
        8,
        `hsl(300,${Math.random() * 100}%,${Math.random() * 100}%)`
      );
    }
  }
 
this will create 30 particles each button click event, centered at the 
button click of the mouse, 3 times normal speed, with a random life of up to 100milliseconds
0,360,  means shoot out anywhere in a circle from the center point.
of random sizes 0px to 8px in size

and that is 
`hsl(300,${Math.random() * 100}%,${Math.random() * 100}%)`
hsl(300,%,%) gives like a magenta, with random intensity and lightness
    
*/////////////////////////////////////////////////////////////////////////







function particle(
  x,
  y,
  particleLife,
  particleSpeed,
  particleAngleStart,
  particleAngleEnd,
  particleMinSize,
  particleMaxSize,
  particleColor
) {
  let newParticle = document.createElement("div");
  let size = `${(Math.random() * particleMaxSize) + particleMinSize}px`;
  newParticle.style.width = size;
  newParticle.style.height = size;
  newParticle.style.borderRadius = "50%";
  newParticle.style.backgroundColor = particleColor
    ? particleColor
    : `hsl(${Math.random() * 360},75%,75%)`;

  newParticle.style.position = "absolute";
  newParticle.x = x;
  newParticle.y = y;
  newParticle.style.left = `${newParticle.x}px`;
  newParticle.style.top = `${newParticle.y}px`;
  newParticle.style.zIndex = `10`;

  document.body.appendChild(newParticle);
  let timeOut = particleLife
    ? particleLife + 1
    : Math.floor(Math.random() * 250);
  let randomDir = (Math.random() * (particleAngleEnd - particleAngleStart)) + particleAngleStart
    
    randomDir *=  (Math.PI / 180) //convert to radians;
  let vx = Math.cos(randomDir) * particleSpeed;
  let vy = Math.sin(randomDir) * particleSpeed;
  let movementInterval = setInterval(() => {
    timeOut = timeOut - 1;
    if (timeOut > 0) {
      newParticle.x += vx;
      newParticle.y += vy;
      newParticle.style.left = `${newParticle.x}px`;
      newParticle.style.top = `${newParticle.y}px`;
    } else {
      newParticle.parentElement.removeChild(newParticle);
      clearInterval(movementInterval);
    }
  }, 10);
}