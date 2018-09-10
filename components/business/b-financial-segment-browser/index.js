import React from 'react';
import PropTypes from 'prop-types';
import FinancialSegmentDialog from './FinancialSegmentDialog';

import { BComponent } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BInputAction } from 'b-input-action';
import { BInput } from 'b-input';
import { BDialogHelper } from 'b-dialog-box';
import { BParameterComponent } from 'b-parameter-component';

export class BFinancialSegmentBrowser extends BBusinessComponent {

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    sequenceVisible: false,
    sequenceLabelText: ''// ,
    // hintText: this.getMessage('BusinessComponents', 'Branch')
  };

  static propTypes = {
    ...BBusinessComponent.propTypes,
    labelText: PropTypes.string,
    hintText: PropTypes.string,
    sequenceVisible: PropTypes.bool,
    sequenceLabelText: PropTypes.string,
    errorText: PropTypes.string
  };

  _clearActionButton = { dynamicIcon: 'Clear', iconProperties: { nativeColor: this.props.context.theme.boaPalette.base400 }, onClick: this.clearButtonClicked.bind(this) };
  _openDialogActionButton = { dynamicIcon: 'AddCircleOutline', iconProperties: { nativeColor: this.props.context.theme.boaPalette.pri500 }, onClick: this.openDialogButtonClicked.bind(this) };

  constructor(props, context) {
    super(props, context);

    this.state = {
      segmentValue: '',
      segmentText: '',
      sequenceValue: '',
      sequenceText: '',
    };
  }

  clearButtonClicked() {
    this.resetValue();
  }

  openDialogButtonClicked() {
    let dialogStyle = {};
    if (this.props.context.deviceSize < BComponent.Sizes.MEDIUM) {
      dialogStyle={ width: '75%', height: '90%' };
    }
    else {
      dialogStyle={ width: '40%', height: '85%'};
    }

    let dialog = (
      <FinancialSegmentDialog context={this.props.context}/>
    );

    BDialogHelper.showWithResourceCode(this.props.context, '', dialog, 0, 0,  this.getMessage('BusinessComponents', 'FinancialSegmentLabelSelection'), this.onDialogClosed.bind(this), dialogStyle);
  }

  onDialogClosed(dialogResponse, data) {
    if (dialogResponse == BComponent.DialogResponse.OK) {
      this.setState({
        segmentValue : data.segmentValue,
        segmentText : data.segmentText,
        sequenceValue : data.sequenceValue,
        sequenceText : data.sequenceText,
      });
    }
  }

  /**
   * Return the selected bank that is currently selected
   * @returns {''}
   */
  getValue() {
    return {
      value : this.state.segmentValue,
      Sequence: this.state.sequenceValue
    };
  }

  resetValue() {
    this.setState({
      value: this.props.isMultiSelection ? [] : '',
      displayTextSegment: '',
      displayTextSequence: ''
    });
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  onSegmentSelected(value) {
    this.setState({
      value: {
        segmentValue: value.paramCode,
        segmentText: value.paramDescription,
        sequenceValue: '',
        sequenceText: ''
      }
    });
  }

  getActionList(stateValue) {
    // if (this.props.disabled)
    //   return [];
    // else
    //   return stateValue ? [this._clearActionButton, this._searchButton] : [this._addButton];
    return stateValue ? [this._clearActionButton, this._openDialogActionButton] : [this._openDialogActionButton];
  }

  render() {
    if (this.props.sequenceVisible == true) {
      return (
        <div>
          <BInputAction
            context={this.props.context}
            inputDisabled={true}
            floatingLabelText={this.props.labelText}
            hintText={this.props.hintText}
            leftIconList={[]}
            // rightIconList={[this._clearActionButton, this._openDialogActionButton]}
            rightIconList={this.getActionList(this.state.segmentText)}
            disabled={this.props.disabled}
            value={this.state.segmentText}
            errorText={this.props.errorText}
          />
          <BInput
            context={this.props.context}
            inputDisabled={true}
            floatingLabelText={this.props.sequenceLabelText}
            hintText={this.props.sequenceLabelText}
            disabled={true}
            value={this.state.sequenceText}
          />
        </div>
      );
    }
    else {
      return (
        <BParameterComponent
          context={this.props.context}
          labelText={this.props.labelText}
          hintText= {this.getMessage('BusinessComponents', 'Branch')}
          paramType={'MTADI'}
          displayMember={'ParamDescription'}
          selectedParamCode={this.state.segmentValue}
          onParameterSelect={this.onSegmentSelected.bind(this)}
          errorText={this.props.errorText}
        />
      );
    }
  }
}

export default BFinancialSegmentBrowser;
