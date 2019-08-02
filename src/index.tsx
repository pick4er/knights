import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

import './utils/firebase';
import './styles/index.css';
import './styles/normalize.css';

ReactDOM.render(
  <App />, 
  document.getElementById('root') as HTMLElement
);

