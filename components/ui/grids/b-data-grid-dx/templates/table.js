import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { BComponent, BComponentComposer } from 'b-component';

import {
  Table
} from '@devexpress/dx-react-grid-material-ui';

const styles = theme => ({
  tableStriped: {
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor:  theme.boaPalette.base150, // zebra style
    },
    '& tbody tr:hover': {
      backgroundColor: theme.boaPalette.base200  // hover
    },
  },
});

@BComponentComposer
@withStyles(styles)
export class BTable extends BComponent {


  constructor(props, context) {
    super(props, context);
  }


  render() {

    let isMobileOrTablet = this.props.context.deviceSize < BComponent.Sizes.MEDIUM;
    return (
      <Table.Table
        {...this.props}
        className={isMobileOrTablet==false ? this.props.classes.tableStriped:''}
      />
    );
  }
}

export default BTable;
