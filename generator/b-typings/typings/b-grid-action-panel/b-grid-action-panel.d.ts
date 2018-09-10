declare namespace __BGridActionPanel {
  interface BGridActionPanelProps extends __BComponent.BComponentProps, __BDataGridDX.BDataGridProps {

      columns?: any[];            // __BDataGridDX.Column
      headerBarOptions?: any;     // __BDataGridDX.HeaderBarOptions
      showAddButton?: boolean;
      showDeleteButton?: boolean;
      showEditButton?: boolean;
      showHistoryButton?: boolean;
      onItemSelected?: (index: number, item: any) => void;
      onItemsSelected?: (index: number[], item: any[]) => void; /*çoklu seçimde bu kullanılmalı*/
      onAddClicked?: () => void;
      onEditClicked?: (index: number, item: any) => void;
      onDeleteClicked?: (index: number, item: any) => void;
      onDeleteItemsClicked?: (index: number[], item: any[]) => void; /*çoklu seçimde bu kullanılmalı*/
      onHistoryClicked?: (index: number, item: any) => void;
      addButtonText?: string;
      historyButtonText?: string;
      addButtonDisabled?: boolean;
      historyButtonDisabled?: boolean;

      /**Footer action clicked function */
      onFooterClicked?: (button?: any) => void;

      onRowSelectionChanged?: (dataItem: any, selectedIndex: number) => void;

      /** Footer Button List */
      buttonList?: any[];

      /*
      * Eğer herhangi bir item yoksa gridi gösterme, sadece ekle butonu görünecek
      */
      dontShowGridIfItemNotExists?: boolean;

      /** @deprecated*/
      multiSelection?: boolean;
      /** @deprecated*/
      editable?: boolean;
      /** @deprecated*/
      onRowUpdated?: (index: number, fieldName: string, newValue: any) => void;

  }

  interface BGridActionPanelInstance extends __BComponent.BComponentInstance, __BDataGridDX.BDataGridInstance {
      getSelectedRowIndexes: () => number[];
      addNewRow?: (row?: any) => void;
      getDataSource?: () => any[];
      getSelectedItems?: () => any[];
      setSelectedRowIndexes?: (index: number[]) => void;
      setSize?: (gridWidth: number, gridHeight: number) => void;
  }

  export class BGridActionPanel extends __BComponent.BComponetBase<BGridActionPanelProps, BGridActionPanelInstance> {

  }
}

declare module 'b-grid-action-panel' {
  export import BGridActionPanel = __BGridActionPanel.BGridActionPanel;
  export default BGridActionPanel;
}
