import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';
import { BDivider } from 'b-divider';
import { BInformationText } from 'b-information-text';
import { BLabel } from 'b-label';

@BComponentComposer
export class BActionManagerInfo extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    /**
     * Resource definition of form.
    */
    resourceInfo: PropTypes.object.isRequired,

    visibleInfoButton: PropTypes.bool,

    onClose: PropTypes.func,
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    visibleInfoButBComponentton: true,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      openInfoMenu: false,
      productVisible: false
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.context !== this.props.context) ||
      (nextState.openInfoMenu !== this.state.openInfoMenu);
  }
  closeInfoMenuClick() {
    this.setState((prevState) => {
      return { openInfoMenu: !prevState.openInfoMenu };
    });
    this.props.onClose();
  }
  resultActionListToString(resultList) {
    let actionList = ' ';
    if (resultList && resultList.length > 0) {
      resultList.forEach((item) => {
        actionList += item.actionId +','+ item.name +','+ item.commandName + ','+item.actionType + ','+item.iconPath +  <br/>;
      }, this);
    }
    return actionList;
  }
  render() {
    // console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV==='production' ) {  this.setState(() => { return { productVisible:false}; });}
    else { this.setState(() =>{ return {productVisible:true}; });}
    const titleStyle = {
      color: this.props.context.theme.boaPalette.base400,
      marginBottom: '24px',
      fontSize: '16px'
    };
    const divStyle = {
      margin: '24px 24px 24px 24px'
    };
    const dividerStyle = {
      margin: '24px 0px 24px 0px'
    };
    return (
      <div>
        <div style={divStyle}>
          <BLabel context={this.props.context} text={this.getMessage('BOA', 'AboutResource')} style={titleStyle}/>
          {/* <BInformationText context={this.props.context} labelText={this.getMessage('BOA', 'LoadDurationLabel')} infoText={this.props.resourceInfo.identity}></BInformationText> */}
          <BInformationText context={this.props.context} labelText={this.getMessage('BOA', 'ScreenNumberLabel')} infoText={this.props.resourceInfo.id}></BInformationText>
          <BInformationText context={this.props.context} labelText={this.getMessage('BOA', 'ScreenNameLabel')} infoText={this.props.resourceInfo.name}></BInformationText>
          <BInformationText context={this.props.context} labelText={this.getMessage('BOA', 'ScreenResouceCodeLabel')} infoText={this.props.resourceInfo.resourceCode}></BInformationText>
          <BInformationText context={this.props.context} labelText={this.getMessage('BOA', 'ScreenDescriptionLabel')} infoText={this.props.resourceInfo.description}></BInformationText>
          <BInformationText context={this.props.context} labelText={this.getMessage('BOA', 'BusinessOwnerWorkGroupLabel')} infoText={this.props.resourceInfo.moduleCode}></BInformationText>
          {/* <BInformationText context={this.props.context} labelText={this.getMessage('BOA', 'ITOwnerWorkGroupLabel')} infoText={this.props.context.applicationContext.userManager.workGroupName}></BInformationText> */}
          <BInformationText context={this.props.context} labelText={this.getMessage('BOA', 'FullPathLabel')} infoText={this.props.resourceInfo.fullPath}></BInformationText>
        </div>
        <div style={{display: this.state.productVisible? 'none':'' }}>
          <div>
            <BDivider context={this.props.context} style={dividerStyle} />
          </div>
          <div style={divStyle}>
            <BLabel context={this.props.context} text={this.getMessage('BOAOne', 'DisplayComplexity')} style={titleStyle}/>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOA', 'ComplexityLabel')} infoText={this.props.context.applicationContext.user.machineName}></BInformationText>
            {/* <div style={{ height:'78px'}}>
              <div style={{ float:'left', marginTop: '24px', marginBottom: '24px'}}>
                {BIcon.getIcon(icon)}
              </div>
              <div style={{ float:'left', marginTop: '24px', marginBottom: '24px'}}>
                <BInformationText context={this.props.context} labelText={this.props.context.applicationContext.user.ipAddress} />
              </div>
            </div> */}
          </div>
          <div>
            <BDivider context={this.props.context} style={dividerStyle} />
          </div>
          <div style={divStyle}>
            <BLabel context={this.props.context} text={this.getMessage('BOAOne', 'AdditionalInformation')} style={titleStyle}/>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'AssemblyName')} infoText={this.props.resourceInfo.assemblyName}></BInformationText>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'ClassName')} infoText={this.props.resourceInfo.className}></BInformationText>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'IconPath')} infoText={this.props.resourceInfo.iconPath}></BInformationText>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'IsRevokable')} infoText={this.props.resourceInfo.isRevokable}></BInformationText>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'IsWorkflow')} infoText={this.props.resourceInfo.isWorkflow}></BInformationText>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'ModuleCode')} infoText={this.props.resourceInfo.moduleCode}></BInformationText>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'OpenedBy')} infoText={this.props.resourceInfo.openedBy}></BInformationText>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'OpenState')} infoText={this.props.resourceInfo.openState}></BInformationText>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'Parent')} infoText={this.props.resourceInfo.parent}></BInformationText>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'RibbonToolSizingMode')} infoText={this.props.resourceInfo.ribbonToolSizingMode}></BInformationText>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'SearchTag')} infoText={this.props.resourceInfo.searchTag}></BInformationText>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'SortId')} infoText={this.props.resourceInfo.sortId}></BInformationText>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'ToolTipImagePath')} infoText={this.props.resourceInfo.toolTipImagePath}></BInformationText>
            <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'UIType')} infoText={this.props.resourceInfo.uiType}></BInformationText>
            {/* <BInformationText context={this.props.context} labelText={this.getMessage('BOAOne', 'Actions')} infoText={this.resultActionListToString(this.props.resourceInfo.resourceActionList)}></BInformationText> */}

          </div>
        </div>


      </div>
    );
  }
}
export default BActionManagerInfo;
