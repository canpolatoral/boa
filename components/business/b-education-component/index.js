import React from 'react';

import { BBusinessComponent } from 'b-business-component';
import { BComponentComposer } from 'b-component';
import { BIconButton } from 'b-icon-button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import moment from 'moment/moment';
import { BCard } from 'b-card';
import * as SvgIcons from '@material-ui/icons';
import PropTypes from 'prop-types';

@BComponentComposer
export class BEducationComponent extends BBusinessComponent {

  educationList = [];
  getAllEducations = false;
  educationDisplayCount = undefined;

  constructor(props, context) {
    super(props, context);
    this.state = {
      educationList: [],
      getAllEducations: false
    };
  }

  static propTypes = {
    ...BBusinessComponent.propTypes,
    educationDisplayCount : PropTypes.number
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    educationDisplayCount: 4,
  };

  getValue() {
    return {

    };
  }

  resetValue() {
    this.setState({
      getAllEducations: false,
      educationDisplayCount: this.defaultEducationDisplayCount,
    });
  }

  getStyle() {
    return {
      dateStyle: { fontSize: '12px', color: 'gray', paddingBottom: '5px' },
      cardStyle: { display: 'flex', width: '260px', height: '100px', margin: '10px' }, // , height: '120px'
      detailsStyle: { display: 'flex', flexDirection: 'column' },
      detailsStyle2: { display: 'flex' },
      durationStyle: {
        color: 'gray', fontSize: '14px', textDecoration: 'none', textAlign: 'center', marginBottom: '10px',
        position: 'absolute', width: '100%', bottom: '5px', opacity: '0.8'
      },
      cardContentStyle: {
        width: '180px', height: '80px', overflow: 'hidden', display: 'inline-block',
        textOverflow: 'ellipsis', 'padding-left': '15px', 'padding-right': '0px',
        'padding-top': '5px', 'word-wrap': 'break-word', 'max-height': '4em', 'line-height': '1em'
      },
      linkStyle: {
        flex: '1 0 auto', verticalAlign: 'middle', fontsize: '14px', height: '10px', width: '10px',
        color: 'black', fontWeight: 'bold', textDecoration: 'none'
      },
      mainIconStyle: { width: '80px', height: '100px', 'background-color': '#80ccff', 'padding-left': '20px', 'padding-top': '30px' },
      iconButtonsStyle: { display: 'flex', alignItems: 'center', paddingLeft: '2px', paddingBottom: '0px' },
      likeIconBlueStyle: { color: 'blue', transform: 'scale(0.8)' },
      likeIconGrayStyle: { color: 'gray', transform: 'scale(0.8)' },
      likeCountStyle: { marginLeft: '-8px', fontSize: '12px', color: 'gray' },
      visibleCountStyle: { marginLeft: '-8px', fontSize: '12px', color: 'gray' },
      visibleIconBlueStyle: { color: 'blue', marginLeft: '15px', transform: 'scale(0.8)' },
      visibleIconGrayStyle: { color: 'gray', marginLeft: '15px', transform: 'scale(0.8)' }
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
  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (nextProps !== this.props) {
      // this.setState({ // TODO: ...
      //   selectedStateId:nextProps.selectedStateId,
      //   selectedFlowId:nextProps.selectedFlowId,
      // });

    }
  }


  getEducationList() {
    let proxyRequest = {
      requestClass: 'BOA.Types.Container.BOAPortalRequest',
      requestBody: {
        MethodName: 'RefreshEducationAndSurvey',
      },
      key: 'RefreshEducationAndSurvey'
    };
    this.proxyTransactionExecute(proxyRequest);
  }

  likeOrDislikeEducation(education) {
    var educationAnnouncementContract = {
      Id: education.educationId,
      IsUserLiked: !education.isUserLiked,
    };
    let proxyRequest = {
      requestClass: 'BOA.Types.Container.EducationAnnouncementRequest',
      requestBody: {
        MethodName: 'LikeOrDislikeEducation',
        DataContract: educationAnnouncementContract
      },
      key: 'LikeOrDislikeEducation'
    };
    this.proxyExecute(proxyRequest);

  }

  browseEducation(education) {
    var clientResourceVideoAccessContract = {
      ResourceId: 0, // Portaldan açıldığı için 0 veirliyor
      EducationId: education.educationId,
      AccessTime: new Date(),
      UserName: this.props.context.applicationContext.user.userName,
      HostIP: this.props.context.applicationContext.user.ipAddress,
      HostName: this.props.context.applicationContext.user.machineName
    };
    let proxyRequest = {
      requestClass: 'BOA.Types.Container.ClientResourceVideoAccessRequest',
      requestBody: {
        MethodName: 'Insert',
        DataContract: clientResourceVideoAccessContract
      },
      key: 'browseEducation'
    };
    this.proxyExecute(proxyRequest);

  }

  getIcon() {
    let proxyRequest = {
      requestClass: 'BOA.UI.Content.ContentManager',
      requestBody: {
        MethodName: 'GetEducationIconByName',
        IconPath: 'Resource003056.png',
      },
      key: 'GetEducationIconByName'
    };
    this.proxyExecute(proxyRequest);
  }


  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'RefreshEducationAndSurvey':
        if (response.success == true) {
          this.educationList = [];
          if (response.value != null && response.value.educationAnnouncementList != null && response.value.educationAnnouncementList.length > 0) {
            for (var i = 0; i < response.value.educationAnnouncementList.length; i++) {
              this.educationList.push(
                {
                  educationId: response.value.educationAnnouncementList[i].id,
                  header: response.value.educationAnnouncementList[i].header,
                  link: response.value.educationAnnouncementList[i].linkText,
                  date: moment(response.value.educationAnnouncementList[i].startDate).format('DD.MM.YYYY'),
                  duration: response.value.educationAnnouncementList[i].duration,
                  likeCount: response.value.educationAnnouncementList[i].likeCount,
                  isUserLiked: response.value.educationAnnouncementList[i].isUserLiked,
                  viewCount: response.value.educationAnnouncementList[i].viewCount,
                });
            }
            this.setState({ educationList: this.educationList });

          }


        }
        else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
      case 'LikeOrDislikeEducation':
        if (response.success == true) {
          this.getEducationList();
        }
        else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
      case 'browseEducation':
        if (response.success == true) {
          this.getEducationList();
        }
        else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
      case 'GetEducationIconByName':
        if (response.success == true) {
          this.getEducationList();
        }
        else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.getEducationList();
  }

  handleSelectFlow(index, selectedItems, selectedValues) {
    this.setState({ selectedFlowId: selectedValues[0] });
    if (this.props.onFlowSelect) {
      this.props.onFlowSelect(selectedValues[0]);
    }
    if (selectedValues[0] != -1
      && this.props.stateVisible === true) {
      this.getStateList(selectedValues[0]);
    }
  }

  handleSelectState(index, selectedItems, selectedValues) {
    this.setState({ selectedStateId: selectedValues[0] });
    if (this.props.onStateSelect) {
      this.props.onStateSelect(selectedValues[0]);
    }
  }

  getMainIcon() {
    const iconStyle = { width: '40px', height: '40px' };
    const icon = {
      dynamicIcon: 'Textsms',
      iconProperties: {
        style: { ...iconStyle, color: '#f5f5f0' }
      }
    };
    let DynamicIcon = SvgIcons[icon.dynamicIcon];
    return (<DynamicIcon {...icon.iconProperties} />);
  }

  retrunCard(education) {
    if (education) {
      let educationHeader = education.header.length > 35 ? education.header.substr(0, 35) + '...' : education.header;
      let btnLike = education.isUserLiked ? this.getStyle().likeIconBlueStyle : this.getStyle().likeIconGrayStyle;
      return (
        <Card context={this.props.context} style={this.getStyle().cardStyle} >
          <div style={{ display: 'flex' }}>
            <div style={this.getStyle().detailsStyle2}>
              <ButtonBase onClick={this.browseEducation.bind(this, education)} target="_blank" href={education.link} style={{ cursor: 'default', 'text-decoration': 'none' }}  >
                <CardContent style={this.getStyle().mainIconStyle} >
                  {this.getMainIcon()}
                  <label style={{ color: '#f5f5f0', 'font-size': '12px', 'padding-left': '5px' }}>{education.duration}</label>
                </CardContent>
              </ButtonBase>
            </div>
            <div style={this.getStyle().detailsStyle}>
              <div>
                <CardContent style={this.getStyle().cardContentStyle}>
                  <Typography style={this.getStyle().dateStyle}>{education.date}</Typography>
                  <a target="_blank" title = {educationHeader} onClick={this.browseEducation.bind(this, education)} href={education.link} style={this.getStyle().linkStyle}>{educationHeader}</a>
                </CardContent>
              </div>
              <div style={this.getStyle().iconButtonsStyle}>
                <BIconButton
                  ref={r => this.BIconButton = r}
                  style={btnLike}
                  context={this.context}
                  dynamicIcon='ThumbUp'
                  tooltip= {this.getMessage('BOAOne', 'Like')}
                  disabled={education.disabled}
                  onClick={this.likeOrDislikeEducation.bind(this, education)}
                />
                <Typography style={this.getStyle().likeCountStyle}>{education.likeCount}</Typography>
                <BIconButton
                  ref={r => this.BIconButton = r}
                  style={this.getStyle().visibleIconGrayStyle}
                  context={this.context}
                  dynamicIcon='Visibility'
                  tooltip = {this.getMessage('BOAOne', 'ViewCount')}
                  disabled={this.props.disabled}
                />
                <Typography style={this.getStyle().visibleCountStyle}>{education.viewCount}</Typography>
              </div>
            </div>
          </div>
        </Card >
      );
    } else {
      return (null);
    }

  }

  setAllEducations() {
    this.getAllEducations = true;
    this.setState({ getAllEducations: this.educationList });
  }

  renderEducationsByDisplayCount() {
    let returnArray = [];
    let count = this.props.educationDisplayCount;
    if (this.educationList) {
      for (var i = 0; i < count; i++) {
        returnArray.push(this.retrunCard(this.educationList[i]));
      }
    }
    return (
      <BCard context={this.props.context} style={{ width: '600px', background: 'center', 'box-shadow': 'none' }}>
        <div>
          <tr>
            <td style={{ width: '300px', paddingLeft: '10px' }}>
              <label style={{ coloe: 'gray' }}>{this.getMessage('BOAOne', 'LastAddedEducations')}</label>
            </td>
            <td style={{ width: '250px', display: 'block', textAlign: 'right' }}>
              <a target="_blank" onClick={this.setAllEducations.bind(this)} style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}>{this.getMessage('BOAOne', 'AllEducations')}</a>
            </td>
          </tr>
        </div>
        <CardContent style={{ marginLeft: '0px', marginRight: '-10px', padding: '0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {returnArray}
          </div>
        </CardContent>

      </BCard>);

  }
  renderAllEducations() {
    let returnArray = [];
    if (this.educationList) {
      for (var i = 0; i < this.educationList.length; i++) {
        returnArray.push(this.retrunCard(this.educationList[i]));
      }
    }
    return (
      <BCard context={this.props.context} style={{ background: 'center', 'box-shadow': 'none' }} >
        <CardContent style={{ marginLeft: '-20px', marginRight: '-20px', padding: '0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {returnArray}
          </div>
        </CardContent>

      </BCard>);
  }

  render() {
    return (
      <div>
        {this.getAllEducations ? this.renderAllEducations() : this.renderEducationsByDisplayCount()}
      </div>

    );
  }
}
export default BEducationComponent;
