import React from 'react';

import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

import ReactJson from 'react-json-view';

import { Input } from '@boa/components/Input';
import { InputNumeric } from '@boa/components/InputNumeric';
import { Toggle } from '@boa/components/Toggle';
import { Scroll } from '@boa/components/Scroll';

import { ComponentBase } from '@boa/base';

const style = {
  scrollStyle: { maxHeight: 300, padding: '24px', wordWrap: 'break-word' },
  menuItem: { paddingBottom: '12px', wordWrap: 'break-word' },
  menuItemDivider: { marginLeft: '0', marginRight: '0', marginTop: '6px', marginBottom: '18px' },
  buttonStyle: { height: 40, minWidth: '100%', textAlign: 'left' }
};

const themeItems = [
  { title: 'KT-Green', value: 'kt-green', color: '#006754' },
  { title: 'Violet', value: 'violet', color: '#B618CE' },
  { title: 'Winter', value: 'winter', color: '#1976D2' },
  { title: 'Spring', value: 'spring', color: '#3F51B5' },
  { title: 'Summer', value: 'summer', color: '#D11919' },
  { title: 'Night', value: 'night', color: '#3F51B5' },
];

const languageItems = [
  { title: 'Türkçe', value: 1 },
  { title: 'English', value: 2 },
  { title: 'Deutsch', value: 3 },
  { title: 'русский', value: 4 },
  { title: 'العربية', value: 5 }
];

export default class Playground extends ComponentBase {
  constructor(props, context) {
    super(props, context);
    this.componentPropertySource = [];
    this.onPropertyChanged = this.onPropertyChanged.bind(this);
    this.onApplyClick = this.onApplyClick.bind(this);
    this.componentRef = React.createRef();
  }

  state = {
    selectedTheme: 'violet',
    selectedLanguage: 1,
  };

  onPropertyChanged(property, value) {
    this.props.onPropertyChanged(property, value);
  }

  onApplyClick() {
    this.props.onApplyClick();
  }

  getBInput(property, value) {
    return (
      <Input
        context={this.props.context}
        type='text'
        value={value}
        floatingLabelText={property.name}
        hintText={property.name}
        multiLine
        rows={1}
        rowsMax={4}
        onChange={(e, v) => this.onPropertyChanged(property.name, v)}
      />
    );
  }

  getBInputNumeric(property, value) {
    return (
      <InputNumeric
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
      <Toggle
        context={this.props.context}
        label={property.label ? property.label : property.name}
        labelPosition='left'
        defaultToggled={value}
        toggled={value}
        onToggle={(event, isInputChecked) => this.onPropertyChanged(property.name, isInputChecked)}
      />
    );
  }

  getJsonViewer(property, value) {
    const self = this;
    return (
      <div style={{ marginTop: 15 }}>
        <InputLabel htmlFor={property.name}>{property.name}</InputLabel>
        <ReactJson
          src={value}
          style={{ paddingTop: 10, paddingLeft: 10 }}
          defaultValue={value === 'array' ? 'array' : null}
          enableClipboard={false}
          onAdd={() => {
          }}
          onEdit={(src) => {
            self.onPropertyChanged(property.name, src['updated_src']);
          }}
          onDelete={(src) => {
            console.log('delete');
            self.onPropertyChanged(property.name, src['updated_src']);
          }}
        />
      </div>
    );
  }

  // getShape(property, value) {
  //   const self = this;
  //   return (
  //     <FormControl style={{ maxWidth: 300, width: '100%', marginTop: 15 }}>
  //       <InputLabel htmlFor="theme">{property.name}</InputLabel>
  //       <FormControl style={{ maxWidth: 300, width: '100%', marginTop: 15 }}>
  //         {
  //           Object.keys(property.value).map((key) => {
  //             return (
  //               <InputLabel htmlFor={property.name + key}>{key}</InputLabel>
  //             );
  //           })
  //         }
  //       </FormControl>
  //     </FormControl>
  //     // <FormControl style={{ maxWidth: 300, width: '100%' }}>
  //     //   <InputLabel htmlFor="theme">{property.name}</InputLabel>
  //     //   {
  //     //     Object.keys(property.value).map((key) => {
  //     //       return (
  //     //         <div>
  //     //           <InputLabel htmlFor="theme">{key}</InputLabel>
  //     //           <NativeSelect
  //     //             onChange={
  //     //               (event) => {
  //     //                 // self.onPropertyChanged(property.name, event.target.value);
  //     //               }
  //     //             }>
  //     //             {
  //     //               property.value[key].value.map((item) => {
  //     //                 return <option value={item}>{item}</option>;
  //     //               })
  //     //             }
  //     //           </NativeSelect>
  //     //         </div>
  //     //       );
  //     //     })
  //     //   }
  //     // </FormControl>
  //   );
  // }

  getType(obj) {
    return {}.toString
      .call(obj)
      .match(/\s([a-zA-Z]+)/)[1]
      .toLowerCase();
  }

  getComponent(property, value) {
    const self = this;
    if (property.values && property.values.length > 0) {
      return (
        <div>
          <FormControl style={{ maxWidth: 300, width: '100%', marginTop: 15 }}>
            <InputLabel htmlFor="theme">{property.name}</InputLabel>
            <NativeSelect
              onChange={
                (event) => {
                  self.onPropertyChanged(property.name, event.target.value);
                }
              }>
              {
                property.values.map((item) => {
                  return <option value={item}>{item}</option>;
                })
              }
            </NativeSelect>
          </FormControl>
        </div>);
    }
    else if (property.type.toLowerCase().includes('shape')) {
      return this.getShape(property, value);
    }
    else if (property.type.toLowerCase().includes('date')) {
      return this.getBInput(property, value);
    } else if (property.type.toLowerCase().includes('string')) {
      return this.getBInput(property, value);
    } else if (property.type.toLowerCase().includes('number')) {
      return this.getBInputNumeric(property, value);
    } else if (property.type.toLowerCase().includes('bool')) {
      return this.getBToggle(property, value);
    } else if (property.type.toLowerCase().includes('object') || property.type.toLowerCase().includes('array')) {
      return this.getJsonViewer(property, this.getDefaultValue(property.type));
    } else {
      return null;
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
      case 'array': {
        return [];
      }
      default:
        return undefined;
    }
  }

  render() {
    const { availableProperties } = this.props;
    const self = this;

    if (!availableProperties || availableProperties.length == 0) {
      return null;
    }

    return (
      <div style={{ maxWidth: 300, position: 'relative' }}>
        <Paper>
          <div style={style.criteriaPanel}>
            <Scroll context={this.props.context} option={{ suppressScrollX: true }} style={style.scrollStyle} divStyle={style.scrollStyle}>
              <div>
                <FormControl style={{ maxWidth: 300, width: '100%' }}>
                  <InputLabel htmlFor="theme">Theme</InputLabel>
                  <Select
                    value={this.state.selectedTheme}
                    onChange={
                      (event) => {
                        self.setState({
                          selectedTheme: event.target.value
                        });
                        if (self.props.onThemeChange) {
                          self.props.onThemeChange(event.target.value);
                        }
                      }
                    }>
                    {
                      themeItems.map((item) => {
                        return <MenuItem value={item.value}>{item.title}</MenuItem>;
                      })
                    }
                  </Select>
                </FormControl>
                <FormControl style={{ maxWidth: 300, width: '100%', marginTop: 15, marginBottom: 15 }}>
                  <InputLabel htmlFor="lang">Language</InputLabel>
                  <Select
                    value={this.state.selectedLanguage}
                    onChange={
                      (event) => {
                        self.setState({
                          selectedLanguage: event.target.value
                        });
                        if (self.props.onThemeChange) {
                          self.props.onLanguageChange(event.target.value);
                        }
                      }
                    }>
                    {
                      languageItems.map((item) => {
                        return <MenuItem value={item.value}>{item.title}</MenuItem>;
                      })
                    }
                  </Select>
                </FormControl>
                {availableProperties.map((property, index) => {
                  if (!property.hidden && property.type !== 'func') {
                    return <div key={index}>{this.getComponent(property, property.default)}</div>;
                  }
                })}
              </div>
            </Scroll>
          </div>
        </Paper>
      </div>
    );
  }
}
