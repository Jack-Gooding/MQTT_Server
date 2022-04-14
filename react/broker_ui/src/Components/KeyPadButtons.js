import React, {useState, useEffect} from 'react';

import Buttons from './Buttons';

export default function KeyPadButtons(props) {
  const [data, setData] = useState([[null,0,0,0,0],[0,0,0,0,0]]);


  useEffect(() => {
    let ws = new WebSocket('ws://jack-gooding.com:3234/keypad');
    const subscribe = {
      event: 'bts:subscribe',
      // data: {
      //   channel: `testing123`
      // }
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

          // console.log(response);
          // console.log(index);


          if (index > 4) {
            newData[0][index-4] = pressed;
            // console.log(newData);
          } else {
            newData[1][index] = pressed;
            // console.log(newData);
          }
          // let rows = [];
          // rows.push(newData.slice(5,9));
          // rows.push(newData.slice(0,5));
          // rows[0].shift(null)
          // console.log(rows);

          setData([[...newData[0]],[...newData[1]]]);

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

  },[]);// eslint-disable-line react-hooks/exhaustive-deps

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
