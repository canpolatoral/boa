import * as React from 'react';
import BasePage from '../base';
import { BBrowseForm } from 'b-browse-form';
import { BLoading } from 'b-loading';
import { getMessage } from '../index';
import { BFormManager } from 'b-form-manager';
import { BTransactionForm } from 'b-transaction-form';

export default class BrowsePage extends BasePage {
  constructor(props, context) {
    super(props, context);
  }
}

export function BrowsePageComposer(WrappedComponent) {
  return class IIBrowsePage extends WrappedComponent {

    shallowEqual(objA, objB) {
      if (objA === objB) {
        return true;
      }
      if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
        return false;
      }
      const keysA = Object.keys(objA);
      const keysB = Object.keys(objB);
      if (keysA.length !== keysB.length) {
        return false;
      }
      const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
      for (let i = 0; i < keysA.length; i++) {
        if (keysA[i] != 'snapshotStore' && keysA[i] != 'executeStore') {
          if (!bHasOwnProperty(keysA[i]) || (objA[keysA[i]] !== objB[keysA[i]])) {
            return false;
          }
        }
      }
      return true;
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !this.shallowEqual(this.state, nextState);
    }

    pageDidMount() {
      super.pageDidMount && super.pageDidMount();
      window.onbeforeunload = this.onbeforeunload.bind(this);
    }

    componentWillUnmount() {
      super.componentWillUnmount();

      // ekran kapatılırken kullanıcı ayarları saklanıyor. [boa one web]
      this.saveSettings();
    }

    onbeforeunload(){
      // ekran kapatılırken kullanıcı ayarları saklanıyor. [tarayıcı komple kapanırsa, container ve boa store]
      this.saveSettings();
    }

    render() {
      if (this.state.pageParams && this.state.pageParams.resourceInfo && this.state.pageParams.resourceInfo.resourceActionList) {
        let setting=this.getUserSettings();
        const render = super.render();
        let renderChildren, renderContent = null;
        if (render && render.props) {
          renderChildren = render.props.children;
        }
        return (
          <BBrowseForm
            ref={r => this.snaps.form = r}
            snapshot={this.state.snapshot['form']}
            context={this.state.context}
            resourceInfo={this.state.pageParams.resourceInfo}
            onActionClick={this.onPageActionClick}
            onClosing={this.onPageCloseClick}
            columns={this.state.columns}
            editingDataOptions={this.state.editingDataOptions}
            treeDataOptions={this.state.treeDataOptions}
            filters={this.state.filters}
            sorting={this.state.sorting }
            expandedGroups={this.state.expandedGroups}
            grouping={this.state.grouping}
            aggregate={this.state.aggregate}
            dataSource={this.state.dataSource}
            selectable={this.state.selectable}
            criteriaPanelHeader={getMessage('BusinessComponents', 'Criterias')}
            page={this}
            formHeader={this.state.formHeader}
            formHeaderTransactionTypes={this.state.formHeaderTransactionTypes}
            actionManager={this.createActionManager()}
            rightPaneWidth={this.rightPaneWidth}
            rightPaneContent={this.rightPaneContent}
            leftPaneWidth={this.leftPaneWidth}
            hideActionManager={this.hideActionManager}
            userSetting={setting}
            rowRenderer={this.rowRenderer && this.rowRenderer.bind(this)}
            isRenderCustomRow={this.isRenderCustomRow()}
            customRowProperties={this.state.customRowProperties}
            onGridRowSelectionChanged={this.onRowSelectionChanged && this.onRowSelectionChanged.bind(this)}
            rowStyle={this.rowStyle && this.rowStyle.bind(this)}
            onRowDoubleClick={this.onRowDoubleClick && this.onRowDoubleClick.bind(this)}
            subGridProperties={this.subGridProperties && this.subGridProperties.bind(this)}
            rowDetail={this.rowDetail && this.rowDetail.bind(this)}
            pageLoaded={this.pageDidMount.bind(this)}
            >
            {renderChildren}
          </BBrowseForm>
        );

      }
      else {
        return <BLoading context={this.state.context} />;
      }
    }


    setColumns(columns:Array<any>){
      this.setState({
        columns
      });
    }

    setDataSource(dataSource:Array<any>){
      this.setState({
        dataSource
      });
    }

    setGridOptions(gridOptions:any){
      this.setState({
        ...gridOptions
      });
    }

    /**
     * isRenderCustomRow
     */
    isRenderCustomRow() {

      if(!super.rowRenderer)
        return false;

      //state üzerinde mevcut ise burası kullanılacak.
      else if(this.state.formMode  ){
        if(this.state.formMode=='card')
          return true;
        else if(this.state.formMode=='list')
          return false;
      }
      let setting=this.getUserSettings();

      if( setting && setting.formMode && setting.formMode=='card'){
        return true;
      }
      else
        return false;
    }

    /**
     * getSelectedRowIndexes
     */
    getSelectedRowIndexes() {
      return this.snaps.form ? this.snaps.form.getSelectedRowIndexes() : undefined;
    }

    /**
     * getSelectedRows
     */
    getSelectedRows() {
      return this.snaps.form ? this.snaps.form.getSelectedRows() : undefined;
    }

    /**
     * setSelectedRowIndexes
     * @param {*} indexes
     */
    setSelectedRowIndexes(indexes) {
      return this.snaps.form ? this.snaps.form.setSelectedRowIndexes(indexes) : undefined;
    }

    /**
     * print
     */
    print() {
      this.snaps.form.baseForm.printContent();
    }


  };
}
