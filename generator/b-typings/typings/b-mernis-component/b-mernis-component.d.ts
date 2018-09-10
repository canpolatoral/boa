
declare namespace __BMernisComponent {
    interface BMernisComponentProps extends __BComponent.BComponentProps {
        identityNumber?: any;  // number or string
        showDialogMessages?: boolean;
        canGetOnlineInfoMoreThanOne?: boolean;
        isTextAndButtonsEnabled?: boolean;
        isReadOnly?: boolean;
        searchBehaviourType?: "All" | "SearchForRealPerson" | "SearchForCorporate";
        isVisibileAddressInfoTab?: boolean;
        isVisibileSearchAndClearButton?: boolean;
        isVisibileSearchOnlineButton?: boolean;
        componentPartyType?: "PersonCitizen" | "PersonForeigner" | "Corporate" | "UnDefined";
        showBlackListDialogMessages?: boolean;
        blackListVerificationType?: number;
        isBlackListReadonly?: boolean;
        selectedMernisInfoChanged?: (sender: any) => void;
        selectedMernisInfoCleared?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        recordCouldntFind?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        mernisNotHealty?: (sender: any) => void;
        lostFocus?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        clearClick?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        searchClick?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
    }

    interface MernisComponentContract {
        selectedMernisInformations: BOA.Types.Kernel.Customer.SelectedIdentityAndAddressInformations;
    }

    interface BMernisComponentInstance extends __BComponent.BComponentInstance {
        getValue(): MernisComponentContract;
    }

    export class BMernisComponent extends __BComponent.BComponetBase<BMernisComponentProps, BMernisComponentInstance> { }
}

declare module 'b-mernis-component' {
    export import BMernisComponent = __BMernisComponent.BMernisComponent;
    export import MernisComponentContract = __BMernisComponent.MernisComponentContract;
    export default BMernisComponent;
}