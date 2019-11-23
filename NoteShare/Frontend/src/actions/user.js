// Imports
//  dimport jwtDecode from 'jwt-decode'

// App Imports
import config from '../config'


//import fire from '../config/fire';
import firebase from '../config/fire';
//import * as firebase from 'firebase/app';
// import withFirebaseAuth from 'react-with-firebase-auth'

import { beginApiCall, apiCallError } from '../actions/apistatus'
import {SET_TWEETS,SET_TWEET,SET_USER_TWEETS} from './tweet'

export const USER_CURRENT_SET = 'USER_CURRENT_SET'

// API CALLS
export const BEGIN_API_CALL = "BEGIN_API_CALL";
export const API_CALL_ERROR = "API_CALL_ERROR";

// SIGN UP
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_ERROR = "SIGNUP_ERROR";

// SIGN IN
export const SIGNIN_SUCCESS = "SIGNIN_SUCCESS";
export const SIGNIN_ERROR = "SIGNIN_ERROR";
export const EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED";

// SIGN OUT
export const SIGNOUT_SUCCESS = "SIGNOUT_SUCCESS";
export const SIGNOUT_ERROR = "SIGNOUT_ERROR";

// RESET PASSWORD
export const RESET_SUCCESS = "RESET_SUCCESS";
export const RESET_ERROR = "RESET_ERROR";

// RESET PASSWORD
export const GET_ALL_USERS = "GET_ALL_USERS";



// Signing in with Firebase
// export const signin = (email, password, callback) => async dispatch => {
//   try {
//     dispatch(beginApiCall());
//     firebase
//       .auth()
//       .signInWithEmailAndPassword(email, password)
//       .then(data => {
//         if (data.user.emailVerified) {
//           console.log("IF", data.user.emailVerified);
//           dispatch({ type: SIGNIN_SUCCESS });
//           callback();
//         } else {
//           console.log("ELSE", data.user.emailVerified);
//           dispatch({
//             type: EMAIL_NOT_VERIFIED,
//             payload: "You haven't verified your e-mail address."
//           });
//         }
//       })
//       .catch(() => {
//         dispatch(apiCallError());
//         dispatch({
//           type: SIGNIN_ERROR,
//           payload: "Invalid login credentials"
//         });
//       });
//   } catch (err) {
//     dispatch(apiCallError());
//     dispatch({ type: SIGNIN_ERROR, payload: "Invalid login credentials" });
//   }
// };



var uuid = "";

export function postLogin (uuid,callback) {
  
    console.log("In post login")
    return fetch(`${ config.url.api }api/user/${ uuid }`, {
      method: 'get',

     //body: JSON.stringify(uuid),

      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response) {
          console.log(response)
          //localStorage.setItem('uuid', response.uid)
          //dispatch(setCurrentUser(response))

          return response.json()
        }
      })
      .then(data=> {
        callback(data);
      })
  
}

//export function postRegister (credentials) {

  export const postRegister = (credentials,callback1) => {
  console.log("post");
  console.log(credentials);
  //signup(credentials.email, credentials.password)

  

    credentials.userid = uuid; 
    console.log('credentials');
    console.log(credentials);
   // return fetch(`${ config.url.api }user/register`, {
    return fetch(`${ config.url.api }api/user`, {
      method: 'post',

      body: JSON.stringify(credentials),

      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        
        console.log("register response ",response);
        response.json()
        .then(data=> {
          callback1(data);
        })
        
        
      })
  
}

export function setCurrentUser (user) {
  return {
    type: USER_CURRENT_SET,
    user
  }
}

export function userLogout (callback) {
  return dispatch => {
    localStorage.removeItem('uuid')
    //localStorage.removeItem('uuid')

    dispatch(setCurrentUser({}))
    dispatch(
      {
        type: SET_USER_TWEETS,
        tweets: []
      } 
    )
    dispatch(
      {
        type: "GET_ALL_USERS",
        users: []
      } 
    )
    // dispatch(
    //   {
    //     type: "SET_FOLLOW",
    //     followlist: []
    //   } 
    // )
    dispatch(
      {
        type: "SET_USER_TWEETS",
        userlist: []
      } 
    )
    dispatch(
      {
        type: SET_TWEETS,
        tweets: []
      } 
    )
    dispatch(
      {
        type: SET_TWEET,
        tweet: {}
      } 
    )
    dispatch(
      {
        type: "SIGNUP_SUCCESS",
        payload: {}
      } 
    )
    dispatch(
      {
        type: "SIGNIN_SUCCESS",
        payload: {}
      } 
    )

    //return {success: true}
   
  }
}




/****       SignUp     ***/

// Signing up with Firebase

  export const signup = (credentials) =>  dispatch => {
  try {
    
    //dispatch(beginApiCall());

    console.log("coming");
    console.log(credentials.email);
    console.log(credentials.password);

    
    firebase
      .auth()
      .createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(dataBeforeEmail => {
        firebase.auth().onAuthStateChanged(function(user) {
          user.sendEmailVerification();
        });
      })
      .then(dataAfterEmail => {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // Sign up successful
            console.log("success  login");

              uuid = user.uid;
              credentials.userid = uuid;
              postRegister(credentials, data=> {
                var payload = {success: "true"};
                dispatch({
                    type: "SIGNUP_SUCCESS",
                    payload: payload
                  });
              })

          } else {
            // Signup failed
            dispatch({
              type: SIGNUP_ERROR,
              payload:
                "Something went wrong, we couldn't create your account. Please try again."
            });
            console.log("Unsuccess1");
          }
        });
      })
      .catch(err => {
        dispatch(apiCallError());
        dispatch({
          type: SIGNUP_ERROR,
          payload:
            "Something went wrong, we couldn't create your account. Please try again."
        });
        console.log(err);
        console.log("Unsuccess2");
      });
  } catch (err) {
    dispatch(apiCallError());
    dispatch({
      type: SIGNUP_ERROR,
      payload:
        "Something went wrong, we couldn't create your account. Please try again."
    });
    console.log("Unsuccess3");
  }
};



// Signing in with Firebase
export const signin = (input) => dispatch => {
  try {
    dispatch(beginApiCall());

    console.log(input);

    firebase
      .auth()
      .signInWithEmailAndPassword(input.email, input.password)
      .then(data => {

        console.log(data);

          console.log("IF", data.user.emailVerified);

          
          console.log(data)
          localStorage.setItem('uuid', data.user.uid)
          postLogin(data.user.uid,response => {
            var payload = {successLogin: "true"};
            console.log(response)
            dispatch({
            type: "SIGNIN_SUCCESS",
            payload: payload
            });
          dispatch({
            type: "USER_CURRENT_SET",
            user: response
          })

          })

          // dispatch({
          //   type: "SIGNIN_SUCCESS",
          //   payload: payload
          // });

      })
      .catch(() => {
        dispatch(apiCallError());
        dispatch({
          type: SIGNIN_ERROR,
          payload: "Invalid login credentials"
        });
      });
  } catch (err) {
    dispatch(apiCallError());
    dispatch({ type: SIGNIN_ERROR, payload: "Invalid login credentials" });
  }
};

export function updateProfile (input) {
  const uuid = localStorage.getItem('uuid')
  return dispatch => {
  console.log("In update profile")
  return fetch(`${ config.url.api }api/user/profile/${ uuid }`, {
    method: 'put',

   body: JSON.stringify(input),

    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response) {
        console.log(response)
        //localStorage.setItem('uuid', response.uid)
        dispatch(setCurrentUser(input))


        return response.json()
      }
    })
    // .then(data=> {
    //   callback(data);
    // })
  }

}

export function getAllUsers () {
  const uuid = localStorage.getItem('uuid')
  return dispatch => {
  console.log("Getting all users")
  
  return fetch(`${ config.url.api }api/users/${ uuid }`).then((response) => {
    if (response) {
      console.log(response)
      response.json().then((response) => {
        //response!=[null] && response!=[] && response[0]!=null && response.length>0
        if (response!=[null] && response!=[] && response[0]!=null && response.length>0) {
          console.log(response)
          dispatch({
            type: GET_ALL_USERS,
            payload: response
          })
        }
      })
    } else {
      console.log('Looks like the response wasn\'t perfect, got status', response.status)
    }
  }, function (e) {
    console.log('Fetch failed!', e)
  })
  }

}