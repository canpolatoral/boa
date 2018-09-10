
declare namespace __BInformationText {
    interface BInformationTextProps extends __BComponent.BComponentProps {
        labelText?: string;
        labelWidth?: number;
        infoText?: string;
    }

    interface BInformationTextInstance extends __BComponent.BComponentInstance {
    }

    export class BInformationText extends __BComponent.BComponetBase<BInformationTextProps, BInformationTextInstance> { }
}

declare module 'b-information-text' {
    export import BInformationText = __BInformationText.BInformationText;
    export default BInformationText;
}