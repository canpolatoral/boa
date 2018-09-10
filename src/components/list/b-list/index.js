import React from 'react';
import List from '@material-ui/core/List';
import { BComponent, BComponentComposer } from 'b-component';
import { BListItem } from 'b-list-item';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingVertical: 0,
    width: '100%',
    backgroundColor: theme.boaPalette.paper,
  }
});

@BComponentComposer
@withStyles(styles)
export class BList extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    /**
   * The content of the component.
   */
    children: PropTypes.node,
    /**
     * Useful to extend the style applied to components.
     */
    classes: PropTypes.object.isRequired,
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * The component used for the root node.
     * Either a string to use a DOM element or a component.
     */
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    /**
     * If `true`, compact vertical padding designed for keyboard and mouse input will be used for
     * the list and list items. The property is available to descendant components as the
     * `dense` context.
     */
    dense: PropTypes.bool,
    /**
     * If `true`, vertical padding will be removed from the list.
     */
    disablePadding: PropTypes.bool,
    /**
     * The content of the subheader, normally `ListSubheader`.
     */
    subheader: PropTypes.node,
    items: PropTypes.array,
    onItemClick: PropTypes.func
  }

  static defaultProps = {
    component: 'ul',
    dense: false,
    disablePadding: false,
  }
  
  constructor(props, context) {
    super(props, context);
  }

  getItems() {
    const { items, context, onItemClick } = this.props;
    if (items && items.length > 0) {
      return items.map((item, i) =>
        <BListItem key={i} context={context} selected={item.selected}
          primaryText={item.primaryText}
          secondaryText={item.secondaryText}
          onClick={onItemClick ? () => onItemClick(item) : null}
          divider={item.divider}
        />
      );
    }
  }

  render() {
    const { items, children } = this.props;
    return <List {...this.props} >
      {children ? children : null}
      {items ? this.getItems(items) : null}
    </List>;
  }
}

export default BList;
