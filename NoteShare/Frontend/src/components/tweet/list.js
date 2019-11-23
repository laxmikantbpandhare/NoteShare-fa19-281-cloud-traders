// Imports
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment'

// UI Imports
import { Card, CardTitle } from 'material-ui/Card'
import CardText from 'material-ui/Card/CardText';

function TweetList ({tweets}) {
  console.log(tweets)
  //console.log(id)
  const emptyMessage = (
    <p>No tweets to show.</p>
  )

  const tweetsList = (
    tweets.map(({_id, data, time, topic, userid}) => (
      <div>
      <Card key={_id} style = {{padding:'20px'}}>
        <Link to={`/tweet/${ _id }`}><CardTitle title={topic}  subtitle={moment(time).fromNow()}/>
        <CardText>{data}
        </CardText>
        </Link>
      </Card>
      <br/>
      <br/>
      </div>
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
