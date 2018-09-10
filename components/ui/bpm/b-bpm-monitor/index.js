import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer } from 'b-component';
import { BDialogHelper } from 'b-dialog-box';
import { BBusinessComponent } from 'b-business-component';
import { BTabBar } from 'b-tab-bar';
import { BRouteHistory } from 'b-bpm-route-history';
import { BUserNote } from 'b-bpm-user-note';

@BComponentComposer
export class BpmMonitor extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceInfo: PropTypes.any,
    resourceCode: PropTypes.string,
    instanceId: PropTypes.any
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    resourceCode: 'ISATROTMAP'
  };

  constructor(props, context) {
    super(props, context);
    this.state.isloading = true;
  }

  actionClick(command) {
    switch (command.commandName) {
      case 'GetInfo':
        {
          this.getRouteHistory();
          break;
        }
    }
  }
  contentHeight = null;
  static showMonitor(context, instanceId) {
    let historyDialog = (<BpmMonitor context={context} instanceId={instanceId} />);
    let dialogStyle;
    let isMobileOrTablet = context.deviceSize < BComponent.Sizes.MEDIUM;
    if (isMobileOrTablet) {
      dialogStyle = { width: '90%', height: '90%' };
    }
    else {
      dialogStyle = { width: 500, height: '75%' };
    }
    BDialogHelper.show(context, historyDialog, 0, 0, 'BPM MONITOR', this.callBack, dialogStyle);
  }

  handleClose() {
    BDialogHelper.close(this);
  }

  generateTab() {

    var criteriaTabSet = [
      {
        'text': this.getMessage('BusinessComponents', 'WorkFlowRouteMap'),
        'value': 0,
        'content':
          (
            <div style={{ height: this.contentHeight, width: '100%' }}>
              <BRouteHistory
                context={this.props.context}
                instanceId={this.props.instanceId}
              />
            </div>
          )
      },
      {
        'text': this.getMessage('BusinessComponents', 'WorkFlowNotes'),
        'value': 1,
        'content':
          (
            <div style={{ height: this.contentHeight, width: '100%' }} >
              <BUserNote context={this.props.context} height={this.contentHeight} instanceId={this.props.instanceId}></BUserNote>
            </div>
          )
      }
    ];

    var tabTemplateStyle = {
      padding: 0,
      left: 0,
      right: 0,
      bottom: 54,
      top: 90,
      position: 'absolute'
    };
    return (
      <div ref={r => this.tabBar = r} style={{ height: '90%', width: '100%' }} id='BTabBarCont'>
        <BTabBar
          context={this.props.context}
          tabItems={criteriaTabSet}
          mode='secondary'
          initialSelectedIndex={0}
          tabTemplateStyle={tabTemplateStyle}
        />
      </div>
    );
  }

  render() {
    return this.generateTab();
  }


  componentDidMount() {
    super.componentDidMount();
    this.resizeComponenet();
  }

  resizeComponenet() {
    if (this.tabBar && !this.contentHeight) {
      this.contentHeight = (this.tabBar.offsetHeight - 48);
      this.forceUpdate();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
    this.resizeComponenet();
  }


}

export default BpmMonitor;
