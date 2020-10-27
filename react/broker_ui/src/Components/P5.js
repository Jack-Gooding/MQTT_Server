import react, {useState, useEffect, useRef} from 'react';
import p5 from 'p5';

export default function P5(props) {

  const sketchRef = useRef(null);
  const [volume, setVolume] = useState(0);

  let Sketch = (p) => {
    let cWidth = 200;
    let cHeight = 120;

    let sliderWidth = cWidth;
    let sliderHeight = cHeight;


    p.setup = () => {
      p.createCanvas(cWidth,cHeight);
      for (let i = 0; i < cWidth+cHeight; i+=6) {
        p.stroke(0);
        p.strokeWeight(2)
        p.line(0,i,i,0);
      }
      p.noStroke();
      p.beginShape();
      p.endShape();
    }

    p.draw = () => {
      if (p.mouseX <= sliderWidth && p.mouseX >= 0 && p.mouseY >= 0 && p.mouseY <= sliderHeight ) {
        p.clear();
        p.fill("yellow");
        p.beginShape();
        p.vertex(0,cHeight);
        p.vertex(p.mouseX,cHeight);
        let volHeight = p.map(p.mouseX, 0, sliderWidth, 0, sliderHeight);
        p.vertex(p.mouseX,cHeight-volHeight);
        p.endShape("CLOSE");
        p.fill("grey");
        p.beginShape();
        p.vertex(p.mouseX,cHeight-volHeight);
        p.vertex(p.mouseX,cHeight);
        p.vertex(sliderWidth,cHeight);
        p.vertex(sliderWidth,cHeight-sliderHeight);
        p.endShape("CLOSE");
        setVolume(Math.round(p.mouseX/sliderWidth*100));
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
      <div ref={sketchRef}>
        <p>{volume}</p>
      </div>
    )
}
