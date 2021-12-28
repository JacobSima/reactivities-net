import {makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';

class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity : Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = true;

  constructor(){
    makeAutoObservable(this)
  }

  // sort the activityRegister according to date
  get activitiesByDate(){
    return Array.from(this.activityRegistry.values()).sort((a,b) => 
      Date.parse(a.date) - Date.parse(b.date));
  }

  // Set  Initial Loading Action
  setLoadingInitial = (state: boolean) => this.loadingInitial = state;

  // Set Loading  Action
  setLoading = (state: boolean) => this.loading = state;

  // Load Activities Action
  loadActivities = async () => {
    try {
      const activities = await agent.Activities.list();
      activities.forEach(x => {
        x.date = x.date.split('T')[0];
        this.activityRegistry.set(x.id, x);  
      })
      this.setLoadingInitial(false);  
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);   
    }
  }


  // Select an Activity Action
  selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
  }

  // Cancel Selection of Activity
  cancelSelectedActivity = () => this.selectedActivity = undefined;

  // Open Activity Form
  openForm = (id?: string) => {
    id 
      ? this.selectActivity(id)
      : this.cancelSelectedActivity();

    this.editMode = true;
  }

  // Close Activity Form
  closeForm = () => this.editMode = false;

  // Create Activity Action
  createActivity =  async(activity: Activity) => {
    this.setLoading(true);
    activity.id = uuid();
    try {
      await agent.Activities.create(activity)
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.setLoading(false);
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.editMode = false;
        this.setLoading(false);
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
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.editMode = false;
        this.setLoading(false);
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
        if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
        this.setLoading(false);
      })
    } catch (error) {
      console.log(error);
      this.setLoading(false)
    }
  }
  

}

export default ActivityStore