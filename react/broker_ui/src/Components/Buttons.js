import React from "react";

export default function Buttons(props) {
  return <div className="keypad-buttons">{renderButtons(props.data)}</div>;
}

function renderButtons(data) {
  const render = (
    <>
      <ul>
        {data[0].map((item, index) => {
          return (
            <li key={index} keyid={index} className={"keypad-button" + (item === 1 ? " active" : "") + (item == null ? " inactive" : "")}>
              {" "}
            </li>
          );
        })}
      </ul>
    <ul>
      {data[1].map((item, index) => {
        return (
          <li key={index} keyid={index} className={"keypad-button" + (item === 1 ? " active" : "")}>
            {" "}
          </li>
        );
      })}
    </ul>
  </>
  );
  // const render = <div>{data}</div>;
  return render;
}
