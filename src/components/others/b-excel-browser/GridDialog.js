import React from 'react'; import PropTypes from 'prop-types';

import { BComponent, BComponentComposer } from 'b-component';
import { BTransactionForm } from 'b-transaction-form';
import { BCard } from 'b-card';
import { BDialogHelper } from 'b-dialog-box';
import { BDataGrid } from 'b-data-grid';
@BComponentComposer
export class GridDialog extends BComponent {

  static propTypes = {
    /**
    * Base properties from BBusinessComponent.
    */
    ...BComponent.props,
    /**
    * Indicates the resource info.
    */
    resourceInfo: PropTypes.any,
    /**
    * Indicates the resource code.
    */
    resourceCode: PropTypes.string,
    /**
    * the event to handle closing.
    */
    handleClose: PropTypes.func
  };

  static defaultProps = {
    /**
    * Default prop values from BComponent
    */
    ...BComponent.defaultProps,
    resourceCode: 'YONTEXCELD'
  };

  constructor(props, context) {
    super(props, context);

    this.columnNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    this.columns = this.columnNames.map((value) => {
      return { key: value, name: value, resizable: true, editable: true, type: 'string' };
    });

    let row = {};
    for (let i = 0; i < this.columns.length; i++) {
      row[this.columns[i].key] = '';
    }

    let emptyData = [];
    for (let i = 0; i < 1000; i++) {
      emptyData.push({ ...row });
    }

    this.state = {
      columns: this.columns,
      emptyData: emptyData
    };
  }

  handleClose = () => {
    BDialogHelper.close(this, BComponent.DialogResponse.NONE);
  }

  actionBarButtonClick(e) {
    if (e.commandName == 'Ok') {
      let value = this.dataGrid.getInstance().getDataSource();

      // Sondaki datalarin bos satirlarin tamamini silelim
      while (value.length > 0) {
        let item = value[value.length - 1];

        let findData = false;
        for (let i = 0; i < this.columnNames.length; i++) {
          if (item[this.columnNames[i]] != '') {
            findData = true;
            break;
          }
        }

        if (findData == true) {
          break;
        }

        value = value.slice(0, -1); // Son elemani silelim
      }

      // sadece bizim alanlarimizi iceren nesnelere donusturelim
      value = value.map((item) => {
        var row = [];
        for (let i = 0; i < this.columnNames.length; i++) {
          row.push(item[this.columnNames[i]]);
        }

        return row;
      });

      BDialogHelper.close(this, BComponent.DialogResponse.OK, value);
    }
  }

  render() {
    let dataSource = this.state.emptyData.slice();
    if (typeof this.props.value === 'string') {
      let data = this.props.value.split('\n');
      for (let i = 0; i < data.length; i++) {
        dataSource[i][this.columnNames[0]] = data[i];
      }
    }
    else if (this.props.value instanceof Array) {
      for (let i = 0; i < this.props.value.length; i++) {
        let item = this.props.value[i];
        if (typeof item === 'string') {
          dataSource[i][this.columnNames[0]] = item;
        }
        else if (item instanceof Array) {
          for (let j = 0; j < item.length; j++) {
            dataSource[i][this.columnNames[j]] = item[j];
          }
        }
      }
    }

    return (
      <BTransactionForm
        {...this.props}
        resourceInfo={this.props.resourceInfo}
        onClosing={this.handleClose}
        cardSectionThresholdColumn={1}
        onActionClick={this.actionBarButtonClick.bind(this)}>
        <BCard
          context={this.props.context}>
          <BDataGrid
            ref={ref => this.dataGrid = ref}
            context={this.props.context}
            columns={this.state.columns}
            dataSource={dataSource}
            enableRowSelect={false}
            enableCellSelect={false}
            editable={true}
            groupable={false}
            multiSelection={false}
            showCheckbox={false}
            columnMenu={false}
            columnsDefaultWidth={110}
            filterable={false}
            sortable={false}
            headerBarOptions={{ show: false, showTitle: false, showGrouping: false, showFiltering: false, showMoreOptions: false }}
          />
        </BCard>
      </BTransactionForm>
    );
  }
}

export default GridDialog;
