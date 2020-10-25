// import logo from './logo.svg';
import './App.scss';
import ServicePanel from './Containers/ServicePanel';
import WS2812bPanel from './Components/WS2812bPanel';
import HueLightsPanel from './Components/HueLightsPanel';
import BlindsPanel from './Components/BlindsPanel';

// import ServicePanel from './Containers/ServicePanel';
// import ServicePanel from './Containers/ServicePanel';
// import ServicePanel from './Containers/ServicePanel';
// import ServicePanel from './Containers/ServicePanel';



export default function App(props) {

  return (
    <div className="App">
      <ServicePanel title="WS2812b Ring">
        <WS2812bPanel />
      </ServicePanel>
      <ServicePanel title="Smart Lights">
        <HueLightsPanel />
      </ServicePanel>
      <ServicePanel title="Blinds">
        <BlindsPanel />
      </ServicePanel>
    </div>
  );
};
