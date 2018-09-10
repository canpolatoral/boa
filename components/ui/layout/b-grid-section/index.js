import React from 'react'; import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { BComponent, BComponentComposer } from 'b-component';
let ElementResizeDetectorMaker = require('element-resize-detector');

const GridTresholdLimit = 425; // todo burası incelenmeli (coral)
@BComponentComposer
export class BGridSection extends BComponent {

  static defaultProps = {
    ...BComponent.propTypes,
    disabled: false,
    columnPadding: 24,
    rowPadding: 0 // 16
  };

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
     * Alignment mode for children; it provides multi-column, single-column and mobile modes. Default ContentAlignMode.MULTI.
     */
    contentAlignMode: PropTypes.oneOf([1, 2, 3])
  };

  state = {
    contentAlignMode:BComponent.ContentAlignMode.MULTI,
    disabled: false
  };

  constructor(props, context) {
    super(props, context);
    this.resizeDetector = ElementResizeDetectorMaker();
    this.state.contentAlignMode = props.contentAlignMode || BComponent.ContentAlignMode.MULTI;
    this.state.disabled =props.disabled;
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if ((nextProps.contentAlignMode && nextProps.contentAlignMode != this.state.contentAlignMode) || nextProps.disabled != this.props.disabled)  {
      this.setState({ contentAlignMode: nextProps.contentAlignMode, disabled: nextProps.disabled });
    }
  }

  setDisable(value) {
    this.setState({ disabled: value });
  }

  getTableStyle() {
    return {
      display: 'inline-table',
      border: 'none',
      width: '100%'
    };
  }

  getRowStyle() {
    return {
      display: 'table-row'
    };
  }

  parseChildren() {
    let childs = BComponent.Utils.getFormChildren(this.props.children, this.state.disabled);
    var rows = [];
    var index = 0;
    React.Children.forEach(childs, (item) => {
      // todo BGridRow check deleted.
      // if (item && item.type && item.type.name !== 'BGridRow') throw new Error('BGridSection: Children must be type of BGridRow.');
      // else {
      item = React.cloneElement(item,
        {
          rowIndex: index++,
          columnPadding: this.props.columnPadding,
          rowPadding: this.props.rowPadding,
          contentAlignMode: this.state.contentAlignMode
        });
      rows.push(item);
      // }
    });

    return rows;
  }

  render() {
    let items = this.parseChildren();
    const tableStyle = this.getTableStyle();
    const rowStyle = this.getRowStyle();

    let gridRows = items.map((gridRow, index) => {
      return (
        <div style={rowStyle} key={index}>
          {gridRow}
        </div>
      );
    });
    return (
      <div style={tableStyle}>
        {gridRows}
      </div>
    );
  }

  componentDidMount() {
    super.componentDidMount();
    if (!this.props.contentAlignMode) {
      this.gridDiv = ReactDOM.findDOMNode(this);
      if (this.gridDiv) {
        this.resizeDetector.listenTo(this.gridDiv, this.updateAlignMode.bind(this));
      }
      this.updateAlignMode();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.gridDiv && this.gridDiv.parentNode) {
      try {
        this.resizeDetector.uninstall(this.gridDiv);
      }
      catch (err) {
        this.debugLog(err);
      }
    }
  }

  updateAlignMode() {
    /* MOBILE:1, SINGLE:2, MULTI:3 */
    let gridWidth = this.gridDiv.offsetWidth;
    let contentAlignMode = this.state.contentAlignMode;

    if (gridWidth >= GridTresholdLimit) contentAlignMode = BComponent.ContentAlignMode.MULTI;
    else contentAlignMode = BComponent.ContentAlignMode.MOBILE;

    if (contentAlignMode != this.state.contentAlignMode) {
      this.setState({ contentAlignMode: contentAlignMode });
    }
  }
}

export default BGridSection;
