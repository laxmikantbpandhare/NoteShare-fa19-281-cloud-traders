// Imports
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// App Imports
import { fetchTweets } from '../../actions/tweet'
import Loading from '../loading'
import TweetList from './list'
import Sidebar from '../sidebar'

class TweetListContainer extends Component {
  componentDidMount () {
    this.props.fetchTweets()
  }

  render () {
    return (
      <div > 
        <Sidebar user = {'buyer'} options = {['Profile', 'Past Orders', 'Upcoming Orders']} module = {'account'}/>
      <section className="container"> 
        <h2><span role="img" aria-label="tweets">💭</span> Notes</h2>

        <br/>

        {this.props.tweets.loading ? <Loading/> : <TweetList tweets={this.props.tweets.list}/>}
      </section>
      </div>
    )
  }
}

TweetListContainer.propTypes = {
  tweets: PropTypes.object.isRequired,
  fetchTweets: PropTypes.func.isRequired
}

function tweetsState (state) {
  return {
    tweets: state.tweets
  }
}

export default connect(tweetsState, {fetchTweets})(TweetListContainer)
