
declare namespace __BDocNotice {
    interface BDocNoticeProps extends __BComponent.BComponentProps {
      
        type: 'info' | 'tip' | 'warning' | 'error'
        header?: string,
        content?: string,
        fitMode?: boolean 
    }

    interface BDocNoticeInstance extends __BComponent.BComponentInstance {
        
    }
 
    export class BDocNotice extends __BComponent.BComponetBase<BDocNoticeProps, BDocNoticeInstance> { }
}

declare module 'b-doc-notice' {
    export import BDocNotice = __BDocNotice.BDocNotice;
    export default BDocNotice;
}