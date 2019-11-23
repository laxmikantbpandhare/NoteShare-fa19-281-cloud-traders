// Imports
import update from 'immutability-helper'

// App Imports
import { SET_TWEETS, FETCH_TWEETS_BEGIN, SET_TWEET, FETCH_TWEET_BEGIN, SET_USER_TWEETS, FETCH_USER_TWEETS_BEGIN, SET_FOLLOW } from '../actions/tweet'

export function tweets (state = {list: [], userlist:[],error: false, loading: false, followlist:[]}, action = {}) {
  switch (action.type) {

    case FETCH_TWEETS_BEGIN:
      return update(state, {
        $merge: {
          list: [],
          error: false,
          userlist: [],
          loading: true
        }
      })

      case FETCH_USER_TWEETS_BEGIN:
      return update(state, {
        $merge: {
          error: false,
          userlist: [],
          loading: true
        }
      })

    case SET_TWEETS:
      return update(state, {
        $merge: {
          list: action.tweets,
          userlist: [],
          error: false,
          loading: false
        }
      })

      case SET_FOLLOW:
      return update(state, {
        $merge: {
          followlist: action.payload.userid,
          error: false,
          loading: false
        }
      })

      case SET_USER_TWEETS:
      return {...state,
        userlist: action.payload,
        error: false,
        loading: false

      }
      // update(state, {
      //   $merge: {
      //     userlist: action.payload,
      //     error: false,
      //     loading: false
      //   }
      // })

    default:
      return state
  }
}

export function tweet (state = {details: {}, error: false, loading: false}, action = {}) {
  switch (action.type) {

    case FETCH_TWEET_BEGIN:
      return update(state, {
        $merge: {
          details: {},
          error: false,
          loading: true
        }
      })

    case SET_TWEET:
      return update(state, {
        $merge: {
          details: action.tweet,
          error: false,
          loading: false
        }
      })

    default:
      return state
  }
}
