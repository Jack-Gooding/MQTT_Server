import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export default function ConnectedDevices(props) {

  let [devices, setDevices] = useState([
    "MQTT Test Device"
  ]);

  useEffect(() => {
    fetchData();
    return () => {
        console.log("component unmounted");
    }
  }, [])

  let fetchData = async () => {
    try {

      let res = await axios.get("https://broker.jack-gooding.com/devices");
      //This should be changed to an object for better info
      if (Array.isArray(res.data)) {
        setDevices(res.data);
      }

    }
    catch(e) {
      console.log(e);
    }
  };

    return (
      <div className="service-panel">
        {renderDevices(devices)}
      </div>
    );
};

function renderDevices(data, update) {
  const render = data.map((item, index) =>
    <div key={index} className="mqtt-device-panel">
      <p>
        {item}
      </p>
      <FontAwesomeIcon icon={faInfoCircle}/>
    </div>
  );
  return render;
};
