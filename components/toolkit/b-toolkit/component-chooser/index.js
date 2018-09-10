import React from 'react';
import { BComponent, BComponentComposer } from 'b-component';
import { BToolkit } from '../index';
import { BInputAction } from 'b-input-action';
import { BDialogHelper } from 'b-dialog-box';
import PropTypes from 'prop-types';

@BComponentComposer
export class BComponentChooser extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    selectedItems: PropTypes.array,
    singleElement: PropTypes.bool,
  }
  static defaultProps = {
    selectedItems: null,
    isSingleElement: false,
  }

  state = {
    resourceInfo: {
      'id': 934,
      'name': 'Toolkit',
      'description': 'Toolkit',
      'resourceActionList': [
        {
          'resourceId': 934,
          'actionId': 11,
          'actionType': 1,
          'name': 'TAMAM',
          'commandName': 'Ok',
          'groupName': '',
          'description': 'Ok',
          'iconPath': 'Save',
          'isVirtual': false,
          'isAssignable': true,
          'hasAccounting': false,
          'hasSlip': false,
          'hasCommission': false,
          'hasWorkflow': false,
          'sortId': 1,
          'systemDate': '0001-01-01T00:00:00Z',
          'hasAuthorization': false,
          'hasTellerTransaction': false,
          'hasRevokableTransaction': false,
          'hasFutureDated': false,
          'isOne': false,
          'isSelected': false,
          'isSelectable': true
        },
      ],
    },
    selectedComponentName: null,
  };

  constructor(props, context) {
    super(props, context);
  }

  openNodeChooser = () => {
    let { context, dialogTitle } = this.props;
    let Element = <BToolkit inDialog={true}
      isSingleElement={this.props.isSingleElement}
      selectedItems={this.props.selectedItems}
      resourceInfo={this.state.resourceInfo}
      context={context} />;
    let dialogStyle = { width: '96%', height: '100%', padding: 0, overflow: 'hide' };
    this.dialogRef = BDialogHelper.show(context,
      Element,
      0, 0, dialogTitle ? dialogTitle : 'Bileşen Seçimi', this.onClose, dialogStyle, null, null); //  Title dinamik olarak set edilecek
  }

  onClose = (event) => {
    let selectedComponentName = '';
    if (event.length > 1) {
      selectedComponentName = 'Childs(' + event.length + ') : ';
      event.forEach(element => {
        selectedComponentName = selectedComponentName + element.type.displayName + ', ';
      });
    } else {
      selectedComponentName = event.type.displayName;
    }

    this.setState({ selectedComponentName });
    if (this.props.onComponentSelect) {
      this.props.onComponentSelect(event);
    }

  }

  render() {
    return (
      <BInputAction
        ref={r => this.binputaction = r}
        {...this.props}
        value={this.state.selectedComponentName}
        rightIconList={[
          { dynamicIcon: 'Edit', onClick: this.openNodeChooser }
        ]}
      />
    );
  }
}

export default BComponentChooser;