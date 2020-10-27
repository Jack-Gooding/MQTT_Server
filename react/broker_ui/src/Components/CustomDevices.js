import React, {useState, useEffect} from 'react';
import axios from 'axios';
import VolumeSlider from './P5/VolumeSlider';

export default function ComputerControl(props) {

  let [volume, setVolume] = useState(Math.round(Math.random()*100));

  useEffect(() => {
    fetchData();
    return () => {
        console.log("component unmounted");
    }
  }, [])

  let fetchData = async () => {
    try {

      let res = await axios.get("https://broker.jack-gooding.com/desktop/");
      if (Array.isArray(res.body)) {

      }

    }
    catch(e) {
      console.log(e);
    }
  };


    return (
      <div className="service-panel">
        <div className="panel-card">
          Desk Lights
        </div>
        <div className="panel-card">
          3D Printer Lights
        </div>
      </div>
    );
};

function renderDevices(data, update) {
  const render = data.map((item, index) =>
    <div className="mqtt-device-panel">

    </div>
  );
  return render;
};
