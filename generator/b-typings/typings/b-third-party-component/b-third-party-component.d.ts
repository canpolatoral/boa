
declare namespace __BThirdPartyComponent {
    interface BThirdPartyComponentProps extends __BComponent.BComponentProps {

        /**
         * Determines the bank that is currently selected
         */
        selectedThirdPartyId: number;

        /**
         * Determines the bank that is currently selected
         */
        accountNumber: number;

        /**
         * Determines the bank that is currently selected
         */
        hintText: string;

        /**
         * Determines the bank that is currently selected
         */
        labelText: string;

        /**
         * Determines the bank that is currently selected
         */
        disabled?: boolean;

        /**
         * Callback function fires when a city has been selected.
         */
        onThirdPartySelect: () => void;
    }

    interface BThirdPartyComponentInstance extends __BComponent.BComponentInstance {
    }

    export class BThirdPartyComponent extends __BComponent.BComponetBase<BThirdPartyComponentProps, BThirdPartyComponentInstance> { }
}

declare module 'b-third-party-component' {
    export import BThirdPartyComponent = __BThirdPartyComponent.BThirdPartyComponent;
    export default BThirdPartyComponent;
}