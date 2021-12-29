import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react'
import Loading from '../../../app/layout/Loading';

import { useStore } from '../../../app/stores/store'


const ActivityDetails = () => {
  
  const {activityStore}  = useStore();
  const {id} = useParams<{id: string}>();
  const {selectedActivity: activity, loadActivity, loadingInitial} = activityStore;

  useEffect(() => {
    if(id) loadActivity(id);

  },[id, loadActivity])
  
  if(loadingInitial) return <Loading  content='Loading activity'/>;
  if(!activity) return <></>;

  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span >{activity.date}</span>
        </Card.Meta>
        <Card.Description>
          {activity.description}
       </Card.Description>
      </Card.Content>
    <Card.Content extra>
      <Button.Group widths={2}>
        <Button basic color='blue' content='Edit' as={Link} to={`/manage/${activity.id}`} />
        <Button basic color='grey' content='Cancel' as={Link} to={'/activities'}/>
      </Button.Group>
    </Card.Content>
  </Card>
  )
}

export default observer(ActivityDetails) 
