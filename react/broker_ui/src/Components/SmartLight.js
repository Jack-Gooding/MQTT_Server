import React from 'react';

export default function SmartLight(props) {

  let changeLightState = () => {
    props.update({
      id: props.data.id,
      on: !props.data.on,
      name: props.data.name
    });
  };

  let changeLightColor = (e) => {
    let item = e.target.item;
    let val = e.target.value;
    props.update({
      id: props.data.id,
      name: props.data.name,
      color: {
        hue: `${item == "hue" ? val : null}`,
        sat: `${item == "sat" ? val : null}`,
        bri: `${item == "bri" ? val : null}`
      }
    });
  };

    return (
      <div className="smart-light-card">
        <p>Name: {props.data.name}</p>
        <p>Status: {props.data.on ? "On" : "Off"}</p>
        <button onClick={changeLightState}>
          {props.data.on ? "light off" : "Light on"}
        </button>

        {props.data.type == "Extended color light" ?
          <>
            <input type="range" min="0" max="65534" defaultValue={props.data.color.hue} onMouseUp={(e) => changeLightColor(e)}/>
            <input type="range" min="0" max="254" defaultValue={props.data.color.sat} onMouseUp={(e) => changeLightColor(e)}/>
          </>
        :
          <></>
        }
        <input type="range" min="0" max="254" defaultValue={props.data.color.bri} onMouseUp={(e) => changeLightColor(e)}/>

      </div>
    );
};
