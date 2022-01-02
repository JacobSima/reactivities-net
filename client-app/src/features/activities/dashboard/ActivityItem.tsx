import { format } from 'date-fns'
import React  from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity'
import ActivityAttendeeList from './ActivityAttendeeList'


interface Props {
  activity : Activity;
  
}

const ActivityItem = ({activity}: Props) => {
  return (
    <Segment.Group>
        <Segment>
          {activity.isCancelled && (
            <Label attached='top' color='red' content='Cancel' style={{textAlign:'center'}} />
          )}
          <Item.Group>
            <Item>
              <Item.Image style={{marginBottom:3}} size='tiny' circular  scr={activity.host?.image  || '/assets/user.png'} />
              <Item.Content>
                  <Item.Header 
                    as={Link} 
                    to={`/activities/${activity.id}`} >
                      {activity.title}
                  </Item.Header>
                  <Item.Description>Hosted By <Link to={`/profiles/${activity.hostUsername}`}>{activity.host?.displayName}</Link></Item.Description>
                  {activity.isHost && (
                    <Item.Description>
                      <Label basic color='orange' >You are hosting this activity</Label>
                    </Item.Description>
                  )}
                  {activity.isGoing && !activity.isHost && (
                    <Item.Description>
                      <Label basic color='green' >You are going to this activity</Label>
                    </Item.Description>
                  )}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>

        <Segment>
          <span>
            <Icon name='clock' /> { format(activity.date!, 'dd MM yyyy h:mm aa')}
            <Icon name ='marker' /> {activity.venue}
          </span>
        </Segment>

        <Segment secondary>
            <ActivityAttendeeList  attendees={activity.attendees!} />
        </Segment>

        <Segment clearing>
            <span>{activity.description}</span>
            <Button  
              as={Link} 
              to={`/activities/${activity.id}`}  
              color='teal'
              floated='right'
              content='View'
              />
        </Segment>
    </Segment.Group>
  )
}

export default ActivityItem
