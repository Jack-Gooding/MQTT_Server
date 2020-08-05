const { createCanvas, Image } = require('canvas');
const fs = require('fs');

let marginSize = 20;
let letterSize = 12;

let cArrDefault = [
  {
    name: "Bedroom Light",
    // color: `hsb(${Math.random() * 254}, 100, 100)`,
    color: `hsl(${Math.round(Math.random()*360)},100%,50%)`,
  },
  {
    name: "Bedside Lamp",
    color: `hsl(${Math.round(Math.random()*720)},100%,50%)`,
  },
  {
    name: "Bathroom Light",
    color: `rgb(${Math.round(Math.random()*254)},${Math.round(Math.random()*254)},${Math.round(Math.random()*254)})`,
  }
]

let bulbStatesBanner = (cArr = cArrDefault) => {
  let width = 0;
  let height = 100;

  let rectSizes = [0];

  cArr.forEach((cObj) => {

    //    += margin + 12px per letter
    let newRect = marginSize + letterSize * cObj.name.length;
    rectSizes.push(width + newRect);
    width += newRect;
  });

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  console.log(cArr);

  cArr.forEach((cObj, index) => {

    let colour = {};

    if (cObj.type === "Extended color light") {
      let hue = Math.round((cObj.color.hue/65535)*360);
      // let c = hsv_to_hsl(hue,cObj.color.sat/100,cObj.color.bri/100);
      colour = {
        hue: hue,
        sat: cObj.on ? 100 : 50,
        lightness: cObj.on ? 50 : 20,
      }
      console.log(colour);
    } else {
      if (cObj.on) {
        //hsla(47, 90%, 50%, 1)
        colour = {
          hue: 47,
          sat: 100,
          lightness: 50,
        }
      } else {
        //hsla(227, 19%, 18%, 1)
        colour = {
          hue: 227,
          sat: 19,
          lightness: 18,
        }
      }
    };

    context.fillStyle = `hsl(${colour.hue},${colour.sat}%,${colour.lightness}%)`;
    context.fillRect(rectSizes[index], 0, rectSizes[index + 1], height);


    context.font = "18px 'Comic Sans MS'";
    context.textAlign = 'center';
    context.textBaseline = 'center';
    context.fillStyle = `hsl(${colour.hue+180},${colour.sat}%,${colour.lightness}%)`;

    let halfwayPoint = rectSizes[index] + (rectSizes[index + 1] - rectSizes[index]) / 2;

    context.fillText(cObj.name, halfwayPoint, height/2+6);


  });

  const buffer = canvas.toBuffer('image/png');

  //fs.writeFileSync('./test.png', buffer);
  return buffer;


};

let randomColourBanner = (cArr = cArrDefault) => {


  let width = 0;
  let height = 100;

  let rectSizes = [0];

  cArr.forEach((cObj) => {
    console.log(cObj.name.length);

    //    += margin + 12px per letter
    let newRect = marginSize + letterSize * cObj.name.length;
    rectSizes.push(width + newRect);
    width += newRect;
  });

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  cArr.forEach((cObj, index) => {
    context.fillStyle = `hsl(${cObj.color.hue},${cObj.color.sat}%,${cObj.color.lightness}%)`;

    console.log(cObj.color)
    context.fillRect(rectSizes[index], 0, rectSizes[index + 1], height);

    context.font = "18px 'Comic Sans MS'";
    context.textAlign = 'center';
    context.textBaseline = 'center';
    context.fillStyle = `hsl(${cObj.color.hue+180},${cObj.color.sat}%,${cObj.color.lightness}%)`;

    let halfwayPoint = rectSizes[index] + (rectSizes[index + 1] - rectSizes[index]) / 2;

    context.fillText(cObj.name, halfwayPoint, height/2+6);
  });

  const buffer = canvas.toBuffer('image/png');

  //fs.writeFileSync('./test.png', buffer);
  return buffer;
};


// function hsv_to_hsl(h, s, v) {
//     // both hsv and hsl values are in [0, 1]
//     var l = (2 - s) * v / 2;
//
//     if (l != 0) {
//         if (l == 1) {
//             s = 0
//         } else if (l < 0.5) {
//             s = s * v / (l * 2)
//         } else {
//             s = s * v / (2 - l * 2)
//         }
//     }
//
//     return [h, s, l]
// }


let reconstructPhoto = (buffer, width = 640, height = 480) => {

  let canvas = createCanvas(width, height);
  let context = canvas.getContext('2d');
  // console.log(buffer);
  console.log(width, height);
  let img = new Image();
  context.fillStyle = `rgb(${Math.round(Math.random()*254)},${Math.round(Math.random()*254)},${Math.round(Math.random()*254)})`;
  context.fillRect(0, 0, width, height);

  // img.src = buffer;
  img.src = fs.readFileSync('./test.png');
  img.onload = () => {
    console.log(this.src);
  };
  img.onerror = err => { throw err };
  context.drawImage(img, 0, 0);

   const payload = canvas.toBuffer('image/png');
   // console.log(payload);
   fs.writeFileSync('./reconstructed.png', payload);
   return payload;
};


module.exports = {
  randomColourBanner,
  bulbStatesBanner,
  reconstructPhoto
};
