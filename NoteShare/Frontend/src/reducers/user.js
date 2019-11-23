// Imports
import isEmpty from 'lodash/isEmpty'

// App Imports
import { USER_CURRENT_SET } from '../actions/user'

const initialState = {
  isAuthenticated: false,
  user: {},
  signin_success: false,
  signup_success: false,
  users:[]
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "USER_CURRENT_SET":
      return {
        ...state,
        isAuthenticated: !isEmpty(action.user),
        user: action.user
      }
      case "SIGNUP_SUCCESS":
      return {
       ...state,
       signup_success: action.payload.success
      }
      case "SIGNIN_SUCCESS":
      return {
       ...state,
       signin_success: action.payload.successLogin
      }
      case "GET_ALL_USERS":
      return {
       ...state,
       users: action.payload
      }
    default:
      return state
  }
}
