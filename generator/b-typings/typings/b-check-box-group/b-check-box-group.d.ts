
declare namespace __BCheckBoxGroup {
    interface BCheckBoxGroupProps extends __BComponent.BComponentProps {
        children?: React.ReactNode;
        className?: string;
        defaultSelected?: any;
        name: string;
        checkedItems?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        disabled?: boolean;
        onChange?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        style?: React.CSSProperties;
        items: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
    }

    interface BCheckBoxGroupInstance extends __BComponent.BComponentInstance {
    }

    export class BCheckBoxGroup extends __BComponent.BComponetBase<BCheckBoxGroupProps, BCheckBoxGroupInstance> { }
}

declare module 'b-check-box-group' {
    export import BCheckBoxGroup = __BCheckBoxGroup.BCheckBoxGroup;
    export default BCheckBoxGroup;
}