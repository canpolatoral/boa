
declare namespace __BPersonComponent {
    interface BPersonComponentProps extends __BComponent.BComponentProps {
        disabled?: boolean;
        personId?: any; // TODO: propType handle edilemedi.
        personType?: number
        errorText?: string;
        selectedItemChange?: (selectedPerson: any, closeType: any) => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
    }

    interface BPersonComponentInstance extends __BComponent.BComponentInstance {
    }

    export class BPersonComponent extends __BComponent.BComponetBase<BPersonComponentProps, BPersonComponentInstance> { }
}

declare module 'b-person-component' {
    export import BPersonComponent = __BPersonComponent.BPersonComponent;
    export default BPersonComponent;
}