import React, {useEffect} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import VolumeSlider from './P5/VolumeSlider';

export default function VolumePanel(props) {

  useEffect(() => {
    return () => {
        console.log("component unmounted");
    }
  }, [])

    return (
        <div className="volume-panel-card panel-card">
          <p className="panel-title">
            Volume
          </p>
          {
            (props.value != null)
            ?
            <VolumeSlider value={props.value} update={(e) => props.update(e)} />
            :
            <div className="loading-icon">
              <FontAwesomeIcon icon={faSpinner} />
            </div>
          }
          <p className="panel-value">
            {props.value != null ? props.value+"%" : "loading..."}
          </p>
        </div>
    );
};
