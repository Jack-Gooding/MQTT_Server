import React, {useEffect} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

export default function SmartPlug(props) {


  useEffect(() => {
      //loadEffect
    return () => {
        console.log("component unmounted");
    }
  }, []);

  let toggleLightState = () => {
    props.update({
      id: props.data.id,
      on: !props.data.on,
      name: props.data.name
    });
  };

  return (
    <div className="smart-plug-card panel-card">
      <p className="panel-title">
        {props.data.name}
      </p>
      <button onClick={toggleLightState}>
        {props.data.on ?
          <FontAwesomeIcon style={{"color":"green"}} icon={faPowerOff}/>
          :
          <FontAwesomeIcon icon={faPowerOff}/>
        }
      </button>
    </div>
  );
};
