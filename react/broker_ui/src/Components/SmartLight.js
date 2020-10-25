import React from 'react';

export default function SmartLight(props) {

  let sendLightOff = () => {
    props.update({
      on: !props.data.on,
      name: "somethign random",
    });
  };

  let item = props.data;

    return (
      <div className="smart-light-card">
        <p>Name: {props.data.name}</p>
        <p>Status: {props.data.on ? "On" : "Off"}</p>
        <button onClick={sendLightOff}>
          {props.data.on ? "light off" : "Light on"}
        </button>
      </div>
    );
};
