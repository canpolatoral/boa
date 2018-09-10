import React from 'react';
import { BDialogHelper } from 'b-dialog-box';
import { BComponent } from 'b-component';
import { BRDLViewer } from 'b-rdl-viewer';
import { BRDLDialogViewer } from 'b-rdl-dialog-viewer';
import { BButton } from 'b-button';

export class BRDLViewerTestGenerator  {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    this.disabled = false;
  }

  _btnShowRDLDialogOnclick() {
    var reportPath = 'BOA.One.Report.TestReport.rdlc';
    var reportParameters = [
      {
        ParameterName: 'BankName',
        Value: 'BOA One'
      }
    ];
    var reportDatasources = [
      {
        Name: 'DataSourceList',
        Type: 'BOA.Types.One.ReportDatasourceContract',
        Value: [
          {
            Name: 'Nusret Parlak',
            Value: 'Architecht'
          },
          {
            Name: 'Canpolat Oral',
            Value: 'Kuveyt Türk'
          },
          {
            Name: 'Mehmet Vacit Baydarman',
            Value: 'Architecht'
          }
        ]
      }
    ];
    BRDLDialogViewer.showRDL(this.context, '', reportPath, reportParameters, reportDatasources, BComponent.DialogResponseStyle.OKCANCEL, this.onRDLDialogClose.bind(this));
  }

  onRDLDialogClose(dialogResponse) {
    var message = 'RDL Dialog Response is: ' + (dialogResponse == BComponent.DialogResponse.OK ? 'OK' : (dialogResponse == BComponent.DialogResponse.CANCEL ? 'CANCEL' : 'NONE'));
    BDialogHelper.show(this.context, message, BComponent.DialogType.INFO, BComponent.DialogResponseStyle.OK);
  }

  generate(context) {
    this.context = context;
    var reportPath = 'BOA.One.Report.TestReport.rdlc';
    var reportParameters = [
      {
        ParameterName: 'BankName',
        Value: 'BOA One'
      }
    ];
    var reportDatasources = [
      {
        Name: 'DataSourceList',
        Type: 'BOA.Types.One.ReportDatasourceContract',
        Value: [
          {
            Name: 'Nusret Parlak',
            Value: 'Architecht'
          },
          {
            Name: 'Canpolat Oral',
            Value: 'Kuveyt Türk'
          },
          {
            Name: 'Mehmet Vacit Baydarman',
            Value: 'Architecht'
          }
        ]
      }
    ];
    return [
      {
        'text': 'BRDLViewer',
        'component':
  <div>
    <div style={{ marginBottom: '10px' }}>
      <BButton
      id="disable"
      text="Show RDL Dialog Viewer"
      onClick={this._btnShowRDLDialogOnclick.bind(this)} />
      <BRDLViewer
        context={context}
        ref={(r) => this.BRDLViewer = r}
        reportPath={reportPath}
        reportParameters={reportParameters}
        reportDatasources={reportDatasources}
      />
    </div>
  </div>
      }
    ];
  }
}

export default BRDLViewerTestGenerator;
