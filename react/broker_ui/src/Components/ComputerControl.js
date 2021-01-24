import React, {useState, useEffect} from 'react';
import axios from 'axios';

import VolumePanel from './VolumePanel';
import TemperaturePanel from './TemperaturePanel';


export default function ComputerControl(props) {

  let [volume, setVolume] = useState(null);
  let [temperature, setTemperature] = useState(null);

  useEffect(() => {
    fetchVolumeData();
    fetchTemperatureData();
    return () => {
        console.log("component unmounted");
    }
  }, [])

  let fetchTemperatureData = async () => {
    try {
      console.log(`Requesting Temperature Data`);
      let res = await axios.get("https://broker.jack-gooding.com/temperature");
      console.log(res);
      if (res.data.temperature != null) {
        setTemperature(res.data.temperature);
      }
    }
    catch(e) {
      console.log(e);
    }
  };

  let fetchVolumeData = async () => {
    try {
      console.log(`Requesting Volume Data`);
      let res = await axios.get("https://broker.jack-gooding.com/desktop/volume");
      console.log(res);
      if (res.data.volume != null) {
        let newVol = Math.round(res.data.volume*100);
        setVolume(newVol);
      }
    }
    catch(e) {
      console.log(e);
    }
  };

  let putNewVolume = async (volume) => {
    try {
      console.log(volume);
      let res = await axios.put("https://broker.jack-gooding.com/desktop/volume", {volume: volume});
      console.log(res);
    }
    catch(e) {
      console.log(e);
    }
  };

  let handleVolumeChange = (e) => {
    console.log(`New Volume: ${e}`);
    if (e > 98) {
      e = 100;
    } else if (e < 2) {
      e = 0;
    }
    setVolume(e);
    putNewVolume(e);
  };

    return (
      <div className="service-panel">
        <VolumePanel value={volume} update={(e) => handleVolumeChange(e)}/>
        <TemperaturePanel value={temperature} />
      </div>
    );
};
