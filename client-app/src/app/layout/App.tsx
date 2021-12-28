import React, {useEffect} from 'react';
import {Container} from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import Loading from './Loading';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';


function App() {
  const {activityStore} = useStore();
  const {loadingInitial, loadActivities}  = activityStore;

  useEffect(()=>{
     loadActivities();
  },[activityStore])



  if(loadingInitial) return <Loading  content='Loading app'/>
  return (
    <>
      <NavBar/>
      <Container style={{marginTop: "7em"}} >
        <ActivityDashboard />
      </Container>
    </>
  );
}

export default observer (App);
