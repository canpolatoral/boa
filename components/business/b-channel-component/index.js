import React from 'react';
import PropTypes from 'prop-types';

import { BBusinessComponent } from 'b-business-component';
import { BComponentComposer } from 'b-component';
import { BComboBox } from 'b-combo-box';
import sortBy from 'lodash/sortBy';

@BComponentComposer
export class BChannelComponent extends BBusinessComponent {

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    selectedChannelId: null,
    defaultSelectedChannelId: null,
    multiColumn: true,
    isAllOptionIncluded: true,
    allOptionValue: -1,
    sortBy: 'channelName'
  };

  static propTypes = {
    ...BBusinessComponent.propTypes,
    /**
   * [isMultiple description]
   * @type {Boolean}
   */
    isMultiple: PropTypes.bool,

    sortBy: PropTypes.oneOf(['channelId', 'channelName']),

    /**
     * Determines the Channel that is currently selected.
     * @type {number}
     */
    selectedChannelId: PropTypes.number,
    defaultSelectedChannelId: PropTypes.number,

    /**
     * [selectedChannelIdList description]
     * @type {[type]}
     */
    selectedChannelIdList: PropTypes.arrayOf(PropTypes.number),
    defaultSelectedChannelIdList: PropTypes.arrayOf(PropTypes.number),

    /**
     * Filter the Channels by given channel Ids.
     * @type {arrayOf number}
     */
    channelIdList: PropTypes.arrayOf(PropTypes.number),

    /**
     * If true an item will push to the first row of the Channel list. Default value is false.
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
     * Display the search input field top of the channel component.
     * @type {Boolean}
     */
    disableSearch: PropTypes.bool,

    /**
     * If true, the Channel component will be disabled. Default valuse is false
     * @type {Boolean}
     */
    disabled: PropTypes.bool,

    /**
     * Callback function fires when the channel has been selected.
     * @type {function}
     */
    onChannelSelect: PropTypes.func,
    errorText: PropTypes.string,
    multiColumn: PropTypes.bool,
    selectAllOpening: PropTypes.bool
  };

  state = {
    valueMemberPath: 'channelId',
    displayMemberPath: 'channelName',
    selectedChannelId: this.props.selectedChannelId,
    selectedChannelIdList: this.props.selectedChannelIdList,
    channelList: []
  };

  nullValue = '  ';
  constructor(props, context) {
    super(props, context);
    this.handleOnChannelSelect = this.handleOnChannelSelect.bind(this);
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
   *
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps != this.props) {
      if ((nextProps.selectedChannelId != this.props.selectedChannelId) ||
        (nextProps.channelIdList != this.props.channelIdList) ||
        (nextProps.isMultiple != this.props.isMultiple)) {
        this.loadData(nextProps);
      }
    }
  }

  loadData(props) {
    props = props || this.props;
    let channelList = Object.assign([], BChannelComponent.StaticChannelList);
    if (channelList && channelList.length > 0) {
      this.setValues(channelList, props);
    } else {
      this.getChannelList((isSuccess, channelList) => {
        if (isSuccess) {
          let newList = [];
          if (props.sortBy == 'channelId')
            newList = sortBy(channelList, 'channelId');
          else if (props.sortBy == 'channelName')
            newList = sortBy(channelList, 'channelName');
          BChannelComponent.StaticChannelList = newList;
          this.setValues(newList || [], props);
        }
      });
    }
  }

  getAllOptionItemInstance() {
    let value = this.props.allOptionValue;
    if (value === null || value === undefined)
      value = this.nullValue;
      
    let item = {
      [this.state.valueMemberPath]: value,
      [this.state.displayMemberPath]: this.props.allOptionDescription || this.getMessage('BusinessComponents', 'All')
    };
    return item;
  }

  isAllOptionExists(channelList) {
    if (channelList && channelList.length > 0) {
      let index = channelList.findIndex(
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

  filterByProps(channelList, props) {
    props = props || this.props;
    channelList = channelList || [];

    if (props.channelIdList) {
      let newList = [];
      channelList.forEach(function (channel) {
        let f = props.channelIdList.find(s => s == channel.channelId);
        if (f !== undefined) {
          newList.push(channel);
        }
      }, this);
      channelList = newList;
    }

    if (props.isAllOptionIncluded && !props.isMultiple) {
      let allOptionItem = this.isAllOptionExists(channelList);
      if (!allOptionItem.isExists && Array.isArray(channelList)) {
        channelList.unshift(this.getAllOptionItemInstance());
      }
    }

    return channelList || [];
  }

  /**
   * Load Channel data from data base
   * @param {any} callback (isSuccess: bool, value: any)
   */
  getChannelList() {
    let proxyRequest = {
      requestClass: 'BOA.Types.Kernel.BusinessHelper.ChannelRequest',
      requestBody: {
        MethodName: 'GetChannelList'
      },
      key: 'GetChannelList'
    };
    this.proxyExecute(proxyRequest);
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetChannelList':
        if (response.success) {
          this.setValues(response.value, this.props);
        } else {
          this.setState({
            channelList: [],
            selectedChannelIdList: []
          });
        }
        break;
      default:
        break;
    }
  }

  /**
   * Set selected channel by id
   * @param {any} channelId
   */
  setSelectedChannelById(channelId) {
    this.setState({ selectedChannelId: channelId });
  }

  /**
   * If it is multiple set selected channel list by id list
   * @param channelIdList[]
   */
  setSelectedChannelListByIdList(channelIdList) {
    if (!Array.isArray(channelIdList))
      return;
    if (this.props.isMultiple) {
      this.setState({ selectedChannelId: channelIdList });
    }
  }

  /**
   * Set the Channels by your custom Channels
   * @param channelList
   * @param props
   */
  setValues(channelList, props) {
    if (!Array.isArray((channelList))) {
      this.setState({ channelList: [] });
      return;
    }
    props = props || this.props;
    channelList = this.filterByProps(channelList, props);

    if (!props.isMultiple) {
      let selectedId;
      if (props.isAllOptionIncluded && (props.selectedChannelId === null || props.selectedChannelId == ''))
        // selectedId = this.nullValue;
        selectedId = this.getAllOptionItemInstance(props)[this.state.valueMemberPath];
      else selectedId = props.selectedChannelId;

      this.setState({
        channelList: channelList,
        selectedChannelId: selectedId
      });
    }
    else {
      var selectedChannelIdList;
      if (this.props.selectAllOpening) {
        selectedChannelIdList = channelList.map((c) => {
          return c.channelId;
        });
      } else {
        selectedChannelIdList = props.selectedChannelIdList;
      }
      this.setState({
        channelList: channelList,
        selectedChannelIdList: selectedChannelIdList
      });
    }
  }

  /**
   * Set the Channels by channel Ids
   * @param channelIdList
   * @param props
   */
  setValuesByIds(channelIdList) {
    if (!(channelIdList && Array.isArray(channelIdList) && channelIdList.length > 0)) {
      this.setState({ channelList: [] });
      return;
    }
    this.getChannelList((isSuccess, channelList) => {
      if (isSuccess) {
        channelList = channelList.filter((el) => {
          return channelIdList.find(s => s == el.channelId) !== undefined;
        }) || [];
        this.setValues(channelList, this.props);
      }
      else {
        this.setState({ channelList: [] });
      }
    });
  }

  /**
   * Returns the list of Channel
   * @returns {*}
   */
  getValues() {
    return this.state.channelList || [];
  }

  /**
   * Returns the selected Channel
   * @returns {{}}
   */
  getValue() {
    let item = this.BComboBox.getValue();
    if (!item) return undefined;
    let channelList = this.getValues();

    if (!this.props.isMultiple) {
      let value = channelList.find(s => s[this.state.valueMemberPath] == item.value);
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
      return channelList.filter((el) => {
        return item.value.find(s => s == el[this.state.valueMemberPath]) !== undefined;
      });
    }
  }

  /**
   * Reset the values
   */
  resetValue() {
    let selectedChannelId = this.props.defaultSelectedChannelId;
    if (this.props.isAllOptionIncluded) {
      if (this.props.defaultSelectedChannelId === null) {
        selectedChannelId = this.nullValue;
      }
    }
    this.setState({
      selectedChannelId: selectedChannelId,
      selectedChannelIdList: this.props.defaultSelectedChannelIdList,
    });
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  /**
   * Handle function fired when a Channel is selected
   * @param index
   * @param selectedItems
   * @param selectedValues
   */
  handleOnChannelSelect(index, selectedItems, selectedValues) {
    if (selectedValues && selectedValues.length > 0) {
      if (!this.props.isMultiple) {
        this.setState({ selectedChannelId: selectedValues[0] });
        if (selectedValues[0] == this.nullValue) {
          if (this.props.onChannelSelect)
            this.props.onChannelSelect(this.props.allOptionValue);
        } else {
          if (this.props.onChannelSelect)
            this.props.onChannelSelect(selectedItems[0]);
        }
      } else {
        this.setState({ selectedChannelIdList: selectedValues });
        if (this.props.onChannelSelect)
          this.props.onChannelSelect(selectedItems);
      }
    }
    else {
      if (this.props.onChannelSelect)
        this.props.onChannelSelect(undefined);
    }
  }

  render() {
    let columns = [
      { key: 'channelId', name: this.getMessage('BusinessComponents', 'ChannelId'), width: 100, type: 'string', resizable: true },
      { key: 'channelName', name: this.getMessage('BusinessComponents', 'Channel'), width: 200, type: 'string', resizable: true }];

    return (
      <div>
        <BComboBox
          ref={r => this.BComboBox = r}
          context={this.props.context}
          columns={columns}
          valueMemberPath={this.state.valueMemberPath}
          displayMemberPath={this.state.displayMemberPath}
          value={(this.props.isMultiple ? this.state.selectedChannelIdList : [this.state.selectedChannelId])}
          dataSource={this.state.channelList}
          multiColumn={this.props.multiColumn}
          multiSelect={this.props.isMultiple}
          isAllOptionIncluded={this.props.isAllOptionIncluded}
          onSelect={this.handleOnChannelSelect}
          hintText={this.props.hintText || this.getMessage('BusinessComponents', 'Channel')}
          labelText={this.props.labelText || this.getMessage('BusinessComponents', 'Channel')}
          disabled={this.props.disabled}
          disableSearch={this.props.disableSearch}
          errorText={this.props.errorText} />
      </div>
    );
  }
}

BChannelComponent.StaticChannelList = [];
export default BChannelComponent;
