import React, {useState} from 'react';


export default function Slider(props) {
  let [value, updateValue] = useState(props.defaultValue || 0);

  let handleOnChange = (e) => {
    updateValue({ value: e.target.value });
    props.handleChange(e);
  };

  return (
    <>

      <input
        style={{
          background: `linear-gradient(to right, hsl(0,100,50), hsl(360,100,50))`,
        }}
        type="range"
        property={props.item}
        min={props.min}
        max={props.max}
        defaultValue={value}
        className="slider"
        onChange={(e) => handleOnChange(e)}
        onMouseUp={(e) => props.handleMouseUp(e)}
        disabled={props.disabled && props.disabled !== null}
      />

    </>
  )
}
