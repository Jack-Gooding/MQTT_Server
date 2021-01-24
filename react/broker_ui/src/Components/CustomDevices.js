import React, {useEffect} from 'react';
// import axios from 'axios';

export default function CustomDevices(props) {


  useEffect(() => {
    fetchData();
    return () => {
        console.log("component unmounted");
    }
  }, [])

  let fetchData = async () => {
    try {

      // let res = await axios.get("https://broker.jack-gooding.com/desktop/");
      // if (Array.isArray(res.body)) {
      //
      // }

    }
    catch(e) {
      console.log(e);
    }
  };


    return (
      <div className="service-panel">
        <div className="panel-card">
          Desk Lights
        </div>
        <div className="panel-card">
          3D Printer Lights
        </div>
        <div className="panel-card">
          TODO:
          Server: - interval update plugstate
          All: 'ring/warm' is not good.
        </div>
      </div>
    );
};
