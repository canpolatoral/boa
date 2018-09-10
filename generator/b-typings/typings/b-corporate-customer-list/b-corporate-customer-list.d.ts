
declare namespace __BCorporateCustomerList {
    interface BCorporateCustomerListProps extends __BComponent.BComponentProps {
        name?: string;
        hintText?: string;
        disabled?: boolean;
        minHeight?: string;
        maxHeight?: string;
        defaultChecked?: boolean;
        onChecked?:() => void;
        onCustomerKeyPress?:() =>void;
    }

    interface BCorporateCustomerListInstance extends __BComponent.BComponentInstance {

        /// seçili dataları döndürü
        getCheckedBoxList(): any[];

        /// reset all component
        reset(): void;
        
        /// Dışlarıdan check edilecek değerler gönderilir. 
        setCheckBoxList(list: any[]): void;
    }

    export class BCorporateCustomerList extends __BComponent.BComponetBase<BCorporateCustomerListProps, BCorporateCustomerListInstance> { }
}

declare module 'b-corporate-customer-list' {
    export import BCorporateCustomerList = __BCorporateCustomerList.BCorporateCustomerList;
    export default BCorporateCustomerList;
}