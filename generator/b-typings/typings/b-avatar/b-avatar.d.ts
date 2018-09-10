
declare namespace __BAvatar {
    interface BAvatarProps extends __BComponent.BComponentProps {
        backgroundColor?: string;
        children?: React.ReactNode;
        className?: string;
        color?: string;
        icon?: React.ReactElement<any>;
        size?: number;
        src?: string;
        style?: React.CSSProperties;
    }

    interface BAvatarInstance extends __BComponent.BComponentInstance {
    }

    export class BAvatar extends __BComponent.BComponetBase<BAvatarProps, BAvatarInstance> { }
}

declare module 'b-avatar' {
    export import BAvatar = __BAvatar.BAvatar;
    export default BAvatar;
}