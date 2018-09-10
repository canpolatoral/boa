import React from 'react';
import PropTypes from 'prop-types';
import { BTransactionForm } from 'b-transaction-form';
import { BBusinessComponent } from 'b-business-component';
import { BDataGrid } from 'b-data-grid';
import { BCard } from 'b-card';

export class BAccountNote extends BBusinessComponent {
  static propTypes = {
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    accountNumber: PropTypes.number,
    accountSuffix: PropTypes.number
  };

  static defaultProps = {
    resourceCode: 'YONTACCNTD'
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      accountNoteList: []
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this.getAccountNotes();
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }

  getAccountNotes(response) {
    if (!this.props.accountNumber) return;

    if (this.state.accountNoteList && this.state.accountNoteList.length > 0) { return null; }

    if (!response) {
      let request = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.AccountReminderRequest',
        requestBody: {
          MethodName: 'GetAccountRemindersByAccount',
          AccountNumber: this.props.accountNumber,
          AccountSuffix: this.props.accountSuffix
        },
        key: 'GET_ACCOUNT_REMINDERS_BY_ACCOUNT'
      };
      this.proxyExecute(request);
      return;
    }

    if (response.success) {
      if (response.value) {
        let newList = [];
        response.value.forEach(item => {
          if (item['accountReminderId']) {
            newList.push(item);
          }
        });
        this.setState({ accountNoteList: newList });
      }
    } else {
      this.debugLog(this.resultErrorListToString(response.results), 3);
      this.setState({ accountNoteList: [] });
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GET_ACCOUNT_REMINDERS_BY_ACCOUNT': {
        this.getAccountNotes(response);
        break;
      }
      default:
        break;
    }
  }

  onActionClick(command: any) {
    switch (command.commandName) {
      case 'Save': {
        // this.save();
        break;
      }
      default:
        break;
    }
  }

  onClosing() {
    this.setState({ open: false });
  }

  onRowSelectionChanged() {
    // this.setState({ dialogMessage: 'seçildi.', isDialogOpen: true });
  }

  render() {
    var columns = [
      {
        key: 'accountNumber',
        name: this.getMessage('BusinessComponents', 'AccountNumber')
      },
      {
        key: 'accountSuffix',
        name: this.getMessage('BusinessComponents', 'AccountSuffix')
      },
      {
        key: 'reminderNote',
        name: this.getMessage('CoreBanking', 'Note')
      },
      {
        key: 'branchName',
        name: this.getMessage('BOA', 'BOANoteLastChangedBranch')
      },
      {
        key: 'userName',
        name: this.getMessage('BOA', 'BOANoteLastChangedUser')
      },
      {
        type: 'date',
        dateFormat: 'LLL',
        key: 'systemDate',
        name: this.getMessage('BOA', 'BOANoteLastChangeDate')
      }
    ];

    return (
      <BTransactionForm
        context={this.props.context}
        resourceInfo={this.props.resourceInfo}
        onActionClick={this.onActionClick.bind(this)}
        onClosing={this.onClosing.bind(this)}
      >
        <BCard context={this.props.context} expandable={false} initiallyExpanded={false}>
          <BDataGrid
            context={this.props.context}
            columns={columns}
            dataSource={this.state.accountNoteList}
            multiSelection={false}
            showCheckbox={false}
            onRowSelectionChanged={this.onRowSelectionChanged.bind(this)}
          />
        </BCard>
      </BTransactionForm>
    );
  }
}

export default BAccountNote;
