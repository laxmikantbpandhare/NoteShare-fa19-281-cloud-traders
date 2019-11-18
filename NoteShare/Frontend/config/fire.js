import * as firebase from 'firebase/app';
import "firebase/auth";

const config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: 'AIzaSyABz-Adp0eABp9-9NVO5AX4zocFu8ynuNY',
  authDomain: 'fir-authentication-a0372.firebaseapp.com',
  databaseURL: 'https://react-firebase-auth-6083e.firebaseio.com',
  projectId: 'fir-authentication-a0372',
  storageBucket: 'react-firebase-auth-6083e.appspot.com',
  messagingSenderId: '464346595151'
};
const fire = firebase.initializeApp(config);
export default fire;