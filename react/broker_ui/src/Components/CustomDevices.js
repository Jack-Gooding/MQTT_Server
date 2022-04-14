import React, { useEffect, useState } from "react";
import axios from "axios";

import SmartPlug from "./SmartPlug";
import TemperaturePanel from "./TemperaturePanel";

export default function CustomDevices(props) {
  let [deskLights, setDeskLights] = useState(false);
  let [temperature, setTemperature] = useState(null);
  let [sensors, setSensors] = useState([
    {
      sensorId: "28-0316c2c8bbff",
      location: "Living Room",
      temperature: 20 + Math.floor(Math.random() * 50) / 10,
      // humidity: 30 + Math.floor(Math.random() * 50),
    },
    {
      sensorId: "28-0316c2c8bbfb",
      location: "Office",
      temperature: 20 + Math.floor(Math.random() * 50) / 10,
      humidity: 30 + Math.floor(Math.random() * 50),
    },
  ]);

  useEffect(() => {
    fetchTemperatureData();

    let ws = new WebSocket("ws://jack-gooding.com:3234/desk/lights");
    const subscribe = {
      url: "/desk/lights",
    };

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };

    ws.onmessage = (e) => {
      const res = JSON.parse(e.data);
      console.log("WS desk/lights data received:");
      console.log(res);
      if (res[0] === "desk/lights") {
        let data = parseInt(res[1].message);
        setDeskLights(data);
      }
    };

    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, []);

  let fetchTemperatureData = async () => {
    try {
      console.log(`Requesting Temperature Data`);
      // let res = await axios.get("https://broker.jack-gooding.com/temperature");
      let res = await axios.get("https://broker.jack-gooding.com/climate-sensors");
      console.log(res.data);
      if (res.data.sensors != null) {
        setSensors(res.data.sensors);
      }
    } catch (e) {
      console.log(e);
    }
  };

  let updateDeskLights = async (data) => {
    setDeskLights(!deskLights);
    try {
      console.log(data.on);
      let payload = data.on ? 255 : 0;
      console.log(`payload: ${payload}`);
      let res = await axios.put(
        "https://broker.jack-gooding.com/desk/lights",
        payload
      );
      console.log(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="service-panel">
      <SmartPlug
        key={"desk/lights"}
        data={{ name: "Desk Lights", on: deskLights }}
        update={(e) => updateDeskLights(e)}
      />
      <TemperaturePanel sensors={sensors} />

    </div>
  );
}

// <div className="panel-card">3D Printer Lights</div>

// <div className="panel-card">
//   TODO: Server: - interval update plugstate All: 'ring/warm' is not good.
// </div>
