import React from 'react';
import PropTypes from 'prop-types';

import { BBusinessComponent } from 'b-business-component';
import { BCard } from 'b-card';
import { BTransactionForm } from 'b-transaction-form';
import { BDataGrid } from 'b-data-grid';
import { BDialogHelper } from 'b-dialog-box';
import { BComponent, BComponentComposer } from 'b-component';

@BComponentComposer
export class BBlackListComponent extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    blackListContract: PropTypes.array,
    blackListMernisInfo: PropTypes.array,
    disableActions: PropTypes.bool,
    isIndividual: PropTypes.bool,
    accountNumber: PropTypes.number,
    fromAccountComponent: PropTypes.bool
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'IBLRKARALS',
    blackListContract: [],
    blackListMernisInfo: [],
    fromAccountComponent: false
  };

  state = {
    isIndividual: this.props.isIndividual,
    mernisColumns: [],
    blackListColumns: [],
    personColumns: [],
    personList: []
  }

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.state.personList && this.state.personList.length > 0) { return null; }
    if (this.props.accountNumber) {
      let proxyRequest = {
        requestClass: 'BOA.Types.Kernel.BusinessHelper.PersonInfoRequest',
        requestBody: {
          AccountNumber: this.props.accountNumber,
          MethodName: 'GetAllPersonsByAccountNumber'
        },
        key: 'GetAllPersonsByAccountNumber'
      };
      this.proxyExecute(proxyRequest);
    }
  }


  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetAllPersonsByAccountNumber':
        if (response.success) {
          this.setState({ personList: response.value });
        } else {
          //
        }
        break;
      default:
        break;
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

  actionBarButtonClick(e) {
    if (e.commandName == 'Cancel') { // Vazgeç
      BDialogHelper.close(this, BComponent.DialogResponse.CANCEL);  //  BlackListVerificationType = 0, data null
    } else if (e.commandName == 'Continue') { // Devam Et
      BDialogHelper.close(this, BComponent.DialogResponse.NONE);   // BlackListVerificationType = 0
    } else if (e.commandName == 'SendToApprove') { // Onaya Gönder
      BDialogHelper.close(this, BComponent.DialogResponse.OK);    //  BlackListVerificationType=1
    }
  }

  componentWillMount() {
    super.componentWillMount();
    this.getColumns();
  }

  getColumns() {
    var mColumns = [];
    var bColumns = [];
    var pColumns = [];

    pColumns = [
      {
        key: 'personid',
        name: this.getMessage('BusinessComponents', 'IdentityTaxNumber')
      },
      {
        key: 'name',
        name: this.getMessage('BusinessComponents', 'Name')
      },
      {
        key: 'taxNumber',
        name: this.getMessage('BusinessComponents', 'IdentityTaxNumber  ')
      },
      {
        key: 'personType',
        name: this.getMessage('BusinessComponents', 'PersonType')
      },
      {
        key: 'fatherName',
        name: this.getMessage('BusinessComponents', 'FatherName')
      },
      {
        key: 'birthDate',
        type: 'date',
        name: this.getMessage('BusinessComponents', 'BirthDate')
      },
      {
        key: 'AccomodationCountryName',
        name: this.getMessage('BusinessComponents', 'LocationLabel')
      },
      {
        key: 'CitizenshipCountryName',
        name: this.getMessage('BusinessComponents', 'Citizenship')
      }
    ];

    if (this.state.isIndividual) {
      mColumns = [
        {
          key: 'identityNumber',
          name: this.getMessage('BusinessComponents', 'IdentityTaxNumber')
        },
        {
          key: 'name',
          name: this.getMessage('BusinessComponents', 'Name')
        },
        {
          key: 'surname',
          name: this.getMessage('BusinessComponents', 'Surname')
        },
        {
          key: 'motherName',
          name: this.getMessage('BusinessComponents', 'MotherName')
        },
        {
          key: 'fatherName',
          name: this.getMessage('BusinessComponents', 'FatherName')
        },
        {
          key: 'birthDate',
          type: 'date',
          name: this.getMessage('BusinessComponents', 'BirthDate')
        },
        {
          key: 'birthPlace',
          name: this.getMessage('BusinessComponents', 'BirthPlaceText')
        },

      ];
      bColumns = [
        {
          key: 'blackListName',
          name: this.getMessage('BusinessComponents', 'BlackListType')
        },
        {
          key: 'taxNumber',
          name: this.getMessage('BusinessComponents', 'TaxNumber')
        },
        {
          key: 'name',
          name: this.getMessage('BusinessComponents', 'Name')
        },
        {
          key: 'surname',
          name: this.getMessage('BusinessComponents', 'Surname')
        },
        {
          key: 'fatherName',
          name: this.getMessage('BusinessComponents', 'FatherName')
        },
        {
          key: 'motherName',
          name: this.getMessage('BusinessComponents', 'MotherName')
        },
        {
          key: 'birthDate',
          type: 'date',
          name: this.getMessage('BusinessComponents', 'BirthDate')
        },
        {
          key: 'birthPlace',
          name: this.getMessage('BusinessComponents', 'BirthPlace')
        },
        {
          key: 'birthPlaceText',
          name: this.getMessage('BusinessComponents', 'BirthPlaceText')
        },
        {
          key: 'informationSource',
          name: this.getMessage('BusinessComponents', 'Resource')
        },
        {
          key: 'description',
          name: this.getMessage('BusinessComponents', 'Description')
        }
      ];
    }
    else {
      mColumns = [
        {
          key: 'taxNumber',
          name: this.getMessage('BusinessComponents', 'TaxNumber')
        },
        {
          key: 'commercialName',
          name: this.getMessage('BusinessComponents', 'Name')
        },

        {
          key: 'establishmentDate',
          type: 'date',
          name: this.getMessage('BusinessComponents', 'EstablishmentDate')
        },
        {
          key: 'establishmentPlace',
          name: this.getMessage('BusinessComponents', 'EstablishmentPlace')
        }
      ];
      bColumns = [
        {
          key: 'blackListName',
          name: this.getMessage('BusinessComponents', 'BlackListType')
        },
        {
          key: 'taxNumber',
          name: this.getMessage('BusinessComponents', 'TaxNumber')
        },
        {
          key: 'name',
          name: this.getMessage('BusinessComponents', 'Name')
        },
        {
          key: 'corporateType',
          name: this.getMessage('BusinessComponents', 'CorporateType')
        },
        {
          key: 'informationSource',
          name: this.getMessage('BusinessComponents', 'Resource')
        },
        {
          key: 'description',
          name: this.getMessage('BusinessComponents', 'Description')
        }
      ];
    }
    this.setState({ personColumns: pColumns, mernisColumns: mColumns, blackListColumns: bColumns });

  }

  render() {
    let { context } = this.props;
    let cardStyle = {
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingBottom: '0px'
    };

    return (
      <BTransactionForm context={context}
        resourceInfo={this.props.resourceInfo}
        onActionClick={this.actionBarButtonClick.bind(this)}
        isWideCardEnabled={true}
        disableCardWidth={true}
        disabled={this.props.disableActions}>

        <BCard context={context} expandable={false} initiallyExpanded={false} style={cardStyle}>
          {this.props.fromAccountComponent ?
            <BDataGrid context={context}
              ref={ref => this.gridPerson = ref}
              columns={this.state.personColumns}
              dataSource={this.state.personList}
              headerBarOptions={{
                show: true,
                showTitle: true,
                title: this.getMessage('BusinessComponents', 'CustomerInfo'),
                showFiltering: true,
                showGrouping: true,
                showMoreOptions: true
              }} /> :
            <BDataGrid context={context}
              ref={ref => this.gridMernis = ref}
              columns={this.state.mernisColumns}
              dataSource={this.props.blackListMernisInfo}
              headerBarOptions={{
                show: true,
                showTitle: true,
                title: this.getMessage('BusinessComponents', 'CustomerInfo'),
                showFiltering: true,
                showGrouping: true,
                showMoreOptions: true
              }} />}
        </BCard>
        <BCard context={context} expandable={false} initiallyExpanded={false} style={cardStyle}>
          <BDataGrid context={context}
            ref={ref => this.gridBlackList = ref}
            columns={this.state.blackListColumns}
            dataSource={this.props.blackListContract}
            headerBarOptions={{
              show: true,
              showTitle: true,
              title: this.getMessage('BusinessComponents', 'BlackList'),
              showFiltering: true,
              showGrouping: true,
              showMoreOptions: true
            }} />
        </BCard>

      </BTransactionForm>
    );
  }
}

export default BBlackListComponent;
