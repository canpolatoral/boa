
declare namespace __BPMActionReasonList {
    interface BPMActionReasonListProps extends __BComponent.BComponentProps {
        resourceInfo?: any;
        resourceId?: number;
        resourceCode?: string;
        instanceId?: number;
    }

    interface BPMActionReasonListInstance extends __BComponent.BComponentInstance {
    }

    export class BPMActionReasonList extends __BComponent.BComponetBase<BPMActionReasonListProps, BPMActionReasonListInstance> {
        static showActionReasonList: (context: any, instanceId?: number, callback?: any) => void;
    }
}

declare module 'b-bpm-action-reason-list' {
    export import BPMActionReasonList = __BPMActionReasonList.BPMActionReasonList;
    export default BPMActionReasonList;
}