// Imports
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// App Imports
import { fetchTweetsUsers } from '../../actions/tweet'
import Loading from '../loading'
import TweetList from './list'
import Sidebar from '../sidebar'

class TweetListUserContainer extends Component {
    constructor(props){
        super(props);
        console.log("TweetListUserContainer props: ",props)
        this.state = {
            id: this.props.match.params.id
          };
    }



    componentDidMount () {
        console.log("out In component did mount if clause")
        
          if(this.props.match.params.id)
          {
            console.log("In component did mount if clause")
            this.props.fetchTweetsUsers(this.props.match.params.id)
            console.log("In component")
            this.setState({
                id: this.props.match.params.id
            });
            console.log(this.state.id)
    
          }
    
      }

      componentDidUpdate(prevProps) {
        if(this.props.match.params.id !== prevProps.match.params.id){
            this.props.fetchTweetsUsers(this.props.match.params.id);
            this.setState({
                id: this.props.match.params.id
            });
        }
      }
//   componentDidUpdate () {
//     console.log("out update In component did mount if clause")
    
//       if(this.props.match.params.id)
//       {
//         console.log("In update component did mount if clause")
//         this.props.fetchTweetsUsers(this.props.match.params.id)
//         console.log("In update component")
//         this.setState({
//             id: this.props.match.params.id
//         });
//         console.log(this.state.id)

//       }

//   }

//   shouldComponentUpdate(nextProps, nextState) {
//     // Only update if bricks change
//     console.log("update props", nextProps.match.params.id)
//     console.log("update props", nextState)
//     return nextProps.match.params.id  !==this.state.id;
//   }



  render () {
      const id = this.props.match.params.id
      console.log("In render",id)
      console.log(this.props.tweetsuser)

    return (
      <div > 
        {/* <Sidebar user = {id} options = {['Profile', 'Past Orders', 'Upcoming Orders']} module = {'account'} /> */}
      <section className="container"> 
        <h2><span role="img" aria-label="tweets">💭</span> Notes of {this.props.match.params.name}</h2>

        <br/>

        {this.props.tweetsuser.loading ? <Loading/> : <TweetList tweets={this.props.tweetsuser.userlist} />}
      </section>
      </div>
    )
  }
}

TweetListUserContainer.propTypes = {
    tweetsuser: PropTypes.object.isRequired,
  fetchTweetsUser: PropTypes.func.isRequired,
  id: PropTypes.object.isRequired,
}

function tweetsState (state) {
  return {
    tweetsuser: state.tweets
  }
}

export default connect(tweetsState, {fetchTweetsUsers})(TweetListUserContainer)
