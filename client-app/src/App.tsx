import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Axios from 'axios';
import { Header, List } from 'semantic-ui-react';


function App() {
  const [activities, setActivities] = useState([]);

  useEffect(()=>{

    Axios
      .get("http://localhost:5000/api/activities")
      .then(res => {
        setActivities(res.data)
      })
      .catch(e=> console.log(e))
  },[])

  return (
    <div>
      <Header as='h2' icon='users' content='Reactivities' />
        <List>
          {
            activities.map((activity:any) => (
              <List.Item key={activity.id}>{activity.title}</List.Item>
            ))
          }
        </List>
    </div>
  );
}

export default App;
