import React from 'react';
import PropTypes from 'prop-types';
import BRDLViewerForm from './BRDLViewerForm';

import { BComponent } from 'b-component';
import { BDialogHelper } from 'b-dialog-box';
import { BBusinessComponent } from 'b-business-component';
import { BComponentComposer } from 'b-component';

@BComponentComposer
export class BRDLDialogViewer extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    reportPath: PropTypes.string.isRequired,
    reportParameters: PropTypes.array,
    reportDatasources: PropTypes.array
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      reportPath: this.props.reportPath
    };
  }

  componentWillMount() {
    super.componentWillMount();
    this.setState({ reportPath: 'BOA.One.Report.TestReport.rdlc' });
  }

  // compoent test için
  showRDLDialog() {
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
    let dialog = (
      <BRDLViewerForm
        context={this.props.context}
        reportPath={this.state.reportPath}
        reportParameters={reportParameters}
        reportDatasources={reportDatasources}
        dialogResponseStyle={BComponent.DialogResponseStyle.OKCANCEL} />);
    BDialogHelper.showWithResourceCode(this.props.context, '', dialog, 0, 0, '', this.handleClose.bind(this), { width: '82%', height: '85%' });
    return <div></div>;
  }

  // dışarıdan çağrım için
  // displayName : Dialogbox header
  static showRDL(context, displayName, reportPath, reportParameters, reportDatasources, dialogResponseStyle, onClose) {
    let dialog = (
      <BRDLViewerForm context={context} reportPath={reportPath} reportParameters={reportParameters} reportDatasources={reportDatasources} dialogResponseStyle={dialogResponseStyle} />
    );
    if (onClose) {
      BDialogHelper.showWithResourceCode(context, '', dialog, 0, 0, displayName, onClose, { width: '82%', height: '85%' });
    }
    else {
      BDialogHelper.showWithResourceCode(context, '', dialog, 0, 0, displayName, 0, { width: '82%', height: '85%' });
    }
  }

  render() {
    if (this.state.reportPath) {
      return this.showRDLDialog();
    }
    return (<div style={{ display: 'none' }} />);
  }
}

export default BRDLDialogViewer;
