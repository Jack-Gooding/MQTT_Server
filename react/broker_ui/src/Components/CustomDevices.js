import React, {useEffect, useState} from 'react';
import axios from 'axios';

import SmartPlug from './SmartPlug';

export default function CustomDevices(props) {
  let [deskLights, setDeskLights] = useState(false);

  useEffect(() => {
    let ws = new WebSocket('ws://localhost:3233/desk/lights');
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
      if (res[0] === 'desk/lights') {
        let data = JSON.parse(res[1].message);
        setDeskLights(data);

      };
    };

    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };

  },[]);

  let updateDeskLights = async (data) => {
    setDeskLights(!deskLights);
    try {
      let payload = data ? 255 : 0;
      let res = await axios.put('https://broker.jack-gooding.com/desk/lights', payload);
      console.log(res.data);
    }
    catch(e) {
      console.error(e);
    };
  };

    return (
      <div className="service-panel">
          <SmartPlug key={"desk/lights"} data={{name: "Desk Lights", on: deskLights}} update={(e) => updateDeskLights(e)} />
        <div className="panel-card">
          3D Printer Lights
        </div>
        <div className="panel-card">
          TODO:
          Server: - interval update plugstate
          All: 'ring/warm' is not good.
        </div>
      </div>
    );
};
