import React from 'react';
import PropTypes from 'prop-types';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { BComponent, BComponentComposer } from 'b-component';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  expandIconRL: {
    left: theme.spacing.unit,
    right: 'auto'
  },
  contentRL: {
    margin: '12px 0',
    '& > :last-child': {
      paddingRight: 0
    }
  }
});

@BComponentComposer
@withStyles(styles)
export class BExpander extends BComponent {
  static propTypes = {
    /**
     * Base properties from BComponent
     */
    ...BComponent.propTypes,

    children: PropTypes.node, // The content of the expansion panel.
    classes: PropTypes.object, // Useful to extend the style applied to components.
    CollapseProps: PropTypes.object, //	Properties applied to the Collapse element.
    defaultExpanded: PropTypes.bool, //	false	If true, expands the panel by default.
    disabled: PropTypes.bool, //	false	If true, the panel will be displayed in a disabled state.
    isExpanded: PropTypes.bool, //	If true, expands the panel, otherwise collapse it. Setting this prop enables control over the panel.
    onChange: PropTypes.func, //	Callback fired when the expand/collapse state is changed.

    header: PropTypes.any
    // icon: PropTypes.string,
  };
  static defaultProps = {
    /**
     * Default prop values from BComponent
     */
    ...BComponent.defaultProps,
    children: <div />,
    isExpanded: false,
    disabled: false
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isExpanded: this.props.isExpanded,
      disabled: props.disabled || this.props.disabled
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isExpanded != nextProps.isExpanded || nextProps.disabled !== this.props.disabled)
      this.setState({ isExpanded: nextProps.isExpanded, disabled: nextProps.disabled });
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  expand() {
    this.setState({ isExpanded: true });
  }

  collapse() {
    this.setState({ isExpanded: false });
  }

  getChildren() {
    const childArray = BComponent.Utils.getFormChildren(this.props.children, this.state.disabled);
    return childArray;
  }

  handleOnChange(event, expanded) {
    this.setState({ isExpanded: expanded });
    this.props.onChange && this.props.onChange(event, expanded);
  }

  render() {
    let children = this.getChildren();
    const { classes } = this.props;
    return (
      <ExpansionPanel expanded={this.state.isExpanded} onChange={this.handleOnChange.bind(this) }>
        <ExpansionPanelSummary
          classes={this.props.context.localization.isRightToLeft ? { expandIcon: classes.expandIconRL, content: classes.contentRL } : {}}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>{this.props.header}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>{children}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
export default BExpander;
