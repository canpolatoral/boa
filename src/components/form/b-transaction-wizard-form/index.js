import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import merge from 'lodash/merge';
import { BComponent, Utils, BComponentComposer } from 'b-component';
import { BBaseForm } from 'b-base-form';
import { BCriteriaPanel } from 'b-criteria-panel';
import { BScroll } from 'b-scroll';
import { BStepper } from 'b-stepper';
let ElementResizeDetectorMaker = require('element-resize-detector');


// TODO: temaya gidecek
const CardSectionCardPadding = 12;

@BComponentComposer
export class BTransactionWizardForm extends BBaseForm {
  
  static propTypes = {
    ...BBaseForm.propTypes,

    cardSectionThresholdColumn: PropTypes.number,
    
    cardSectionThresholdWidth: PropTypes.number,
    
    readyOnly: PropTypes.any,
    
    isWideCardEnabled: PropTypes.bool,
    
    disableCardWidth: PropTypes.bool,
    /**
    * Criteria pane expanded/collapsed status. Default true (expanded).
    */
    criteriaPanelExpanded: PropTypes.bool,
    /**
     * Criteria pane can expandable status. Default true (expandable).
     */
    criteriaPanelExpandable: PropTypes.bool,
    /**
     * Criteria pane header button text. Default 'Criterias'.
     */
    criteriaPanelHeader: PropTypes.string,
    /**
     * Form left resizedPane.
     */
    leftPaneContent: PropTypes.any,
        /**
     * Form left resizedPane.
     */
    leftPaneContentStyle: PropTypes.object,
    /**
     * Left resizedPane initial width.
     */
    leftPaneWidth: PropTypes.number,
    
    enableCardSortOnMobile: PropTypes.bool,

    stepList: PropTypes.array.isRequired,

    finisherPage: PropTypes.object,

    onFinishClick: PropTypes.func,

    onWizardClick: PropTypes.func,
    
    isStepper: PropTypes.bool

  };

  static defaultProps = {
    ...BBaseForm.defaultProps,
    cardSectionThresholdColumn: 2,
    cardSectionThresholdWidth: 1024,
    leftPaneMaxWidth: 511,
    rightPaneWidth: 0,
    rightPaneMaxWidth: 511,
    isWideCardEnabled: false,
    disableCardWidth: false,
    criteriaPanelExpanded: true,
    criteriaPanelExpandable: true,
    criteriaPanelHeader: null,
    enableCardSortOnMobile:true,
    hideActionManager: true,
    isStepper: true
  };

  constructor(props, context) {
    super(props, context);
    this.resizeDetector = ElementResizeDetectorMaker();
    this.updateFormWidth = this.updateFormWidth.bind(this);
    this.state = {
      formWidth: props.cardSectionThresholdWidth,
      contentAlignMode: BComponent.ContentAlignMode.MULTI
    };

    this.onCriteriaExpandChanged = this.onCriteriaExpandChanged.bind(this);
    this.criteriaExpanded = this.props.criteriaPanelExpanded;
  }

  updateFormWidth() {
    /* MOBILE:1, SINGLE:2, MULTI:3 */
    let formWidth = this.parentDiv.offsetWidth || this.props.cardSectionThresholdWidth;
    if (formWidth == this.state.formWidth) return;

    let contentAlignMode = this.state.contentAlignMode;
    let singleColumnWidth = (this.props.cardSectionThresholdWidth / this.props.cardSectionThresholdColumn) + CardSectionCardPadding;

    if (formWidth >= this.props.cardSectionThresholdWidth) contentAlignMode = BComponent.ContentAlignMode.MULTI;
    else if (formWidth >= singleColumnWidth) contentAlignMode = BComponent.ContentAlignMode.SINGLE;
    else contentAlignMode = BComponent.ContentAlignMode.MOBILE;

    if (contentAlignMode != this.state.contentAlignMode) {
      this.setState({ formWidth: formWidth, contentAlignMode: contentAlignMode });
    }
  }

  updateRightPane(isExpanded) {
    this.baseForm.getInstance().updateRightPane(isExpanded);
  }

  componentDidMount() {
    super.componentDidMount();
    this.parentDiv = ReactDOM.findDOMNode(this).parentNode;
    if (this.parentDiv) {
      this.resizeDetector.listenTo(this.parentDiv, this.updateFormWidth);
    }
    this.updateFormWidth();
    if (this.baseForm) {
      this.progressPanel = this.baseForm.getInstance().progressPanel;
    }

    this.props.pageLoaded && this.props.pageLoaded();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.parentDiv) {
      this.resizeDetector.uninstall(this.parentDiv);
    }
  }

  setDisable(disabled) {
    this.baseForm && this.baseForm.getInstance().setDisable(disabled);
  }

  disableAction(commandName) {
    this.baseForm && this.baseForm.getInstance().disableAction(commandName);
  }

  enableAction(commandName) {
    this.baseForm && this.baseForm.getInstance().enableAction(commandName);
  }

  onCriteriaExpandChanged(isExpanded) {
    this.criteriaExpanded = isExpanded;
    this.baseForm.getInstance().updateLeftPane(isExpanded);
  }

  onFinishClick(e, data) {

    if (this.props.onFinishClick) {
      return this.props.onFinishClick(e, data);
    }
  }

  onWizardClick(e, data) {

    if (this.props.onWizardClick) {
      return this.props.onWizardClick(e, data);
    }
  }

  getSnapshot() {
    return {
      stepperState: this.stepper.getInstance().getSnapshot()
    };
  }

  setSnapshot(snapshot) {
    this.stepperState = snapshot && snapshot.stepperState;
  }

  render() {
    var divStyle = {
      padding: 0,
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      position: 'absolute'
    };
    this.contentDivStyle = {
      pointerEvents: this.props.readyOnly ? 'none' : 'all'
    };
    divStyle = merge(divStyle, this.props.style ? this.props.style : {});
    
    if (!this.props.hideActionManager && this.props.isStepper) {
      divStyle = merge(divStyle, {marginTop:15});
    }
    
    let criteriaStyle = {
      width: '100%',
      height: '100%'
    };

    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;
    const leftPaneContentStyle = Object.assign({}, {padding: isMobileOrTablet ? 0 : 24}, this.props.leftPaneContentStyle);

    var criteriaContent = (
      <BScroll context={this.props.context} /* option={{ suppressScrollX: true }}*/ >
        <div style={leftPaneContentStyle}>
          {this.props.leftPaneContent}
        </div>
      </BScroll>
    );

    let criteriaPanel = Utils.isMobile(this.props) ? criteriaContent : (
      <BCriteriaPanel context={this.props.context}
        onExpandChange={this.onCriteriaExpandChanged}
        expanded={this.criteriaExpanded}
        expandable={this.props.criteriaPanelExpandable}
        header={this.props.criteriaPanelHeader  || this.getMessage('BusinessComponents', 'Criterias')} >
        <div style={criteriaStyle}>
          {criteriaContent}
        </div>
      </BCriteriaPanel>
    );

    return (
      <BBaseForm
        ref={r => this.baseForm = r}
        {...this.props}
        leftPaneWidth={this.props.leftPaneContent ? (this.props.leftPaneWidth ? this.props.leftPaneWidth : 270) : 0}
        leftPaneContent={this.props.leftPaneContent ? criteriaPanel : null}>
        <div style={divStyle}>
          <BStepper
            context={this.props.context}
            ref={r => this.stepper = r}
            activeStep={this.props.activeStep}
            snapshot={this.props.snapshot}
            stepList={this.props.stepList}
            resourceInfo={this.props.resourceInfo}
            finisherPage={this.props.finisherPage}
            onActionClick={this.onWizardClick.bind(this)}
            onFinishClick={this.onFinishClick.bind(this)}  />
        </div>
      </BBaseForm>
    );
  }

}

export default BTransactionWizardForm;
