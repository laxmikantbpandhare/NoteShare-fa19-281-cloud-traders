// Imports
import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import CardText from 'material-ui/Card/CardText';

// UI Imports
import { Card, CardTitle } from 'material-ui/Card'

function TweetView ({tweet}) {
  return (
    <div>
      <Card>
        <CardTitle title={tweet.topic} subtitle={moment(tweet.time).fromNow()}/>
        <CardText>{tweet.data}
        </CardText>
      </Card>

      <br/>

      <Link to="/"><span role="img" aria-label="back">👈</span> Back to all notes</Link>
    </div>
  )
}

export default TweetView
