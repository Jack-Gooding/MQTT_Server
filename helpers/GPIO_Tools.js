let noise = require('./perlin.js');


// simple Up/down oscillation
//
let simpleOscillatePWM = async (obj, currentVal) => {
  let interval = setInterval(() => {
    currentVal += Math.PI/50;
    if (currentVal > 2*Math.PI) {
      currentVal = 0;
    };
    let ledVal = (Math.sin(currentVal-1)+1)*(254/2);
    obj.pwmWrite(Math.round(ledVal));
  }, 20);

  return x;
};
