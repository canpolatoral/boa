
declare namespace __BCreditCardComponent {
    interface BCreditCardComponentProps extends __BComponent.BComponentProps {
        creditCardBankInfo?: string;
        creditCardNumber?: string;
    }

    interface BCreditCardComponentInstance extends __BComponent.BComponentInstance {
    }

    export class BCreditCardComponent extends __BComponent.BComponetBase<BCreditCardComponentProps, BCreditCardComponentInstance> { }
}

declare module 'b-credit-card-component' {
    export import BCreditCardComponent = __BCreditCardComponent.BCreditCardComponent;
    export default BCreditCardComponent;
}