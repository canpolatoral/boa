import React from 'react';
import propTypes from 'prop-types';
import { BInformationText } from 'b-information-text';
import { BComponentComposer} from 'b-component';
import {BBusinessComponent} from 'b-business-component';
import {BCard} from 'b-card';
import { BGridSection } from 'b-grid-section';
import { BGridRow } from 'b-grid-row';
import {withStyles} from '@material-ui/core/styles';
import { BMenuItem } from 'b-menu-item';
import {BIcon} from 'b-icon';
import { MenuList } from '@material-ui/core';
import { Logos } from 'b-icon';
import { BIconButton } from 'b-icon-button';
import { BLabel } from 'b-label';

const styles = theme => ({
  divStyle:{
    borderleft: '1px solid #333',
    paddingLeft:'5px'
  },
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignContent: 'stretch',
    background: theme.boaPalette.comp500,
    width: '100%'
  },
  listItemRoot: {
    paddingTop: 6,
    paddingBottom: 6,
    minHeight: 36,
  },
  listItemRootMobile: {
    minHeight: 48,
  },
  listItemTextPrimary: {
    color: theme.boaPalette.base400,
    fontSize: 14,
  },
  menuItemRoot: {
    minHeight: 48,
  },
  menuItemGutters: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  menuItemTextPrimary: {
    color: theme.boaPalette.base450,
    fontSize: 13,
  }
});
@BComponentComposer
@withStyles(styles)
export class BAnnualLeave extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    data: propTypes.array
  };
  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    multiColumn: true,
  };
  constructor(props, context) {
    super(props, context);
    this.disabled = true;
  }
  state = {
    importantDayTypes:{
      anniversary: 1,
      absence: 2,
      birthday: 3,
      other: 4,
      quiz: 5,
      education: 6,
      travel: 7
    },
    descriptionAboutPerson:[]
  }
  getData() {
    return this.props.data || [];
  }
  getYouareInKuwaitTurk() {
    let personHRInfo: Array<any> = this.getData();
    if (personHRInfo.length>0) {
      const workKTSinceString = personHRInfo.workKTSinceString;
      const stringYouareInKuwaitTurk = this.getMessage('BusinessComponents', 'YouareInKuwaitTurk');
      const workKTSinceDateString = personHRInfo.workKTSinceDateString;
      const { KTLogoWhite } = Logos;
      let logo = <KTLogoWhite style={{ width: '45px', height: '45px' }} />;
      return (<BCard
    context={this.props.context}
    column={2}
    style={{ backgroundColor: 'rgb(0, 102, 71)' }}
    mobileSortOrder={2}>
        <div>
          <div style={{ width: '50px', height: '50px', float: 'left', marginRight: '15px', marginTop: '8px'}}>
            {logo}
          </div>
          <div style={{ color: 'white', fontSize: '13px', display: 'table-cell', paddingTop: '5px' }}>
            <BGridSection
          context={this.props.context}
          style={this.props.style}
          rowPadding={2}>
              <BGridRow context={this.props.context}>{workKTSinceString}</BGridRow>
              <BGridRow context={this.props.context}>{stringYouareInKuwaitTurk}</BGridRow>
              <BGridRow context={this.props.context}><div style={{ fontSize: '11px' }}>{workKTSinceDateString}</div></BGridRow>
            </BGridSection>
          </div>
        </div>
      </BCard >);
    }
  }
  getMenuItems() {
    let personHRInfo: Array<any> = this.getData();
    const leftIconFlag = BIcon.getIcon({ dynamicIcon: 'Flag' });
    const leftIconSchool = BIcon.getIcon({ dynamicIcon: 'School' });
    const leftIconStyleRed='red';
    const leftIconStyleBlue='blue';
    let flag;
    let flagColor;
    const menuItems = (personHRInfo.length>0 && personHRInfo.importantDays &&
          personHRInfo.importantDays.length > 0 && personHRInfo.importantDays.map((day) =>{
            switch (day.importantDayTypeId) {

              case this.state.importantDayTypes.Anniversary:
              case this.state.importantDayTypes.absence    :
              case this.state.importantDayTypes.birthday   :
              case this.state.importantDayTypes.other      :
              case this.state.importantDayTypes.education  :
                {
                  flag=leftIconFlag;
                  flagColor=leftIconStyleRed;
                  break;
                }
              case this.state.importantDayTypes.quiz:
                {
                  flag=leftIconSchool;
                  flagColor=leftIconStyleBlue;
                  break;
                }
              default:
                {
                  flag=leftIconFlag;
                  flagColor=leftIconStyleRed;
                  break;
                }
            }
            return (<BMenuItem
                className={this.props.classes.menuItem}
                context={this.props.context}
                primaryText={day.description}
                primaryTextPadding={'-10px'}
                leftIcon={flag}
                leftIconStyle={{color:flagColor}}
                />);
          }));
    return menuItems;
  }
  getImportantDays() {
    return (
      <BCard
      context = {this.props.context}
      // title = "Önemli Günleriniz"
      title={this.getMessage('BusinessComponents', 'YourImportantDays')}
      column = {0} >
        <div>
          <MenuList>
            {this.getMenuItems()}
          </MenuList>
        </div>
      </BCard >
    );
  }
  getPermissionInformation() {
    let personHRInfo: Array<any> = this.getData();
    if (personHRInfo.length>0 && personHRInfo.absenceInformation) {
      // Toplam Yıllık İzin ve Planlanan parametreleri aynı değerden(totalAbsence) çektim şimdilik.
      let totalAbsence = personHRInfo.absenceInformation.totalAbsence.toString();
      let plannedAbsence = personHRInfo.absenceInformation.totalAbsence.toString();
      let remainingAbsence = personHRInfo.absenceInformation.remainingAbsence.toString();
      let usedAbsence = personHRInfo.absenceInformation.usedAbsence.toString();

      return (<BCard
      context = {this.props.context}
      // title = "İzin Bilgileriniz" YourPermissionInformation
       title={this.getMessage('BusinessComponents', 'YourPermissionInformation')}
      column = {0}
       >
        <BInformationText
              context={this.props.context}
              // labelText="Toplam Yıllık İzin"
              title={this.getMessage('BusinessComponents', 'TotalAnnualLeave')}
              infoText={totalAbsence}
              />
        <BGridSection context={this.props.context} style={this.props.style}>
          <BGridRow context={this.props.context} columnCount={4}>
            <div>
              <table>
                <tr><td>{this.getMessage('BusinessComponents', 'Planned')}</td></tr>
                <tr><th>{plannedAbsence}</th></tr>
              </table>
            </div>

            <div style={{borderLeft:'solid 1px black', padding:'5px'}}>
              <table>
                <tr><td>{this.getMessage('BusinessComponents', 'Used')}</td></tr>
                <tr><th style={{color:'red'}}>{usedAbsence}</th></tr>
              </table>
            </div>

            <div style={{borderLeft:'solid 1px black', padding:'5px'}}>
              <table>
                <tr><td>{this.getMessage('BusinessComponents', 'Remaining')}</td></tr>
                <tr><th style={{color:'green'}}>{remainingAbsence}</th></tr>
              </table>
            </div>
          </BGridRow>
        </BGridSection>
      </BCard >
      );
    }
  }
  getIconInfo(iconName, descriptionAboutPerson) {
    let icon = <BIconButton
      ref={r => this.BIconButton = r}
      style={{ color: this.props.context.theme.boaPalette.pri500, margin:'-80px', transform: 'scale(1)'}}
      context={this.props.context}
      dynamicIcon={iconName}
      tooltip={ descriptionAboutPerson.map((key) =>{
        return (<BLabel
          context={this.props.context}
          text={key}/>
        );})}/>;

    return icon;
  }
  getWorkingPermissionInformation() {
    let personHRInfo: Array<any> = this.getData();
    if (personHRInfo.length>0 && personHRInfo.positionFamilyAbsenceInfo) {
      let absenseList = personHRInfo.positionFamilyAbsenceInfo;
      let onAbsencePersonCount = 0;
      let allPersonListWithAbsence = [];
      let positionFamilyAbsenseList = [];
      for (var key in absenseList) {
        onAbsencePersonCount += absenseList[key].onAbsencePersonCount;
        allPersonListWithAbsence.push(absenseList[key].personWithAbsenceList);
        positionFamilyAbsenseList.push(absenseList[key]);
      }
      if (onAbsencePersonCount == 0)
        return;
      let outgm = positionFamilyAbsenseList.filter(x => x.isInHeadOffice == false && x.onAbsencePersonCount > 0);

      if (outgm.length > 0) {
        this.setState({descriptionAboutPerson: outgm});
      }
      return (<BCard
      ref={(r) => personHRInfo.positionFamilyAbsenceInfo = r}
      multiColumn={true}
      context = {this.props.context}
      // title = "Çalışan İzin Bilgileriniz"
        title= {this.getMessage('BusinessComponents', 'InformationOfEmployeeAbsence')}>
        <BGridSection context={this.props.context} style={this.props.style}>
          <BGridRow context={this.props.context} columnCount={2}>
            <BInformationText
              context={this.props.context}
               labelWidth={15}
              // labelText="Toplam İzinli Çalışan Sayısı"
              labelText={this.getMessage('BusinessComponents', 'TotalPermittedEmployees')}
              infoText={onAbsencePersonCount.toString()}/>
            {this.getIconInfo('Info', this.state.descriptionAboutPerson)}
          </BGridRow>
        </BGridSection>
      </BCard >
      );
    }
  }

  render() {
    return (<div style = { {width:500} }>
      {this.getYouareInKuwaitTurk()}
      {this.getImportantDays()}
      {this.getPermissionInformation()}
      {this.getWorkingPermissionInformation()}
    </div>);
  }
}
export default BAnnualLeave;
