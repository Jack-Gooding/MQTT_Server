import React, { useState, useEffect } from "react";
//import styles from '../css/ScreeningQuestions.scss';
import axios from "axios";
import WS2812bRing from "./P5/WS2812bRing";
import Slider from "./Slider";

export default function WS2812bRingPanel(props) {
  let [leds, setLeds] = useState([]);

  useEffect(() => {
    fetchData();
    return () => {
      console.log("component unmounted");
    };
  }, []);

  let fetchData = () => {
    let leds = [];
    for (let i = 0; i < 24; i++) {
      leds.push({
        hue: (i / 24) * 360,
        sat: 75,
        bri: 75,
      });
    }
    setLeds(leds);
  };

  let handleClick = async () => {
    let res = await axios.put("https://broker.jack-gooding.com/ring/warm", {
      data: "test",
    });
    console.log(res);
  };

  let updateLightState = async () => {};

  let changeLightColor = async () => {};

  return (
    <div className="service-panel">
      <div className="WS2812bPanel panel-card">
        <WS2812bRing data={leds} />
        <div className="WS2812b-control-panel">
          <div className="modes">
            <button
              onClick={() => {
                handleClick();
              }}
            >
              Warm
            </button>
            <button
              onClick={() => {
                handleClick();
              }}
            >
              Rainbow
            </button>
            <button
              onClick={() => {
                handleClick();
              }}
            >
              Rainbow Fade
            </button>
            <button
              onClick={() => {
                handleClick();
              }}
            >
              Warm
            </button>
          </div>
          <div className="rotation">Rotation speed</div>
          <Slider
            min="0"
            max="65534"
            item="hue"
            defaultValue={100}
            handleChange={(e) => updateLightState(e, "hue")}
            handleMouseUp={(e) => changeLightColor(e, "hue")}
          />
          <div className="sliders">
            <Slider
              min="0"
              max="65534"
              item="hue"
              defaultValue={100}
              handleChange={(e) => updateLightState(e, "hue")}
              handleMouseUp={(e) => changeLightColor(e, "hue")}
            />
            <Slider
              min="0"
              max="65534"
              item="sat"
              defaultValue={100}
              handleChange={(e) => updateLightState(e, "hue")}
              handleMouseUp={(e) => changeLightColor(e, "hue")}
            />
            <Slider
              min="0"
              max="65534"
              item="bri"
              defaultValue={100}
              handleChange={(e) => updateLightState(e, "hue")}
              handleMouseUp={(e) => changeLightColor(e, "hue")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// <Badge variant="secondary">{candidate.applicationMethod}</Badge>
