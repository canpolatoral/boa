import React from 'react';
import PropTypes from 'prop-types';
import { BBusinessComponent } from 'b-business-component';
import { BComponentComposer } from 'b-component';
import { BComboBox } from 'b-combo-box';
import { BProgress } from 'b-progress';
import sortBy from 'lodash/sortBy';
import remove from 'lodash/remove';
import _ from 'lodash';

export var SortOption;
(function(SortOption) {
  SortOption[(SortOption['Code'] = 1)] = 'Code';
  SortOption[(SortOption['Description'] = 2)] = 'Description';
  SortOption[(SortOption['Value'] = 3)] = 'Value';
  SortOption[(SortOption['None'] = 4)] = 'None';
})(SortOption || (SortOption = {}));

@BComponentComposer
export class BParameterComponent extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    /**
     * The paramType of your component.
     * @type {string}
     */
    paramType: PropTypes.string,
    /**
     * Determines the columns of the parameter component.
     * @type {string}
     */
    paramColumns: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        header: PropTypes.string,
        width: PropTypes.number,
        visible: PropTypes.bool
      })
    ),
    /**
     * Determines the parameter that is currently selected.
     * @type {string}
     */
    selectedParamCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultSelectedParamCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Sort the parameters.
     * @type {String or Number}
     */
    sortOption: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * The collection of paramType.
     * @type {arrayOf string}
     */
    paramTypeList: PropTypes.arrayOf(PropTypes.string),
    /**
     * Filter the parameters by param code
     * @type {string}
     */
    paramCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Filter the parameters by param date
     * @type {string}
     */
    paramDate: PropTypes.string,
    /**
     * Filter the parameters by param value
     * @type {string}
     */
    paramValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Filter the parameters by param value 2
     * @type {string}
     */
    paramValue2Filter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Filter the parameters by param value 3
     * @type {string}
     */
    paramValue3Filter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Filter the parameters by param value 4
     * @type {string}
     */
    paramValue4Filter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Filter the parameters by param value 5
     * @type {string}
     */
    paramValue5Filter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Filter the parameters by param value 6
     * @type {string}
     */
    paramValue6Filter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Filter the parameters by param value 7
     * @type {string}
     */
    paramValue7Filter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * If true an item will push to the first row of the parameter list. Default is value is false.
     * @type {bool}
     */
    isAllOptionIncluded: PropTypes.bool,
    /**
     * If isAllOptionIncluded is true.. Default value is 'Hepsi'
     * @type {string}
     */
    allOptionDescription: PropTypes.string,
    /**
     * If isAllOptionIncluded is true.. Default value is '-1'
     * @type {any}
     */
    allOptionValue: PropTypes.any,
    /**
     * The hint content to display.
     * @type {string}
     */
    hintText: PropTypes.string,
    /**
     * The content of the floating label.
     * @type {string}
     */
    labelText: PropTypes.string,
    /**
     * Display the search input field top of the parameter component.
     * @type {bool}
     */
    disableSearch: PropTypes.bool,
    /**
     * If true, the parameter component will be disabled
     * @type {bool}
     */
    disabled: PropTypes.bool,
    /**
     * Display your chosen column on parameter component. Default column is 'paramDescription'
     * @type {string}
     */
    displayMemberPath: PropTypes.oneOf([
      'paramDescription',
      'paramType',
      'paramCode',
      'paramValue',
      'paramValue2',
      'paramValue3',
      'paramValue4',
      'paramValue5'
    ]),

    /**
     * Callback function fires when the parameter has been selected.
     * @type {func}
     */
    onParameterSelect: PropTypes.func,
    showCheckBox: PropTypes.bool,
    isCheckBoxChecked: PropTypes.bool,
    onCheck: PropTypes.func,
    inputOnBlur: PropTypes.func,
    errorText: PropTypes.string,
    inputValue: PropTypes.string,
    multiColumn: PropTypes.bool,
    inlineGridMode: PropTypes.bool
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    paramType: 'ULKE',
    displayMemberPath: 'paramDescription',
    sortOption: SortOption.Code,
    allOptionValue: -1,
    selectedParamCode: null,
    defaultSelectedParamCode: null,
    showCheckBox: false,
    isCheckBoxChecked: false,
    multiColumn: true,
    inlineGridMode: false
  };

  constructor(props, context) {
    super(props, context);
    this.currentProps = Object.assign({}, this.props);
    this.valueMemberPath = 'paramCode';
    this.nullValue = 'null';

    this.state = {
      selectedParamCode: this.props.selectedParamCode,
      allOptionDescription: this.props.allOptionDescription || this.getMessage('BOA', 'All'),
      fullParameterList: [],
      parameterList: [],
      selectedParameter: null
    };
  }

  loadingIcon = (
    <BProgress
      context={this.props.context}
      size={20}
      progressType={'circular'}
      mode={'indeterminate'}
      style={{
        color: this.props.context.theme.boaPalette.base400,
        position: 'absolute',
        top: '30%',
        right: !this.props.context.localization.isRightToLeft ? '3px' : 'auto'
      }}
    />
  );

  getSnapshot() {
    return {
      state: this.state
    };
  }
  setSnapshot(snapshot) {
    this.setState(snapshot.state);
  }

  /**
   * Invoked immediately before a component is mounted
   */
  componentDidMount() {
    super.componentDidMount();
    this.loadData();
  }

  /**
   * Invoked before a mounted component receives new props
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.currentProps = Object.assign({}, nextProps);

      if (
        nextProps.paramType != this.props.paramType ||
        nextProps.paramTypeList != this.props.paramTypeList ||
        nextProps.paramCode != this.props.paramCode ||
        nextProps.paramValue != this.props.paramValue
      ) {
        this.loadData();
      } else if (
        nextProps.sortOption != this.props.sortOption ||
        nextProps.paramValue2Filter != this.props.paramValue2Filter ||
        nextProps.paramValue3Filter != this.props.paramValue3Filter ||
        nextProps.paramValue4Filter != this.props.paramValue4Filter ||
        nextProps.paramValue5Filter != this.props.paramValue5Filter ||
        nextProps.paramValue6Filter != this.props.paramValue6Filter ||
        nextProps.paramValue7Filter != this.props.paramValue7Filter ||
        nextProps.isAllOptionIncluded != this.props.isAllOptionIncluded
      ) {
        this.setValues(null, this.state.selectedParamCode);
      } else if (nextProps.selectedParamCode != this.state.selectedParamCode) {
        this.setValues(null, nextProps.selectedParamCode);
      } else if (nextProps.defaultSelectedParamCode != this.props.defaultSelectedParamCode) {
        this.setValues(null, nextProps.defaultSelectedParamCode);
      }
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GET_PARAMETER_LIST': {
        this.getParameterList(response);
        break;
      }
      case 'GET_MULTIPLE_PARAMETER_LIST': {
        this.getMultipleParameterList(response);
        break;
      }
      default:
        break;
    }
  }

  getColumns() {
    let defaultColumns = [
      { name: 'paramType', header: this.getMessage('BusinessComponents', 'TypeLabel'), width: 150, visible: false },
      { name: 'paramCode', header: this.getMessage('BusinessComponents', 'CodeLabel2'), width: 130, visible: true },
      { name: 'paramDescription', header: this.getMessage('BusinessComponents', 'Description'), width: 220, visible: true },
      { name: 'paramValue', header: this.getMessage('BusinessComponents', 'Value'), width: 100, visible: true }
    ];

    let paramColumns = this.props.paramColumns || defaultColumns;

    if (paramColumns.findIndex(s => s.name === this.valueMemberPath) == -1) {
      throw new TypeError('Your columns does not contain "' + this.valueMemberPath + '" please define it.');
    }
    if (paramColumns.findIndex(s => s.name === this.props.displayMemberPath) == -1) {
      throw new TypeError('displayMemberPath:"' + this.props.displayMemberPath + '" does not contain in your columns.');
    }

    let columns = [];
    paramColumns.forEach(function(column) {
      let header = column.header,
        visible = column.visible,
        width = column.width;

      if (column.header === undefined) header = column.name;
      if (column.visible == undefined) visible = true;
      if (column.width === undefined) width = 120;

      columns.push({
        key: column.name,
        name: header,
        width: visible == true ? width : 1,
        hidden: visible == false ? true : false,
        resizable: true
      });
    }, this);

    return columns;
  }

  getAllOptionItemInstance() {
    let props = this.currentProps;
    let value = props.allOptionValue;
    if (value === null || value === undefined) value = this.nullValue;

    let item = {
      [this.valueMemberPath]: String(value),
      [props.displayMemberPath]: this.state.allOptionDescription,
      isAllOptionValue: true
    };
    return item;
  }

  isAllOptionExists(parameterList) {
    if (parameterList && parameterList.length > 0) {
      let all = this.getAllOptionItemInstance();
      let i = parameterList.findIndex(s => s[this.valueMemberPath] == all[this.valueMemberPath]);
      return {
        isExists: i == -1 ? false : true,
        index: i
      };
    }
    return { isExists: false, index: -1 };
  }

  getSortedValues(paramList) {
    let sortOption = this.currentProps.sortOption;
    let newList = [];
    switch (sortOption) {
      case SortOption.Code:
        newList = sortBy(paramList, 'paramCode');
        break;
      case SortOption.Description:
        newList = sortBy(paramList, 'paramDescription');
        break;
      case SortOption.Value:
        newList = sortBy(paramList, 'paramValue');
        break;
      default:
        newList = paramList;
        break;
    }
    return newList;
  }

  filterByProps(parameterList) {
    let props = this.currentProps;
    parameterList = parameterList || [];

    if (props.paramValue && parameterList) {
      let m = props.paramValue;
      parameterList = remove(parameterList, function(parameter) {
        return parameter.paramValue == m;
      });
    }
    if (props.paramValue2Filter && parameterList) {
      let m = props.paramValue2Filter;
      parameterList = remove(parameterList, function(parameter) {
        return parameter.paramValue2 == m;
      });
    }
    if (props.paramValue3Filter && parameterList) {
      let m = props.paramValue3Filter;
      parameterList = remove(parameterList, function(parameter) {
        return parameter.paramValue3 == m;
      });
    }
    if (props.paramValue4Filter && parameterList) {
      let m = props.paramValue4Filter;
      parameterList = remove(parameterList, function(parameter) {
        return parameter.paramValue4 == m;
      });
    }
    if (props.paramValue5Filter && parameterList) {
      let m = props.paramValue5Filter;
      parameterList = remove(parameterList, function(parameter) {
        return parameter.paramValue5 == m;
      });
    }
    if (props.paramValue6Filter && parameterList) {
      let m = props.paramValue6Filter;
      parameterList = remove(parameterList, function(parameter) {
        return parameter.paramValue6 == m;
      });
    }
    if (props.paramValue7Filter && parameterList) {
      let m = props.paramValue7Filter;
      parameterList = remove(parameterList, function(parameter) {
        return parameter.paramValue7 == m;
      });
    }

    if (props.isAllOptionIncluded) {
      var allOptionItem = this.isAllOptionExists(parameterList);
      if (!allOptionItem.isExists && Array.isArray(parameterList)) {
        parameterList.unshift(this.getAllOptionItemInstance());
      }
    }

    return parameterList || [];
  }

  /**
   * Load parameter list from database
   * @param props
   */
  loadData() {
    let props = this.currentProps;

    if (props.paramTypeList && props.paramTypeList.length > 0) {
      this.getMultipleParameterList();
    } else {
      this.getParameterList();
    }
  }

  /**
   * Get Parameter List
   * @param {any} props
   * @param {any} callback (isSuccess: bool, value: any)
   */
  getParameterList(response) {
    if (this.state.parameterList && this.state.parameterList.length > 0) {
      return null;
    }
    let props = this.currentProps;
    if (!(props.paramType && props.paramType.trim() != '')) return;

    if (!response) {
      let methodName = 'GetParameters';
      let parameterFilter = {};
      parameterFilter.ParamType = props.paramType;

      if (props.paramCode || props.paramValue || props.paramDate) {
        methodName = 'GetParameterList';
        parameterFilter.ParamCode = props.paramCode;
        parameterFilter.ParamValue = props.paramValue;
        parameterFilter.ParamDate = props.paramDate;
      }

      let request = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.ParameterRequest',
        requestBody: {
          MethodName: methodName,
          ParameterContract: parameterFilter
        },
        key: 'GET_PARAMETER_LIST'
      };

      this.proxyExecute(request);
      return;
    }

    if (response.success) {
      this.setValues(response.value, this.state.selectedParamCode);
    } else {
      this.clear();
      console.log(this.resultErrorListToString(response.results));
    }
  }

  clear() {
    this.setState({ fullParameterList: [], parameterList: [] });
  }

  /**
   * Get Multiple Parameter List
   * @param {any} props
   * @param {any} callback (isSuccess: bool, value: any)
   */
  getMultipleParameterList(response) {
    let props = this.currentProps;

    if (!response) {
      let request = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.ParameterRequest',
        requestBody: {
          MethodName: 'GetMultipleParameterList',
          ParamTypeList: props.paramTypeList
        },
        key: 'GET_MULTIPLE_PARAMETER_LIST'
      };

      this.proxyExecute(request);
      return;
    }

    if (response.success) {
      let newList = [];
      props.paramTypeList.forEach(item => {
        let paramList = response.value[item.toLowerCase()] || [];
        for (var i = 0; i < paramList.length; i++) {
          let parameter = paramList[i];
          if (parameter.paramCode != '') {
            newList.push(parameter);
          }
        }
      }, this);

      this.setValues(newList, this.state.selectedParamCode);
    } else {
      this.clear();
      console.log(this.resultErrorListToString(response.results));
    }
  }

  /**
   * Sort the parameters. Available options is BParameterComponent.SortOption.Code,
   * BParameterComponent.SortOption.Description, BParameterComponent.SortOption.Value
   * @param sortOption
   */
  sortValues(sortOption) {
    if (!sortOption) return;

    let paramList = this.getValues();
    if (paramList && paramList.length > 0) {
      paramList = this.filterByProps(paramList);
      paramList = this.getSortedValues(paramList, sortOption);

      let allOptionItem = this.isAllOptionExists(paramList);
      if (allOptionItem.isExists && Array.isArray(paramList)) {
        paramList.splice(allOptionItem.index, 1);
        paramList.unshift(this.getAllOptionItemInstance());
      }
      this.setValues(paramList, this.state.selectedParamCode);
    }
  }

  /**
   * Set the Parameters by parameterList
   * @param parameterList
   * @param props
   */
  setValues(parameterList, selectedParamCode) {
    let paramList = parameterList || this.state.fullParameterList;
    let fullParameterList = _.cloneDeep(paramList);

    paramList = this.getSortedValues(paramList);
    paramList = this.filterByProps(paramList);

    let selectedParameter = paramList.find(s => s[this.valueMemberPath] == selectedParamCode);
    this.setState({
      parameterList: paramList,
      fullParameterList: fullParameterList,
      selectedParamCode: selectedParamCode,
      selectedParameter: selectedParameter
    });

    if (selectedParameter) {
      if (this.props.isAllOptionIncluded) {
        if (this.props.allOptionValue == selectedParamCode) {
          var o = Object.assign({}, selectedParameter);
          o[this.valueMemberPath] = this.props.allOptionValue;
          this.handleOnParameterSelect(o);
          return;
        }
      }
      this.handleOnParameterSelect(selectedParameter);
    }
  }

  /**
   * Set the Parameters by paramCodes. paramCodeList is a string array
   * @param paramCodeList
   */
  setValuesByCodes(paramCodeList) {
    let newList = [];
    let paramList = this.getValues();
    if (paramList && paramList.length > 0) {
      paramCodeList.forEach(function(paramCode) {
        let parameter = paramList.find(s => s[this.valueMemberPath] === paramCode);
        if (parameter) {
          newList.push(parameter);
        }
      }, this);
    }
    this.setValues(newList, this.state.selectedParamCode);
  }

  /**
   * Set selected parameter by paramcode
   * @param {any} paramCode
   */
  setSelectedParamCodeByCode(paramCode) {
    this.setValues(null, paramCode);
  }

  /**
   * Reset the value
   */
  resetValue() {
    let selectedParamCode = this.props.defaultSelectedParamCode;
    if (this.props.isAllOptionIncluded) {
      if (this.props.defaultSelectedParamCode === null) {
        selectedParamCode = this.nullValue;
      }
    }
    this.setState({
      selectedParamCode: selectedParamCode
    });
  }

  /**
   * Returns the list of parameters
   * @returns {*}
   */
  getValues() {
    return this.state.parameterList || [];
  }

  /**
   * Get the parameter that is currently selected.
   * @returns {*|{}}
   */
  getValue() {
    let item = this.BComboBox.getValue();
    if (!item) return undefined;
    let paramList = this.getValues();
    if (item && item.isCheckBoxChecked) {
      return {
        isCheckBoxChecked: item.isCheckBoxChecked,
        value: item.value ? item.value : null
      };
    }
    let value = paramList.find(s => s[this.valueMemberPath] == item.value && s.paramType == this.props.paramType);
    if (this.props.isAllOptionIncluded) {
      if (value) {
        if (value[this.valueMemberPath] == this.nullValue) {
          return this.props.allOptionValue;
        }
      } else {
        return item.allProps;
      }
    }
    if (value) {
      value.isCheckBoxChecked = item.isCheckBoxChecked;
    }
    return value;
  }

  setDisable(value) {
    this.BComboBox.setDisable(value);
  }

  handleOnParameterSelect(selectedParameter) {
    let props = this.currentProps;
    if (props.selectedParamCode && props.onDynamicChange) {
      var componentInfo = { name: props.snapKey, event: 'parameterSelect' };
      props.onDynamicChange && props.onDynamicChange(componentInfo);
    }
    if (selectedParameter) {
      props.onParameterSelect && props.onParameterSelect(selectedParameter);
    }
  }

  /**
   * Handle function fired when a parameter is selected
   * @param index
   * @param selectedItems
   * @param selectedValues
   */
  handleOnSelect(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      let paramCode = selectedValues[0];
      this.setValues(undefined, paramCode);
    }
  }

  validateConstraint() {
    return this.BComboBox ? this.BComboBox.validateConstraint() : true;
  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <BComboBox
          errorText={this.props.errorText}
          ref={r => (this.BComboBox = r)}
          context={this.props.context}
          valueConstraint={this.props.valueConstraint}
          columns={this.getColumns()}
          valueMemberPath={this.valueMemberPath}
          displayMemberPath={this.props.displayMemberPath}
          dataSource={this.state.parameterList}
          value={[this.state.selectedParamCode]}
          multiple={false}
          multiColumn={this.props.multiColumn}
          multiSelect={false}
          isAllOptionIncluded={false} /* we will manage */
          onSelect={this.handleOnSelect.bind(this)}
          hintText={this.props.hintText || this.getMessage('RuleEngine', 'TextParameterComponent')}
          labelText={this.props.labelText || this.getMessage('RuleEngine', 'TextParameterComponent')}
          disabled={this.props.disabled}
          disableSearch={this.props.disableSearch}
          showCheckBox={this.props.showCheckBox}
          isCheckBoxChecked={this.props.isCheckBoxChecked}
          inputValue={this.props.inputValue}
          onCheck={this.props.onCheck}
          inputOnBlur={this.props.inputOnBlur}
          inlineGridMode={this.props.inlineGridMode}
        />
        {this.state.isLoading && this.loadingIcon}
      </div>
    );
  }
}

BParameterComponent.SortOption = SortOption;
export default BParameterComponent;
