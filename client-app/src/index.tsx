import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.css'
import './app/layout/styles.css';
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './app/stores/store';

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />,
  </StoreContext.Provider>,
 
  document.getElementById('root')
);

reportWebVitals();
