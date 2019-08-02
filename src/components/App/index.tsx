import React from 'react';

import firebase, { database } from '../../utils/firebase';
import './index.css';

const App: React.FC = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const roadsRef = database.ref('/').orderByKey().limitToFirst(100);
    roadsRef.once('value').then(function(snapshot) {
      console.log('shapshot.val():', snapshot.val());
    });
  }, [count]);

  return (
    <div className="App">
      <header className="App-header">
        <p>Count: { count }</p>
        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>
      </header>
    </div>
  );
}

export default App;
