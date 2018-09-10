
declare namespace __BRouteHistory {
    interface BRouteHistoryProps extends __BComponent.BComponentProps {
        resourceInfo?: any;
        resourceCode?: string;
        instanceId?: any;
    }


    interface BRouteHistoryInstance extends __BComponent.BComponetBase<BRouteHistoryProps> {
    }

    export class BRouteHistory extends __BComponent.BComponetBase<BRouteHistoryProps, BRouteHistoryInstance> {
        static showRoute: (context: any, instanceId?: number) => void;
    }
}


declare module 'b-bpm-route-history' {
    export import BRouteHistory = __BRouteHistory.BRouteHistory;
    export default BRouteHistory;
}