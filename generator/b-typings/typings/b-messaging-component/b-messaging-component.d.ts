declare namespace __BMessagingComponent {
  interface BMessagingComponentProps extends __BComponent.BComponentProps {
      selectedCode?: string,
      disabled?: boolean,
      hintText?: string,
      floatingLabelText?: string,
      onChange?: (selectedCode: any) => void;
  }

  interface BMessagingComponentInstance extends __BComponent.BComponentInstance {
  }

  export class BMessagingComponent extends __BComponent.BComponetBase<BMessagingComponentProps, BMessagingComponentInstance> { }

}

declare module 'b-messaging-component' {
  export import BMessagingComponent = __BMessagingComponent.BMessagingComponent;
  export default BMessagingComponent;
}
