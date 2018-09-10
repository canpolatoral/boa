
declare namespace __BHtmlToReact {
    interface BHtmlToReactProps extends __BComponent.BComponentProps {
        html?: string;
        style?: React.CSSProperties;
    }

    interface BHtmlToReactInstance extends __BComponent.BComponentInstance {
    }

    export class BHtmlToReact extends __BComponent.BComponetBase<BHtmlToReactProps, BHtmlToReactInstance> { }
}

declare module 'b-html-to-react' {
    export import BHtmlToReact = __BHtmlToReact.BHtmlToReact;
    export default BHtmlToReact;
}