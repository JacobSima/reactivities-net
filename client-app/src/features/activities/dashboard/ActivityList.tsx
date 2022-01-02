import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react'
import {Header} from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import ActivityItem from './ActivityItem';


const ActivityList = () => {
  const {activityStore} =  useStore();
  const {groupedActivities} =  activityStore;

  return (
    <>
      {groupedActivities.map(([group, activities]) => (
        <Fragment key={group}>
          <Header sub color='teal'>
              {group}
          </Header>
          {activities.map(activity =>(
            <ActivityItem  activity={activity} key={activity.id}/>
          ))}
        </Fragment>
      ))}

    </>
  )
}

export default observer(ActivityList) 
