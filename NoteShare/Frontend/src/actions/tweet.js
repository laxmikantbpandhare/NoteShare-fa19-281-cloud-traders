// App Imports
import config from '../config'
var AWS = require('aws-sdk');


export const SET_TWEETS = 'SET_TWEETS'
export const SET_USER_TWEETS = 'SET_USER_TWEETS'
export const FETCH_TWEETS_BEGIN = 'FETCH_TWEETS_BEGIN'
export const FETCH_USER_TWEETS_BEGIN = 'FETCH_USER_TWEETS_BEGIN'
export const SET_TWEET = 'SET_TWEET'
export const FETCH_TWEET_BEGIN = 'FETCH_TWEET_BEGIN'
export const SET_FOLLOW = 'SET_FOLLOW'


AWS.config.update(
  {
    accessKeyId: "your",
    secretAccessKey: "your",
  }
);
var s3 = new AWS.S3();

export function fetchTweets () {
  return dispatch => {
    dispatch({
      type: FETCH_TWEETS_BEGIN
    })

    const uuid = localStorage.getItem('uuid')

    return fetch(`${ config.url.api }api/note/user/${ uuid }`).then((response) => {
      if (response) {
        console.log(response)
        response.json().then((response) => {
          //response!=[null] && response!=[] && response[0]!=null && response.length>0
          if (response!=[null] && response!=[] && response[0]!=null && response.length>0) {
            console.log(response)
            dispatch({
              type: SET_TWEETS,
              tweets: response
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

// export function fetchTweets () {
//   return dispatch => {
//     dispatch({
//       type: FETCH_TWEETS_BEGIN
//     })

//     s3.getObject(
//       { Bucket: "cmpe281-noteshare", Key: "all.json" },
//       function (error, data) {
//         if (error != null) {
//           console.log("Failed to retrieve an object: " + error);
//         } else {
//             let responseData = data.Body.toString();
//             let parsedResponseData = JSON.parse(responseData);
//             console.log("in S3")
//             var resultSet = [];
//             Object.keys(parsedResponseData).forEach(function (item) {
//                 console.log(item); // key
//                 let currValue = parsedResponseData[item]; // value
    
//                 const uuid = localStorage.getItem("uuid")
//                 if(uuid === currValue.userid){
//                     let resObj = {
//                         time:currValue.time,
//                         topic:currValue.topic,
//                         data:currValue.data
//                     }
//                     resultSet.push(resObj);
//                 }
    
//             });
//             console.log(resultSet);
//             if (resultSet!=[null] && resultSet!=[] && resultSet[0]!=null && resultSet.length>0) {
//               console.log(resultSet)
//               dispatch({
//                 type: SET_TWEETS,
//                 payload: resultSet
//               })
//             }
            
//         }
    
//       }
//     );
//   }
// }


export function fetchTweetsUsers (id) {
  return dispatch => {
    dispatch({
      type: FETCH_USER_TWEETS_BEGIN
    })

    return fetch(`${ config.url.api }api/note/user/${ id }`).then((response) => {
      if (response) {
        console.log(response)
        response.json().then((response) => {
          //response!=[null] && response!=[] && response[0]!=null && response.length>0
          if (response!=[null] && response!=[] && response[0]!=null && response.length>0) {
            console.log(response)
            dispatch({
              type: SET_USER_TWEETS,
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

// export function fetchTweetsUsers (id) {
//   return dispatch => {
//     dispatch({
//       type: FETCH_USER_TWEETS_BEGIN
//     })

//     s3.getObject(
//       { Bucket: "noteshare-cmpe281", Key: "all.json" },
//       function (error, data) {
//         if (error != null) {
//           console.log("Failed to retrieve an object: " + error);
//         } else {
//             let responseData = data.Body.toString();
//             let parsedResponseData = JSON.parse(responseData);
//             var resultSet = [];
//             Object.keys(parsedResponseData).forEach(function (item) {
//                 console.log(item); // key
//                 let currValue = parsedResponseData[item]; // value
    
//                 //const uuid = localStorage.getitem("uuid")
//                 if(id === currValue.userid){
//                     let resObj = {
//                         time:currValue.time,
//                         topic:currValue.topic,
//                         data:currValue.data
//                     }
//                     resultSet.push(resObj);
//                 }
    
//             });
//             console.log(resultSet);
//             if (resultSet!=[null] && resultSet!=[] && resultSet[0]!=null && resultSet.length>0) {
//               console.log(resultSet)
//               dispatch({
//                 type: SET_USER_TWEETS,
//                 payload: resultSet
//               })
//             }
            
//         }
    
//       }
//     );
//   }
// }

export function fetchTweet (tweetId) {
  return dispatch => {
    dispatch({
      type: FETCH_TWEET_BEGIN
    })
    const uuid = localStorage.getItem('uuid')

    return fetch(`${ config.url.api }api/note/get/${ uuid }`).then((response) => {
      if (response) {
        console.log(response)
        response.json().then((response) => {
          if (response) {
            console.log(response)
            dispatch({
              type: SET_TWEET,
              tweet: response
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

export function postTweet (tweet) {
  const uuid = localStorage.getItem('uuid')
  tweet.userid = uuid
  console.log(tweet)
  return dispatch => {
    //return fetch(`${ config.url.api }api/tweet/${ uuid }`, {
    return fetch(`${ config.url.api }api/note/cmd/`, {
      method: 'post',

      body: JSON.stringify(tweet),

      headers: {
        'Content-Type': 'text/plain'
      }
    })
      .then(response =>
        {
          //response.json()
         // dispatch()
          console.log(response)
        })
  }
}

export function follow (id) {
  return dispatch => {
    // dispatch({
    //   type: FETCH_USER_TWEETS_BEGIN
    // })

    const uuid = localStorage.getItem('uuid')

    return fetch(`${ config.url.api }api/follow/user/${ uuid }/${id}`, {
      method: 'post',

      //body: JSON.stringify(tweet),

      headers: {
        'Content-Type': 'text/plain'
      }
    }).then((response) => {
      if (response) {
        console.log(response)
        response.json().then((response) => {
          //response!=[null] && response!=[] && response[0]!=null && response.length>0
          if (response) {
            console.log(response)
            dispatch({
              type: SET_FOLLOW,
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

export function unfollow (id) {
  return dispatch => {
    // dispatch({
    //   type: FETCH_USER_TWEETS_BEGIN
    // })

    const uuid = localStorage.getItem('uuid')

    return fetch(`${ config.url.api }api/follow/unfollow/${ uuid }/${id}`, {
      method: 'post',

      //body: JSON.stringify(tweet),

      headers: {
        'Content-Type': 'text/plain'
      }
    }).then((response) => {
      if (response) {
        console.log(response)
        response.json().then((response) => {
          //response!=[null] && response!=[] && response[0]!=null && response.length>0
          if (response) {
            console.log(response)
            dispatch({
              type: SET_FOLLOW,
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
