declare namespace _BStreamHub {
  class BStreamHub {
      joinGroup(resourceCode: string, callback:any, errorCallback:any ): any;
      leaveGroup(resourceCode: string, callback:any, errorCallback:any ): any;
  }

  export function getStreamHub():Promise<any>;
  export function getStreamHubWithJoin(resourceCode:String, callback:any, errorCallback:any):Promise<any>;
}

declare module "b-streamhub" {
  export import getStreamHub = _BStreamHub.getStreamHub;
  export import getStreamHubWithJoin = _BStreamHub.getStreamHubWithJoin;
}
