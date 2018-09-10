import React from 'react';
import GridList from '@material-ui/core/GridList';
import { BComponent, BComponentComposer } from 'b-component';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {}
});

@BComponentComposer
@withStyles(styles)
export class BGridList extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    /**
    * Number of px for one cell height.
    * You can set `'auto'` if you want to let the children determine the height.
    */
    cellHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
    /**
     * Grid Tiles that will be in Grid List.
     */
    children: PropTypes.node.isRequired,
    /**
     * Useful to extend the style applied to components.
     */
    classes: PropTypes.object.isRequired,
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * Number of columns.
     */
    cols: PropTypes.number,
    /**
     * The component used for the root node.
     * Either a string to use a DOM element or a component.
     */
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    /**
     * Number of px for the spacing between tiles.
     */
    spacing: PropTypes.number,
    /**
     * @ignore
     */
    style: PropTypes.object,
  }

  static defaultProps = {
    cellHeight: 180,
    cols: 2,
    component: 'ul',
    spacing: 4,
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { children } = this.props;
    return <GridList {...this.props} >
      {children ? children : null}
    </GridList>;
  }
}

export default BGridList;
