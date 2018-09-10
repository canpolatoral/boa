import React from 'react'; import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import SelectField from './SelectField';

import { BComponent, BComponentComposer } from 'b-component';
import { BCheckBox } from 'b-check-box';
import { BInput } from 'b-input';

@BComponentComposer
export class BComboBox extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    style: PropTypes.object,
    defaultValue: PropTypes.arrayOf(PropTypes.any),
    value: PropTypes.arrayOf(PropTypes.any),
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    name: PropTypes.string,
    hintText: PropTypes.string,
    labelText: PropTypes.string,
    multiSelect: PropTypes.bool,
    multiColumn: PropTypes.bool,
    disableSearch: PropTypes.bool,
    displayMemberPath: PropTypes.string,
    valueMemberPath: PropTypes.string,
    displayLabelMemberPath: PropTypes.arrayOf(PropTypes.string),
    displayLabelSeperator: PropTypes.string,
    isAllOptionIncluded: PropTypes.bool,
    allOptionText: PropTypes.string,
    allOptionValue: PropTypes.any,
    fullWidth: PropTypes.bool,
    errorText: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string,
      width: PropTypes.number,
      resizable: PropTypes.bool,
      locked: PropTypes.bool,
      editable: PropTypes.bool,
      formatter: PropTypes.object
    })),
    dataSource: PropTypes.array.isRequired,
    autocompleteFilter: PropTypes.func,
    displaySelectionsRenderer: PropTypes.func,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    onCheck: PropTypes.func,
    showCheckBox: PropTypes.bool,
    isCheckBoxChecked: PropTypes.bool,
    inputOnBlur: PropTypes.func,
    inputValue: PropTypes.string,
    inlineGridMode:PropTypes.bool
  };


  static defaultProps = {
    ...BComponent.defaultProps,
    defaultValue: [],
    labelText: 'Label Text',
    multiSelect: false,
    multiColumn: false,
    disableSearch: false,
    autoComplete: false,
    displayMemberPath: 'text',
    valueMemberPath: 'value',
    isAllOptionIncluded: false,
    allOptionValue: -1,
    allOptionText: 'Hepsi',
    fullWidth: true,
    value: [],
    showCheckBox: false,
    isCheckBoxChecked: false,
    inlineGridMode:false
  };

  // Constructor
  constructor(props, context) {
    super(props, context);
    this.state = {
      dataSource: this.props.dataSource,
      disabled: this.props.disabled,
      showCheckBox: this.props.showCheckBox,
      isCheckBoxChecked: this.props.isCheckBoxChecked,
      inputValue: this.props.inputValue ? this.props.inputValue : '',
      comboBoxValue: this.props.value,
      checkBoxDivHeight: '30px'
    };


    let value=this.props.valueMemberPath;
    let display=this.props.displayMemberPath;

    var AllOptionDescription = {};
    if (display == value) {
      AllOptionDescription[display] = this.props.allOptionText;
    } else {
      AllOptionDescription[display] = this.props.allOptionText;
      AllOptionDescription[value] = this.props.allOptionValue;
    }

    // eğer herhangi bir çağrıda datasource undefined set edilmişse component patlamasın
    if (this.state.dataSource)
    {
      while (this.props.isAllOptionIncluded) {
        if (this.state.dataSource.length > 0) {
          if (this.state.dataSource[0][value] == AllOptionDescription[value]) {
            this.props.dataSource.splice(0, 1);
          }
          else { break; }
        }
        else { break; }
      }
      if (this.state.dataSource.length > 0 && this.props.isAllOptionIncluded) {
        this.state.dataSource.unshift(AllOptionDescription);
      }

      if (this.state.dataSource && this.state.dataSource.length > 0) {
        for (let i = 0; i < this.state.dataSource.length; i++) {
          this.state.dataSource[i].bComboboxIndex = i;
        }
      }
    }

    this.onSelect = this.onSelect.bind(this);
    this.onClose  = this.onClose.bind(this);

    this.checkBoxChecked = this.checkBoxChecked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCheckBoxChecked !== this.props.isCheckBoxChecked ||
      nextProps.inputValue !== this.props.inputValue ||
      nextProps.disabled !== this.props.disabled ||
      nextProps.dataSource != this.props.dataSource ||
      nextProps.value != this.props.value) {
      if (this.props.dataSource != nextProps.dataSource ||
        nextProps.value != this.props.value) {
        let newDataSource = nextProps.dataSource;
        if (newDataSource && newDataSource.length > 0) {
          for (let i = 0; i < newDataSource.length; i++) {
            newDataSource[i].bComboboxIndex = i;
          }
        }

        this.setState({ dataSource: newDataSource, value: nextProps.value }); this.setState({ dataSource: newDataSource, value: nextProps.value });
      }
      if (nextProps.isCheckBoxChecked !== this.props.isCheckBoxChecked ||
        nextProps.inputValue !== this.props.inputValue ||
        nextProps.disabled !== this.props.disabled) {
        this.setState({
          isCheckBoxChecked: nextProps.isCheckBoxChecked,
          inputValue: nextProps.inputValue,
          disabled: nextProps.disabled
        });
      }
    }
  }

  componentDidMount() {
    if (this.state.showCheckBox && this.divContent) {
      this.setCheckBoxHeight(ReactDOM.findDOMNode(this.divContent).offsetHeight + 'px');
    }
  }

  componentDidUpdate() {
    if (this.state.showCheckBox && this.divContent) {
      this.setCheckBoxHeight(ReactDOM.findDOMNode(this.divContent).offsetHeight + 'px');
    }
  }

  // To get selected value(s) of the component as array.
  getValue() {
    if (this.state.showCheckBox && this.state.isCheckBoxChecked) {
      return { isCheckBoxChecked: this.state.isCheckBoxChecked, value: this.input ? this.input.getInstance().getValue():null };
    }
    else {
      var values = this.selectField ? this.selectField.getValue():null;
      // Arrayin kendisini degil bir kopyasini donelim. Aksi durumda disarida array uzerinde yapilan değişiklikler
      // burayi da etkilemekte
      if (Array.isArray(values)) {
        values = values.slice();
      }
      var allProps = this.selectField ? this.selectField.getSelectedItems():null;
      return { isCheckBoxChecked: false, value: values, allProps: allProps };
    }
  }

  resetValue() {
    if (this.state.showCheckBox) {
      this.input && this.input.getInstance().resetValue();
      this.selectField && this.selectField.resetValue(this.props.defaultValue);
      this.setState({ inputValue: '', value: null });
    }
    else {
      this.selectField && this.selectField.resetValue(this.props.defaultValue);
      this.setState({ inputValue: '', value: null });
    }
    this.setState({ showCheckBox: this.props.showCheckBox, isCheckBoxChecked: this.props.isCheckBoxChecked });
  }

  setDisable(value) {
    let inputValue, comboBoxValue;
    if (this.state.isCheckBoxChecked) {
      inputValue = this.input ? this.input.getInstance().getValue() : null;
      this.setState({ inputValue: inputValue });
    }
    else {
      comboBoxValue = this.selectField ? this.selectField.getValue():null;
      this.setState({ value: comboBoxValue });
    }
    this.setState({ disabled: value });
  }

  getSnapshot() {
    let snapshot = {};
    snapshot.state = this.state;
    if (this.state.showCheckBox) {
      snapshot.checkBox = this.checkBox ? this.checkBox.getSnapshot() : null;
    }
    if (this.state.showCheckBox && this.state.isCheckBoxChecked) {
      snapshot.input = this.input ? this.input.getInstance().getSnapshot() : null;
    }
    else {
      snapshot.comboBox = this.selectField ? this.selectField.getSnapshot() : null;
    }
    return snapshot;
  }

  setSnapshot(snapshot) {

    this.setState({ ...snapshot.state }, ()=>{
      if (snapshot.state.showCheckBox) {
        this.checkBox && snapshot.checkBox && this.checkBox.setSnapshot(snapshot.checkBox);
      }
      if (snapshot.state.showCheckBox && snapshot.state.isCheckBoxChecked) {
        this.input && snapshot.input && this.input.getInstance().setSnapshot(snapshot.input);
      }
      else {
        this.selectField && snapshot.comboBox && this.selectField.setSnapshot(snapshot.comboBox);
      }
    });
  }

  getSelectedItems() {
    if (this.state.showCheckBox && this.state.isCheckBoxChecked) {
      return null;
    }
    else {
      return this.selectField ? this.selectField.getSelectedItems():null;
    }
  }

  checkBoxChecked(event, value) {
    let inputValue, comboBoxValue;
    if (this.state.isCheckBoxChecked) {
      inputValue = this.input ? this.input.getInstance().getValue():null;
      this.setState({ isCheckBoxChecked: value, inputValue: inputValue });
    }
    else {
      comboBoxValue = this.selectField ? this.selectField.getValue() : null;
      this.setState({ isCheckBoxChecked: value, value: comboBoxValue });
    }
    if (this.props.onCheck) {
      this.props.onCheck(event, value);
    }
  }

  setCheckBoxHeight(newHeight) {
    if (newHeight != this.state.checkBoxDivHeight)
      this.setState({ checkBoxDivHeight: newHeight });
  }

  onSelect(selectedIndex, selectedItems, selectedItem) {
    this.props.onSelect && this.props.onSelect(selectedIndex, selectedItems, selectedItem);
    var componentInfo = { name: this.props.snapKey, event: 'select' };
    this.props.onDynamicChange && this.props.onDynamicChange(componentInfo);
  }

  onClose() {
    this.props.onClose && this.props.onClose();

  }

  validateConstraint() {
    return (this.state.showCheckBox && this.state.isCheckBoxChecked) ?
      (this.input ? this.input.getInstance().validateConstraint() : true) :
      (this.selectField ? this.selectField.validateConstraint() : true);
  }

  render() {

    let valueMemberPath=this.props.valueMemberPath;
    let displayMemberPath=this.props.displayMemberPath;
    let multiColumn=this.props.multiColumn;

    // multiColumn belirtilmiş ama single column görüntüleniyorsa...
    if (this.props.multiColumn && this.props.columns && this.props.columns.length>0) {
      var visibleColumns=this.props.columns.filter((element)=>{return element.hidden!=true;});
      if (visibleColumns && visibleColumns.length==1) {
        multiColumn=false;
      }
    }

    let _BComboBox, _BInput, _BCheckBox;
    if (!this.state.showCheckBox || this.state.showCheckBox && !this.state.isCheckBoxChecked) {
      // Control value
      var newValue = [];
      if (this.props.value != null) {
        var finalValue = !this.props.value || !Array.isArray(this.props.value) ? [] : (this.state.value ? this.state.value : this.props.value);
        // finalValue = this.props.value.length == 0 && Array.isArray(this.props.defaultValue.length) ? this.props.defaultValue : finalValue;
        if (this.props.value.length == 0 && this.props.defaultValue) {
          if (Array.isArray(this.props.defaultValue)) {
            finalValue = this.props.defaultValue;
          }
          else {
            finalValue = [this.props.defaultValue];
          }
        }
        // If multiSelect is false, value must have 1 value. Otherwise, multiple values will be selected.
        newValue = this.props.multiSelect ? finalValue : (!Array.isArray(finalValue) || finalValue.length == 0 ? finalValue : [finalValue[0]]);
      }
      _BComboBox =
        <SelectField
          context={this.props.context}
          ref={r => this.selectField = r}
          key={'BComboBox'}
          disabled={this.state.disabled}
          valueConstraint={this.props.valueConstraint}
          name={this.props.name}
          multiSelect={this.props.multiSelect}
          multiColumn={multiColumn}
          columns={this.props.columns}
          dataSource={this.state.dataSource}
          hintText={this.props.hintText}
          labelText={this.props.labelText}
          floatingLabelStyle={this.props.floatingLabelStyle}
          onSelect={this.onSelect}
          onClose={this.onClose}
          errorText={this.props.errorText}
          style={this.props.style}
          disableSearch={this.props.disableSearch}
          displaySelectionsRenderer={this.props.displaySelectionsRenderer}
          autocompleteFilter={this.props.autocompleteFilter}
          value={newValue}
          text={this.props.text}
          fullWidth={this.props.fullWidth}
          displayMemberPath={displayMemberPath}
          valueMemberPath={valueMemberPath}
          displayLabelSeperator={this.props.displayLabelSeperator}
          displayLabelMemberPath={this.props.displayLabelMemberPath}
          inlineGridMode={this.props.inlineGridMode}
          />;
    }
    else {
      _BInput =
        <BInput
          context={this.props.context}
          ref={r => this.input = r}
          key={'BInput'}
          hintText={this.props.hintText}
          floatingLabelText={this.props.labelText}
          value={this.state.inputValue}
          onBlur={this.props.inputOnBlur}
          disabled={this.state.disabled}
          inlineGridMode={this.props.inlineGridMode}/>;
    }
    if (this.state.showCheckBox) {
      let inputStyle = { alignSelf:'center'  };
      _BCheckBox =
        <BCheckBox
          context={this.props.context}
          ref={r => this.checkBox = r}
          key={'BCheckBox'}
          defaultChecked={this.state.isCheckBoxChecked}
          onCheck={this.checkBoxChecked}
          style={inputStyle}
          disabled={this.state.disabled} />;
      return (
        <div style={{ width: '100%', float: 'none', display: 'inline-block' }}>
          <div ref={r => this.divContent = r} style={{ width: 'calc(100% - 29px)', float: 'left', display: 'inline-block' }}>
            {this.state.isCheckBoxChecked ?
              _BInput
              :
              _BComboBox
            }
          </div>
          <div ref={r => this.divCheckBox = r} style={{ width: '29px', height: this.state.checkBoxDivHeight, display: 'flex', alignItems: 'flex-end', verticalAlign: 'middle' }}>
            {_BCheckBox}
          </div>
        </div>
      );
    }
    else {
      return (

          _BComboBox
      );
    }
  }
}

export default BComboBox;
