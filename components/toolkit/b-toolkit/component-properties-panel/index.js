import React from 'react';
import { BComponent, BComponentComposer } from 'b-component';
import { BToolkit } from '../index';
import { BDialogHelper } from 'b-dialog-box';
import { getReadablePropTypes } from '../components';
import { BInput } from 'b-input';
import { BInputNumeric } from 'b-input-numeric';
import { BToggle } from 'b-toggle';
import { BComponentChooser } from '../component-chooser';
import PropTypes from 'prop-types';
import { BGridActionPanel } from 'b-grid-action-panel';

@BComponentComposer
export class BComponentPropertiesPanel extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    width: PropTypes.number,
  }

  static defaultProps = {
    ...BComponent.defaultProps,
    width: 300,
  }

  state = {
    selectedComponentName: null,
    viewProps: {},
    defaultProps: null,
    propTypes: null,
    warningMessage: null,
  };

  constructor(props, context) {
    super(props, context);
  }

  openNodeChooser = () => {
    let { context } = this.props;
    let Element = <BToolkit inDialog={true} resourceInfo={this.state.resourceInfo} context={context} />;
    let dialogStyle = { width: '96%', height: '100%', padding: 0, overflow: 'hide' };
    this.dialogRef = BDialogHelper.show(context,
      Element,
      0, 0, 'Bileşen Seçimi', this.onClose, dialogStyle, null, null); //  Title dinamik olarak set edilecek
  }

  onPropsChanged = (newProps) => {
    let viewProps = Object.assign({}, newProps);
    this.setState({ viewProps });
    if (this.props.onPropsChange)
      this.props.onPropsChange(viewProps);
  }

  componentWillMount() {
    super.componentWillMount();
    if (this.props.componentRef) {
      if (this.props.componentRef.getComponentPropTypes && this.props.componentRef.getComponentDefaultProps) {
        let propTypes = getReadablePropTypes(this.props.componentRef.getComponentPropTypes());
        let defaultProps = this.props.componentRef.getComponentDefaultProps();
        let displayName = this.props.componentRef.getDisplayName();
        this.setState({ viewProps: Object.assign({}, defaultProps), propTypes, displayName, defaultProps });
      }
      else {
        this.setState({
          viewProps: {},
          defaultProps: null,
          propTypes: null, warningMessage: 'İlgili Bileşen @ComponentComposer ile export edilmemiş olabilir !'
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (this.props.componentRef != nextProps.componentRef && nextProps.componentRef) {
      if (nextProps.componentRef.getComponentPropTypes && nextProps.componentRef.getComponentDefaultProps) {
        let propTypes = getReadablePropTypes(nextProps.componentRef.getComponentPropTypes());
        let defaultProps = nextProps.componentRef.getComponentDefaultProps();
        let displayName = this.props.componentRef.getDisplayName();
        this.setState({ viewProps: Object.assign({}, defaultProps), propTypes, displayName, defaultProps });
      }
      else {
        this.setState({
          viewProps: {},
          defaultProps: null,
          propTypes: null, warningMessage: 'İlgili Bileşen @ComponentComposer ile export edilmemiş olabilir !'
        });
      }
    } else if (!nextProps.componentRef) {
      this.setState({ viewProps: {}, defaultProps: null, propTypes: null });
    }
  }
  onComponentSelect = (Selected, properyName) => {
    let viewProps = this.state.viewProps;
    viewProps[properyName] = Selected;
    this.onPropsChanged(viewProps);
  }

  render() {
    let context = this.props.context;
    return <div>
      {this.state.propTypes ? this.state.propTypes.map((p, i) => {

        let ptype = p.type;
        if (p.type === 'undefined' || p.type === 'any') {
          if (p.name == 'children' || p.name == 'subheader' || p.name == 'cardTitleElement')
            ptype = 'node';
          else if (p.name == 'columns' || p.name == 'dataSource')
            ptype = 'array';
          else {
            if (typeof (this.state.defaultProps[p.name]) == typeof (true))
              ptype = 'bool';
            else if (typeof (this.state.defaultProps[p.name]) == typeof (1))
              ptype = 'number';
            else
              ptype = 'string';
          }
        }

        if (ptype === 'string') {
          return <BInput key={i} context={context}
            floatingLabelText={p.name}
            value={this.state.viewProps[p.name]}
            onChange={(e, v) => {
              let viewProps = this.state.viewProps;
              viewProps[p.name] = v;
              this.onPropsChanged(viewProps);
            }}
          />;
        } else if (ptype === 'number') {
          return <BInputNumeric key={i} context={context}
            floatingLabelText={p.name}
            value={this.state.viewProps[p.name]}
            onChange={(e, v) => {
              let viewProps = this.state.viewProps;
              viewProps[p.name] = v;
              this.onPropsChanged(viewProps);
            }}
          />;
        } else if (ptype === 'bool') {
          return <BToggle key={i}
            context={context}
            label={p.name}
            defaultToggled={this.state.viewProps[p.name]}
            onToggle={() => {
              let viewProps = this.state.viewProps;
              viewProps[p.name] = !viewProps[p.name];
              this.onPropsChanged(viewProps);
            }}
          />;
        } else if (ptype === 'node') {
          return <BComponentChooser key={i}
            context={context}
            floatingLabelText={p.name + ' (node)'}
            dialogTitle={this.state.displayName + '.' + p.name}
            selectedItems={this.state.viewProps[p.name]}
            onComponentSelect={(Selected) => this.onComponentSelect(Selected, p.name)}
          />;
        } else if (ptype === 'element') {
          return <BComponentChooser key={i}
            context={context}
            floatingLabelText={p.name + ' (element)'}
            dialogTitle={this.state.displayName + '.' + p.name}
            selectedItems={this.state.viewProps[p.name]}
            isSingleElement={true}
            onComponentSelect={(Selected) => this.onComponentSelect(Selected, p.name)}
          />;
        } else if (ptype === 'array' && p.name == 'dataSource') {
          let columns = [];
          let dataSource = [];
          let viewProps = this.state.viewProps;

          if (p.name == 'columns') { // burası çalışmıyor şuan
            columns = [
              {
                key: 'key',
                name: 'key',
                editable: true,
              },
              {
                key: 'name',
                name: 'name',
                editable: true,
              },
              {
                key: 'type',
                name: 'Type',
                editable: true,
              },
              {
                key: 'editable',
                name: 'editable',
                type: 'bool',
                editable: true,
              },
              {
                key: 'width',
                name: 'width',
                type: 'number',
                editable: true,
              },
            ];
            if (viewProps.columns && viewProps.columns.length > 0) {
              dataSource = viewProps.columns;
            }
            else {
              dataSource = [
                { key: 'value', name: 'Value', type: 'number', editable: true, width: 40 },
                { key: 'text', name: 'Text', editable: true, width: 40 }];
              this.columns = dataSource;
              viewProps.columns = this.columns;
              this.onPropsChanged(viewProps);
            }
          }
          else if (p.name == 'dataSource') {
            // if (viewProps.columns && viewProps.columns.length > 0)
            //  columns = viewProps.columns;
            // else
            columns = [
              { key: 'value', name: 'Value', type: 'number', editable: true, width: 40 },
              { key: 'text', name: 'Text', editable: true, width: 40 }];

            if (viewProps.dataSource && viewProps.dataSource.length > 0) {
              dataSource = viewProps.dataSource;
            }
            else {
              dataSource = [
                { value: 1, text: 'Mahmud' }];

              viewProps.columns = columns;
              viewProps.dataSource = dataSource;
              this.onPropsChanged(viewProps);
            }
          }
          let hasValue = dataSource.length > 0;
          let gstyle = !hasValue ? { display: 'inline-block', float: 'right' } : {};
          return <div style={{ paddingBottom: 42 }}>
            <div style={{ fontSize: 14, color: context.theme.boaPalette.base400 }}>{p.name}</div>
            <BGridActionPanel
              key={i}
              style={gstyle}
              context={context}
              showAddButton={true}
              showDeleteButton={true}
              showEditButton={true}
              editable={true}
              editButtonDisabled={!hasValue}
              dontShowGridIfItemNotExists={!hasValue}
              multiSelection={true}
              enableRowSelect={true}
              enableCellSelect={true}
              addButtonText={'Add'}
              showEditButton={false}
              dataSource={dataSource}
              columns={columns}
              onAddClicked={() => this.onAddClicked(p, dataSource, columns)}
              onDeleteClicked={(index) => {
                let source = Object.assign([], dataSource);
                source.splice(index, 1);
                viewProps[p.name] = source;
                this.onPropsChanged(viewProps);
              }}
              onItemUpdated={(index, fieldName, newValue) => {
                let source = Object.assign([], dataSource);
                source[index][fieldName] = newValue;
                viewProps[p.name] = source;
                this.onPropsChanged(viewProps);
              }}
            /></div>;
        }

      }) : this.state.warningMessage ? <div style={{ padding: 16, fontSize: 18 }}> UYARI!
        <span>{this.state.warningMessage}</span>
      </div> : null

      }
    </div>;
  }

  onAddClicked = (p, dataSource, columns) => {
    let source = Object.assign([], dataSource);
    var row = {};
    columns.forEach(item => {
      row[item.key] = item.type === 'number' ? 100 : item.key;
    });
    source.push(row);
    let viewProps = this.state.viewProps;
    viewProps[p.name] = source;

    this.onPropsChanged(viewProps);
  }

  convertType = (value, type) => {
    switch (type) {
      case 'number': {
        if (typeof value === 'number') return value;
        let convertedValue = Number(value);
        if (!convertedValue || isNaN(convertedValue)) convertedValue = this.getDefaultValue(type);
        return convertedValue;
      }
      case 'boolean': {
        if (typeof value === 'boolean') return value;
        let convertedValue = Boolean(value);
        if (!convertedValue || isNaN(convertedValue)) convertedValue = this.getDefaultValue(type);
        return convertedValue;
      }
      case 'string': {
        if (typeof value === 'string') return value;
        let convertedValue = String(value);
        if (!convertedValue || isNaN(convertedValue)) convertedValue = this.getDefaultValue(type);
        return convertedValue;
      }
      default:
        return undefined;
    }
  }

  getDefaultValue = (type) => {
    switch (type) {
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'string':
        return '';
      case 'object':
        return {};
      default:
        return undefined;
    }
  }

  getType = (obj) => {
    return {}.toString
      .call(obj)
      .match(/\s([a-zA-Z]+)/)[1]
      .toLowerCase();
  }


}

export default BComponentPropertiesPanel;
