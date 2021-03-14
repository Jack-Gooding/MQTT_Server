import React, {useState, useEffect} from 'react';
//import styles from '../css/ScreeningQuestions.scss';

import Buttons from './Buttons';

export default function KeyPadButtons(props) {
  const [data, setData] = useState([0,0,0,0,0,0,0,0,0]);


  useEffect(() => {
    let ws = new WebSocket('ws://localhost:3233/keypad');
    const subscribe = {
      event: 'bts:subscribe',
      data: {
        channel: `testing123`
      }
    };

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };

    ws.onmessage = (e) => {

      const response = JSON.parse(e.data);

      if (response[0] === 'keypad') {

        let newData = data;
        let topic = response[1].topic.split('/');


        if (topic[0] === 'keypad' && topic[1] === 'button') {

          let index = response[1].message.split("")[response[1].message.length-1] - 1;
          let pressed = (topic[2] === "pressed") ? 1 : 0;

          newData[index] = pressed;

          setData([...newData]);
          // setDevices(newData);
        };
      }
    };

    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };

  },[]);

  //
  // let sendWebsocketMessage = () => {
  //   // ws.send("button pressed, ty");
  // };
  //


  // <button onClick={sendWebsocketMessage}>Increment</button>
  return (
    <div className="order-container">
      <Buttons data={data}/>
    </div>
  );
};
