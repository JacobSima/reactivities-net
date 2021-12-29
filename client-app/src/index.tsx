import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.css'
import './app/layout/styles.css';
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './app/stores/store';
import { BrowserRouter as Router} from 'react-router-dom';

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <Router>
      <App />,
    </Router>
  </StoreContext.Provider>,
 
  document.getElementById('root')
);

reportWebVitals();
