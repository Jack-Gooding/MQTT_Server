import React, {useState, useEffect} from 'react';
import axios from 'axios';

import SmartLight from './SmartLight';
//import styles from '../css/ScreeningQuestions.scss';

export default function HueLightsPanel(props) {

  let [lights, setLights] = useState([
    {
      name: "Example",
      id: 0,
      on: true,
      color: {bri: 100}
    }
  ]);

  async function fetchData() {
    try {
      console.log(`Requesting Data`);
      let res = await axios.get('https://broker.jack-gooding.com/lights');
      if (res != null && res.data.length > 0) {
        console.log(res.data);
        setLights(res.data);
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

  let updateLight = async (data) => {

    let newLights = [...lights];
    let lightIndex = newLights.findIndex((light) => light.id == data.id);
    if (data.on != null) {
      newLights[lightIndex].on = data.on;
      console.log(`Setting ${data.name} to ${data.on ? "On" : "Off"}`);
    };

    if (data.color != null) {
      if (data.color.hue != null) newLights[lightIndex].color.hue = data.color.hue;
      if (data.color.sat != null) newLights[lightIndex].color.sat = data.color.sat;
      if (data.color.bri != null) newLights[lightIndex].color.bri = data.color.bri;
      console.log(`Updating ${data.name}'s color.`);
    };

    setLights(newLights);

    try {
      let payload = [
        {
          id: data.id,
          on: data.on,
          name: data.name,
          color: data.color,
        },
      ];
      let res = await axios.put('https://broker.jack-gooding.com/lights', payload);
      console.log(res.data);
    }
    catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="HueLightsPanel">
      Hue Lights
      {renderLights(lights, updateLight)}
    </div>
  );
};

function renderLights(data, update) {
  const render = data.map((item, index) =>
    <SmartLight key={index} data={item} update={(e) => update(e)} />
  );
  return render;
};
