import React from 'react';
import PropTypes from 'prop-types';
import { BBusinessComponent } from 'b-business-component';
import { Utils } from 'b-component';
import moment from 'moment/moment';
import { BIconButton } from 'b-icon-button';

export class BCommunicationSummary extends BBusinessComponent {
  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    ...BBusinessComponent.propTypes,
    data: PropTypes.array
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps
  };

  getData() {
    return this.props.data || [];
  }

  getIcon(iconName, environemnt, description) {
    let icon = (
      <BIconButton
        ref={r => (this.BIconButton = r)}
        style={{
          color: this.props.context.theme.boaPalette.warning500,
          transform: 'scale(0.8)',
          marginRight: '-12px',
          marginBottom: '5px'
        }}
        dynamicIcon={iconName}
        tooltip={this.getMessage(environemnt, description)}
      />
    );

    return icon;
  }

  getTableRows() {
    let isMobile = Utils.isMobile(this.props);
    let dateTdStyle = {
      border: '1px solid #ddd',
      fontSize: '13px',
      borderRight: '0',
      padding: '18px',
      textAlign: 'left',
      color: this.props.context.theme.boaPalette.base400,
      width: '25%',
      fontWeight: '500'
    };
    let descriptionTdStyle = {
      border: '1px solid #ddd',
      borderLeft: '0',
      paddingTop: '15px',
      textAlign: 'left',
      color: this.props.context.theme.boaPalette.base400,
      width: '75%'
    };
    let descriptionStyle = {
      fontSize: '14px',
      fontWeight: '500',
      color: this.props.context.theme.boaPalette.base500
    };
    let floatStyle = {
      float: isMobile ? 'none' : 'left',
      fontSize: '12px'
    };

    let communicationSummaryList: Array<any> = this.getData();
    if (communicationSummaryList.length > 0) {
      return communicationSummaryList.map(parameter => {
        return (
          <tr>
            <td style={dateTdStyle}>
              <div> {moment(parameter.beginDate).format('DD.MM.YYYY')}</div>
            </td>
            <td style={descriptionTdStyle}>
              <div style={descriptionStyle}>{parameter.documentName}</div>
              <div>
                <div style={floatStyle}>
                  {this.getIcon('AcUnit', 'BOAOne', 'DocumentNumber')}
                  {parameter.documentNo}
                </div>
                <div style={floatStyle}>
                  {this.getIcon('Domain', 'BOAOne', 'DocumentType')}
                  {parameter.documentTypeDescription}
                </div>
                <div style={floatStyle}>
                  {this.getIcon('Person', 'BOAOne', 'Documenting')}
                  {parameter.userFullName}
                </div>
              </div>
            </td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colspan="2" style={dateTdStyle}>
            <div style={{ fontSize: '13px' }}>{this.getMessage('BOAOne', 'CorrespondenceDescription')}</div>
          </td>
        </tr>
      );
    }
  }

  render() {
    let isMobile = Utils.isMobile(this.props);
    var tableStyle = {
      borderCollapse: 'collapse',
      backgroundColor: this.props.context.theme.boaPalette.comp500,
      width: isMobile ? '100%' : '40%'
    };
    var thStyle = {
      padding: '18px',
      border: '1px solid #ddd',
      fontWeight: '500',
      fontSize: '13px',
      color: this.props.context.theme.boaPalette.base300
    };
    return (
      <table style={tableStyle}>
        <style> {'tr:nth-child(even)'}</style>
        <tr>
          <th colspan="2" style={thStyle}>
            {this.getMessage('BOAOne', 'Correspondence')}
          </th>
        </tr>
        {this.getTableRows()}
      </table>
    );
  }
}
export default BCommunicationSummary;
