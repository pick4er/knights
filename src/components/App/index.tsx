import React from 'react';
import debounce from 'lodash.debounce';

import Map from '../Map';
import List from '../List';

import { IKnight } from '../../types';
import { database } from '../../utils/firebase';
import './index.css';

let debouncedKnightHover: any;
let debouncedKnightLeave: any;

const App: React.FC = () => {
  const [knights, setKnights] = React.useState([]);
  const [hoveredKnight, setHoveredKnight] = React.useState<IKnight | null>(null);

  React.useEffect(() => {
    debouncedKnightHover = debounce(setHoveredKnight, 1000);
    debouncedKnightLeave = debounce(() => setHoveredKnight(null), 1000);
  }, []);

  React.useEffect(() => {
    const roadsRef = database
      .ref('/')
      .orderByKey()
      .limitToFirst(100);

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
        onKnightHover={(knight) => debouncedKnightHover(knight)} 
        onKnightLeave={debouncedKnightLeave}
      />
    </div>
  )
}

export default App;
