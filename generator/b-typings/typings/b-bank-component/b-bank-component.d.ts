
declare namespace __BBankComponent {
    interface BBankComponentProps extends __BComponent.BComponentProps {

        /**
         * Determines the bank that is currently selected
         */
        selectedBankId?: number;

        /**
         * Determines the city that is currently selected
         */
        selectedCityId?: number;

        /**
         * Determines the branch that is currently selected
         */
        selectedBranchId?: number;

        /**
         * Determines the bank type
         */
        bankType?: number;

        /**
         * Determines the closed or not closed banks
         */
        isClosedBanksInclude?: boolean;

        /**
         * Bileþendeki hangi listelerin açýk olacaðýný belirler.
         */
        behaviourType?: any;

        /**
         * Callback function fires when a bank has been selected.
         */
        onBankSelect?: (selectedBank: BOA.Types.Kernel.General.BankContract) => void;

        /**
         * Callback function fires when a city has been selected.
         */
        onCitySelect?: (selectedCity: BOA.Types.Kernel.General.CityContract) => void;

        /**
         * Callback function fires when a branch has been selected.
         */
        onBranchSelect?: (selectedBranch: BOA.Common.Types.BranchContract) => void;
    }

    interface BBankComponentInstance extends __BComponent.BComponentInstance {
        getValue(): any;
        resetValue(): void;
    }

    export class BBankComponent extends __BComponent.BComponetBase<BBankComponentProps, BBankComponentInstance> { }
}

declare module 'b-bank-component' {
    export import BBankComponent = __BBankComponent.BBankComponent;
    export default BBankComponent;
}