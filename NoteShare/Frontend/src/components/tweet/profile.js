// Imports
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

// UI Imports
import Snackbar from 'material-ui/Snackbar'
import RaisedButton from 'material-ui/RaisedButton'
import { blue500, red500 } from 'material-ui/styles/colors'
import TextField from 'material-ui/TextField'
import { Card, CardText } from 'material-ui/Card'

// App Imports
import { updateProfile } from '../../actions/user'
import AuthRedirect from './../user/auth-redirect'
import Loading from '../loading'

class Profile extends Component {
  constructor (props) {
    super(props)

    this.state = {
      _id: '',
      firstname: '',
      lastname: '',
      phone:'',
      email:'',
      image:'',
      isLoading: false,
      error: '',
      notification: false,
      viewTweet: false, 
      tweetId: ''
    }
  }

  componentDidMount()
  {
      if(this.props.user)
      {
          this.setState(
              {
                _id: this.props.user.user._id,
                firstname: this.props.user.user.firstname,
                lastname: this.props.user.user.lastname,
                phone:this.props.user.user.phone,
                email:this.props.user.user.email,
              }
          )

      }
  }



  onSubmit (event) {
    event.preventDefault()

    console.log('E - submit #update-profile')

    this.setState({isLoading: true})

    let input = {}
    input._id = this.state._id
    input.firstname = this.state.firstname
    input.lastname = this.state.lastname
    input.phone = this.state.phone
    input.email = this.state.email

    if (input.firstname !== '') {
       // this.props.updateProfile(input)
      this.props.updateProfile(input).then((response) => {
        if (response) {
          console.log(response)
          this.setState({isLoading: false, notification: true, text: '', error: ''})
        } else {
          this.setState({isLoading: false, error: "error"})
        }
      })
    } else {
      this.setState({isLoading: false, error: 'Note cannot be empty.', notification: false})
    }
  }

  onChange (event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render () {

    console.log("add");
    const {isAuthenticated} = this.props.user

    return (
        
      <section>
        <h2><span role="img" aria-label="tweet">💭</span> Edit your profile</h2>

        <br/>

        {this.state.error ? <Card><CardText color={red500}>{this.state.error}</CardText></Card> : ''}

        {this.state.message ? <Card><CardText color={blue500}>{this.state.message}</CardText></Card> : ''}

        <form id="form-tweet" onSubmit={this.onSubmit.bind(this)}>
          <TextField
            name="firstname"
            value={this.state.firstname}
            onChange={this.onChange.bind(this)}
            floatingLabelText="First Name"
            multiLine={true}
            rows={1}
            fullWidth={true}
          />

            <TextField
                name="lastname"
                value={this.state.lastname}
                onChange={this.onChange.bind(this)}
                floatingLabelText="Last Name"
                multiLine={true}
                rows={1}
                fullWidth={true}
            />

            <TextField
                name="phone"
                value={this.state.phone}
                onChange={this.onChange.bind(this)}
                floatingLabelText="Phone Number"
                multiLine={true}
                rows={1}
                fullWidth={true}
            />

            <TextField
                name="email"
                value={this.state.email}
                onChange={this.onChange.bind(this)}
                floatingLabelText="Email entered"
                multiLine={true}
                disabled={"disabled"}
                rows={1}
                fullWidth={true}
            />
                


          <br/>
          <br/>

          {this.state.isLoading ? <Loading/> : <RaisedButton label="🐤 Submit" type="submit" backgroundColor={blue500} />}
        </form>

        <Snackbar
          open={this.state.notification}
          message="User information has been updated has been posted"
          autoHideDuration={4000}
          action="Go to Home"
          onActionClick={() => (this.setState({viewTweet: true}))}
        />

        {this.state.viewTweet ? <Redirect to={`/`}/> : ''}

        <AuthRedirect/>
      </section>
    )
  }
}

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    updateProfile: PropTypes.func.isRequired,
  }
  
  function mapStateToProps (state) {
    return {
      user: state.user
    }
  }

export default connect(mapStateToProps, {updateProfile})(Profile)
