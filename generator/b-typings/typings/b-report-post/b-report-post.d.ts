declare namespace __BReportPost {
    interface BReportPostProps extends __BComponent.BComponentProps {
        activeReportReportId?:number;
        activeReportResourceId?:number;
        postmanRequest?:any;
        dataContract?:any;
        isPostman?:boolean;
    }

    interface BReportPostInstance extends __BComponent.BComponentInstance {
     
    }

    export class BReportPost extends __BComponent.BComponetBase<BReportPostProps, BReportPostInstance> { }
}

declare module 'b-report-post' {
    export import BReportPost = __BReportPost.BReportPost;
    export default BReportPost;
}