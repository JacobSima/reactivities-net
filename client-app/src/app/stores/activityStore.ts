import { format } from "date-fns";
import {makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { Profile } from "../models/profile";
import { store } from "./store";

class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity : Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor(){
    makeAutoObservable(this)
  }

  // sort the activityRegister according to date
  get activitiesByDate(){
    return Array.from(this.activityRegistry.values()).sort((a,b) => 
      a.date!.getTime() - b.date!.getTime())
  }

  // Group Activities by Date
  get groupedActivities(){
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) =>{
        const date = format(activity.date!, 'dd MMM yyyy');
        activities[date] =  activities[date] 
        ?  [...activities[date], activity]
        : [activity];
        return activities;
      }, {} as {[key:string] : Activity[]})
    )
  }

  // Set  Initial Loading Action
  setLoadingInitial = (state: boolean) => this.loadingInitial = state;

  // Set Loading  Action
  setLoading = (state: boolean) => this.loading = state;

  // Registery Activity Set and Get a single Activity
  private getActivity =(id: string) => this.activityRegistry.get(id);
  private setActivity = (activity: Activity) => {

    const user = store.userStore.user
    if(user){
      activity.isGoing =  activity.attendees!.some(a => a.username === user.username);
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
    }
   
    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  }

  // Load Activities Action
  loadActivities = async () => {
    this.setLoadingInitial(true); 
    try {
      const activities = await agent.Activities.list();
      activities.forEach(activity => {
        // set activity into activityRegistry
        this.setActivity(activity);
      })
      this.setLoadingInitial(false);  
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);   
    }
  }

  
  // Load Single Activity
  loadActivity = async(id:string) => {
    let activity = this.getActivity(id);
    if(activity){
      this.selectedActivity =  activity;
      return activity;
    }else{
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        runInAction(() => this.selectedActivity =  activity);
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  }

  // Create Activity Action
  createActivity =  async(activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    try {
      await agent.Activities.create(activity)
      const newActivity = new Activity(activity)
      newActivity.hostUsername = user!.username;
      newActivity.attendees = [attendee];
      this.setActivity(newActivity);
      runInAction(() => {
        this.selectedActivity = newActivity;
      })
    } catch (error){console.log(error)}
  }

  // Update Activity Action
  updateActivity = async(activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if(activity.id){
          // everything in the second spread operator will override first one in the object
          let updatedActivity = { ...this.getActivity(activity.id), ...activity};
          this.activityRegistry.set(activity.id, updatedActivity as Activity);
          this.selectedActivity = updatedActivity as Activity;
        }
        
        
      })
    } catch (error){console.log(error)}
  }


  // Delete Activity Action
  deleteActivity = async (id: string) => {
    this.setLoading(true);
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.setLoading(false);
        this.setLoadingInitial(false);
      })
    } catch (error) {
      console.log(error);
      this.setLoading(false)
      this.setLoadingInitial(false);
    }
  }

  updateAttendance = async() => {
    const user = store.userStore.user;
    this.setLoading(true);

    try{
      await agent.Activities.attend(this.selectedActivity!.id)
      runInAction(() => {
        if(this.selectedActivity?.isGoing){
          this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(
            a => a.username !== user?.username
          );
          this.selectedActivity.isGoing = false;
        }else{
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }

        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
      })
    }catch(error){
      console.log(error)
    }finally{this.setLoading(false)}
  }

  cancelActivityToggle = async() => {
    this.setLoading(true);
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      })
    } 
    catch (error) {console.log(error)}
    finally{this.setLoading(false)};
  }

  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  }

  updateAttendeeFollowing = (username: string) => {
    this.activityRegistry.forEach(activity => {
      activity.attendees.forEach(attendee => {
        if(attendee.username === username){
          attendee.following ? attendee.followersCount -- : attendee.followersCount ++;
          attendee.following = !attendee.following;
        }
      })
    })
  }
  

}

export default ActivityStore