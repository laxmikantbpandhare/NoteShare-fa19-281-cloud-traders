// Imports
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
//import moment from 'moment'

// UI Imports
import { Card, CardTitle } from 'material-ui/Card'

function UserList ({users}) {
  console.log(users)
  const emptyMessage = (
    <p>No users to show.</p>
  )

  const usersList = (
    users.map(({_id, uuid, firstname,lastname,email}) => (
      <Card key={_id}>
        <Link to={`/tweet/${ _id }`}><CardTitle title={firstname +" "+ lastname} subtitle={email}/></Link>
      </Card>
    ))
  )

  return (
    <div>
      {
        (users.length == 0 && users ==[] && users ==[null] && users ==null && users[0] ==null ) ? emptyMessage : usersList}
    </div>
  )
}

UserList.propTypes = {
  users: PropTypes.array.isRequired
}

export default UserList
