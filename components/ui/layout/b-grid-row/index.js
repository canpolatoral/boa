import React from 'react'; import PropTypes from 'prop-types';

import { BComponent, BComponentComposer } from 'b-component';

@BComponentComposer
export class BGridRow extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,
    /**
     * disable or not for child elements.
     */
    disabled: PropTypes.bool,
    /**
     * Padding of between columns.
     */
    columnPadding: PropTypes.number,
    /**
     * Padding for between rows.
     */
    rowPadding: PropTypes.number,
    /**
     * Column count for BGridSection.
     */
    columnCount: PropTypes.number,
    /**
     * Row index in BGridSection.
     */
    rowIndex: PropTypes.number,
    /*
     * Vertical-alignment for cell content.
     */
    verticalAlign: PropTypes.string,
    /**
     * Alignment mode for children; it provides multi-column, single-column and mobile modes. Default ContentAlignMode.MULTI.
     */
    contentAlignMode: PropTypes.oneOf([1, 2, 3])
  }

  static defaultProps = {
    ...BComponent.defaultProps,
    disabled: false,
    columnCount: 1,
    rowIndex: 0,
    columnPadding: 24,
    rowPadding: 0, // 16
    verticalAlign: 'middle',
    contentAlignMode: BComponent.ContentAlignMode.MULTI
  }

  constructor(props, context) {
    super(props, context);
    this.state = { disabled: props.disabled };
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (nextProps.disabled != this.props.disabled) {
      this.setState({ disabled: nextProps.disabled });
    }
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  isMobile() {
    if (this.props.context.deviceSize == BComponent.Sizes.SMALL)
      return true;
    else
      return this.props.contentAlignMode == BComponent.ContentAlignMode.MOBILE;
  }

  getTableStyle() {
    return {
      display: 'inline-table',
      border: 'none',
      width: '100%',
      tableLayout: 'fixed'
    };
  }

  getRowStyle() {
    return {
      display: 'table-row'
    };
  }

  getCellStyle(index, isMobile) {
    var cellStyle = {
      display: 'table-cell',
      verticalAlign: this.props.verticalAlign
    };
    var cellPaddingHorizontal = this.props.columnPadding / 2;
    var cellPaddingVertical = this.props.rowPadding;

    if (isMobile) {
      if (index > 0) {
        cellStyle.paddingTop = cellPaddingVertical;
      }
      if (this.props.rowIndex > 0) {
        cellStyle.paddingTop = cellPaddingVertical;
      }
    }
    else {
      if (this.props.rowIndex > 0) {
        cellStyle.paddingTop = cellPaddingVertical;
      }
      if (this.props.columnCount == 2) {
        if (index == 0) {
          cellStyle.paddingRight = cellPaddingHorizontal;
        }
        else if (index == 1) {
          cellStyle.paddingLeft = cellPaddingHorizontal;
        }
      }
      else if (this.props.columnCount == 3) {
        if (index == 0) {
          cellStyle.paddingRight = cellPaddingHorizontal;
        }
        else if (index == 1) {
          cellStyle.paddingRight = cellPaddingHorizontal;
          cellStyle.paddingLeft = cellPaddingHorizontal;
        }
        else if (index == 2) {
          cellStyle.paddingLeft = cellPaddingHorizontal;
        }
      }
    }

    return cellStyle;
  }

  parseChildren() {
    if (this.props.children && typeof(this.props.children) != 'string' && this.props.children.length > this.props.columnCount)
      throw new Error('BGridRow: Children count must be equal or less than column count');

    let childs = BComponent.Utils.getFormChildren(this.props.children, this.state.disabled);
    var items = [];

    React.Children.forEach(childs, (item) => {
      // Burayı açmak isteyen Nusret parlak ile görüşsün
      // if (item && item.type && item.type.name === 'BCard') throw new Error('BGridRow: Children must not be type of BCard.');
      // else {
      items.push(item);
      // }
    });

    return items;
  }

  render() {
    let isMobile = this.isMobile();
    let items = this.parseChildren();

    const tableStyle = this.getTableStyle();
    const rowStyle = this.getRowStyle();

    var cellItems = [];

    if (isMobile) {
      cellItems = items.map((item, index) => {
        return (
          <div style={rowStyle} key={index}>
            <div style={this.getCellStyle(index, isMobile)}>
              {item}
            </div>
          </div>
        );
      });
      return (
        <div style={tableStyle}>
          {cellItems}
        </div>
      );
    }
    else {
      cellItems = items.map((item, index) => {
        return (
          <div style={this.getCellStyle(index, isMobile)} key={index}>
            {item}
          </div>
        );
      });
      for (var i = items.length; i < this.props.columnCount; i++) {
        cellItems.push((<div style={this.getCellStyle(i, isMobile)} key={i}></div>));
      }
      return (
        <div style={tableStyle}>
          <div style={rowStyle}>
            {cellItems}
          </div>
        </div>
      );
    }
  }
}

export default BGridRow;
