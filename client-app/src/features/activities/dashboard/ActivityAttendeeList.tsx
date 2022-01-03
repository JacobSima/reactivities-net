import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'
import { List, Image, Popup } from 'semantic-ui-react'
import { Profile } from '../../../app/models/profile'
import ProfileCard from '../../profiles/ProfileCard'

interface Props {
  attendees: Profile[];
}

const ActivityAttendeeList = ({attendees}: Props) => {
  const styles = {
    borderColor: 'orange',
    borderWidth: 2
  }

  return (
    <List horizontal >
      {attendees.map(attendee => (
        <Popup
          hoverable
          key={attendee.username}
          trigger={
            <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
              <Image 
                bordered
                style ={attendee.following ? styles: null}
                size='mini' 
                circular src={ attendee.image || '/assets/user.png'} />
          </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={attendee} />
          </Popup.Content>
        </Popup>
        
      ))}
    </List>
  )
}

export default observer(ActivityAttendeeList) 
