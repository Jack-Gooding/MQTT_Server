import React, {useEffect} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import VolumeSlider from './P5/VolumeSlider';

export default function TemperaturePanel(props) {

  useEffect(() => {
    return () => {
        console.log("component unmounted");
    }
  }, [])

    return (
        <div className="volume-panel-card panel-card">
          <p className="panel-title">
            Temperature
          </p>
          {
            (props.value != null)
            ?
            <div className="panel-content">
              <p>
                {props.value}°C
              </p>
            </div>
            :
            <div className="loading-icon">
              <FontAwesomeIcon icon={faSpinner} />
            </div>
          }
        </div>
    );
};
