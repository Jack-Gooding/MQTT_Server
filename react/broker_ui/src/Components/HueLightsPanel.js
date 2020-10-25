import React, {useState, useEffect} from 'react';
import axios from 'axios';

import SmartLight from './SmartLight';
//import styles from '../css/ScreeningQuestions.scss';

export default function HueLightsPanel(props) {

  let [lights, setLights] = useState([
    {
      name: "Example",
      on: true,
    }
  ]);

  useEffect(() => {
    try {
      async function fetchData() {
        try {
          let res = await axios.get('https://broker.jack-gooding.com/lights');
          if (res) {
            console.log(res.data);
            setLights(res.data);
          };
        }
        catch(e) {
          console.log(e);
        }
      };
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
    newLights[0].on = data.on;
    setLights(newLights);
    try {
      let res = await axios.put('https://broker.jack-gooding.com/lights', [{
        id: 2,
        on: Math.round(Math.random()),
      },
      {
        id: 1,
        on: Math.round(Math.random()),
      },
      {
        id: 3,
        on: Math.round(Math.random()),
      },
      {
        id: 0,
        on: Math.round(Math.random()),
      }]);
      console.log(res.data);
    }
    catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="HueLightsPanel">
      Hue Lights
      <SmartLight data={lights[0]} update={updateLight} />
    </div>
  );
};
