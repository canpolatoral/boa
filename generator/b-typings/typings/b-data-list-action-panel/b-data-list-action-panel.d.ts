
declare namespace __BDataListActionPanel {
    interface BDataListActionPanelProps extends __BComponent.BComponentProps {
        columns: any[];
        dataSource: any;
        panelKey: string;
        displayItemCount?: number;
        showAddButton?: boolean;
        showDeleteButton?: boolean;
        showEditButton?: boolean;
        showHistoryButton?: boolean;
        onItemSelected?: (index: number, item: any) => void;
        onAddClicked?: () => void;
        onEditClicked?: (index: number, item: any) => void;
        onDeleteClicked?: (index: number, item: any) => void;
        onHistoryClicked?: (index: number, item: any) => void;
        addButtonText?: string;
        historyButtonText?: string;
        addButtonDisabled?: boolean;
        historyButtonDisabled?: boolean;
        focusedField?: string;
        focusedFieldCompareValue?: any;
        focusedFieldTitle?: string;
        selectable?: string;
    }

    interface BDataListActionPanelInstance extends __BComponent.BComponentInstance {
        resetState(): void;
        deleteItem(index: number): void;
        getValue(): any;
        getSelectedIndex(): number;
    }

    export class BDataListActionPanel extends __BComponent.BComponetBase<BDataListActionPanelProps, BDataListActionPanelInstance> { }
}

declare module 'b-data-list-action-panel' {
    export import BDataListActionPanel = __BDataListActionPanel.BDataListActionPanel;
    export default BDataListActionPanel;
}