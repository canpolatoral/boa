
declare namespace __BUserComponent {
    interface BUserComponentProps extends __BComponent.BComponentProps {
        selectedUserId?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        selectedUserCode?: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        branchId?: number;
        isAllOptionIncluded?: boolean;
        allOptionDescription?: string;
        allOptionValue?: any;
        hintText?: string;
        labelText?: string;
        disabled?: boolean;
        disableSearch?: boolean;
        displayMemberPath?: string;
        isCacheEnabled?: boolean;
        isServiceUserEnabled?: boolean;
        multiSelect?: boolean;
        IsSystemColumnVisible?: boolean;
        onUserSelect?: (selectedUser: BOA.Common.Types.BoaUserContract) => void; // TODO: method parametre ve dönüş tipi eklenmeli! 
        sortOption?: any; // TODO: propType handle edilemedi.
        errorText?: string;
        valueConstraint?: any;
    }

    interface BUserComponentInstance extends __BComponent.BComponentInstance {
    }

    export class BUserComponent extends __BComponent.BComponetBase<BUserComponentProps, BUserComponentInstance> { }
}

declare module 'b-user-component' {
    export import BUserComponent = __BUserComponent.BUserComponent;
    export default BUserComponent;
}