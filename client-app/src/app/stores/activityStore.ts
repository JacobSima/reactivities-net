import { format } from "date-fns";
import {makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

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
  createActivity =  async(activity: Activity) => {
    this.setLoading(true);
    try {
      await agent.Activities.create(activity)
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.setLoading(false);
        this.setLoadingInitial(false);
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.editMode = false;
        this.setLoading(false);
        this.setLoadingInitial(false);
      })
    }
  }

  // Update Activity Action
  updateActivity = async(activity: Activity) => {
    this.setLoading(true);
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity)
        this.selectedActivity = activity;
        this.editMode = false;
        this.setLoading(false);
        this.setLoadingInitial(false);
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.editMode = false;
        this.setLoading(false);
        this.setLoadingInitial(false);
      })
    }
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
  

}

export default ActivityStore