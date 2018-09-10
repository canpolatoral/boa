
declare namespace __BHtmlToReact {
    import React = __React;
    interface BHtmlToReactProps extends __BComponent.BComponentProps {
        html?: string;
        style?: React.CSSProperties;
    }

    export class BHtmlToReact extends  __BComponent.BComponetBase<BHtmlToReactProps> {
    }
}

declare module 'b-html-to-react' {
    export import BHtmlToReact = __BHtmlToReact.BHtmlToReact;
    export default BHtmlToReact;
}