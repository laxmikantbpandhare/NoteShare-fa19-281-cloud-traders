// App Imports
import config from '../config'

export const SET_TWEETS = 'SET_TWEETS'
export const FETCH_TWEETS_BEGIN = 'FETCH_TWEETS_BEGIN'
export const SET_TWEET = 'SET_TWEET'
export const FETCH_TWEET_BEGIN = 'FETCH_TWEET_BEGIN'

export function fetchTweets () {
  return dispatch => {
    dispatch({
      type: FETCH_TWEETS_BEGIN
    })

    const uuid = localStorage.getItem('uuid')

    return fetch(`${ config.url.api }api/user/tweet/${ uuid }`).then((response) => {
      if (response) {
        console.log(response)
        response.json().then((response) => {
          if (response) {
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

export function fetchTweet (tweetId) {
  return dispatch => {
    dispatch({
      type: FETCH_TWEET_BEGIN
    })

    return fetch(`${ config.url.api }api/tweet/${ tweetId }`).then((response) => {
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
  console.log(tweet)
  return dispatch => {
    return fetch(`${ config.url.api }api/tweet/${ uuid }`, {
      method: 'post',

      body: JSON.stringify(tweet),

      headers: {
        'Content-Type': 'text/plain'
      }
    })
      .then(response =>
          response.json())
  }
}
