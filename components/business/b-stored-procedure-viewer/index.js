import React from 'react';
import BStoredProcedureViewerDialog from './dialog';
import { BComponent, BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BInputAction } from 'b-input-action';
import { BDialogHelper } from 'b-dialog-box';
import PropTypes from 'prop-types';

/*
  Dinamik ekranda kullanılmak için oluşturuldu. Özelleştirilebilir.
*/
@BComponentComposer
export class BStoredProcedureViewer extends BBusinessComponent {

  static propTypes = {
    /**
    * Base properties from BBusinessComponent
    */
    ...BBusinessComponent.propTypes,
    selectedParameters: PropTypes.array,
    selectedReturnColumns: PropTypes.array,
    selectedSp: PropTypes.object,
    // availableValues: PropTypes.any,
    dialogStyle: PropTypes.object,
    onChange:  PropTypes.func,
  }

  static defaultProps = {
    /**
    * Default prop values from BBusinessComponent
    */
    ...BBusinessComponent.defaultProps,
  }

  state = {
    spList: [],
    spComboList: [],
    data:this.props.selectedSp,
    dialogStyle: this.props.dialogStyle,
  };

  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    super.componentWillMount();
    // this.rightIconList = [];
    // this.rightIconList.push(
    //   {
    //     'dynamicIcon': 'Clear',
    //     'iconProperties': { 'style': { 'color': this.props.context.theme.boaPalette.base400 } },
    //     'onClick': this.clearClicked.bind(this),
    //   },
    //   {
    //     'dynamicIcon': 'Search',
    //     'iconProperties': { 'style': { 'color': this.props.context.theme.boaPalette.pri500 } },
    //     'onClick': this.searchClicked.bind(this)
    //   },
    // );
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedSp != nextProps.selectedSp) {
      this.setState({data:Object.assign({}, nextProps.selectedSp)});
    }
  }

  getSnapshot() {
    return {
      state: this.state
    };
  }
  setSnapshot(snapshot) {
    this.setState(snapshot.state);
  }
  render() {
    let { context } = this.props;
    let selectedSpName = this.state.data && this.state.data.fullSpName ? this.state.data.fullSpName : '';
    let rightIconList = [];
    if (selectedSpName) {
      rightIconList.push(
        {
          dynamicIcon: 'Clear',
          onClick: this.clearClicked.bind(this)
        }
      );
    }
    rightIconList.push(
      {
        dynamicIcon: 'AddCircleOutline',
        iconProperties: { nativeColor: context.theme.boaPalette.pri500 },
        onClick: this.searchClicked.bind(this)
      }
    );
    return (
      <BInputAction
        ref={r => this.bInputAction = r}
        value={selectedSpName}
        context={context}
        inputDisabled={true}
        hintText={this.getMessage('DynamicFormGenerator', 'StoredProcedureEng')}
        floatingLabelText={this.getMessage('DynamicFormGenerator', 'StoredProcedureEng')}
        rightIconList={rightIconList} />
    );
  }

  searchClicked() {
    let selectedSpName, selectedParameters, selectedReturnColumns;
    if (this.state.data) {
      selectedSpName = this.state.data.fullSpName;
      selectedParameters = this.state.data.parameterList;
      selectedReturnColumns = this.state.data.returnColumnList;
    }
    // let dialogStyle;
    if (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) {
      this.setState({ dialogStyle : { width: '600px', height: '585px' }});
    }
    else {
      this.setState({ dialogStyle : { width: '45%', height: '75%' }});
    }
    if (!this.state.spList || this.state.spList.length == 0) {
      this.getStoredProcedures(selectedSpName, selectedParameters, selectedReturnColumns, this.state.dialogStyle);
    }
    else {
      this.openDialog(this.state.spList, this.state.spComboList, selectedSpName, selectedParameters, selectedReturnColumns, this.state.dialogStyle);
    }
  }

  clearClicked() {
    this.setState({ data : null });
    this.onChange();
  }

  openDialog(spList, spComboList, selectedSpName, selectedParameters, selectedReturnColumns, dialogStyle) {
    let dialog = (
      <BStoredProcedureViewerDialog context={this.props.context}
        spList={spList}
        spComboList={spComboList}
        selectedSpName={selectedSpName}
        selectedParameters={selectedParameters}
        selectedReturnColumns={selectedReturnColumns}
        // availableValues={this.props.availableValues}
        onClosing={this.handleClose}
        ref={r => this.spDialog = r} />);
    BDialogHelper.showWithResourceCode(this.props.context, '', dialog, 0, 0, 'Stored Procedure List', this.handleClose.bind(this), dialogStyle);
  }

  getStoredProcedures(selectedSpName, selectedParameters, selectedReturnColumns, dialogStyle) {
    // let promise = this.proxyCall('BOA.Types.DynamicFormGenerator.SpBrowserRequest', { MethodName: 'SelectSpByColumns', resourceId: 6321 });

    let proxyRequest = {
      requestClass: 'BOA.Types.DynamicFormGenerator.SpBrowserRequest',
      requestBody: {
        MethodName: 'SelectSpByColumns',
        resourceId: '9999'
      },
      key: 'SelectSpByColumns',
      params: dialogStyle // eslint dialogstyle kullanılmıyor uyarısını gidermek için eklendi.
    };
    this.proxyExecute(proxyRequest);
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetAllBranches':
      case 'SelectSpByColumns':
        if (response.success) {
          // başarılıysa
          let comboList = [];
          proxyResponse.response.value.forEach((spContract) => {
            comboList.push({ text: spContract.fullSpName, value: spContract.fullSpName });
          });
          this.setState({ spList: proxyResponse.response.value, spComboList: comboList });
          let selectedSpName = this.state.data && this.state.data.fullSpName ? this.state.data.fullSpName : '';
          this.openDialog(proxyResponse.response.value, comboList, selectedSpName, this.state.selectedParameters, this.state.selectedReturnColumns, this.state.dialogStyle);
        } else {
          this.debugLog('error: getStoredProcedures method error: ' + proxyResponse.results[0].errorMessage, 3);
        }
        break;
      default:
        break;
    }
  }

  handleClose(dialogResponse, data) {
    if (dialogResponse == BComponent.DialogResponse.YES) {
      if (data && data.fullSpName) {
        this.setState({data:Object.assign({}, data)});
      }
    }
    this.onChange();
  }

  onChange() {
    if (this.props.onChange) {
      this.props.onChange(this.state.data);
    }
  }
}

export default BStoredProcedureViewer;
