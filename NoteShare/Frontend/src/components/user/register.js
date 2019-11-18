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
//import { postRegister, signup } from '../../actions/user'
import { signup } from '../../actions/user'


class UserRegister extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      phone: '',
      userid: '',
      error: '',
      isLoading: false,
      isLoggingIn: false,
      notification: false,
      registered: false
    }
  }

  onSubmit (event) {
    event.preventDefault()

    console.log('E - submit #form-tweet')

    let input = {}
    input.email = this.state.email
    input.password = this.state.password
    input.firstname = this.state.firstname
    input.lastname = this.state.lastname
    input.phone = this.state.phone


    if (input.email !== '' && input.password !== '') {
      this.setState({isLoggingIn: true, isLoading: true})

        this.props.signup(input);



    //     if (response) {
    //       this.setState({
    //         isLoading: false,
    //         isLoggingIn: false,
    //         notification: true,
    //         email: '',
    //         password: '',
    //         firstname: '',
    //         lastname: '',
    //         phone:'',
    //         error: ''
    //       })

    //       // Redirect
    //       setTimeout(() => {
    //         this.setState({registered: true})
    //       }, 1000)
    //     } else {
    //       this.setState({
    //         isLoading: false,
    //         isLoggingIn: false,
    //     //    error: response.errors[0].message,
    //         notification: false
    //       })
    //     }
    //   })
    // } else {
    //   this.setState({
    //     error: 'Please enter your Email ID and password.',
    //     notification: false
    //   })
    // }
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
        <h2>Register</h2>

        <br/>

        {this.state.error ? <Card><CardText color={red500}>{this.state.error}</CardText></Card> : ''}

        {this.state.message ? <Card><CardText color={blue500}>{this.state.message}</CardText></Card> : ''}

        <form id="form-tweet" onSubmit={this.onSubmit.bind(this)}>
          <TextField
            name="email"
            value={this.state.email}
            onChange={this.onChange.bind(this)}
            floatingLabelText="Email ID"
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


          <TextField
            name="firstname"
            value={this.state.firstname}
            onChange={this.onChange.bind(this)}
            floatingLabelText="First Name"
            fullWidth={true}
          />

          <br/>


          <TextField
            name="lastname"
            value={this.state.lastname}
            onChange={this.onChange.bind(this)}
            floatingLabelText="last Name"
            fullWidth={true}
          />

          <br/>


          <TextField
            name="phone"
            value={this.state.phone}
            onChange={this.onChange.bind(this)}
            floatingLabelText="Phone"
            fullWidth={true}
          />

          <br/>
          <br/>

          <RaisedButton label="Submit" type="submit" backgroundColor={blue500} />

          <Link to="/user/login"><FlatButton label="Login"/></Link>
        </form>

        <Snackbar
          open={this.state.isLoggingIn}
          message="Logging in..."
          autoHideDuration={1000}
        />

        <Snackbar
          open={this.state.notification}
          message="Registered successfully."
          autoHideDuration={4000}
        />

        {this.props.success ? <Redirect to="/user/login"/> : ''}
      </section>
    )
  }
}


const mapDispatchToProps = dispatch => {
  return {
    signup: data => {dispatch(signup(data))}
  }
}

const mapStateToProps = state => {
  return{
    success: state.user.signup_success
  }
}

export default connect(mapStateToProps , mapDispatchToProps)(UserRegister);

