import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

import { BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BComboBox } from 'b-combo-box';
import { CountryFlags } from 'b-icon';

export var SortOption;
(function (SortOption) {
  SortOption[SortOption['Code'] = 1] = 'Code';
  SortOption[SortOption['Name'] = 2] = 'Name';
  SortOption[SortOption['Id'] = 3] = 'Id';
  SortOption[SortOption['None'] = 4] = 'None';
})(SortOption || (SortOption = {}));

@BComponentComposer
export class BFECComponent extends BBusinessComponent {

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    selectedFECId: null,
    defaultSelectedFECId: null,
    displayMemberPath: 'fecName',
    sortOption: SortOption.Id,
    isAllOptionIncluded: true,
    allOptionValue: -1
  };

  static propTypes = {
    ...BBusinessComponent.propTypes,
    /**
     * Determines the FEC that is currently selected.
     * @type {number}
     */
    selectedFECId: PropTypes.number,
    defaultSelectedFECId: PropTypes.number,

    /**
     * [isMultiple description]
     * @type {Boolean}
     */
    isMultiple: PropTypes.bool,

    /**
     * [selectedFECIdList description]
     * @type {[type]}
     */
    selectedFECIdList: PropTypes.arrayOf(PropTypes.number),
    defaultSelectedFECIdList: PropTypes.arrayOf(PropTypes.number),

    /**
     * Filter the FECs by given fec Ids.
     * @type {arrayOf number}
     */
    fECIdList: PropTypes.arrayOf(PropTypes.number),

    /**
     * Filter the FECs by given fecCodes
     * @type {arrayOf string}
     */
    fECCodeList: PropTypes.arrayOf(PropTypes.string),

    /**
     * Filter the FECs by given fec groups
     */
    fECGroupList: PropTypes.arrayOf(PropTypes.number),

    /**
     * If true an item will push to the first row of the FEC list. Default value is false.
     * @type {Boolean}
     */
    isAllOptionIncluded: PropTypes.bool,

    /**
     * If isAllOptionIncluded is true. Default value is 'Hepsi'
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
     * Display the search input field top of the fec component.
     * @type {Boolean}
     */
    disableSearch: PropTypes.bool,

    /**
     * If true, the FEC component will be disabled. Default valuse is false
     * @type {Boolean}
     */
    disabled: PropTypes.bool,

    /**
     * Display your chosen column on fec component. Default column(displayMemberPath) is 'fecName'
     * @type {string}
     */
    displayMemberPath: PropTypes.oneOf(['fecName', 'fecCode']),

    /**
     * Sort the FECs. Available options is BFECComponent.SortOption.Code, BFECComponent.SortOption.Name, BFECComponent.SortOption.Id
     * @type {oneOfType([PropTypes.string, PropTypes.number])}
     */
    sortOption: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * Default value is null
     * @type {number}
     */
    inUse: PropTypes.number,

    /**
     * Default value is null
     * @type {number}
     */
    timeDepositeAccount: PropTypes.number,

    /**
     * Default value is null
     * @type {number}
     */
    demandDepositeAccount: PropTypes.number,

    /**
     * Filter the FECs by given isForward. Default value is null.
     * @type {Boolean}
     */
    isForward: PropTypes.bool,
    usageCode: PropTypes.string,

    /**
     * Callback function fires when the fec has been selected.
     * @type {function}
     */
    onFECSelect: PropTypes.func,
    errorText: PropTypes.string
  };

  state = {
    valueMemberPath: 'fecId',
    selectedFECId: (this.props.selectedFECId || (this.props.selectedFECId == 0) ?
      this.props.selectedFECId : this.props.defaultSelectedFECId),
    selectedFECIdList: this.props.selectedFECIdList,
    fECList: [],
    allOptionDescription: this.props.allOptionDescription || this.getMessage('BusinessComponents', 'All')
  };

  nullValue = 'null';
  constructor(props, context) {
    super(props, context);
    this.handleOnFECSelect = this.handleOnFECSelect.bind(this);
  }

  /**
   * Invoked immediately before a component is mounted
   */
  componentDidMount() {
    this.loadData();
  }

  /**
   * Invoked before a mounted component receives new props
   * @param nextProps
   *
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps != this.props) {
      if (
        (this.props.selectedFECId != undefined && nextProps.selectedFECId != undefined && (nextProps.selectedFECId != this.props.selectedFECId)) ||
        (this.props.fECIdList != undefined && nextProps.fECIdList != undefined && (nextProps.fECIdList != this.props.fECIdList)) ||
        (this.props.fECCodeList != undefined && nextProps.fECCodeList != undefined && (nextProps.fECCodeList != this.props.fECCodeList)) ||
        (this.props.fECGroupList != undefined && nextProps.fECGroupList != undefined && (nextProps.fECGroupList != this.props.fECGroupList)) ||
        (this.props.sortOption != undefined && nextProps.sortOption != undefined && (nextProps.sortOption != this.props.sortOption)) ||
        (this.props.inUse != undefined && nextProps.inUse != undefined && (nextProps.inUse !== this.props.inUse)) ||
        (this.props.timeDepositeAccount != undefined && nextProps.timeDepositeAccount != undefined && (nextProps.timeDepositeAccount !== this.props.timeDepositeAccount)) ||
        (this.props.demandDepositeAccount != undefined && nextProps.demandDepositeAccount != undefined && (nextProps.demandDepositeAccount !== this.props.demandDepositeAccount)) ||
        (this.props.isForward != undefined && nextProps.isForward != undefined && (nextProps.isForward !== this.props.isForward)) ||
        (this.props.usageCode != undefined && nextProps.usageCode != undefined && (nextProps.usageCode !== this.props.usageCode)) ||
        (this.props.isMultiple != undefined && nextProps.isMultiple != undefined && (nextProps.isMultiple !== this.props.isMultiple)) ||
        (this.props.allOptionDescription != undefined && nextProps.allOptionDescription != undefined && (nextProps.allOptionDescription !== this.props.allOptionDescription))) {
        this.loadData(nextProps);


      }
    }
  }

  loadData(props) {
    props = props || this.props;
    let fECList = Object.assign([], BFECComponent.StaticFECList);
    if (fECList && fECList.length > 0) {
      this.setValues(fECList, props);
    } else {
      this.getFecList(null, props);
    }
  }

  getAllOptionItemInstance() {
    let value = this.props.allOptionValue;
    if (value === null)
      value = this.nullValue;

    let item = {
      [this.state.valueMemberPath]: value,
      [this.props.displayMemberPath]: this.state.allOptionDescription,
      'fecName': this.state.allOptionDescription
    };
    return item;
  }

  isAllOptionExists(fECList) {
    if (fECList && fECList.length > 0) {
      let index = fECList.findIndex(
        s => s[this.state.valueMemberPath] === this.getAllOptionItemInstance()[this.state.valueMemberPath]
      );
      return {
        isExists: index == -1 ? false : true,
        index: index
      };
    }
    return {
      isExists: false,
      index: -1
    };
  }

  getSortedValues(fecList, sortOption) {
    let newList = [];
    switch (sortOption) {
      case SortOption.Code:
        newList = sortBy(fecList, 'fecCode');
        break;
      case SortOption.Name:
        newList = sortBy(fecList, 'fecName');
        break;
      case SortOption.Id:
        newList = sortBy(fecList, 'fecId');
        break;
      default:
        newList = fecList;
        break;
    }
    return newList;
  }

  filterByProps(fECList, props) {
    props = props || this.props;
    fECList = fECList || [];

    if (props.fECGroupList) {
      let newList = [];
      fECList.forEach(function (fec) {
        let f = props.fECGroupList.find(s => s == fec.fecGroup);
        if (f !== undefined) {
          newList.push(fec);
        }
      }, this);
      fECList = newList;
    }
    if (props.fECIdList) {
      let newList = [];
      fECList.forEach(function (fec) {
        let f = props.fECIdList.find(s => s == fec.fecId);
        if (f !== undefined) {
          newList.push(fec);
        }
      }, this);
      fECList = newList;
    }
    if (props.fECCodeList) {
      let newList = [];
      fECList.forEach(function (fec) {
        let f = props.fECCodeList.find(s => s == fec.fecCode);
        if (f !== undefined) {
          newList.push(fec);
        }
      }, this);
      fECList = newList;
    }

    if (props.inUse)
      fECList = fECList.filter((el) => { return el.isUse == props.inUse; }) || [];

    if (props.timeDepositeAccount)
      fECList = fECList.filter((el) => { return el.timeDepositeAccount == props.timeDepositeAccount; }) || [];

    if (props.demandDepositeAccount)
      fECList = fECList.filter((el) => { return el.demandDepositeAccount == props.demandDepositeAccount; }) || [];

    if (props.isForward)
      fECList = fECList.filter((el) => { return el.isForward == props.isForward; }) || [];

    if (props.usageCode)
      fECList = fECList.filter((el) => { return el.usageCode == props.usageCode; }) || [];


    if (props.isAllOptionIncluded && !props.isMultiple) {
      let allOptionItem = this.isAllOptionExists(fECList);
      if (!allOptionItem.isExists && Array.isArray(fECList)) {
        fECList.unshift(this.getAllOptionItemInstance());
      }
    }

    return fECList || [];
  }

  /**
   * Load FEC data from data base
   * @param {any} keyForResult (key for proxyDidResponse response specification)
   */
  getFecList(response, props, fecIdList, fecCodeList) {

    if (!response) {

      let parameters = fecIdList ? { fecIdList: fecIdList, props: props } : null;
      parameters = fecCodeList ? { fecCodeList: fecCodeList, props: props } : null;
      parameters = parameters | {};
      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.FECRequest',
        requestBody: {
          MethodName: 'GetFecList'
        },
        key: 'GET_FEC_LIST',
        params: parameters
      };
      this.proxyExecute(proxyRequest);
      return;
    }

    if (fecIdList) {
      if (response.success) {
        let fECList = response.value || [];
        fECList = fECList.filter((el) => { return fecIdList.find(s => s == el.fecId) !== undefined; });
        this.setValues(fECList, props);
      } else {
        this.debugLog(this.resultErrorListToString(response.results), 3);
        this.setState({ fECList: [] });
      }
    }
    else if (fecCodeList) {
      if (response.success) {
        let fECList = response.value || [];
        fECList = fECList.filter((el) => { return fecCodeList.find(s => s == el.fecCode) !== undefined; });
        this.setValues(fECList, props);
      } else {
        this.debugLog(this.resultErrorListToString(response.results), 3);
        this.setState({ fECList: [] });
      }
    }
    else {
      if (response.success) {
        let newProps = props || this.props;
        BFECComponent.StaticFECList = response.value;
        this.setValues(BFECComponent.StaticFECList || [], newProps);
      } else {
        this.debugLog(this.resultErrorListToString(response.results), 3);
      }

    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key, params } = proxyResponse;
    switch (key) {
      case 'GET_FEC_LIST':
        this.getFecList(response, params.props, params.fecIdList, params.fecCodeList);
        break;

      default:
        break;
    }
  }

  /**
   * Reset the values
   */
  resetValue() {
    let selectedFECId = this.props.defaultSelectedFECId;
    if (this.props.isAllOptionIncluded) {
      if (this.props.defaultSelectedFECId === null) {
        selectedFECId = this.nullValue;
      }
    }
    this.setState({
      selectedFECId: selectedFECId,
      selectedFECIdList: this.props.defaultSelectedFECIdList,
    });
  }

  /**
   * Sort the FECs. Available options is BFECComponent.SortOption.Code,
   * BFECComponent.SortOption.Name, BFECComponent.SortOption.Id
   * @param sortOption
   */
  sortValues(sortOption) {
    if (!sortOption) return;
    let fECList = this.getValues();
    if (fECList && fECList.length > 0) {
      fECList = this.filterByProps(fECList, this.props);
      fECList = this.getSortedValues(fECList, sortOption);

      let allOptionItem = this.isAllOptionExists(fECList);
      if (allOptionItem.isExists) {
        fECList.splice(allOptionItem.index, 1);
        fECList.unshift(this.getAllOptionItemInstance());
      }
      this.setValues(fECList, this.props);
    }
  }

  /**
   * Set selected fec by id
   * @param {any} fecId
   */
  setSelectedFECById(fecId) {
    this.setState({ selectedFECId: fecId });
  }

  /**
   * Set selected fec by id
   * @param {any} fecId
   */
  setSelectedFECByCode(fecCode) {
    let fecList = this.getValues();
    let selectedFEC = fecList.find(s => s.fecCode == fecCode);
    if (selectedFEC)
      this.setState({ selectedFECId: selectedFEC.fecId });
    else
      this.setState({ selectedFECId: undefined });
  }

  /**
   * If it is multiple set selected fec list by id list
   * @param fecIdList[]
   */
  setSelectedFECListByIdList(fecIdList) {
    if (!Array.isArray(fecIdList))
      return;
    if (this.props.isMultiple) {
      this.setState({ selectedFECId: fecIdList });
    }
  }

  /**
   * Set the FECs by your custom FECs
   * @param fECList
   * @param props
   */
  setValues(fECList, props) {
    if (!Array.isArray((fECList))) {
      this.setState({ fECList: [] });
      return;
    }
    props = props || this.props;
    fECList = this.getSortedValues(fECList, props.sortOption);
    fECList = this.filterByProps(fECList, props);

    if (!props.isMultiple) {
      let selectedId;
      if (props.isAllOptionIncluded && props.selectedFECId === null)
        selectedId = this.nullValue;
      else
        selectedId = props.selectedFECId;

      this.setState({
        fECList: fECList,
        selectedFECId: selectedId
      });
    }
    else {
      this.setState({
        fECList: fECList,
        selectedFECIdList: props.selectedFECIdList
      });
    }
  }

  /**
   * Set the FECs by fec Ids
   * @param fecIdList
   * @param props
   */
  setValuesByIds(fecIdList) {
    if (!(fecIdList && Array.isArray(fecIdList) && fecIdList.length > 0)) {
      this.setState({ fECList: [] });
      return;
    }
    this.getFecList(null, this.props, fecIdList);
  }

  /**
 * Set the FECs by fec Codes
 * @param fecCodeList
 * @param props
 */
  setValuesByCodes(fecCodeList) {
    if (!(fecCodeList && Array.isArray(fecCodeList) && fecCodeList.length > 0)) {
      this.setState({ fECList: [] });
      return;
    }
    this.getFecList(null, this.props, fecCodeList);
  }

  /**
   * Returns the list of FEC
   * @returns {*}
   */
  getValues() {
    return this.state.fECList || [];
  }

  /**
   * Returns the selected FEC
   * @returns {{}}
   */
  getValue() {
    let item = this.BComboBox.getValue();
    if (!item) return undefined;
    let fecList = this.getValues();

    if (!this.props.isMultiple) {
      let value = fecList.find(s => s[this.state.valueMemberPath] == item.value);
      if (this.props.isAllOptionIncluded) {
        if (value) {
          if (value[this.state.valueMemberPath] == this.nullValue) {
            return this.props.allOptionValue;
          }
        }
      }
      return value;
    }
    else {
      return fecList.filter((el) => {
        return item.value.find(s => s == el[this.state.valueMemberPath]) !== undefined;
      });
    }
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  /**
   * Handle function fired when a FEC is selected
   * @param index
   * @param selectedItems
   * @param selectedValues
   */
  handleOnFECSelect(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      let selectedFECId = selectedValues[0];
      let selectedFEC = selectedItems[0];
      if (!this.props.isMultiple) {
        this.setState({ selectedFECId: selectedFECId });
        if (this.props.isAllOptionIncluded && selectedFECId == this.nullValue) {
          if (this.props.onFECSelect)
            this.props.onFECSelect(this.props.allOptionValue);
        } else {
          if (this.props.onFECSelect)
            this.props.onFECSelect(selectedFEC);
        }
      } else {
        this.setState({ selectedFECIdList: selectedValues });
        if (this.props.onFECSelect)
          this.props.onFECSelect(selectedItems);
      }
    }
    else {
      if (this.props.onFECSelect)
        this.props.onFECSelect(null);
    }
  }

  render() {
    let columns =
      [
        {
          key: 'fecCode', name: this.getMessage('BusinessComponents', 'FEC'),
          width: 120,
          type: 'custom',
          clickable: true,
          reactTemplate: (dataitem) => {
            return (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {(dataitem.fecId == this.props.allOptionValue || dataitem.fecId == this.nullValue) ? <div /> :
                <CountryFlags.Flag
                    context={this.props.context}
                    ByFecCode={true}
                    flagCode={dataitem.fecCode}>
                </CountryFlags.Flag>}
                <div style={{ marginLeft: 12, marginTop: 3 }}>{(dataitem.fecId == this.props.allOptionValue || dataitem.fecId == this.nullValue)? '00' : dataitem.fecCode}</div>
              </div >
            );
          }
        },
        { key: 'fecName', name: this.getMessage('BusinessComponents', 'ExchangeName'), width: 200, type: 'string' }
      ];

    return (
      <div>
        <BComboBox
          ref={r => this.BComboBox = r}
          context={this.props.context}
          columns={columns}
          valueMemberPath={this.state.valueMemberPath}
          displayMemberPath={this.props.displayMemberPath}
          value={(this.props.isMultiple ? this.state.selectedFECIdList : [this.state.selectedFECId])}
          dataSource={this.state.fECList}
          multiColumn={true}
          multiSelect={this.props.isMultiple}
          isAllOptionIncluded={false} /* we will manage */
          onSelect={this.handleOnFECSelect}
          hintText={this.props.hintText || this.getMessage('BusinessComponents', 'FXCurrencyType')}
          labelText={this.props.labelText || this.getMessage('BusinessComponents', 'FXCurrencyType')}
          disabled={this.props.disabled}
          disableSearch={this.props.disableSearch}
          errorText={this.props.errorText} />
      </div>
    );
  }
}

BFECComponent.StaticFECList = [];
BFECComponent.SortOption = SortOption;
export default BFECComponent;
