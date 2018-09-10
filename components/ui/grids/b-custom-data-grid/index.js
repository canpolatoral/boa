import React from 'react';
import PropTypes from 'prop-types';
import { BComponent, BComponentComposer} from 'b-component';
import { BDataGrid } from 'b-data-grid-dx';
import { withStyles } from '@material-ui/core/styles';
import { BFlexPanel } from 'b-flex-panel';
import Button from '@material-ui/core/Button';
import {BCard} from 'b-card';
import * as SvgIcons from '@material-ui/icons';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    fontSize: '12px'
  },
  icon: {
    marginRight: 5
  }
});

let ElementResizeDetectorMaker = require('element-resize-detector');

// TODO: temaya gidecek
const CardSectionCardPadding = 12;


@BComponentComposer
@withStyles(styles)
export class BCustomDataGrid extends BComponent {
  static propTypes = {
    
    ...BDataGrid.propTypes,

    buttonList: PropTypes.array,

    onFooterClicked: PropTypes.func,

    /**
     * Callback function fired when datagrid row selection changed event.
     */
    onGridRowSelectionChanged: PropTypes.func,
   
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    ...BDataGrid.defaultProps,
    buttonList: [],
    cardSectionThresholdColumn: 2,
    cardSectionThresholdWidth: 1024,

  };

  constructor(props, context) {
    super(props, context);
    this.handleOnClicked = this.handleOnClicked.bind(this);
    this.onGridRowSelectionChanged = this.onGridRowSelectionChanged.bind(this);
    this.resizeDetector = ElementResizeDetectorMaker();

    this.gridWidth = 500;
    this.gridHeight = 300;

    this.state = {
      ...this.state,
      ...props
    };

  }

  componentWillReceiveProps(nextProps) {

    if (this.props.buttonList != nextProps.buttonList) {
      this.setState({
        buttonList:  nextProps.buttonList
      });
    }
  }

  handleOnClicked(e, callBack) {
    if (this.props.onFooterClicked) {
      return this.props.onFooterClicked(e, callBack);
    }
  }

  populateActions(actionList) {
    let actionButtons = [];
    actionList.forEach(element => {
      actionButtons.push(this.createAction(element));
    }, this);

    return actionButtons;
  }

  createAction(action) {
    const {classes, context} = this.props;
    classes.disabled = (classes.disabled == undefined) ? false : classes.disabled;
    let icon = SvgIcons[action.icon];
    let DynamicIcon = icon;
    return (
      <Button 
        context={context}
        color="primary" 
        onClick={() => {
          this.handleOnClicked(action.name);
        }} 
        disabled={action.disabled}
        className={classes.button}>{icon != null? <div style={{marginRight:'5px'}}> <DynamicIcon /></div>:null} {action.label}</Button>
    );
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.datagridDiv) {
      this.resizeDetector.listenTo(this.datagridDiv, this.onResizeParent.bind(this));
    }
    this.onResizeParent();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.datagridDiv) {
      this.resizeDetector.uninstall(this.datagridDiv);
    }

  }

  onResizeParent() {

    if (this.datagridDiv) {

      let formWidth = this.datagridDiv.offsetWidth || this.props.cardSectionThresholdWidth;
      if (formWidth == this.state.formWidth) return;

      let contentAlignMode = this.state.contentAlignMode;
      let singleColumnWidth = (this.props.cardSectionThresholdWidth / this.props.cardSectionThresholdColumn) + CardSectionCardPadding;

      if (formWidth >= singleColumnWidth) contentAlignMode = undefined; // todo
      else contentAlignMode = BComponent.ContentAlignMode.MOBILE;

      if (contentAlignMode != this.state.contentAlignMode) {
        this.setState({ formWidth: formWidth, contentAlignMode: contentAlignMode });
      }

      this.gridWidth = this.datagridDiv.offsetWidth;
      this.gridHeight = this.datagridDiv.offsetHeight - 150;
      this.datagrid.getInstance().setSize(this.gridWidth, this.gridHeight);
    }
  }

  render() {

    let { context, buttonList, ...gridProps} = this.props;
    
    if (buttonList!= undefined && buttonList != null ) {
      this.actionButtons = this.populateActions(buttonList);
    }

    const actionsDivStyle = {
      width: '100%',
      textAlign: !this.props.context.localization.isRightToLeft ? 'left' : 'right',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    };
  
    const actionsParentDivStyle = {
      width: '100%'
    };
    
    const divStyle = {
      marginLeft: this.state.contentAlignMode == BComponent.ContentAlignMode.MOBILE ? 0 : 24,
      marginRight: this.state.contentAlignMode == BComponent.ContentAlignMode.MOBILE ? 0 : 24,
      marginTop: this.state.contentAlignMode == BComponent.ContentAlignMode.MOBILE ? 8 : 24,
      marginBottom: 5,
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      position: 'absolute'
    };

    return (
    
      <div ref={r => this.datagridDiv = r} style={divStyle}>
        <BCard context={context}  >
          {(
            <div>
              <BDataGrid
              context={context}
              ref={r => (this.datagrid = r)}
              height={this.gridHeight}
              minWidth={this.gridWidth}
              enableRowSelect={true}
              enableCellSelect={false}
              isInsideTheCard={false}
              {...gridProps}
            />
            </div>
          )}
          {this.props.buttonList && this.actionButtons!=undefined && (
            <div className="actionButtonWrap">
              <BFlexPanel
                  alignItems="center"
                  responsive={false}
                  ref={r => (this.actionsParentDiv = r )}
                  style={actionsParentDivStyle}>

                <BFlexPanel
                  alignItems="center"
                  responsive={false}
                  ref={r => { this.actionsDiv = r;}}
                  style={actionsDivStyle}>
                  {this.actionButtons}
                </BFlexPanel>
              </BFlexPanel>
            </div>
            )}
        </BCard>
        <style>
          {`
              .dgWrap { margin-bottom:10px; }
              .actionButtonWrap { margin-top: 15px; float:right; }
          `}
        </style>
      </div>
    );
  }

  onGridRowSelectionChanged() {
    this.props.onGridRowSelectionChanged && this.props.onGridRowSelectionChanged(this.getSelectedRows());
  }

  getSelectedRowIndexes() {
    return this.datagrid.getInstance().getSelectedRowIndexes();
  }

  setSelectedRowIndexes(indexes) {
    return this.datagrid.getInstance().setSelectedRowIndexes(indexes);
  }

  getSelectedItems() {
    return this.datagrid.getInstance().getSelectedItems();
  }
}
export default BCustomDataGrid;
