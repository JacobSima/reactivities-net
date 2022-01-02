import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react'
import {  useParams } from 'react-router-dom';
import {Grid } from 'semantic-ui-react'
import Loading from '../../../app/layout/Loading';

import { useStore } from '../../../app/stores/store'
import DetailChat from './DetailChat';
import DetailHeader from './DetailHeader';
import DetailInfo from './DetailInfo';
import DetailSideBar from './DetailSideBar';


const ActivityDetails = () => {
  
  const {activityStore}  = useStore();
  const {id} = useParams<{id: string}>();
  const {selectedActivity: activity, loadActivity, loadingInitial, clearSelectedActivity} = activityStore;

  useEffect(() => {
    if(id) loadActivity(id);

    // As you close or change the selected activity must be cleared in the memory
    return () => clearSelectedActivity();

  },[id, loadActivity, clearSelectedActivity])
  
  if(loadingInitial) return <Loading  content='Loading activity'/>;
  if(!activity) return <></>;

  return (
    <Grid>
      <Grid.Column width={10}>
          <DetailHeader activity={activity} />
          <DetailInfo  activity={activity}/>
          <DetailChat activityId={activity.id}/>
      </Grid.Column>
      <Grid.Column width={6} >
          <DetailSideBar activity={activity}/>
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDetails) 
