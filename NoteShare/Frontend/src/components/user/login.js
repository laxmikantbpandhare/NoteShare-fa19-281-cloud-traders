// Imports
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
// import PropTypes from 'prop-types'

// UI Imports
import Snackbar from 'material-ui/Snackbar'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import { blue500, red500 } from 'material-ui/styles/colors'
import TextField from 'material-ui/TextField'
import { Card, CardText } from 'material-ui/Card'

// App Imports
import { signin } from '../../actions/user'

class UserLogin extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      error: '',
      isLoading: false,
      isLoggingIn: false,
      notification: false,
      logged: false
    }
  }

  onSubmit (event) {
    event.preventDefault()

    console.log('E - submit #form-tweet')

    let input = {}
    input.email = this.state.email
    input.password = this.state.password

    if (input.email !== '' && input.password !== '') {
      this.setState({isLoggingIn: true, isLoading: true})

      this.props.signin(input);

    }
  }

  onChange (event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render () {

   // console.log("this.props==)))",this.props);


    return (
      <section>
        <h2>Login</h2>

        <br/>

        {this.state.error ? <Card><CardText color={red500}>{this.state.error}</CardText></Card> : ''}

        {this.state.message ? <Card><CardText color={blue500}>{this.state.message}</CardText></Card> : ''}

        <form id="form-tweet" onSubmit={this.onSubmit.bind(this)}>
          <TextField
            name="email"
            value={this.state.email}
            onChange={this.onChange.bind(this)}
            floatingLabelText="Email id"
            fullWidth={true}
          />

          <TextField
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.onChange.bind(this)}
            floatingLabelText="Password"
            fullWidth={true}
          />

          <br/>
          <br/>

          <RaisedButton label="Submit" type="submit" backgroundColor={blue500} />

          <Link to="/user/register"><FlatButton label="Register"/></Link>
        </form>

        <Snackbar
          open={this.state.isLoggingIn}
          message="Logging in..."
          autoHideDuration={1000}
        />

        <Snackbar
          open={this.state.notification}
          message="Login successful, redirecting..."
          autoHideDuration={2000}
        />


        {this.props.successful ? <Redirect to="/"/> : ''}  

      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signin: data => {dispatch(signin(data))}
  }
}

const mapStateToProps = state => {
  return{
    successful: state.user.signin_success
  }
}

export default connect(mapStateToProps , mapDispatchToProps)(UserLogin);
