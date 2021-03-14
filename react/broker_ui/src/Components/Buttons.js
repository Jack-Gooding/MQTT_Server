import React from 'react';


export default function Buttons(props) {


  return (
    <div className="keypad-buttons">
      {renderDevices(props.data)}
    </div>
  );
};

function renderDevices(data) {

  const render = data.map((item, index) => {

    return <div className={"keypad-button" + (item === 1 ? ' active' : '')}> </div>;

  });
  // const render = <div>{data}</div>;
  return render;
};
