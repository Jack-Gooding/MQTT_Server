import React, {useState, useEffect} from 'react';
import P5 from './P5';
//import styles from '../css/ScreeningQuestions.scss';

export default function HueLightsPanel(props) {

  let [loaded, setLoaded] = useState(null);

  async function fetchData() {
    try {
      setTimeout(() => {
        setLoaded(true);
      },200);
    }
    catch(e) {
      console.log(e);
    }
  };

  useEffect(() => {
    try {
      fetchData();
    }
    catch(e) {
      console.error("Error during fetch!");
      console.error(e);
    }
    return () => {
        console.log("component unmounted");
    }
  }, [])


  return (
    <div className="panel-card">
      {
        loaded
        ?
        <P5 value={loaded} />
        :
        <></>
      }
    </div>
  );
};
