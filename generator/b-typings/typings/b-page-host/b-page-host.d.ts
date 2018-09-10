
declare namespace __BPageHost {
    interface BPageHostProps extends __BComponent.BComponentProps {
        content?: React.ReactNode;
        leftDrawerWidth?: number;
        rightDrawerWidth?: number;
        style?: any;
    }

    interface BPageHostInstance extends __BComponent.BComponentInstance {

    }

    export class BPageHost extends __BComponent.BComponetBase<BPageHostProps, BPageHostInstance> { }
}

declare module 'b-page-host' {
    export import BPageHost = __BPageHost.BPageHost;
    export default BPageHost;
}