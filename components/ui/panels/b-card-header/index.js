import React from 'react';
import PropTypes from 'prop-types';

import { BComponent, BComponentComposer } from 'b-component';
import { BIconButton } from 'b-icon-button';
import { BLabel } from 'b-label';
@BComponentComposer
export class BCardHeader extends BComponent {
  static propTypes = {
    ...BComponentComposer.propTypes,
    context: PropTypes.any,
    isVisible: PropTypes.bool,
    title: PropTypes.string.isRequired,
    isTitleVisible: PropTypes.bool,
    actionList: PropTypes.array,
    headerContent: PropTypes.array,
    isExpandable: PropTypes.bool,
    isExpanded: PropTypes.bool,
    onExpandChange: PropTypes.func,
    titleContent: PropTypes.any,
    style: PropTypes.object,
    onClickTitle:PropTypes.func,
    /*
    Works counter to showAddButton. If wanted to customize the button in card header, should use actionHeaderContent
    If showAddButton true, actionHeaderContent is ignored.
    */
    actionHeaderContent: PropTypes.any,
    isExpandableButtonVisible: PropTypes.bool,
    /**
    * Default false.
    * If true, shows Add button in card component. Also, if true actionHeaderContent is ignored .
    */
    showAddButton: PropTypes.bool
  }

  static defaultProps = {
    ...BComponentComposer.defaultProps,
    isVisible: true,
    title: '',
    isTitleVisible: true,
    isExpandable: true,
    isExpanded: true,
    onExpandChange: null,
    actionList: null,
    headerContent: null,
    titleContent: null,
    actionHeaderContent: null,
    isExpandableButtonVisible: true,
    showAddButton: false    
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      title: props.title,
      isTitleVisible: props.isTitleVisible,
      isExpandable: props.isExpandable,
      isExpanded: props.isExpanded,
      actionList: props.actionList,
      headerContent: props.headerContent,
      titleContent: props.titleContent,
      actionHeaderContent: props.actionHeaderContent
    };
    this.onExpanding = this.onExpanding.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    this.setState({
      title: nextProps.title,
      isTitleVisible: nextProps.isTitleVisible,
      isExpandable: nextProps.isExpandable,
      isExpanded: nextProps.isExpanded,
      actionList: nextProps.actionList,
      headerContent: nextProps.headerContent,
      titleContent: nextProps.titleContent,
      actionHeaderContent: nextProps.actionHeaderContent
    });
  }

  render() {
    if (!this.props.isVisible) {
      return null;
    }

    let headerStyle = {
      fontSize: 16,
      color: this.props.context.theme.boaPalette.base400,
      position: 'relative',
      transition:'0.2s',
      marginBottom:0,
      padding: '12px 0px',
    };

    //  let floatLeftStyle = { float: !this.props.context.localization.isRightToLeft ? 'left' : 'right' };
    //  let boaPalette = this.props.context.theme.boaPalette;
    //  let moreOptionsStyle = Object.assign(this.props.showMoreOptions ? {} : { display: 'none' }, floatLeftStyle);

    var actionList = null;
    var title = null;
    var expandButton = null;
    var headerContent = null;
    var titleContent = null;
    var actionHeaderContent = null;

    if (this.state.actionList && this.state.actionList.length > 0) {
      actionList = this.state.actionList.map((icon, index) => {
        return (
          <BIconButton
            style={{ padding: 12, paddingRight:16 }}
            context={this.props.context}
            disabled={this.state.disabled}
            key={'right' + index}
            {...icon} />
        );
      });
    }
    if (this.state.isExpandable) {
      
      var expandButtonStyle = 
        { 
          position: 'relative', 
          display: 'flex', 
          paddingRight:'0px', 
          alignItems:'center',
        };
      
      if (!this.props.isExpandableButtonVisible) {
        expandButtonStyle.display = 'none';
      }
      expandButton = (<div style={expandButtonStyle}>
        <BIconButton
          style={{}}
          context={this.props.context}
          dynamicIcon={ this.state.isExpanded ? 'ExpandLess' : 'ExpandMore' }
          onClick={this.onExpanding.bind(this)} />
      </div>);
    }

    if (this.state.headerContent) {
      headerContent = this.state.headerContent;
    }

    if (this.state.titleContent) {
      titleContent = this.state.titleContent;
    }

    if (this.state.actionHeaderContent) {
      actionHeaderContent = this.state.actionHeaderContent;
    }
    if (this.props.isTitleVisible && this.props.title) {
      title = (<BLabel context={this.props.context} text={this.props.title} style={headerStyle}/>);      
    }
    /*  Başlık konulma zorunluluğu UX kararına göre açılacaktır.
    else if (!this.props.title && !this.props.headerContent && !this.props.titleContent && !this.props.actionHeaderContent )
    { throw new Error('BCard must have title prop'); } */

    var actionPanelStyle = {
      marginTop: 'auto',
      marginBottom: 'auto',
      display: 'inherit',
      marginRight: this.props.context.localization.isRightToLeft ? 'auto' : '0px',
      marginLeft: this.props.context.localization.isRightToLeft ? '0px' : 'auto',
      transition:'0.2s',
      padding:0,
    };
    
    var rootStyle = {
      paddingLeft: this.props.context.localization.isRightToLeft ?  8 : 24,
      paddingRight: this.props.context.localization.isRightToLeft ? 24 : 8,
      position: 'relative',
      paddingTop: this.state.isExpanded? '0px' : '0px',
      minHeight:  52,
      transition:'0.2s',
      alignItems:'center',
      display:'flex'
    };
    if (this.props.context.deviceSize < BComponent.Sizes.MEDIUM)
    {
      Object.assign(rootStyle, {
        paddingLeft: this.props.context.localization.isRightToLeft ?  0 : 16,
        paddingRight: this.props.context.localization.isRightToLeft ? 16 : 0,
      });
    }

    if (this.props.context.localization.isRightToLeft) {
      return (<div onClick={this.props.onClickTitle}>
        <div style={rootStyle}>
          <div style={actionPanelStyle}>
            {expandButton}
            {actionList}
            {headerContent}
            {actionHeaderContent}
          </div>
          {titleContent}
          {title} 
        </div>
      </div>);

    } else {
      return (<div onClick={this.props.onClickTitle}>
        <div style={rootStyle}>
          {title}
          {titleContent}
          <div style={actionPanelStyle}>
            {actionHeaderContent}
            {headerContent}
            {actionList}
            {expandButton}
          </div>
        </div>
      </div>);
    }
  }

  onExpanding(event) {
    this.props.onExpandChange && this.props.onExpandChange(event);
    event.preventDefault();
  }
}

export default BCardHeader;
