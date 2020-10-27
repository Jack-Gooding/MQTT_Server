import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export default function ConnectedDevices(props) {

  let [devices, setDevices] = useState([
    {name: "MQTT Broker"}
  ]);

  useEffect(() => {
    fetchData();
    return () => {
        console.log("component unmounted");
    }
  }, [])

  let fetchData = async () => {
    try {

      let res = await axios.get("https://broker.jack-gooding.com/inseq/fingerprint");
      if (Array.isArray(res.body)) {
        setDevices(res.body);
      }

    }
    catch(e) {
      console.log(e);
    }
  };

  let handleClick = () => {
  };

    return (
      <div className="service-panel">
        {renderDevices(devices)}
      </div>
    );
};

function renderDevices(data, update) {
  const render = data.map((item, index) =>
    <div className="mqtt-device-panel">
      <p>
        {item.name}
      </p>
      <FontAwesomeIcon icon={faInfoCircle}/>
    </div>
  );
  return render;
};
