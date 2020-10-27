import React, {useState} from 'react';
//import styles from '../css/ScreeningQuestions.scss';

export default function WS2812bPanel(props) {

  let [actionsDropdown, setActionsDropdown] = useState(false);

  let handleClick = () => {
    //setDropdownShow(!dropdownShow);
  };


  let item = props.data;

    return (
      <div className="WS2812bPanel">
      </div>
    );
};

// <Badge variant="secondary">{candidate.applicationMethod}</Badge>
