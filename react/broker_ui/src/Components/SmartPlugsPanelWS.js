import React, {useState, useEffect} from 'react';
import axios from 'axios';

import SmartPlug from './SmartPlug';
//import styles from '../css/ScreeningQuestions.scss';

export default function HueLightsPanelWS(props) {

  let [plugs, setPlugs] = useState([
    {
      name: "Example",
      id: 0,
      on: true,
    },
    // {
    //   name: "Example",
    //   id: 1,
    //   on: true,
    // }
  ]);

  useEffect(() => {
    let ws = new WebSocket('ws://jack-gooding.com:3234/plugs');
    const subscribe = {
      url: "/plugs",
    };

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };

    ws.onmessage = (e) => {

      const res = JSON.parse(e.data);
      console.log("WS plug data received:");
      console.log(res);
      if (res[0] === 'plugs') {

        let plugs = res[1].message;
        setPlugs(plugs);

      };
    };

    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };

  },[]);

  let updatePlugs = async (data) => {

    let newPlugs = [...plugs];
    let plugIndex = newPlugs.findIndex((plug) => plug.id === data.id);
    if (data.on != null) {
      newPlugs[plugIndex].on = data.on;
      console.log(`Setting ${data.name} to ${data.on ? "On" : "Off"}`);
    };

    setPlugs(newPlugs);

    try {
      let payload = [
        {
          id: data.id,
          on: data.on,
          name: data.name,
        },
      ];
      let res = await axios.put('https://broker.jack-gooding.com/plugs', payload);
      console.log(res.status === 200);
    }
    catch(e) {
      console.error(e);
    };
  };


  return (
    <div className="service-panel">
      {renderPlugs(plugs, updatePlugs)}
    </div>
  );
};

function renderPlugs(data, update) {
  // console.log(data);
  const render = data.map((item, index) =>
    <SmartPlug key={index} data={item} update={(e) => update(e)} />
  );
  return render;
};
