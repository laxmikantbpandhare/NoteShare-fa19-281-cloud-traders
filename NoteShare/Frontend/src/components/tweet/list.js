// Imports
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment'

// UI Imports
import { Card, CardTitle } from 'material-ui/Card'

function TweetList ({tweets}) {
  console.log(tweets)
  const emptyMessage = (
    <p>No tweets to show.</p>
  )

  const tweetsList = (
    tweets.map(({_id, msg, time}) => (
      <Card key={_id}>
        <Link to={`/tweet/${ _id }`}><CardTitle title={msg} subtitle={moment(time).fromNow()}/></Link>
      </Card>
    ))
  )

  return (
    <div>
      {
        (tweets.length == 0 && tweets ==[] && tweets ==[null] && tweets ==null && tweets[0] ==null ) ? emptyMessage : tweetsList}
    </div>
  )
}

TweetList.propTypes = {
  tweets: PropTypes.array.isRequired
}

export default TweetList
