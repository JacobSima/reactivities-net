import React, {useEffect, useState} from 'react';
import { Container} from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import Loading from './Loading';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =  useState(false);

  useEffect(()=>{

    agent
      .Activities.list()
      .then(data => {
        let activities : Activity[] = [];
        data.forEach(x => {
          x.date = x.date.split('T')[0];
          activities.push(x);
        })
        setActivities(activities);
        setLoading(false);
      })
      .catch(e=> console.log(e))
  },[])

  const handlerSelectActivity = (id: string) =>{
    setSelectedActivity(activities.find(activity => activity.id === id));
  }

  const handleCancelSelectActivity = () => setSelectedActivity(undefined);

  const handleFormOpen = (id?: string)=>{
    id ? handlerSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  const handleFormClose = () => setEditMode(false);

  const handleCreateOrEditActivity = (activity: Activity) => {
    setSubmitting(true);
    if(activity.id){
      agent
        .Activities
        .update(activity)
        .then(() => {
          setActivities([...activities.filter(x => x.id !== activity.id), activity]);
          setSelectedActivity(activity);
          setEditMode(false);
          setSubmitting(false);
        })
    }else{
      activity.id = uuid();
      agent
        .Activities
        .create(activity)
        .then(() => {
          setActivities([...activities, activity]);
          setSelectedActivity(activity);
          setEditMode(false);
          setSubmitting(false);
        }) 
    }
    
        

  }

  const handleDeleteActivity = (id: string) => {
    setSubmitting(true);
    agent
      .Activities
      .delete(id)
      .then(() =>{
        setActivities([...activities.filter(x => x.id !== id)]);
        setSubmitting(false);
      } )
    
  }

  if(loading) return <Loading  content='Loading app'/>
  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{marginTop: "7em"}} >
        <ActivityDashboard 
          activities={activities} 
          selectedActivity = {selectedActivity}
          selectActivity = {handlerSelectActivity}
          cancelSelectActivity = {handleCancelSelectActivity}
          editMode ={editMode}
          openForm ={handleFormOpen}
          closeForm = {handleFormClose}
          createOrEdit ={handleCreateOrEditActivity}
          deleteActivity ={ handleDeleteActivity}
          submitting ={submitting}
          />
      </Container>
    </>
  );
}

export default App;
