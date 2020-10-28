import React, {useState, useEffect} from 'react';
import axios from 'axios';

import VolumePanel from './VolumePanel';


export default function ComputerControl(props) {

  let [volume, setVolume] = useState(null);

  useEffect(() => {
    fetchData();
    return () => {
        console.log("component unmounted");
    }
  }, [])

  let fetchData = async () => {
    try {
      let res = await axios.get("https://broker.jack-gooding.com/desktop/volume");
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
      </div>
    );
};
