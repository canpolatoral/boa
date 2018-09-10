import React from 'react';
import { BBusinessComponent } from 'b-business-component';
import { BComponentComposer } from 'b-component';
import { BIcon } from 'b-icon';
var BButton = require('b-button').BButton;

@BComponentComposer
export class BAnnouncementComponent extends BBusinessComponent {

  constructor(props, context) {
    super(props, context);
    this.state = {
      announcementList: []
    };
  }

  static propTypes = {
    ...BBusinessComponent.propTypes
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps
  };

  getStyle() {
    return {
      tableStyle: { borderCollapse: 'collapse', backgroundColor: this.props.context.theme.boaPalette.comp500, minHeight: '80px', width: '75%' },
      trStyle: { border: '1px solid #ddd', margin: 'auto', fontSize: '12px', textAlign: 'right', color: this.props.context.theme.boaPalette.shad500 },
      thStyle: { padding: '20px', border: '1px solid #ddd', fontSize: '15px', color: this.props.context.theme.boaPalette.base300, fontWeight: 'bold' },
      tdStyle: { borderLeft: '0', padding: '20px', textAlign: 'left', color: this.props.context.theme.boaPalette.shad500, width: '92%' },
      tdIconStyle: { borderLeft: '0', width: '8%', verticalAlign: 'text-top', paddingTop: '20px' }
    };
  }

  getSnapshot() {
    return {
      state: this.state
    };
  }

  setSnapshot(snapshot) {
    this.setState({ ...snapshot.state });
  }

  getAnnouncementList() {
    if ((this.state.announcementList || []).length == 0) {
      let proxyRequest = {
        requestClass: 'BOA.Types.Container.BOAPortalRequest',
        requestBody: {
          MethodName: 'GetAnnouncements',
        },
        key: 'GetAnnouncements'
      };
      this.proxyTransactionExecute(proxyRequest);
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetAnnouncements':
        if (response.success == true) {
          // this.announcementList = [];
          let announcementList = [];

          if (response.value != null && response.value.announcementList != null && response.value.announcementList.length > 0) {
            for (var i = 0; i < response.value.announcementList.length; i++) {
              announcementList.push(
                {
                  educationId: response.value.announcementList[i].id,
                  header: response.value.announcementList[i].header,
                  detail: response.value.announcementList[i].details,
                  iconPath: response.value.announcementList[i].iconPath,
                  link: response.value.announcementList[i].linkText,
                });
            }
            this.setState({ announcementList: announcementList });
          }
        }
        else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.getAnnouncementList();
  }

  getIcon(iconName) {
    const Icon = {
      dynamicIcon: iconName,
      iconProperties: {
        color: this.props.context.theme.boaPalette.comp500
      }
    };
    return BIcon.getIcon(Icon);
  }

  createTableRow(announcement) {
    if (announcement) {
      return (<tr style={this.getStyle().trStyle}>
        <td style={this.getStyle().tdIconStyle}>
          <div>
            <BButton
              context={this.props.context}
              type="fab"
              fontIcon={this.getIcon('AccountBalance')}
              disabled={true}
              mini={true}
              style={{ backgroundColor: this.props.context.theme.boaPalette.badgePurple, color: this.props.context.theme.boaPalette.comp500 }}
            />
          </div>
        </td>
        <td style={this.getStyle().tdStyle}>
          <div style={{ fontWeight: 'bold' }}>{announcement.header}</div><br />
          <div style={{ float: 'left' }}> {announcement.detail}</div>
        </td>
      </tr>);
    } else {
      return (null);
    }
  }

  renderAnnouncements() {
    let returnArray = [];
    if (this.state.announcementList && this.state.announcementList.length > 0) {
      for (var i = 0; i < this.state.announcementList.length; i++) {
        returnArray.push(this.createTableRow(this.state.announcementList[i]));
      }
    }
    return (
      <table style={this.getStyle().tableStyle}>
        <style> {'tr:nth-child(even)'}</style>
        <tr style={this.getStyle().trStyle}>
          <th colspan='2' style={this.getStyle().thStyle}> {this.getMessage('BOAOne', 'Announcement')}</th>
        </tr>
        {returnArray}
      </table>
    );
  }

  render() {
    return (
      <div>
        {this.renderAnnouncements()}
      </div>
    );
  }
}
export default BAnnouncementComponent;