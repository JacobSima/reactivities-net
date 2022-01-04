import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import {Grid, Loader} from 'semantic-ui-react'
import { PagingParams } from '../../../app/models/pagination'
import { useStore } from '../../../app/stores/store'
import ActivityFilter from './ActivityFilter'
import ActivityList from './ActivityList'
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityItemPlaceHolder'


const ActivityDashboard = () => {

  const {activityStore} = useStore();
  const {
      loadActivities, 
      activityRegistry, 
      setPagingParams,
      pagination
  } = activityStore;

  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
  }

  useEffect(()=>{
    if(activityRegistry.size <= 1) loadActivities();
  },[activityRegistry.size, loadActivities])

  // if(loadingInitial && !loadingNext) return <Loading  content='Loading activities...'/>

  return (
    <Grid>
      <Grid.Column width={'10'}>
        {activityStore.loadingInitial && !loadingNext ? (
          <>
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
          </>
        ):(
            <InfiniteScroll
              pageStart={0}
              loadMore={handleGetNext}
              hasMore={!loadingNext && !! pagination && pagination.currentPage < pagination.totalPages}
              initialLoad={false}
            >
              <ActivityList />
            </InfiniteScroll>

        )}
        
        
        {/* <Button 
          floated='right' 
          content='More...' 
          positive
          onClick={handleGetNext}
          loading={loadingNext}
          disabled={pagination?.totalPages === pagination?.currentPage}
        /> */}
      </Grid.Column>
      <Grid.Column width={'6'} >
        <ActivityFilter />
      </Grid.Column>
      <Grid.Column width={10}>
          <Loader active={loadingNext}  />
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDashboard) 
