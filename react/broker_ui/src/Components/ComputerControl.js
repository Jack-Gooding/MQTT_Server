import React, {useState, useEffect} from 'react';
import axios from 'axios';

import VolumePanel from './VolumePanel';


export default function ComputerControl(props) {

  let [volume, setVolume] = useState(null);

  useEffect(() => {
    // fetchVolumeData();
    let ws = new WebSocket('ws://jack-gooding.com:3234/desktop/volume');
    const subscribe = {
      url: "/desktop/volume",
    };

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };

    ws.onmessage = (e) => {

      const res = JSON.parse(e.data);
      console.log("WS volume data received:");
      console.log(res);
      if (res[0] === 'desktop/volume') {

        let volume = Math.round(res[1].message*100);
        setVolume(volume);

      };
    };

    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };

  }, [])



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
      </div>
    );
};
