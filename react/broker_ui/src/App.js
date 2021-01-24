// import logo from './logo.svg';
import './App.scss';
import ServicePanel from './Containers/ServicePanel';
import ConnectedDevices from './Components/ConnectedDevices';
import P5Panel from './Components/P5Panel';
import ComputerControl from './Components/ComputerControl';
import CustomDevices from './Components/CustomDevices';
import WS2812bRingPanel from './Components/WS2812bRingPanel';
import HueLightsPanel from './Components/HueLightsPanel';
import SmartPlugsPanel from './Components/SmartPlugsPanel';
import BlindsPanel from './Components/BlindsPanel';

import './fontawesome.js';

// import ServicePanel from './Containers/ServicePanel';
// import ServicePanel from './Containers/ServicePanel';
// import ServicePanel from './Containers/ServicePanel';
// import ServicePanel from './Containers/ServicePanel';



export default function App(props) {

  return (
    <div className="App">
      <ServicePanel title="Connected Components">
        <ConnectedDevices/>
      </ServicePanel>
      <ServicePanel title="WS2812b Led Control">
      <WS2812bRingPanel />
      </ServicePanel>
      <ServicePanel title="Smart Lights">
        <HueLightsPanel />
      </ServicePanel>
      <ServicePanel title="Smart Plugs">
        <SmartPlugsPanel />
      </ServicePanel>
      <ServicePanel title="Computer Control">
        <ComputerControl/>
      </ServicePanel>
      <ServicePanel title="Custom Devices">
        <CustomDevices/>
      </ServicePanel>
      <ServicePanel title="Blinds">
        <BlindsPanel />
      </ServicePanel>
      <ServicePanel title="P5.js Sketch">
      <P5Panel/>
      </ServicePanel>
    </div>
  );
};
