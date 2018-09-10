
declare namespace __BContentLoader {
  interface BContentLoaderProps extends __BComponent.BComponentProps {

    /** height, default:140 */
    height?: number;

    /** speed, default:140 */
    speed?: number;

    /** primaryColor */
    primaryColor?: number;

    /** secondaryColor */
    secondaryColor?: number;

    /** root style */
    style?: React.CSSProperties;


  }

  interface BContentLoaderInstance extends __BComponent.BComponentInstance {
  }

  export class BContentLoader extends __BComponent.BComponetBase<BContentLoaderProps, BContentLoaderInstance> {

    /** Clear cached row height and forceUpdate */
    clearAllRowHeight?: () => void;
  }
}

declare module 'b-content-loader' {
  export import BContentLoader = __BContentLoader.BContentLoader;
  export default BContentLoader;
}
