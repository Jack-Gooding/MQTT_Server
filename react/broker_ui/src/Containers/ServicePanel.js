import React from 'react';
//import styles from '../css/ScreeningQuestions.scss';

export default function ServicePanel(props) {

    return (
      <div className="service-panel-container">
        {props.children}
      </div>
    );
};

// <Badge variant="secondary">{candidate.applicationMethod}</Badge>
