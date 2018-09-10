import React from 'react';
import Paper from '@material-ui/core/Paper';
import BDropArea from '../drag-drop/area';
import ActionDelete from '@material-ui/icons/Delete';
import { BBusinessComponent } from 'b-business-component';
import { BInput } from 'b-input';
import { BInputAction } from 'b-input-action';
import { BInputNumeric } from 'b-input-numeric';
import { BComboBox } from 'b-combo-box';
import { BToggle } from 'b-toggle';
import { BButton } from 'b-button';
import { BDateTimePicker } from 'b-datetime-picker';
import { BScroll } from 'b-scroll';
import * as BDragDrop from 'b-drag-drop';
import { BIconButton } from 'b-icon-button';
import { BStoredProcedureViewer } from 'b-stored-procedure-viewer';
import { BMessagingComponent } from 'b-messaging-component';
import { BDynamicEventDesigner } from 'b-dynamic-event-designer';
import { BDynamicOpenResourceDesigner } from 'b-dynamic-open-resource-designer';
import { BGridActionPanel } from 'b-grid-action-panel';
import { BDialogHelper } from 'b-dialog-box';
import { BLabel } from 'b-label';
import { BFlexPanel } from 'b-flex-panel';
import { Tabs, Tab } from '@material-ui/core';
import sortBy from 'lodash/sortBy';

var composeDragSource = BDragDrop.composeDragSource;
const componentTabIndex = 0;
const propertiesTabIndex = 1;

class BDragDropMenuItem extends React.PureComponent {
  render() {
    return <div key={this.props.packageName}>{this.props.packageName}</div>;
  }
}

export class BDesignerProperties extends BBusinessComponent {
  constructor(props, context) {
    super(props, context);
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.componentPropertySource = [];
  }

  state = {
    ownerOfSelectedElement: null,
    availableProperties: [],
    currentProperties: [],
    expanded: true,
    showTrash: false,
    menuItems: this.props.menuItems,
    selectedTabIndex: 0
  };

  componentWillMount() {
    this.setTrash();
    if (this.props.snapshot) {
      this.setState({ ...this.props.snapshot });
    }
  }

  showProperties(currentProperties, availableProperties, ownerOfSelectedElement) {
    this.setState({
      currentProperties,
      availableProperties,
      ownerOfSelectedElement,
      selectedTabIndex: propertiesTabIndex
    });
  }

  updateProperties(currentProperties, ownerOfSelectedElement) {
    let currentProps = Object.assign({}, currentProperties);
    this.setState({
      currentProperties: currentProps,
      ownerOfSelectedElement,
      selectedTabIndex: propertiesTabIndex
    });
  }

  cleanProperties() {
    this.setState({
      currentProperties: [],
      availableProperties: [],
      ownerOfSelectedElement: null,
      selectedTabIndex: componentTabIndex
    });
  }

  getAvailableProperties() {
    return this.state.availableProperties;
  }

  setAvailableComponents(values) {
    this.availableComponents = Object.assign([], values);
  }

  showTrash() {
    this.setState({ showTrash: true });
  }

  hideTrash() {
    this.setState({ showTrash: false });
  }

  setTrash() {
    const properties = {
      key: 'trash',
      context: this.props.context,
      onDrop: this.props.onDropToTrash,
      isTrash: true,
      hoverColor: 'crimson',
      canDrop: (props, monitor) => {
        if (!monitor.getItem().owner && monitor.getItem().className !== 'BCard') return false;
        return true;
      }
    };
    const area = (
      <div>
        <ActionDelete />
      </div>
    );
    this.trash = React.createElement(BDropArea, Object.assign({}, properties), area);
  }

  handleOnTabChange = (event, value) => {
    this.setState({ selectedTabIndex: value });
  };

  onMenuItemFiltered(event, value) {
    if (value && value.length > 2) {
      let menuItems = this.props.menuItems.filter(item => {
        return item.packageName.includes(value);
      });
      this.setState({ menuItems });
    } else {
      this.setState({ menuItems: this.props.menuItems });
    }
  }

  onPropertyChanged(property, value) {
    this.props.onPropertyChanged(property, value);
  }

  eventDataChanged(property, value) {
    this.props.onPropertyChanged(property, value);
  }

  getBDateTimePicker(property, value) {
    return (
      <BDateTimePicker
        context={this.props.context}
        mode="portrait"
        type="text"
        format="DDMMYYYY hmmss"
        value={value}
        floatingLabelTextDate={property.name}
        floatingLabelTextTime={property.name}
        onChange={(e, v) => this.onPropertyChanged(property.name, v)}
      />
    );
  }

  getBInput(property, value) {
    return (
      <BInput
        context={this.props.context}
        type="text"
        value={value}
        floatingLabelText={property.name}
        hintText={property.name}
        onChange={(e, v) => this.onPropertyChanged(property.name, v)}
      />
    );
  }

  getBMessagingComponent(property, value) {
    return (
      <BMessagingComponent
        context={this.props.context}
        selectedCode={value}
        floatingLabelText={property.name}
        hintText={property.name}
        onChange={v => this.onPropertyChanged(property.name, v)}
      />
    );
  }

  getBInputNumeric(property, value) {
    return (
      <BInputNumeric
        context={this.props.context}
        value={value}
        floatingLabelText={property.name}
        hintText={property.name}
        onChange={(e, v) => this.onPropertyChanged(property.name, Number(v))}
      />
    );
  }

  getBToggle(property, value) {
    return (
      <BToggle
        context={this.props.context}
        label={property.label ? property.label : property.name}
        labelPosition="left"
        defaultToggled={value}
        toggled={value}
        onToggle={(event, isInputChecked) => this.onPropertyChanged(property.name, isInputChecked)}
      />
    );
  }

  getBStoredProcedureViewer(property, value) {
    return (
      <BStoredProcedureViewer
        context={this.props.context}
        onChange={data => this.onPropertyChanged(property.name, data)}
        availableValues={this.availableComponents}
        selectedSp={value}
      />
    );
  }

  getType(obj) {
    return {}.toString
      .call(obj)
      .match(/\s([a-zA-Z]+)/)[1]
      .toLowerCase();
  }

  getBGridActionPanel(property, dataSource, columns) {
    if (!dataSource) {
      return null;
    }

    let hasValue = dataSource.length > 0;
    let gstyle = !hasValue ? { display: 'inline-block', float: 'right' } : {};
    return (
      <div
        style={{ overflow: 'hidden', borderBottom: '1px dotted #bdbdbd', marginBottom: '15px', paddingBottom: '5px', paddingTop: '5px' }}
      >
        <label style={{ color: 'gray', fontSize: '13pt' }}>{property.name}</label>
        <BGridActionPanel
          style={gstyle}
          context={this.props.context}
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
          onAddClicked={() => {
            let source = Object.assign([], dataSource);
            var row = {};
            columns.forEach(item => {
              row[item.key] = item.type === 'number' ? 100 : item.key;
            });
            source.push(row);
            this.onPropertyChanged(property.name, source);
          }}
          onDeleteClicked={(index) => {
            let source = Object.assign([], dataSource);
            source.splice(index, 1);
            this.onPropertyChanged(property.name, source);
          }}
          onItemUpdated={(index, fieldName, newValue) => {
            let source = Object.assign([], dataSource);
            if (source && source.length > 0) {
              source[index][fieldName] = this.convertType(newValue, this.getType(newValue));
            }
            this.onPropertyChanged(property.name, source);
          }}
        />
      </div>
    );
  }

  getBArray(property, dataSource) {
    if (property.arrayOf) {
      let columns = [
        {
          key: 'value',
          name: property.column,
          type: property.arrayOf,
          editable: true
        }
      ];
      let gridValue = [];
      if (dataSource) {
        dataSource.forEach(item => {
          gridValue.push({ value: item });
        });
      }

      return this.getBGridActionPanel(property, dataSource, columns);
    } else {
      return this.getBGridActionPanel(property, dataSource, property.dataGridKeys);
    }
  }

  getBFunction(property, value) {
    return (
      <BFlexPanel direction="horizontal" context={this.props.context}>
        <BIconButton
          key="Add"
          label
          context={this.props.context}
          style={{ marginLeft: -10 }}
          dynamicIcon="AddBox"
          // iconProperties={{ color: this.props.context.theme.actionButton.iconColor }}
          iconProperties={{ color: this.props.context.theme.boaPalette.pri500 }}
          onClick={() => {
            if (!value || value === 'undefined') {
              value = {
                name: 'onDynamicChange',
                itemKey: 'resource',
                interactions: []
              };
            }
            value.name = property.name;
            let eventDesigner = (
              <BDynamicEventDesigner
                context={this.props.context}
                eventData={value}
                componentPropertySource={this.componentPropertySource}
                onEventDataChanged={this.eventDataChanged.bind(this, property.name)}
              />
            );
            let dialogStyle = { width: 950, height: '75%' };
            BDialogHelper.show(
              this.props.context,
              eventDesigner,
              0,
              0,
              'Konu',
              () => {
                this.props.onPropertyChanged('updateProperties', 'updateProperties');
              },
              dialogStyle
            );
          }}
        />
        {value &&
          value.interactions &&
          value.interactions.length && (
            <div>
              <BLabel
                context={this.props.context}
                text={property.name}
                style={{
                  color: this.props.context.theme.boaPalette.pri500,
                  display: 'flex',
                  fontSize: '16px',
                  'margin-bottom': '4px',
                  'margin-top': '14px'
                }}
              />
              <BLabel
                context={this.props.context}
                text={(!value ? '0' : value.interactions.length.toString()) + ' iterasyon'}
                style={{
                  color: this.props.context.theme.boaPalette.base300,
                  display: 'flex',
                  fontSize: '12px'
                }}
              />
            </div>
          )}
      </BFlexPanel>
    );
  }

  getBButtonOpenScreen(property, value) {
    return (
      <BFlexPanel direction="horizontal" context={this.props.context}>
        <BIconButton
          key="Add"
          context={this.props.context}
          style={{ marginLeft: -10 }}
          dynamicIcon="AddBox"
          // iconProperties={{ color: this.props.context.theme.actionButton.iconColor }}
          iconProperties={{ color: this.props.context.theme.boaPalette.pri500 }}
          onClick={() => {
            let resourceId = null;
            if (value) {
              resourceId = value.resourceId;
              value.name = property.name;
            }
            let eventDesigner = (
              <div>
                {
                  <BDynamicOpenResourceDesigner
                    context={this.props.context}
                    value={resourceId}
                    onResourceDataChanged={(resourceId, resourceData) => {
                      this.props.onPropertyChanged('buttonOpenScreen', {
                        resourceId: resourceId,
                        resourceData: resourceData
                      });
                    }}
                  />
                }
              </div>
            );
            let dialogStyle = { width: '75%', height: '75%' };
            BDialogHelper.show(this.props.context, eventDesigner, 0, 0, 'Konu', null, dialogStyle);
          }}
        />
        <div>
          <BLabel
            context={this.props.context}
            text={property.name}
            style={{
              color: this.props.context.theme.boaPalette.pri500,
              display: 'flex',
              fontSize: '16px',
              'margin-bottom': '4px',
              'margin-top': '14px'
            }}
          />
        </div>
      </BFlexPanel>
    );
  }

  getComponent(property, value) {
    if (property.availableValues && Array.isArray(property.availableValues) && property.availableValues.length > 0) {
      let items = [];
      property.availableValues.forEach(value => {
        items.push({ text: String(value), value: value });
      });

      let columns = [{ key: 'value', name: 'value' }];

      return (
        <BComboBox
          context={this.props.context}
          dataSource={items}
          columns={columns}
          labelText={property.name}
          multiSelect={false}
          multiColumn={false}
          hintText={property.name}
          value={[value]}
          displayMemberPath="text"
          valueMemberPath="value"
          onSelect={(selectedIndexes, selectedItems, selectedValues) => this.onPropertyChanged(property.name, selectedValues[0])}
          isAllOptionIncluded={false}
        />
      );
    }

    switch (property.type) {
      case 'date':
        return this.getBDateTimePicker(property, value);
      case 'string':
        return this.getBInput(property, value);
      case 'messaging':
        return this.getBMessagingComponent(property, value);
      case 'number':
        return this.getBInputNumeric(property, value);
      case 'boolean':
        return this.getBToggle(property, value);
      case 'array':
        return this.getBArray(property, value);
      case 'dataSource':
        return this.getBStoredProcedureViewer(property, value);
      case 'function':
        return this.getBFunction(property, value);
      case 'buttonOpenScreen':
        return this.getBButtonOpenScreen(property, value);
      default:
        return this.getBInput(property, value);
    }
  }

  convertType(value, type) {
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

  getDefaultValue(type) {
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

  onHeaderClick() {
    this.changeExpanded(!this.state.expanded);
  }

  changeExpanded(expanded) {
    if (this.state.expanded != expanded) {
      this.setState({ expanded }, () => {
        this.props.onExpandChange && this.props.onExpandChange(expanded);
      });
    }
  }

  generateProperties(menuItem) {
    const { packageName, className, properties } = menuItem;
    const context = this.props.context;
    let props = { packageName, className, context };
    properties.forEach(property => {
      props[property.name] = property.default;
      if (property.type === 'array') {
        if (!property.default) props[property.name] = [];
        if (property.default === 'undefined') props[property.name] = undefined;
      }
    });
    return props;
  }

  getProperties(className) {
    let Bcard = {
      packageName: 'b-card',
      className: 'BCard',
      properties: [
        {
          name: 'isTitleVisible',
          type: 'boolean',
          default: true
        },
        {
          name: 'itemKey',
          type: 'string',
          default: null
        },
        {
          name: 'size',
          type: 'number',
          default: 3,
          availableValues: [1, 2, 3]
        },
        {
          name: 'title',
          type: 'string',
          default: null
        }
      ],
      value: ['value']
    };

    if (className === Bcard.className) return Bcard.properties;

    let menuItem = this.props.menuItems.find(x => x.className === className);
    if (menuItem) {
      return menuItem.properties;
    }
    return null;
  }

  getValues(className) {
    let menuItem = this.props.menuItems.find(x => x.className === className);
    if (menuItem) {
      return menuItem.value;
    }
    return null;
  }

  updateComponentPropertySource(componentProperty) {
    this.componentPropertySource = componentProperty;
  }

  render() {
    const style = {
      scrollStyle: { padding: '24px', wordWrap: 'break-word' },
      menuItem: { paddingBottom: '12px', wordWrap: 'break-word' },
      menuItemDivider: { marginLeft: '0', marginRight: '0', marginTop: '6px', marginBottom: '18px' },
      criteriaPanel: { width: this.state.expanded ? '100%' : 0 },
      buttonStyle: { height: 40, minWidth: '100%', textAlign: 'start' },
      buttonTextStyle: {
        color: this.props.context.theme.boaPalette.base400,
        fontWeight: 'normal',
        fontSize: 16,
        display: this.state.expanded ? 'initial' : 'none',
        textTransform: 'capitalize'
      }
    };

    const iconProperties = {
      // color: this.props.context.theme.criteriaHeader.textColor,
      color: this.props.context.theme.boaPalette.base400,
      style: {
        marginLeft: this.state.expanded ? 24 : 12,
        transition: 'margin-left 250ms'
      }
    };

    const currentProperties = this.state.currentProperties;

    let lastMenuItems = sortBy(this.state.menuItems, 'packageName');
    const componentItems = lastMenuItems.map((item, index) => {
      const key = `MenuItem${index}`;
      const MenuItem = composeDragSource(BDragDropMenuItem);
      const props = this.generateProperties(item);
      return (
        <div key={key} style={style.menuItem}>
          <MenuItem {...props} />
        </div>
      );
    });

    const propertiesContent =
      this.state.availableProperties.length > 0 ? (
        this.state.availableProperties.map((property, index) => {
          if (!property.hidden) {
            let value = Object.keys(currentProperties).find(x => x === property.name);
            if (value) {
              value = currentProperties[value];
            } else if (property.default) {
              value = property.default;
            }
            const propertKey = `${this.state.ownerOfSelectedElement}${currentProperties.className}${property.name}${index}`;
            return <div key={propertKey}>{this.getComponent(property, value)}</div>;
          }
        })
      ) : (
        <label>{this.getMessage('DynamicFormGenerator', 'ThereIsNoSelectedComponent')}</label>
      );

    // this.getMessage('DynamicFormGenerator', 'Components')
    return (
      <Paper>
        <BButton
          context={this.props.context}
          type="flat"
          fullWidth={true}
          dynamicIcon={'FilterList'}
          iconProperties={iconProperties}
          textStyle={style.buttonTextStyle}
          text={this.getMessage('BOAOne', 'ComponentPanel')}
          onClick={this.onHeaderClick}
          backgroundColor={this.props.context.theme.boaPalette.base150}
          style={style.buttonStyle}
        />

        <div style={{ display: 'block', textAlign: 'center', height: this.state.showTrash ? 30 : 0 }}>
          {this.state.showTrash && this.trash}
        </div>

        <div style={style.criteriaPanel}>
          <Tabs value={this.state.selectedTabIndex} onChange={this.handleOnTabChange} indicatorColor="primary" textColor="primary">
            <Tab label="Components" />
            <Tab label="Properties" />
          </Tabs>

          {this.state.selectedTabIndex === componentTabIndex && (
            <BScroll context={this.props.context} option={{ suppressScrollX: true }} style={style.scrollStyle}>
              <BInputAction
                ref={r => (this.bInputAction = r)}
                onChange={this.onMenuItemFiltered.bind(this)}
                context={this.props.context}
                hintText="Search"
                rightIconList={[{ dynamicIcon: 'Search', disabled: true, iconProperties: { color: '#1976D2' } }]}
              />
              <div>{componentItems}</div>
            </BScroll>
          )}

          {this.state.selectedTabIndex === propertiesTabIndex && (
            <BScroll context={this.props.context} option={{ suppressScrollX: true }} style={style.scrollStyle}>
              <div>{propertiesContent}</div>
            </BScroll>
          )}
        </div>
      </Paper>
    );
  }
}
export default BDesignerProperties;
