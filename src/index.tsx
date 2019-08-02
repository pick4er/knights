import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

import './utils/firebase';
import './index.css';

ReactDOM.render(
  <App />, 
  document.getElementById('root') as HTMLElement
);

