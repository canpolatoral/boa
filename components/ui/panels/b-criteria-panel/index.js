import React from 'react'; import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Paper from '@material-ui/core/Paper';
import { BComponent, BComponentComposer } from 'b-component';
import { BButton } from 'b-button';
import { BMenuItem } from 'b-menu-item';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
@BComponentComposer
export class BCriteriaPanel extends BComponent {
  static defaultProps = {
    ...BComponent.defaultProps,
    disabled: false,
    expandable: true,
    expanded: true,
    header: 'Kriterler'
  }

  static propTypes = {
    ...BComponent.propTypes,
    /**
     * Text of criteria panel header button's text.
     */
    header: PropTypes.string,
    /**
     * Can be used to render elements inside the CriteriaPanel.
     */
    children: PropTypes.node,
    /**
     * disable or not for child elements.
     */
    disabled: PropTypes.bool,
    /**
     * If true, this criteria panel is expandable.
     */
    expandable: PropTypes.bool,
    /**
     * Criteria Panel expanded status.
     */
    expanded: PropTypes.bool,
    /**
     * Callback function fired when the `expanded` state of the criteria panel has changed.
     *
     * @param {boolean} newExpandedState Represents the new `expanded` state of the criteria panel.
     */
    onExpandChange: PropTypes.func,
    /**
     * Calls when resizable component resize. Calls back with (direction: string, styleSize: object, clientSize: object, delta: object)
     */
    onResize: PropTypes.func
  }

  width = 0;

  constructor(props, context) {
    super(props, context);
    this.onHeaderClick = this.onHeaderClick.bind(this);
    const { header, disabled, expanded, expandable } = props;
    this.state = { header, disabled, expanded, expandable };
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    const { header, disabled, expanded, expandable } = nextProps;
    this.changeExpanded(expanded);
    this.setState({ header, disabled, expandable });
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  render() {
    // const headerIcon = 'ContentFilterList';
    const headerIcon = 'Criterias'; // prop'dan alınabilir.
    const headerIconFolder = 'Others'; // prop'dan alınabilir.
    const children = this.getChildren();
    const paperStyle = {
      position: 'absolute',
      height: '100%',
      width: '100%',
      textAlign: !this.props.context.localization.isRightToLeft ? 'left' : 'right'
    };
    const buttonStyle = {
      height: 40,
      minWidth: '100%',
      textAlign: !this.props.context.localization.isRightToLeft ? 'start' : 'right',
      // borderStyle: 'solid',
      // borderLeftWidth: 0,
      // borderTopWidth: 0,
      borderBottom: '1px solid',
      borderRight: !this.props.context.localization.isRightToLeft && '1px solid',
      borderLeft: this.props.context.localization.isRightToLeft && '1px solid',
      // borderRightWidth: 0,
      // borderRadius: 0,
      borderColor: this.props.context.theme.boaPalette.base200,
      backgroundColor: this.props.context.theme.boaPalette.comp500
    };
    const buttonTextStyle = {
      color: this.props.context.theme.boaPalette.base400,
      fontWeight: 'normal',
      fontSize: 16,
      display: this.state.expanded ? 'initial' : 'none',
      textTransform: 'capitalize',
    };
    const iconProperties = {
      folder: headerIconFolder,
      nativeColor: this.props.context.theme.boaPalette.pri500,
      style: !this.props.context.localization.isRightToLeft ? { marginLeft: this.state.expanded ? 24 : 12, transition: 'margin-left 250ms' }
        : { marginRight: this.state.expanded ? 24 : 12, transition: 'margin-right 250ms' }
    };
    const criteriaContentStyle = this.getContentStyle();
    return (

      <Paper ref={r => this.criteriaContent = r} zDepth={2} style={paperStyle}>
        {!this.state.expanded ? <BButton context={this.props.context}
          type="flat"
          allowLabelCase={true}
          fullWidth={true}
          bIcon={!this.state.expanded && headerIcon}
          iconProperties={iconProperties}
          textStyle={buttonTextStyle}
          disabled={!this.state.expandable}
          onClick={this.onHeaderClick}

          style={buttonStyle} /> : <BMenuItem
            context={this.props.context}
            primaryText={this.state.header}
            rightIcon={!this.props.context.localization.isRightToLeft && <ChevronLeft nativeColor={this.props.context.theme.boaPalette.base400} />}
            leftIcon={this.props.context.localization.isRightToLeft && <ChevronRight nativeColor={this.props.context.theme.boaPalette.base400} />}
            style={{
              backgroundColor: this.props.context.theme.boaPalette.base150,
              height: 16
            }}
            disabled={!this.state.expandable}
            rightIconStyle={{
              marginLeft: this.props.context.localization.isRightToLeft && 20,
              marginRight: !this.props.context.localization.isRightToLeft && 20
            }}
            primaryTextPadding={'0px 24px'}
            itemSelected={this.onHeaderClick.bind(this)} />}
        <div style={criteriaContentStyle}>
          {children}
        </div>
      </Paper>

    );
  }

  componentDidMount() {
    super.componentDidMount();
    this.criteriaContentElement = ReactDOM.findDOMNode(this.criteriaContent);
    if (this.criteriaContentElement) {
      this.width = this.criteriaContentElement.offsetWidth;
    }
  }

  getContentStyle() {
    // Son width değerine göre kapanma sonrası kaydırılacak width hesabı.
    // TODO: animation.
    // let transformWidth = this.width + 48;
    let style = {
      width: this.state.expanded ? '100%' : 0,
      display: this.state.expanded ? 'block' : 'none',
      position: 'absolute',
      top: 40,
      bottom: 0,
      /* transform: 'translate(' + (this.state.expanded ? '0px' : (-1 * transformWidth) + 'px') + ', 0px)', */
      /* transition: 'transform 450ms cubic-bezier(0.32, 1, 0.32, 1) 0ms' */
    };
    return style;
  }

  getChildren() {
    let childs = BComponent.Utils.getFormChildren(this.props.children, this.state.disabled);
    return childs;
  }

  onHeaderClick() {
    this.changeExpanded(!this.state.expanded);
  }

  changeExpanded(expanded) {
    if (this.state.expanded != expanded) {
      this.setState({ expanded }, () => {
        this.props.onExpandChange && this.props.onExpandChange(expanded);
      });
    }
  }
}

export default BCriteriaPanel;
