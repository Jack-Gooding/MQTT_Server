import React, {useState} from 'react';
//import styles from '../css/ScreeningQuestions.scss';

export default function BlindsPanel(props) {

  let [blindsPos, setBlindsPos] = useState(false);

  let handleClick = () => {
    //setDropdownShow(!dropdownShow);
    setBlindsPos(blindsPos++);
  };

    return (
      <div className="blinds-panel">
        Blinds
        <button onClick={handleClick}>-1</button>
        <button onClick={handleClick}>+1</button>
        <button onClick={handleClick}>-5</button>
        <button onClick={handleClick}>+5</button>
        <button onClick={handleClick}>-20</button>
        <button onClick={handleClick}>+20</button>        
      </div>
    );
};

// <Badge variant="secondary">{candidate.applicationMethod}</Badge>
