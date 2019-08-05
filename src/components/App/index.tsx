import React from 'react';
import debounce from 'lodash.debounce';

import Map from '../Map';
import List from '../List';

import { IKnight } from '../../types';
import { database } from '../../utils/firebase';
import './index.css';

interface IAppState {
  knights: any[];
  setKnights: any;
  hoveredKnight: IKnight | null;
  setHoveredKnight: any;
  isMobile: boolean;
  setIsMobile: any;
}

interface IKnightHandler {
  (knight: any): void;
}

let debouncedKnightHover: any;
let debouncedKnightsLeave: any;

function onKnightHover(setHoveredKnight: any): IKnightHandler {
  return function hoverHandler(knight) {
    setHoveredKnight(knight);
  }
}

function onKnightsLeave(setHoveredKnight: any): IKnightHandler {
  return function leaveHandler() {
    debouncedKnightHover.cancel();
    setHoveredKnight(null);
  }
}

function handleIsMobile(state: IAppState) {
  return function isMobileHandler() {
    const { isMobile, setIsMobile } = state;
    if (typeof window === 'undefined') return;
    if (window.innerWidth <= 600 && !isMobile) {
      setIsMobile(true);
    } else if (window.innerWidth > 600 && isMobile) {
      setIsMobile(false);
    }
  }
}

const App: React.FC = () => {
  const [knights, setKnights] = React.useState([]);
  const [hoveredKnight, setHoveredKnight] = React.useState<IKnight | null>(null);
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  const state = {
    knights,
    setKnights,
    hoveredKnight,
    setHoveredKnight,
    isMobile,
    setIsMobile,
  }

  React.useEffect(() => {
    debouncedKnightsLeave = debounce(
      onKnightsLeave(setHoveredKnight), 300,
    );
    debouncedKnightHover = debounce(
      onKnightHover(setHoveredKnight), 500,
    );
  }, [setHoveredKnight]);

  React.useEffect(() => {
    if (window.innerWidth <= 600) setIsMobile(true); 
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const debouncedMobileHandler = debounce(handleIsMobile(state), 1000);
    window.addEventListener('resize', debouncedMobileHandler);

    return () => window.removeEventListener('resize', debouncedMobileHandler);
  }, [state]);

  React.useEffect(() => {
    const roadsRef = database
      .ref('/')
      .orderByKey()
      .limitToFirst(200);

    roadsRef
      .once('value')
      .then(snapshot => setKnights(snapshot.val()))
      .catch(console.error);
  }, []);

  return (
    <div className="App">
      <Map 
        knights={knights} 
        hoveredKnight={hoveredKnight}
      />
      <List 
        knights={knights} 
        onKnightHover={debouncedKnightHover} 
        onKnightsLeave={debouncedKnightsLeave}
        isMobile={isMobile}
      />
    </div>
  )
}

export default App;
