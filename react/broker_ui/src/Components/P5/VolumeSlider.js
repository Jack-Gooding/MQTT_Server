import react, {useState, useEffect, useRef} from 'react';
import p5 from 'p5';

export default function VolumeSlider(props) {

  let [mouseInside, setMouseInside] = useState(false);
  let volume = props.defaultValue;
  const sketchRef = useRef(null);

  let Sketch = (p) => {
    let cWidth = 200;
    let cHeight = 80;

    let sliderWidth = cWidth;
    let sliderMaxHeight = cHeight;
    let sliderMinHeight = 20;

    let checkBoundaries = () => {
      let inside = false;
      let volHeight = p.map(p.mouseX, 0, sliderWidth, sliderMinHeight, sliderMaxHeight);
      if (p.mouseX <= sliderWidth && p.mouseX >= 0 && p.mouseY <= cHeight && p.mouseY >= cHeight-volHeight ) {
        inside = true;
      };
      return inside;
    };

    p.setup = () => {
      p.createCanvas(cWidth,cHeight);
      p.noStroke();

      p.fill("yellow");
      p.beginShape();
      p.vertex(0,cHeight-sliderMinHeight);
      p.vertex(0,cHeight);
      let volX = Math.round(volume/100*sliderWidth);
      let volHeight = p.map(volX, 0, sliderWidth, sliderMinHeight, sliderMaxHeight);
      p.vertex(volX,cHeight);
      p.vertex(volX,cHeight-volHeight);
      p.endShape("CLOSE");
      p.fill("grey");
      p.beginShape();
      p.vertex(volX,cHeight-volHeight);
      p.vertex(volX,cHeight);
      p.vertex(sliderWidth,cHeight);
      p.vertex(sliderWidth,cHeight-sliderMaxHeight);
      p.endShape("CLOSE");
      p.noLoop();
    }

    p.draw = () => {
      if (checkBoundaries()) {
        let volHeight = p.map(p.mouseX, 0, sliderWidth, sliderMinHeight, sliderMaxHeight);
        p.clear();
        p.fill("yellow");
        p.beginShape();
        p.vertex(0,cHeight-sliderMinHeight);
        p.vertex(0,cHeight);
        p.vertex(p.mouseX,cHeight);
        p.vertex(p.mouseX,cHeight-volHeight);
        p.endShape("CLOSE");
        p.fill("grey");
        p.beginShape();
        p.vertex(p.mouseX,cHeight-volHeight);
        p.vertex(p.mouseX,cHeight);
        p.vertex(sliderWidth,cHeight);
        p.vertex(sliderWidth,cHeight-sliderMaxHeight);
        p.endShape("CLOSE");
        let newVol = Math.round(p.mouseX/sliderWidth*100);
        volume = newVol;
        props.update(volume);
      }
    }

    p.mousePressed = () => {
      if (checkBoundaries()) {
        p.loop();
      }
    };

    p.mouseClicked = () => {
      props.update(volume, true);
      p.noLoop();
    };

    p.mouseMoved = () => {
      if (checkBoundaries()) {
        setMouseInside(true);
      } else {
        setMouseInside(false);
      }
    };
  }

  useEffect(() => {
    let myP5 = new p5(Sketch, sketchRef.current);
    return () => {
        console.log("component unmounted");
    }
  }, [])

    return (
      <div class="sketch-container" style={{"cursor": `${mouseInside ? 'pointer' : ""}`}} ref={sketchRef}>
      </div>
    )
}
