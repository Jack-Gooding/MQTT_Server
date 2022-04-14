import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPowerOff,
  faInfoCircle,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import { usePopper } from "react-popper";
import styled from "styled-components";

import hashlines from "./../images/hash.png";

import Slider from "./Slider";

export default function SmartLight(props) {
  const buttonRef = useRef(null);
  const popperRef = useRef(null);
  const [arrowRef, setArrowRef] = useState(null);
  const [showPopper, setShowPopper] = useState(false);

  const { styles, attributes } = usePopper(
    buttonRef.current,
    popperRef.current,
    {
      modifiers: [
        {
          name: "arrow",
          options: {
            element: arrowRef,
          },
        },
        {
          name: "offset",
          options: {
            offset: [0, 10],
          },
        },
      ],
    }
  );

  let [color, setColor] = useState([
    49, //hue
    61, //sat
    65, //bri
  ]);

  useEffect(() => {
    if (props.data.color.hue != null) {
      let newColor = [...color];
      let propColor = props.data.color;
      console.log(propColor);
      propColor = hsv_to_hsl(
        propColor.hue / 65534,
        propColor.sat / 254,
        propColor.bri / 254
      );
      newColor[0] = propColor[0] * 360;
      newColor[1] =
        propColor[1] * 254 > 200
          ? ((200 - 127) / (200 - 127)) * 85 + 15
          : propColor[1] * 254 < 127
          ? ((127 - 127) / (200 - 127)) * 85 + 15
          : ((propColor[1] * 254 - 127) / (200 - 127)) * 85 + 15;
      newColor[2] = propColor[2] * 100 * 0.6 + 100 * 0.2;
      console.log(newColor);
      setColor(newColor);
    }
    return () => {
      console.log("component unmounted");
    };
  }, []);

  function hsv_to_hsl(h, s, v) {
    // both hsv and hsl values are in [0, 1]
    var l = ((2 - s) * v) / 2;
    if (l !== 0) {
      if (l === 1) {
        s = 0;
      } else if (l < 0.5) {
        s = (s * v) / (l * 2);
      } else {
        s = (s * v) / (2 - l * 2);
      }
    }
    return [h, s, l];
  }

  let changeLightState = () => {
    props.update({
      id: props.data.id,
      on: !props.data.on,
      name: props.data.name,
    });
  };

  let changeLightColor = (e, item) => {
    let val = e.target.value;
    props.update({
      id: props.data.id,
      name: props.data.name,
      color: {
        hue: item === "hue" ? val : null,
        sat: item === "sat" ? val : null,
        bri: item === "bri" ? val : null,
      },
    });
  };

  let updateLightState = (e, item) => {
    let newColor = [...color];

    if (item === "hue") newColor[0] = (e.target.value / 65534) * 360;
    if (item === "sat")
      newColor[1] = ((e.target.value - 127) / (200 - 127)) * 85 + 15;
    if (item === "bri") {
      let propColor = hsv_to_hsl(
        newColor[0] / 360,
        newColor[1] / 254,
        e.target.value / 254
      );
      newColor[2] = propColor[2] * 100 * 0.6 + 100 * 0.2;
    }
    setColor(newColor);
  };

  return (
    <div className="smart-light-card panel-card">
      <div className="card-title-bar">
        <div className="vertical-center">
          <span>
            <p>{props.data.name} </p>
            <FontAwesomeIcon
              ref={buttonRef}
              onClick={() => setShowPopper(!showPopper)}
              className={"smart-light-info"}
              icon={faInfoCircle}
            />
            {showPopper ? (
              <PopperContainer
                onClick={() => setShowPopper(!showPopper)}
                ref={popperRef}
                style={styles.popper}
                {...attributes.popper}
              >
                <div ref={setArrowRef} style={styles.arrow} id="arrow" />
                <p>I'm a popper</p>
              </PopperContainer>
            ) : null}
          </span>
        </div>
        {props.data.reachable === true ? (
          <button onClick={changeLightState}>
            <FontAwesomeIcon
              style={{ color: `${props.data.on ? "green" : "inherit"}` }}
              icon={faPowerOff}
            />
          </button>
        ) : (
          <div className="no-connection">
            <FontAwesomeIcon style={{ color: "rgb(200,0,0)" }} icon={faWifi} />
          </div>
        )}
      </div>
      <div className="color-sliders">
        <div>
        {props.data.type === "Extended color light" ? (
          <>
            <Slider
              min="0"
              max="65534"
              item="hue"
              defaultValue={props.data.color.hue}
              handleChange={(e) => updateLightState(e, "hue")}
              handleMouseUp={(e) => changeLightColor(e, "hue")}
              disabled={!props.data.reachable}

            />
            <Slider
              min="127"
              max="200"
              item="sat"
              defaultValue={props.data.color.sat}
              handleChange={(e) => updateLightState(e, "sat")}
              handleMouseUp={(e) => changeLightColor(e, "sat")}
              disabled={!props.data.reachable}

            />
          </>
        ) : (
          <></>
        )}
        <Slider
          min="1"
          max="254"
          item="bri"
          defaultValue={props.data.color.bri}
          handleChange={(e) => updateLightState(e, "bri")}
          handleMouseUp={(e) => changeLightColor(e, "bri")}
          disabled={!props.data.reachable}

        />
    </div>
    {!props.data.reachable ?
    <div className="slider-disabled-screen">
      {props.data.type === "Extended color light" ?
        <>
        <div></div>
        <div></div>
        </>
      :
      <></>
  }
  <div></div>
    </div>
  :
<></>}
      </div>
      <div
        className="color-block"
        style={{
          background: `${
            props.data.on
              ? `hsl(${color[0]},${color[1]}%,${color[2]}%)`
              : `hsla(${color[0]}, 24%, 15%, 1)`
          } ${props.data.on ? "" : `url(${hashlines})`}`,
        }}
      ></div>
    </div>
  );
}

const PopperContainer = styled.div`
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: white;
  padding: 20px;
  text-align: center;
  position: absolute;
  bottom: 100%;
  color: black;
  #arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    &:after {
      content: " ";
      background-color: white;
      box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
      position: absolute;
      top: -25px; // padding + popper height
      left: 0;
      transform: rotate(45deg);
      width: 10px;
      height: 10px;
    }
  }

  &[data-popper-placement^="top"] > #arrow {
    bottom: -30px;
    :after {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    }
  }
`;
