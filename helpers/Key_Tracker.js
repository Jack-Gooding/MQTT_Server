const ws2812B = require("./WS2812B.js");

//Semi-complicated

let buttonStates = {};

// This function is triggered when a button is pressed AND released.
// If pressed, starts a timer window with actions on expiry

let timers = {};

let indicatorLed = async function(direction) {
  if (direction === "Short") {
    ws2812B.shortIndicator();
  } else if (direction === "Long") {
    ws2812B.longIndicator();
  } else if (direction === "Longer") {
    ws2812B.longerIndicator();
  } else {
    ws2812B.releaseIndicator();
  }
}

function checkLength(arr, count) {
  let i;
  if (count > arr.length) {
    i = arr.length-1;

  } else {
    i = count-1;

  }
  return i;
}

async function clearTimers() {
 let buttons = Object.keys(buttonStates);
 buttons.forEach(function(button) {
   let timers = Object.keys(buttonStates[button]);
   timers.forEach(function(timer) {
     if (timer != "undefined") {
       if (typeof(buttonStates[button][timer]) == "object") {
         if (buttonStates[button][timer]._repeat != null) {
           clearInterval(buttonStates[button][timer]);
         } else {
           //No action needed, timeouts still need to expire gracefully 
           //clearTimeout(buttonStates[button][timer]);
         }
       }
     }
   })
 });
};

async function handlePresses(direction, buttonName, actions) {

  let button = buttonStates[buttonName];
  //if button doesn't exist in buttonStates, create it.
  if (button == null) {
    buttonStates[buttonName] = {
      name: buttonName,
      count: 0,
      shortPressTimeout: undefined,
      longPressTimeout: undefined,
      longerPressTimeout: undefined,
      longerPressInterval: undefined,
    };

    button = buttonStates[buttonName];
  }

  //key was released
  if (direction == false || direction == undefined || direction == "released" ) {

    //if the long press action was not taken
    if (button.longPressTimeout._destroyed == false) {

      //wait small delay for multi-presses
      button.shortPressTimeout = setTimeout(function() {
        console.log("Short Press");
        let i = checkLength(actions, button.count);
        actions[i].shortPress(button.count-1);
        button.count = 0;
      }, 300);


    } else if (button.longPressTimeout._destroyed == true  && button.longerPressTimeout._destroyed == false) {
      console.log("Long Press");
      let i = checkLength(actions, button.count);
      actions[i].longPress(button.count-1);
      button.count = 0;
    } else if (button.longerPressTimeout._destroyed == true) {
      button.count = 0;
    };

    //indicatorLed("Released");
    clearTimeout(button.longPressTimeout);
    clearTimeout(button.longerPressTimeout);
    clearInterval(button.longerPressInterval);
  //key was pressed
  } else {
    //indicatorLed("Short");

    //mqtt.client.publish('keypad/leds',JSON.stringify({leds:[{red:0,green:254,blue:0},{red:0,green:0,blue:0},{red:0,green:0,blue:0},]}));

    button.count++;
    console.log(`${buttonName} pressed ${button.count} times!`);
    clearTimeout(button.shortPressTimeout);

    button.longPressTimeout = setTimeout(function() {
      console.log("Long Press Timeout Ready")
      //indicatorLed("Long");
    }, 500);

    button.longerPressTimeout = setTimeout(function() {
      button.longerPressInterval = setInterval(function() {
        console.log("Longer Press action");
        let i = checkLength(actions, button.count);

        actions[i].longerPress(button.count-1);
        //indicatorLed("Longer");
      },400);
    }, 1000);


  }


};


/*
async function handlePresses(e,button) {


  //if button was released
  if (!e) {

    //prevent hold action
    clearTimeout(button3IntervalDelay);
    //clear hold interval
    clearInterval(button3Interval);


  //if button was pressed
  } else {

    //increment press count
    button3Count += 1;

    //reset timer window to 0
    clearTimeout(button3Timeout);
    button3Timeout = setTimeout(function() {

      //reset count on time window expiry
      button3Count = 0;
      //console.log("not sure when this is triggered");

      //do stuff based on how many presses

    },1000);

    //persistent variable as buttonCount is reset often
    let pressedCount = button3Count;
    console.log(pressedCount);

    //timer begin for hold action, cleared on release
    button3IntervalDelay = setTimeout(function() {

      //prevent non-hold action from occuring
      clearTimeout(button3Timeout);
      //reset button count to 0
      button3Count = 0;

      //optional interval action, could be replaced by any different action.
      button3Interval = setInterval(function() {

        //vary interval effect by pressed count
        if (pressedCount === 1) {
          console.log("Incrementing Lights");
        } else if (pressedCount === 2) {
          console.log("Decrementing Lights");
          changeLightBrightness("down",20);
        } else {
          console.log("err");
        }


      },200); //short interval length
    },500); //longer hold window

  }
};
*/

module.exports = {
  handlePresses,
  clearTimers,
}
