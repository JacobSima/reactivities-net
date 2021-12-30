import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

class CommonStore {

  error: ServerError | null  = null;
  token: string | null = window.localStorage.getItem('jwt');
  appLoaded = false;

  constructor(){
    makeAutoObservable(this);

    // react when the token changes
    reaction(
      () => this.token,
      token => token
          ? window.localStorage.setItem('jwt',token)
          : window.localStorage.removeItem('jwt')

    )

  }

  setServerError = (error: ServerError) => this.error =  error

  setToken = (token: string | null) => {
    this.token = token;
  }

  setAppLoaded = () => this.appLoaded = true;

}



export default CommonStore