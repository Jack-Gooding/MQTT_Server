import React, {useState, useEffect} from 'react';
import axios from 'axios';

import SmartPlug from './SmartPlug';
//import styles from '../css/ScreeningQuestions.scss';

export default function HueLightsPanel(props) {

  let [plugs, setPlugs] = useState([
    {
      name: "Example",
      id: 0,
      on: true,
    },
    {
      name: "Example",
      id: 1,
      on: true,
    }
  ]);

  async function fetchData() {
    try {
      console.log(`Requesting Plug Data`);
      let res = await axios.get('https://broker.jack-gooding.com/plugs');
      if (res != null && res.data.length > 0) {
        setPlugs(res.data);
      };
    }
    catch(e) {
      console.log(e);
    }
  };

  useEffect(() => {
    try {
      fetchData();
    }
    catch(e) {
      console.error("Error during fetch!");
      console.error(e);
    }
    return () => {
        console.log("component unmounted");
    }
  }, [])

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
      console.log(res.data);
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
  const render = data.map((item, index) =>
    <SmartPlug key={index} data={item} update={(e) => update(e)} />
  );
  return render;
};
