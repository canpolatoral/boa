import React from 'react';
import PropTypes from 'prop-types';
import { BBusinessComponent } from 'b-business-component';
import { BTransactionForm } from 'b-transaction-form';
import { BCard } from 'b-card';
import { BInput } from 'b-input';
import { BInformationText } from 'b-information-text';

export class BCustomerNote extends BBusinessComponent {
  static propTypes = {
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    isNew: PropTypes.bool,
    note: PropTypes.shape({
      id: PropTypes.number,
      accountNumber: PropTypes.any,
      customerName: PropTypes.string,
      note: PropTypes.string,
      branchName: PropTypes.string,
      systemDate: PropTypes.string,
      userName: PropTypes.string
    })
  };

  static defaultProps = {
    resourceCode: 'YONTCUSNTD',
    isNew: true
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      noteInput: this.props.note ? this.props.note.note : ''
    };
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'SAVE': {
        this.save(response);
        break;
      }
      case 'DELETE': {
        this.delete(response);
        break;
      }
      default:
        break;
    }
  }

  onActionClick(command: any) {
    switch (command.commandName) {
      case 'Save': {
        this.save();
        break;
      }
      case 'Delete': {
        this.delete();
        break;
      }
      default:
        break;
    }
  }

  handleOnChange(e: any) {
    this.setState({ noteInput: e.target.value });
  }

  delete(response) {
    if (!response) {
      let request = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.AccountNoteRequest',
        requestBody: {
          MethodName: 'DeleteAccountNote',
          DataContract: {
            Id: this.props.note.id
          }
        },
        key: 'DELETE'
      };
      this.proxyExecute(request);
      return;
    }

    if (!response.success && !response.results.length > 0) {
      this.debugLog(this.resultErrorListToString(response.results), 3);
    }
  }

  save(response) {
    if (!this.state.noteInput) return;

    if (!response) {
      let request = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.AccountNoteRequest',
        requestBody: {
          MethodName: 'AddAccountNote',
          DataContract: {
            AccountNumber: this.props.note.accountNumber,
            BranchId: 99,
            Note: this.state.noteInput
          }
        },
        key: 'SAVE'
      };
      this.proxyExecute(request);
      return;
    }

    if (!response.success && !response.results.length > 0) {
      this.debugLog(this.resultErrorListToString(response.results), 3);
    }
  }

  render() {
    return (
      <BTransactionForm context={this.props.context} resourceInfo={this.props.resourceInfo} onActionClick={this.onActionClick.bind(this)}>
        <BCard context={this.props.context} expandable={false} initiallyExpanded={false}>
          <BInformationText
            context={this.props.context}
            labelText={this.getMessage('BusinessComponents', 'CustomerNo')}
            infoText={this.props.note.accountNumber}
          />
          <BInformationText
            context={this.props.context}
            labelText={this.getMessage('Accounting', 'LabelCustomerName')}
            infoText={this.props.note.customerName}
          />
          {this.props.isNew ? (
            <div />
          ) : (
            <div>
              <BInformationText
                context={this.props.context}
                labelText={this.getMessage('BOA', 'BOANoteLastChangedBranch')}
                infoText={this.props.note.branchName}
              />
              <BInformationText
                context={this.props.context}
                labelText={this.getMessage('BOA', 'BOANoteLastChangeDate')}
                infoText={this.props.note.systemDate}
              />
              <BInformationText
                context={this.props.context}
                labelText={this.getMessage('BOA', 'BOANoteLastChangedUser')}
                infoText={this.props.note.userName}
              />
            </div>
          )}
          <hr
            style={{
              height: '1px',
              border: 'none',
              backgroundColor: '#E0E0E0',
              marginLeft: '-24px',
              marginRight: '-24px',
              marginTop: '0px',
              marginBottom: '0px'
            }}
          />
          <BInput
            context={this.props.context}
            type="text"
            multiLine={true}
            rows={3}
            rowsMax={5}
            noWrap={true}
            floatingLabelText={this.getMessage('Loans', 'CustomerNote')}
            style={{ marginRight: '10px' }}
            onChange={this.handleOnChange.bind(this)}
            value={this.state.noteInput}
          />
        </BCard>
      </BTransactionForm>
    );
  }
}

export default BCustomerNote;
