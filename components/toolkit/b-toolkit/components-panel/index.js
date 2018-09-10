import React from 'react';
import { BComponent, BComponentComposer } from 'b-component';
import BoaComponents from '../components';
import { BDataGrid } from 'b-data-grid';
import PropTypes from 'prop-types';

@BComponentComposer
export class BToolkitComponentsPanel extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    width: PropTypes.number,
  }

  static defaultProps = {
    ...BComponent.defaultProps,
    width: 300,
  }

  state = {
  };

  constructor(props, context) {
    super(props, context);
  }

  onRowSelectionChanged = (event) => {
    let SelectedItem = BoaComponents.find(f => f.name == event.name);
    if (this.props.onItemSelect) {
      this.props.onItemSelect(SelectedItem);
    }
  }

  render() {

    let columns = [
      {
        key: 'name',
        name: 'Bileşen Adı',
      },
      {
        key: 'category',
        name: 'Bileşen Türü',
      },
    ];

    let dataSource = this.props.dataSource ? this.props.dataSource : BoaComponents;
    let filteredDataSource = dataSource;
    if (this.props.types) {
      filteredDataSource = [];
      this.props.types.forEach(item => {
        let obj = dataSource.find(f => f.type == item);
        if (obj) {
          filteredDataSource.push(obj);
        }
      });
    }

    return (
      <BDataGrid
        ref={r => this.catalogdatagrid = r}
        context={this.props.context}
        width={this.props.width}
        dataSource={filteredDataSource}
        columns={columns}
        editable={false}
        onRowSelectionChanged={this.onRowSelectionChanged}
        group={[
          {
            field: 'category',
            aggregates: [
              { field: 'category', aggregate: 'count' }
            ]
          }
        ]}
        selectable='singleNonPointer'
      />
    );
  }
}

export default BToolkitComponentsPanel;