// Imports
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Switch, Route ,Link} from 'react-router-dom';

// App Imports
import { fetchTweets } from '../../actions/tweet'
import TweetListUserContainer from "./list-container-user"
import TweetListOwnerContainer from "./list-container-owner"
import Loading from '../loading'
import TweetList from './list'
import Sidebar from '../sidebar'
// import { fetchTweets } from '../../actions/tweet'

class TweetListContainer extends Component {
  componentDidMount () {
    this.props.fetchTweets()
  }

  render () {
    return (
      <div > 
        <Sidebar user = {'buyer'} options = {['Profile', 'Past Orders', 'Upcoming Orders']} module = {'account'}/>
      <section className="container"> 
        {/* <h2><span role="img" aria-label="tweets">💭</span> Notes</h2> */}
        <div className = "right-side-area">
                        <Switch>
                        <Route path="/notes/:id/:name" component={TweetListUserContainer}/>
                        <Route exact path="/" component={TweetListOwnerContainer}/>

                        </Switch>
                        {/* <section className="container">  
        <h2><span role="img" aria-label="tweets">💭</span> Notes</h2>

        {this.props.tweets.loading ? <Loading/> : <TweetList tweets={this.props.tweets.list}/>}
      </section> */}
                    </div>

      

        {/* {this.props.tweets.loading ? <Loading/> : <TweetList tweets={this.props.tweets.list}/>} */}
      </section>
      </div>
    )
  }
}

TweetListOwnerContainer.propTypes = {
  tweets: PropTypes.object.isRequired,
  fetchTweets: PropTypes.func.isRequired
}

function tweetsState (state) {
  return {
    tweets: state.tweets
  }
}

export default connect(tweetsState, {fetchTweets})(TweetListContainer)
