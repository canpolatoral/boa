import * as signalR from '@aspnet/signalr';
import { getProxy } from 'b-proxy';

export class BStreamHub {

  static streamHubConnection = null;
  static callBackDictionary = null;

  constructor() {
    this.callBackDictionary = {};
  }

  connectToStreamHub(): Promise {
    let that = this;
    return new Promise(function(resolve:any, reject:any) {
      if (that.streamHubConnection) {
        resolve(that.streamHubConnection);
        return;
      }
      let bearer = getProxy().authenticationContext.access_token;
      let hubConnection = new signalR.HubConnectionBuilder()
              .withUrl('/streamhub', { accessTokenFactory: () => bearer, skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets })
              .configureLogging(signalR.LogLevel.Trace)
              .build();
      hubConnection.start().then(() => {
        hubConnection.on('SendData', (data: any) => {
          if (that.callBackDictionary[data.resourceCode]) {

            if (data.messageTime < that.callBackDictionary[data.resourceCode].lastMessageTime) return;

            for (let i=0; i<that.callBackDictionary[data.resourceCode].callbackList.length; i++) {
              that.callBackDictionary[data.resourceCode].callbackList[i](JSON.parse(data.value));
            }
          }
        });

        hubConnection.on('SendDataError', (error: any) => {
          if (that.callBackDictionary[error.resourceCode]) {

            if (error.messageTime < that.callBackDictionary[error.resourceCode].lastMessageTime) return;

            for (let i=0; i<that.callBackDictionary[error.resourceCode].callbackList.length; i++) {
              that.callBackDictionary[error.resourceCode][i](error.value);
            }
          }
        });
      }).then(()=>{
        that.streamHubConnection = hubConnection;
        resolve(that.streamHubConnection);
      }).catch((error)=>{
        reject(error);
      });
    });
  }

  joinGroup(resourceCode, callback, errorCallback) {
    if (this.streamHubConnection) {
      let callBackFromDictionary;
      if (!this.callBackDictionary[resourceCode]) {
        this.callBackDictionary[resourceCode] = {lastMessageTime: null, callbackList:[], errorCallbackList:[]};
      }
      else {
        callBackFromDictionary = this.callBackDictionary[resourceCode].callbackList.filter(this.filterFindFunction.bind(this, callback));
      }
      if (!callBackFromDictionary || callBackFromDictionary.length == 0) {
        if (!this.callBackDictionary[resourceCode].isConnected) {
          this.streamHubConnection.invoke('JoinStreamGroup', resourceCode);
          this.callBackDictionary[resourceCode].isConnected = true;
        }
        this.callBackDictionary[resourceCode].callbackList.push(callback);
        if (errorCallback) this.callBackDictionary[resourceCode].errorCallbackList.push(errorCallback);
      }
    }
  }

  filterRemoveFunction(target, element) {
    return element != target;
  }

  filterFindFunction(target, element) {
    return element == target;
  }

  leaveGroup(resourceCode, callback, errorCallback) {
    if (this.streamHubConnection) {
      if (this.callBackDictionary[resourceCode].callbackList && callback)
        this.callBackDictionary[resourceCode].callbackList = this.callBackDictionary[resourceCode].callbackList.filter(this.filterRemoveFunction.bind(this, callback));
      if (this.callBackDictionary[resourceCode].errorCallbackList && errorCallback)
        this.callBackDictionary[resourceCode].errorCallbackList = this.errorCallbackList[resourceCode].errorCallbackList.filter(this.filterRemoveFunction.bind(this, errorCallback));

      if (this.callBackDictionary[resourceCode].callbackList.length == 0) {
        this.streamHubConnection.invoke('LeaveStreamGroup', resourceCode);
        this.callBackDictionary[resourceCode].isConnected = false;
      }
    }
  }
}

let bStreamHubInstance;
export function getStreamHub() {
  return new Promise(function(resolve:any, reject:any) {
    if (!bStreamHubInstance) {
      bStreamHubInstance = new BStreamHub();
      bStreamHubInstance.connectToStreamHub().then(()=>{
        resolve(bStreamHubInstance);
        return;
      }).catch((error)=>{
        reject(error);
      });
    }
    else {
      resolve(bStreamHubInstance);
    }
  });
}

export function getStreamHubWithJoin(resourceCode:String, callback:any, errorCallback:any) {
  return new Promise(function(resolve:any, reject:any) {
    getStreamHub()
      .then((streamHub)=>{
        streamHub.joinGroup(resourceCode, callback, errorCallback);
        resolve(streamHub);
      })
      .catch((err)=>{
        reject(err);
      });
  });
}
