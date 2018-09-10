
declare namespace __BThirdPartyRelationPersonsComponent {
    interface BThirdPartyRelationPersonsComponentProps extends __BComponent.BComponentProps {
        disabled?: boolean;
        isToggled?: boolean;
        isToggleDisabled?: boolean;

        thirdPartySerializeId?: number;
        accountNumber?: number;
        thirdPersonId?: number;
        relationPersonId?: number;

        isEntitled?: boolean;
        isCharge?: boolean;
        isFaxMailOrder?: boolean;
        isPhoneApproved?: boolean;
        isSignitureApproved?: boolean;
        isDefinedFaxNumber?: boolean;
        isOriginalOrder?: boolean;
        inteviewText?: string;

        relationshipTypeIdList?: any /*PropTypes.arrayOf(number)*/;
        allowFilterCustomerProperties?: boolean;
        authorizationTypeFilterList?: any /*PropTypes.arrayOf(number)*/;

        labelToggle?: string;
        labelEntitled?: string;
        labelCharge?: string;
        labelFaxMailOrder?: string;
        labelDefinedFaxNumber?: string;
        labelIsOriginalOrder?: string;
        labelIsSignitureApproved?: string;
        labelIsPhoneApproved?: string;
        labelInteviewText?: string;
        labelPersonType?: string;

        onToggle?: (value: boolean) => void;
        onPersonTypeChange?: (value: string) => void; // value => Entitled, Charge, FaxMailOrder
        onThirdPartySelect?: (thirdParty: any) => void;
        onPersonRelationsSelect?: (personRelation: any) => void;
    }

    interface BThirdPartyRelationPersonsComponentInstance extends __BComponent.BComponentInstance {
        /**
         * thirdPartySerializeInfo: BOA.Types.Kernel.General.ThirdPartyWithRelationPersonsSerializeContract,
         * thirdPartyComponentContract: BOA.Types.Kernel.General.ThirdPartyComponentContract,
         * personRelationsContract: BOA.Types.Kernel.Customer.PersonRelationsContract
         */
        getValue(): ReturnValueContract;
    }

    export class BThirdPartyRelationPersonsComponent extends __BComponent.BComponetBase<BThirdPartyRelationPersonsComponentProps, BThirdPartyRelationPersonsComponentInstance> { }

    class ReturnValueContract {
        thirdPartySerializeInfo: BOA.Types.Kernel.General.ThirdPartyWithRelationPersonsSerializeContract;
        thirdPartyComponentContract: BOA.Types.Kernel.General.ThirdPartyComponentContract;
        personRelationsContract: BOA.Types.Kernel.Customer.PersonRelationsContract
    }
}

declare module 'b-third-party-relation-persons-component' {
    export import BThirdPartyRelationPersonsComponent = __BThirdPartyRelationPersonsComponent.BThirdPartyRelationPersonsComponent;
    export default BThirdPartyRelationPersonsComponent;
}