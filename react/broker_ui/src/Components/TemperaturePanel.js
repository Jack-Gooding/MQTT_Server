import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTint,
  faThermometerQuarter,
} from "@fortawesome/free-solid-svg-icons";

export default function TemperaturePanel(props) {
  return (
    <div className="panel-card sensor-panel">
      <p className="panel-title">Climate Sensors</p>
      {props.sensors != null ? (
        <RenderSensors data={props.sensors} />
      ) : (
        <div className="loading-icon">
          <FontAwesomeIcon icon={faSpinner} />
        </div>
      )}
    </div>
  );
}

function RenderSensors(props) {
  // const render = props.data.map((sensor, index) => {
  //   console.log(sensor);
  //   <div key={`climate-sensor-${index}`} className="climate-sensor">
  //     <p>{23.1 + "°C"}</p>
  //   </div>
  // });
  console.log(props.sensors);
  const render = (
    <div className="sensor-panel-container">
      <div className="sensor-panel-sub-container">
        {props.data.map((sensor, index) => {
          return (
            <div className="sensor-sub-panel">
              <p className="sensor-title">{sensor.friendlyName}</p>
              <div className="sensor-readings">
                {sensor.temperature != null ? (
                  <p className="sensor-temperature">
                    <FontAwesomeIcon icon={faThermometerQuarter} />
                    &nbsp;
                    {Math.round(sensor.temperature*10)/10 + "°C"}
                  </p>
                ) : (
                  <></>
                )}
                {sensor.humidity != null ? (
                  <p className="sensor-humidity">
                    <FontAwesomeIcon icon={faTint} />
                    &nbsp;
                    {Math.round(sensor.humidity*10)/10 + "%"}
                  </p>
                ) : (
                  <></>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return render;
}
