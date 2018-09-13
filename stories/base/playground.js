import React from 'react';
import Paper from '@material-ui/core/Paper';
import reactElementToJSXString from 'react-element-to-jsx-string';

import { BInput } from 'b-input';
import { BInputNumeric } from 'b-input-numeric';
import { BComboBox } from 'b-combo-box';
import { BToggle } from 'b-toggle';
import { BDateTimePicker } from 'b-datetime-picker';
import { BGridActionPanel } from 'b-grid-action-panel';
import { BDocViewer } from 'b-doc-viewer';
import { BScroll } from 'b-scroll';
import Context from './context';

export default class Playground extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.componentPropertySource = [];
    this.onPropertyChanged = this.onPropertyChanged.bind(this);
  }

  state = {
    availableProperties: [],
    currentProperties: {},
    expanded: true,
    showTrash: false,
    menuItems: this.props.menuItems,
    selectedTabIndex: 0,
    context: Context
  };

  componentWillMount() {
    this.prepareData();
  }

  prepareData() {
    const self = this;
    // if (this.props.component) {
    //   const RenderedComponent = this.props.component;
    //   console.log(RenderedComponent.propTypes);
    //   if (RenderedComponent.propTypes) {
    //     Object.keys(RenderedComponent.propTypes).forEach((key) => {
    //       console.log(key);
    //       const type = RenderedComponent.propTypes[key];
    //       if (type == PropTypes.string) {
    //         console.log(key + ' is a string property');
    //       }

    //     });
    //   }
    // }

    if (this.props.content && this.props.content.length > 0) {
      const availableProperties = this.props.content.find(x => x.name === 'Props');
      if (availableProperties && availableProperties.infoArray) {
        const infoArray = availableProperties.infoArray;
        if (infoArray.length > 0) {
          let currentProperties = {};
          infoArray.forEach((item) => {
            let defaultValue = self.findDefault(item.name);
            if (defaultValue) {
              currentProperties[item.name] = defaultValue;
            }
          });
          this.setState({ availableProperties: infoArray, currentProperties }, () => {
            const code = self.getComponentString();
            this.setState({ code });
          });
        }
      }
    }
  }

  findDefault(propName) {
    if (this.props.defaults && this.props.defaults.length > 0) {
      let defaultProp = this.props.defaults[0];
      if (defaultProp && defaultProp.props && defaultProp.props[propName]) {
        return defaultProp.props[propName];
      }
    }
  }

  getName() {
    if (this.props.content && this.props.content.length > 0) {
      return this.props.content[0].name;
    }
    return 'BComponent';
  }

  onPropertyChanged(property, value) {
    const self = this;
    let currentProperties = Object.assign({}, this.state.currentProperties);
    if (value) {
      currentProperties[property] = value;
    } else {
      delete currentProperties[property];
    }

    this.setState({ currentProperties }, () => {
      const code = self.getComponentString();
      self.setState({ code });
    });
  }

  getBDateTimePicker(property, value) {
    return (
      <BDateTimePicker
        context={this.state.context}
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
        context={this.state.context}
        type="text"
        value={value}
        floatingLabelText={property.name}
        hintText={property.name}
        onChange={(e, v) => this.onPropertyChanged(property.name, v)}
      />
    );
  }

  getBInputNumeric(property, value) {
    return (
      <BInputNumeric
        context={this.state.context}
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
        context={this.state.context}
        label={property.label ? property.label : property.name}
        labelPosition="left"
        defaultToggled={value}
        toggled={value}
        onToggle={(event, isInputChecked) => this.onPropertyChanged(property.name, isInputChecked)}
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
          context={this.state.context}
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

  getComponent(property, value) {
    if (property.availableValues && Array.isArray(property.availableValues) && property.availableValues.length > 0) {
      let items = [];
      property.availableValues.forEach(value => {
        items.push({ text: String(value), value: value });
      });

      let columns = [{ key: 'value', name: 'value' }];

      return (
        <BComboBox
          context={this.state.context}
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

    if (property.type.toLowerCase().includes('date')) {
      return this.getBDateTimePicker(property, value);
    } else if (property.type.toLowerCase().includes('string')) {
      return this.getBInput(property, value);
    } else if (property.type.toLowerCase().includes('number')) {
      return this.BInputNumeric(property, value);
    } else if (property.type.toLowerCase().includes('bool')) {
      return this.getBToggle(property, value);
    } else if (property.type.toLowerCase().includes('array')) {
      return this.getBArray(property, value);
    } else {
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

  render() {
    const { availableProperties } = this.state;

    if (!availableProperties || availableProperties.length == 0) {
      return null;
    }

    const RenderedComponent = this.props.component;

    const style = {
      scrollStyle: { maxHeight: 300, padding: '24px', wordWrap: 'break-word' },
      menuItem: { paddingBottom: '12px', wordWrap: 'break-word' },
      menuItemDivider: { marginLeft: '0', marginRight: '0', marginTop: '6px', marginBottom: '18px' },
      criteriaPanel: { padding: 20, width: this.state.expanded ? '100%' : 0 },
      buttonStyle: { height: 40, minWidth: '100%', textAlign: 'left' },
      buttonTextStyle: {
        color: this.state.context.theme.boaPalette.base400,
        fontWeight: 'normal',
        fontSize: 16,
        display: this.state.expanded ? 'initial' : 'none',
        textTransform: 'capitalize'
      }
    };

    let code = `\`\`\`html \n ${this.state.code} \n \`\`\``;

    const currentProperties = this.state.currentProperties;

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
      ) : (<label>{this.getMessage('DynamicFormGenerator', 'ThereIsNoSelectedComponent')}</label>);

    return (
      <div>
        <BDocViewer content='## Playground' editorType='atomOneLight' />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Paper style={{ maxWidth: 300 }}>
            <div style={style.criteriaPanel}>
              <BScroll context={this.state.context} option={{ suppressScrollX: true }} style={style.scrollStyle}>
                <div>{propertiesContent}</div>
              </BScroll>
            </div>
          </Paper>
          <div style={{ marginLeft: 100 }}>
            <RenderedComponent  {...currentProperties} context={this.state.context}></RenderedComponent>
          </div>
        </div>
        <BDocViewer content={code} editorType='atomOneLight' />
      </div>
    );
  }

  getComponentString() {
    const RenderedComponent = this.props.component;
    return reactElementToJSXString((<RenderedComponent context={this.state.context} {...this.state.currentProperties}></RenderedComponent>), { displayName: this.getName.bind(this), filterProps: ['context', 'maxFontSize', 'minFontSize'] });
  }

  getMessage(group, property) {
    return group + ' ' + property;
  }
}
