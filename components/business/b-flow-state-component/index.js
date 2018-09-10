import React from 'react';
import PropTypes from 'prop-types';

import { BBusinessComponent } from 'b-business-component';
import { BComponentComposer } from 'b-component';
import { BComboBox } from 'b-combo-box';

@BComponentComposer
export class BFlowStateComponent extends BBusinessComponent {

  flowList = [];
  stateList = [];
  constructor(props, context) {
    super(props, context);
    this.state = { flowList: [], stateList: [], selectedFlowId: props.selectedFlowId, selectedStateId: props.selectedStateId };
  }

  static propTypes = {
    ...BBusinessComponent.propTypes,
    /**
     * Determines the state number that is currently selected.
     * @type {number}
     */
    selectedStateId: PropTypes.number,

    /**
     * Determines the flow number that is currently selected.
     * @type {number}
     */
    selectedFlowId: PropTypes.number,

    /**
     * If true, the state will be visible. Default valuse is true.
     * @type {bool}
     */
    stateVisible: PropTypes.bool,

    /**
     * Callback function fires when the flow has been selected.
     * @type {func}
     */
    onFlowSelect: PropTypes.func,

    /**
     * Callback function fires when the state has been selected.
     * @type {func}
     */
    onStateSelect: PropTypes.func,

  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    stateVisible: true
  };

  getValue() {
    return {
      selectedFlowId: this.state.selectedFlowId,
      selectedStateId: this.state.selectedStateId
    };
  }

  resetValue() {
    this.setState({
      selectedFlowId: undefined,
      selectedStateId: undefined,
      stateList: []
    });
  }

  getSnapshot() {
    return {
      state: this.state
    };
  }

  setSnapshot(snapshot) {
    this.setState({ ...snapshot.state });

  }
  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (nextProps !== this.props) {
      // this.setState({ // TODO: ...
      //   selectedStateId:nextProps.selectedStateId,
      //   selectedFlowId:nextProps.selectedFlowId,
      // });

    }
  }

  getFlowList() {
    let proxyRequest = {
      requestClass: 'BOA.Types.Workflow2.BrowseFlowRequest',
      requestBody: {
        MethodName: 'GetFlowList',
        ResourceId: 153,
        ActionId: 11
      },
      key: 'getFlowList'
    };
    this.proxyTransactionExecute(proxyRequest);
  }


  getStateList(flowId) {
    let proxyRequest = {
      requestClass: 'BOA.Types.Workflow2.StateRequest',
      requestBody: {
        MethodName: 'GetStateListByFlowId',
        FlowId: flowId,
        ResourceId: 153,
        ActionId: 11
      },
      key: 'getStateList'
    };
    this.proxyTransactionExecute(proxyRequest);
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'getFlowList':
        if (response.success == true) {
          response.value.forEach((item) => {
            this.flowList.push(
              {
                flowId: item.flowId,
                name: item.name
              });
          }, this);
          this.setState({ flowList: this.flowList });
        }
        else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
      case 'getStateList':
        if (response.success == true) {
          var stateList = response.value;
          this.setState({ stateList: stateList });
        }
        else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;

      default:
        break;
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.state.flowList
      && (this.state.flowList == null || this.state.flowList.length == 0))
      this.getFlowList();
  }

  handleSelectFlow(index, selectedItems, selectedValues) {
    this.setState({ selectedFlowId: selectedValues[0] });
    if (this.props.onFlowSelect) {
      this.props.onFlowSelect(selectedValues[0]);
    }
    if (selectedValues[0] != -1
      && this.props.stateVisible === true) {
      this.getStateList(selectedValues[0]);
    }
  }

  handleSelectState(index, selectedItems, selectedValues) {
    this.setState({ selectedStateId: selectedValues[0] });
    if (this.props.onStateSelect) {
      this.props.onStateSelect(selectedValues[0]);
    }
  }

  render() {
    return (
      <div>
        <BComboBox
          context={this.props.context}
          hintText={this.getMessage('BusinessComponents', 'OperationType')}
          labelText={this.getMessage('BusinessComponents', 'OperationType')}
          dataSource={this.state.flowList}
          multiSelect={false}
          multiColumn={false}
          value={[this.state.selectedFlowId]}
          displayMemberPath='name'
          valueMemberPath='flowId'
          isAllOptionIncluded={false}
          allOptionValue={-1}
          onSelect={this.handleSelectFlow.bind(this)}
        />
        {this.props.stateVisible ?
          <BComboBox
            context={this.props.context}
            hintText={this.getMessage('BusinessComponents', 'Status')}
            labelText={this.getMessage('BusinessComponents', 'Status')}
            dataSource={this.state.stateList}
            multiSelect={false}
            multiColumn={false}
            value={[this.state.selectedStateId]}
            displayMemberPath='name'
            valueMemberPath='stateId'
            isAllOptionIncluded={false}
            allOptionValue={-1}
            onSelect={this.handleSelectState.bind(this)}
          /> : <div />
        }
      </div>
    );
  }

}
export default BFlowStateComponent;

