// Imports
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist/lib';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import jwtDecode from 'jwt-decode'

// UI Imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

// App Imports
import registerServiceWorker from './registerServiceWorker'
import { PersistGate } from "redux-persist/lib/integration/react";
import { setCurrentUser } from './actions/user'
import rootReducer from './reducers/root'
import App from './app'  
import './index.css'


const initialState = {};

const middleware = [thunk];

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
  // blacklist: ['navigation']
  // whitelist: ['auth', 'notes']
 };
 const pReducer = persistReducer(persistConfig, rootReducer);
 const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ ? 
    compose(applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) :
    compose(applyMiddleware(...middleware));
// Store
const store = createStore(
  pReducer,
  initialState,
  composeEnhancers
)
const persistor = persistStore(store)

// User Authentication
// const token = localStorage.getItem('token')
// if (token && token !== 'undefined' && token !== '') {
//   store.dispatch(setCurrentUser(jwtDecode(token)))
// }

// // User Authentication
// const uuid = localStorage.getItem('uuid')
// if (uuid && uuid !== 'undefined' && uuid !== '') {
//   store.dispatch(setCurrentUser(jwtDecode(uuid)))
// }

// Render App
window.store = store
ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <MuiThemeProvider>
        <Router>
          <App />
        </Router>
      </MuiThemeProvider>
    </PersistGate>
  </Provider>,

  document.getElementById('root')
)

// Service Worker
registerServiceWorker()
