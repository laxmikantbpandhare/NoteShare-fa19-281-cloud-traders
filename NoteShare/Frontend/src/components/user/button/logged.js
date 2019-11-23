// Imports
import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// UI Imports
//import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'

// App Imports
import { userLogout } from '../../../actions/user'

class UserButtonLogged extends Component {
  constructor () {
    super()

    this.state = {
      notification: false,
      loggedOut: false
    }
  }

  logout (event) {
    event.preventDefault()

    this.props.userLogout()
  }

  render () {
    return (
      <>
        <Link to="/tweet/add"><FlatButton label="Create Note"/></Link>
        <FlatButton label="Sign out" onClick={this.logout.bind(this)} />
        {this.props.successful ? <Redirect to="/"/> : ''}  
      </>
      
    )
  }
}

UserButtonLogged.propTypes = {
  userLogout: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
  return{
    successful: state.user.signin_success
  }
}

export default connect(mapStateToProps, {userLogout})(UserButtonLogged)
