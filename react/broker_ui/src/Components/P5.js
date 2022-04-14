import {useEffect, useRef} from 'react';
import p5 from 'p5';

export default function P5(props) {

  const sketchRef = useRef(null);


  let Sketch = (p) => {
    let cWidth = 200;
    let cHeight = 200;


    // function getAngleDeg(ax,ay,bx,by) {
    //   var angleRad = Math.atan((ay-by)/(ax-bx));
    //   var angleDeg = angleRad * 180 / p.TWO_PI;
    //
    //   return(angleDeg);
    // }
    //
    function getAngleRad(ax,ay,bx,by) {
      var angleRad = Math.atan((ay-by)/(ax-bx));
      angleRad+=p.PI/2;
      if (ax-bx < 0) {
        angleRad+=p.PI;
      }
      // angleRad = angleRad;
      //let a = p.createVector(ax,ay);
      //let b = p.createVector(bx,by);

      //let angleRad = a.angleBetween(b);
      //console.log(a,b,angleRad);
      return(angleRad);
    }

    let maxSize = Math.sqrt(Math.pow(cWidth,2), Math.pow(cHeight,2));

    p.setup = () => {
      p.createCanvas(cWidth,cHeight);
      p.strokeCap(p.ROUND);
      p.strokeJoin(p.ROUND);
      p.smooth();
      p.noStroke();
      p.beginShape();
      p.endShape();
    }

    p.draw = () => {
      p.clear();
      p.translate(cWidth/2,cHeight/2);
      p.stroke('#bbb');
      p.point(0,0);
      // let sectors = [];
      //console.log(p.mouseX,p.mouseY);

      //console.log(p.mouseX-cWidth/2,p.mouseX-cHeight/2,Math.atanh(p.mouseX-cWidth/2,p.mouseX-cHeight/2));
      let mouseAngle = getAngleRad(0,0,cWidth/2-p.mouseX,cHeight/2-p.mouseY);

      p.push();
      p.noStroke();
      p.fill("white");
      p.ellipse(0,0,2*maxSize/2.2+5);
      p.erase();
      p.ellipse(0,0,2*maxSize/3-5);
      p.noErase();
      p.pop();

      for (let i = 0; i < 24; i++) {
        let sector = [];
        let theta1 = p.map(i, 0, 24, 0, p.TWO_PI);
        let hue = p.map(i, 0, 24, 0, 100);
        //
        // let xPos1 = Math.sin(theta1)*maxSize/3;
        // let yPos1 = Math.cos(theta1)*maxSize/3;
        // let xPos2 = Math.sin(theta1)*maxSize/4;
        // let yPos2 = Math.cos(theta1)*maxSize/4;
        //
        //
        // p.point(xPos1,yPos1);
        // p.line(xPos1,yPos1,xPos2,yPos2);
        let change = 0;
        let start = 2;
        let end = 18;
        if (mouseAngle > theta1 && mouseAngle < theta1 + p.TWO_PI/24 && p.dist(cWidth/2,cHeight/2,p.mouseX,p.mouseY) < maxSize/2.2 && p.dist(cWidth/2,cHeight/2,p.mouseX,p.mouseY) > maxSize/3) {
          change = 5;
          //console.log(mouseAngle, theta1);
          start -=2;
          end +=2;
        }
        p.push();
        p.noStroke();
        p.colorMode(p.HSB,100);
        p.fill(hue,100,100);
        for (let j = start; j <= end; j++) {
          let theta2 = p.map(j, 0, 20, 0, p.TWO_PI);
          theta2 = theta2/24;
          sector.push(theta2);
        };
        p.beginShape();
        sector.forEach((theta2) => {
          let xPos1 = Math.cos(theta1+theta2 - p.PI/2)*(maxSize/2.2+change);
          let yPos1 = Math.sin(theta1+theta2 - p.PI/2)*(maxSize/2.2+change);
          p.vertex(xPos1, yPos1);
        });
        for (let j = sector.length-1; j >= 0; j--) {
          let theta2 = sector[j];
          let xPos1 = Math.cos(theta1+theta2 - p.PI/2)*(maxSize/3-change);
          let yPos1 = Math.sin(theta1+theta2 - p.PI/2)*(maxSize/3-change);
          p.vertex(xPos1, yPos1);
        }
        p.endShape();
        p.pop();

      }
    }
  }

  useEffect(() => {
    let myP5 = new p5(Sketch, sketchRef.current);
    myP5.loop = true;
    return () => {
        console.log("component unmounted");
    }
  }, [])

    return (
      <div value={props.value} ref={sketchRef}>
      </div>
    )
}
