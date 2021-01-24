import react, {useState, useEffect, useRef} from 'react';
import p5 from 'p5';

export default function WS2812b(props) {

  const sketchRef = useRef(null);

  let Sketch = (p) => {
    let cWidth = 200;
    let cHeight = 200;

    let numPips = 24;

    let maxSize = Math.sqrt(Math.pow(cWidth,2), Math.pow(cHeight,2));

    let innerD = maxSize/3;
    let outerD = maxSize/2.2;

    let pips = [];
    let pipActiveTracker = false;

    class Pip {
      constructor(angle = 0, active = false) {
        this.angle = angle;
        this.active = active;
        this.angles = [];
        this.numAngles = 16;
        this.defaultHue = 0;
      };

      generateAngles = () => {
        this.defaultHue = p.map(this.angle, 0, p.TWO_PI, 0, 100);
        for (let i = 0; i < this.numAngles; i++) {

          let theta2 = p.map(i, 0, this.numAngles, 0, p.TWO_PI/24);

          this.angles.push(theta2);
        };
      };

      show = () => {
        if (this.angles.length <= 0 || this.angles == null) {
          this.generateAngles();
        };

        // p.push();
        // // p.translate(cWidth/2, cHeight/2);
        // p.strokeWeight(1);
        // p.stroke(255)
        // p.point(0,0);
        // let xPos1 = Math.cos(this.angle - p.PI/2)*(outerD);
        // let yPos1 = Math.sin(this.angle - p.PI/2)*(outerD);
        // p.line(0,0,xPos1, yPos1);
        // p.pop();

        p.fill(p.color(this.defaultHue, 100,100));

        if (this.active) {
          p.stroke(0);
          p.strokeWeight(1);
        } else {
          p.noStroke();
        }

        p.beginShape();
        // console.log(this.points);
        for (let i = 0; i < this.angles.length; i++) {
          let activeCheck = (i != 0 && i != this.angles.length-1) || this.active;
          if (activeCheck) {
            // let point = this.points[i];
            let angle2 = this.angles[i];
            let xPos1 = Math.cos(this.angle+angle2 - p.PI/2);
            let yPos1 = Math.sin(this.angle+angle2 - p.PI/2);
            // p.vertex(point[0]*outerD,point[1]*outerD);
            p.vertex(xPos1*outerD,yPos1*outerD);
          };
        }
        for (let i = this.angles.length-1; i >= 0 ; i--) {
          let activeCheck = (i != 0 && i != this.angles.length-1) || this.active;
          if (activeCheck) {
            let angle2 = this.angles[i];
            let xPos1 = Math.cos(this.angle+angle2 - p.PI/2);
            let yPos1 = Math.sin(this.angle+angle2 - p.PI/2);
            // let point = this.points[i];
            // p.vertex(point[0]*innerD,point[1]*innerD);
            p.vertex(xPos1*innerD,yPos1*innerD);
          };
        }
        p.endShape(p.CLOSE);
      };
    };

    function getAngleDeg(ax,ay,bx,by) {
      var angleRad = Math.atan((ay-by)/(ax-bx));
      var angleDeg = angleRad * 180 / p.TWO_PI;

      return(angleDeg);
    }

    function getAngleRad(ax,ay,bx,by) {
      var angleRad = Math.atan((ay-by)/(ax-bx));
      angleRad+=p.PI/2;
      if (ax-bx < 0) {
        angleRad+=p.PI;
      }
      angleRad = angleRad;
      return(angleRad);
    }

    let drawRing = () => {
      //draws the ring 'PCB'
      p.push();
      p.noStroke();
      p.fill("white");
      p.ellipse(0,0,2*outerD+4); //
      p.erase();
      p.ellipse(0,0,2*innerD-4);
      p.noErase();
      p.pop();
    };

    p.setup = () => {
      p.createCanvas(cWidth,cHeight);
      p.frameRate(16);
      p.strokeCap(p.ROUND);
      p.strokeJoin(p.ROUND);
      p.smooth();
      p.noStroke();
      p.colorMode(p.HSB,100);

      for (let i = 0; i < 24; i++) {

        let theta1 = p.map(i, 0, 24, 0, p.TWO_PI);
        let hue = p.map(i, 0, 24, 0, 100);

        let pip = new Pip(theta1);
        pip.generateAngles();
        pips.push(pip);
      };

      p.translate(cWidth/2,cHeight/2);
      drawRing();
      pips.forEach((pip) => {
        pip.show();
        pip.active = false;
      });

    }


    p.draw = () => {
      let ringDrawn = false;
      p.translate(cWidth/2,cHeight/2);

      let activePip = pips.find((a) => {return a.active == true});

      if (activePip != null) {
        activePip.active = false;
      }

      let mouseDist = p.dist(0,0,cWidth/2-p.mouseX,cHeight/2-p.mouseY);
      if (mouseDist > innerD && mouseDist < outerD) {

        p.stroke('#bbb');

        let mouseAngle = getAngleRad(0,0,cWidth/2-p.mouseX,cHeight/2-p.mouseY);
        mouseAngle = mouseAngle - mouseAngle % (p.TWO_PI/24);

        let pip = pips.sort((a,b) => {

          return (Math.abs(mouseAngle - a.angle) - Math.abs(mouseAngle - b.angle));
        })[0];

        pip.defaultHue = Math.random()*100;
        pip.active = true;
        pipActiveTracker = true;
        // console.log(pip);

        };


        if ((mouseDist > innerD && mouseDist < outerD) || pipActiveTracker) {
          if (!ringDrawn) drawRing();
          pips.forEach((pip) => {
            pip.show();
          });
        }


    }

  }

  useEffect(() => {
    let myP5 = new p5(Sketch, sketchRef.current);
    return () => {
        console.log("component unmounted");
    }
  }, [])

    return (
      <div value={props.value} ref={sketchRef}>
      </div>
    )
}
