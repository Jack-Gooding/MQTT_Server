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
        setVolume(res.body.volume);
      }

    }
    catch(e) {
      console.log(e);
    }
  };

  let putNewVolume = async () => {
    try {

      let res = await axios.put("https://broker.jack-gooding.com/desktop/volume", volume);
      console.log(res);
    }
    catch(e) {
      console.log(e);
    }
  };

  let handleVolumeChange = (e, submit) => {
    console.log(`New Volume: ${e}`);
    if (e > 98) {
      e = 100;
    } else if (e < 2) {
      e = 0;
    }
    setVolume(e);
    if (submit) {
      //Do axios put request here;;
      putNewVolume(e);
    }
  };

    return (
      <div className="service-panel">
        <div className="volume-panel-card panel-card">
          <p className="panel-title">
            Volume
          </p>
          <VolumeSlider defaultValue={volume} update={(e) => {handleVolumeChange(e)}}/>
          <p className="panel-value">
            {volume}%
          </p>
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
