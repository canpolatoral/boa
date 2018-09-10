import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import {Stepper, Step, StepLabel} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Card, CardActions, CardContent} from '@material-ui/core';
import {BComponent, BComponentComposer, Utils} from 'b-component'; // BComponent,
import { BDialogHelper } from 'b-dialog-box';

const styles = theme => ({
  root: {
    width: '100%',
  },
  instructions: {
    margin: theme.spacing.unit,
    marginTop: 15,
    marginBottom: 15,
    minHeight: 250,
    width:'100%'
  }
});

const ACTIONTYPE = {
  'Islem' : 1,
  'Onay' : 2,
  'Wizard' : 11,
  'Inpage' : 12
};

@BComponentComposer
@withStyles(styles)
export class BStepper extends BComponent {
  // #region propTypes && defaultPropTypes
  static lastPageContent: any;

  static propTypes = {

    ...BComponent.propTypes,

     /**
     * resource info
     */
    resourceInfo: PropTypes.any,

     /**
     * container page
     */
    page: PropTypes.any,

    /**
     * Callback function fired when the any action is clicked by the mouse.
     *
     * @param {object} event targeting the element.
     */
    onActionClick: PropTypes.func,

    /**
     * Adım Listesi
     */
    stepList: PropTypes.array.isRequired,

    /**
     * Wizard bitince ekrana basılacak uyarıyı gösterir
     */
    onFinishClick: PropTypes.func,
 /**
     * container activeStep
     */
    activeStep: PropTypes.number,

    /**
     * Wizard bittikten sonra açılan model pencere özellikleri
     */

    finisherPage: PropTypes.object,
    /**
     * Classes list
     */

    classes: PropTypes.object,

    /**
     * sıralı gitmeyecek
    */
    nonLinear:PropTypes.bool,

    /**
     * Adımlar yatak mı dikey mi? // Horizantal|Vertical
     */
    orientation: PropTypes.string,

    /**
     * Adım altta olsun
     */
    alternativeLabel: PropTypes.bool
  }

  static defaultProps = {
    ...BComponent.defaultProps,
    alternativeLabel: false,
    orientation: 'Horizantal',
    nonLinear: false,
    stepList: [],
    activeStep: 0,
  }

  // #endregion

  // #region constructor
  constructor(props, context) {
    super(props, context);
    this.prevStep = this.prevStep.bind(this);
    this.state = {
      ...this.state,
      ...props,
      activeStep: this.props.activeStep,
      finisherPage: this.props.finisherPage,
      stepList: this.props.stepList ? cloneDeep(this.props.stepList) : [],
      resourceActionList: this.props.resourceInfo && this.props.resourceInfo.resourceActionList ? cloneDeep(this.props.resourceInfo.resourceActionList) : []
    };
  }

  // #endregion

  // #region predefined methods

  getSnapshot() {
    return {
      state: this.state
    };
  }

  setSnapshot(snapshot) {
    let {state} = (snapshot && snapshot.stepperState) ? snapshot.stepperState : snapshot;
    this.state = Object.assign({}, this.state, state);
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if ((nextProps.resourceInfo
      && nextProps.resourceInfo.resourceActionList != this.props.resourceInfo.resourceActionList)
      || nextProps.stepList != this.props.stepList) {
      this.setState({
        activeStep: nextProps.activeStep,
        stepList: nextProps.stepList ? cloneDeep(nextProps.stepList):[],
        resourceActionList: nextProps.resourceInfo && nextProps.resourceInfo.resourceActionList ? cloneDeep(nextProps.resourceInfo.resourceActionList) : []
      });
    }
  }

  componentWillMount() {
    super.componentWillMount();
    this.actionList = this.getActionList();
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  // #endregion

  // #region Event Listeners

  genericActionClick(e, callBack) {
    const { activeStep, stepList } = this.state;

    let nextStep = (activeStep < stepList.length -1)? activeStep + 1: -1;

    var action = this.getActiveAction(activeStep);
    var nextaction = this.getActiveAction(nextStep);

    if (!nextaction && nextStep != -1)
    {
      var nextPageTitle = stepList[nextStep].title;
      BDialogHelper.show(this.props.context, nextPageTitle + ' ekranına yetkiniz bulunmamaktadır.',
      BComponent.DialogType.INFO,
      BComponent.DialogResponseStyle.OKCANCEL, 'Bilgilendirme',
      (): any => {
        return;
      },
      { width:450, height: 200 }
    );
    } else {
      this.setState({
        activeStep: (activeStep < (stepList.length - 1) )? activeStep + 1: activeStep,
      });

      if (this.props.onActionClick && (action && action.actionId > 0))
        this.props.onActionClick(action, callBack);
    }

  }

  prevStep() {

    const { activeStep} = this.state;
    this.setState({
      activeStep:  (activeStep > 0)? activeStep - 1: activeStep
    });
  }

  onFinisher(e, callBack) {
    if (this.state.finisherPage) {
      BDialogHelper.show(this.props.context,
        this.state.finisherPage.content,
        BComponent.DialogType.INFO,
        BComponent.DialogResponseStyle.OK,
        this.state.finisherPage.title,
        (dialogResponse: any): any => {
          if (dialogResponse == BComponent.DialogResponse.OK) {
            if (this.props.onFinishClick)
              this.props.onFinishClick(event, callBack);
          }
        },
        { width: this.state.finisherPage.width, height: this.state.finisherPage.height }
      );
    }
  }

  // #endregion EventListener

  // #region InHouse Methods

  getActiveAction(activeStep) : any {

    let {stepList} = this.state;
    var selectedStep =  (stepList && stepList[activeStep])?stepList[activeStep]:null;
    if (selectedStep == null) {
      return null;
    }

    return  this.actionList? this.actionList.find(u => u.commandName == selectedStep.action):null;
  }

  getStepContent(stepIndex) {
    let {stepList} = this.state;
    return ( stepIndex != undefined && stepIndex != (stepList.length - 1) && stepList[stepIndex]?stepList[stepIndex].content:null);
  }

  isDisabled(stepIndex) {
    let {stepList} = this.state;
    return (stepList[stepIndex].disabled ? true : false);
  }

  // #endregion InHouse Methods

  // #region render()

  render() {

    let isMobile = Utils.isMobile(this.props);
    const {classes} = this.props;
    const { activeStep, stepList, resourceActionList } = this.state;


    if (!isMobile) {
      return (
        <div className={classes.root}>
          <Card context={this.props.context} style={{margin:'2px'}}>
            <CardContent style={{padding:'3px'}}>
              <Stepper activeStep={activeStep}>
                {stepList.map((item, key) => {
                  return (
                    <Step key={key}>
                      <StepLabel>{item.title}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </CardContent>
          </Card>
          <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
          <Card context={this.props.context}>
            <CardActions style={{width:'100%', display:'inline-block'}}>

              {activeStep > 0 && (
                <Button
                  context={this.props.context}
                  style={{float:'left'}}
                  variant="raised"
                  color="primary"
                  onClick={this.prevStep} >
                  {this.getMessage('BOA', 'Back')}
                </Button>
              )}
              { ( (!this.state.finisherPage && activeStep == (stepList.length - 1)) || activeStep < (stepList.length - 1) ) && (
                <Button
                  context={this.props.context}
                  disabled={resourceActionList == null ||
                            resourceActionList.filter(u => u.actionType == ACTIONTYPE.Wizard && u.commandName == stepList[activeStep].action).length == 0 ||
                            this.isDisabled(activeStep)
                          }
                  style={{float:'right'}}
                  variant="raised"
                  color="primary"
                  onClick={this.genericActionClick.bind(this)}>
                  {(stepList[activeStep] && stepList[activeStep].buttonLabel)?stepList[activeStep].buttonLabel:this.getMessage('BOA', 'Forward')}
                </Button>
              )}
              {this.state.finisherPage && activeStep == (stepList.length - 1) && (
                <Button
                  context={this.props.context}
                  style={{float:'right'}}
                  variant="raised"
                  color="primary"
                  onClick={this.onFinisher.bind(this)}>
                  {this.getMessage('BOA', 'Finish')}
                </Button>
                )}
            </CardActions>
          </Card>
        </div>);
    }
    else {
      return (
        <div>Mobil İçerik</div>);
    }
  }
  // #endregio

  /* Action Generation */
  getActionList() {
    if (!(this.state.resourceActionList)) {
      return [];
    }

    let actionList = [];
    let resourceActionList = this.state.resourceActionList;

    actionList = resourceActionList.filter(u => u.actionType == ACTIONTYPE.Wizard && u.isVirtual == false).slice(0);
    this.sortActionList(actionList);
    return actionList;

  }

  sortActionList(actionList) {
    actionList.sort(function (a, b) {
      if (a.sortId > b.sortId) {
        return 1;
      }
      if (a.sortId < b.sortId) {
        return -1;
      }
      var nameA = BComponent.Localization.stringUpperCase(a.name);
      var nameB = BComponent.Localization.stringUpperCase(b.name);
      if (nameA > nameB) {
        return 1;
      }
      if (nameA < nameB) {
        return -1;
      }
      return 0;
    });
  }


}

export default BStepper;
