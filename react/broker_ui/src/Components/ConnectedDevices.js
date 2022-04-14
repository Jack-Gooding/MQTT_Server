import React, { useState, useEffect } from "react";
import { usePopper } from "react-popper";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import PopperExample from "./PopperExample.js";

export default function ConnectedDevices(props) {
  let [devices, setDevices] = useState(["MQTT Test Device"]);

  useEffect(() => {
    fetchData();
    return () => {
      console.log("component unmounted");
    };
  }, []);

  let fetchData = async () => {
    try {
      let res = await axios.get("https://broker.jack-gooding.com/devices", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "application/json",
        },
      });
      //This should be changed to an object for better info
      if (Array.isArray(res.data)) {
        setDevices(res.data, useState);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="service-panel">
      <RenderDevices data={devices} />
      <PopperExample />
    </div>
  );
}

const RenderDevices = (props, useState) => {
  const render = props.data.map((item, index) => (
    <div key={index} className="mqtt-device-panel">
      <p>{item}</p>
      <p className="info-icon">
        <FontAwesomeIcon type="button" icon={faInfoCircle} />
      </p>
    </div>
  ));
  return render;
};
