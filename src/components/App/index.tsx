import React from 'react';

import Map from '../Map';
import List from '../List';

import { database } from '../../utils/firebase';
import './index.css';

const App: React.FC = () => {
  const [knights, setKnights] = React.useState([]);

  React.useEffect(() => {
    const roadsRef = database
      .ref('/')
      .orderByKey()
      .limitToFirst(100);

    roadsRef
      .once('value')
      .then(snapshot => setKnights(snapshot.val()))
      .catch(console.error);
  });

  return (
    <div className="App">
      <Map knights={knights} />
      <List knights={knights} />
    </div>
  )
}

export default App;
