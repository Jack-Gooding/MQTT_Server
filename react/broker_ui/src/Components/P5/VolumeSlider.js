import {useState, useEffect, useRef} from 'react';
import p5 from 'p5';

export default function VolumeSlider(props) {

  let [mouseInside, setMouseInside] = useState(false);
  let [volume, setVolume] = useState(props.value);

  const sketchRef = useRef(null);

  let Sketch = (p) => {
    let cWidth = 200;
    let cHeight = 80;

    let sliderWidth = cWidth;
    let sliderMaxHeight = cHeight;
    let sliderMinHeight = 20;

    let firstRun = true;
    let mouseHeld = false;


    let checkBoundaries = () => {
      let inside = false;
      let volHeight = p.map(p.mouseX, 0, sliderWidth, sliderMinHeight, sliderMaxHeight);
      if (p.mouseX <= sliderWidth && p.mouseX >= 0 && p.mouseY <= cHeight && p.mouseY >= cHeight-volHeight ) {
        inside = true;
      };
      return inside;
    };

    let drawSlider = (x) => {

      let volHeight = p.map(x, 0, sliderWidth, sliderMinHeight, sliderMaxHeight);
      p.clear();
      p.fill("yellow");
      p.beginShape();
      p.vertex(0,cHeight-sliderMinHeight);
      p.vertex(0,cHeight);
      p.vertex(x,cHeight);
      p.vertex(x,cHeight-volHeight);
      p.endShape("CLOSE");
      p.fill("grey");
      p.beginShape();
      p.vertex(x,cHeight-volHeight);
      p.vertex(x,cHeight);
      p.vertex(sliderWidth,cHeight);
      p.vertex(sliderWidth,cHeight-sliderMaxHeight);
      p.endShape("CLOSE");

    };

    p.setup = () => {
      p.createCanvas(cWidth,cHeight);
      p.noStroke();

      p.noLoop();
    }

    p.draw = () => {

      if (firstRun === false) {
        drawSlider(p.mouseX);
        console.log(props.value);
        let newVol = Math.round(p.mouseX/sliderWidth*100);
        volume = newVol;
        if (volume > 100) {
          volume = 100;
        } else if (volume < 0) {
          volume = 0;
        }
      } else {
        firstRun = false;
        console.log(props.value);
        drawSlider(props.value/100*sliderWidth);
        console.log("firstRun");
      }
    }

    p.mousePressed = () => {
      if (checkBoundaries()) {
        p.loop();
        mouseHeld = true;
      }
    };

    p.mouseReleased = () => {
      if (checkBoundaries()) {
      }
      if (mouseHeld) {
        props.update(volume);
      }
      p.noLoop();
      mouseHeld = false;
    };

    p.mouseMoved = () => {
      if (checkBoundaries()) {
        setMouseInside(true);
      } else {
        setMouseInside(false);
      }
    };
  }

  let createP5 = () => {
    console.log("render once");
  };

  useEffect(() => {
    console.log(props.value);
    setVolume(props.value);
    let myP5 = new p5(Sketch, sketchRef.current);
    return () => {
        console.log("component unmounted");
    }
  }, [])

    return (
      <>
        <div className="sketch-container" value={props.value} style={{"cursor": `${mouseInside ? 'pointer' : ""}`}} ref={sketchRef}>
        </div>
      </>
    )
}
