import React from 'react';
import { BComponent, BComponentComposer, Sizes } from 'b-component';
import PropTypes from 'prop-types';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache  } from 'react-virtualized';
import { BCard } from 'b-card';

@BComponentComposer
export class BVirtualizedList extends BComponent {
  static propTypes = {
    ...BComponent.propTypes,


    /** An array containing custom data. A user defines the access to this data. Refer to Data Accessors for details. */
    dataSource: PropTypes.array,

    /** rowHeight properties.. https://github.com/bvaughn/react-virtualized/blob/master/docs/CellMeasurer.md#cellmeasurercache  */
    cacheProperties: PropTypes.any,

     /** Callback invoked with information about the slice of rows that were just rendered.  */
    rowRenderer:PropTypes.func,

    /**
     * Removes fixed height from the scrollingContainer so that the total height
     * of rows can stretch the window. Intended for use with WindowScroller
     */
    autoHeight: PropTypes.boolean,

    /**
     * Used to estimate the total height of a List before all of its rows have actually been measured.
     * The estimated total height is adjusted as rows are rendered.
     */
    estimatedRowSize: PropTypes.number,

    /** Height constraint for list (determines how many actual rows are rendered) */
    height: PropTypes.number,

    /**
     * Number of rows to render above/below the visible bounds of the list.
     * These rows can help for smoother scrolling on touch devices.
     */
    overscanRowCount: PropTypes.number,


    /** Row index to ensure visible (by forcefully scrolling if necessary) */
    scrollToIndex: PropTypes.number,


    /** Optional inline style */
    style: PropTypes.any,


    /** Width of list */
    width: PropTypes.number

  }

  static defaultProps = {
    estimatedRowSize:36,
    overscanRowCount:3,
    cacheProperties:{
      minHeight:36,
      fixedWidth:true,
    }
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      ...props
    };

    this.cache = new CellMeasurerCache({
      ...this.state.cacheProperties
    });

  }

  componentWillReceiveProps(nextProps) {

    if (this.props.dataSource != nextProps.dataSource) {
      this.setState({
        dataSource: nextProps.dataSource,
      });
    }
  }

  /**
   * herbir row kendi içerisinde yüksekliği değişiyor ise yüksekliklerin tekrar hesaplanması için bu fonksiyon çağrılmalıdır.
   */
  clearAllRowHeight() {
    this.cache.clearAll();
    this.list.forceUpdateGrid();
  }

  recomputeRowHeights (index: number) {
    this.list && this.list.recomputeRowHeights(index);
  }

  getOffsetForRow ({ alignment, index }) {
    this.list && this.list.getOffsetForRow({ alignment, index });
  }

  scrollToPosition (scrollTop: number) {
    this.list && this.list.scrollToPosition(scrollTop);
  }

  scrollToRow (index: number) {
    this.list && this.list.scrollToRow(index);
  }

  noRowsRenderer() {
    let isMobile = this.props.context.deviceSize <= Sizes.SMALL;
    return (
      <BCard context={this.props.context}
        style={{
          marginTop: isMobile ? 12 : 24,
          marginRight: isMobile ? 0 : 24,
          marginLeft: isMobile ? 0 : 24 }}
        >
        <div style={{ height: '100%' }}>
          <div style={
          {
            paddingTop: 24,
            paddingBottom: 24,
            fontSize: 15,
            textAlign: 'center',
            color: this.props.context.theme.boaPalette.base300

          }}>{this.getMessage('BOAOne', 'UseCriteriaFieldToQuery')}</div>
        </div>
      </BCard>
    );
  }

  rowRenderer (rowProps) {

    let renderRow=this.props.rowRenderer(
      this.state.dataSource[rowProps.index],
      rowProps,
      this.props.context,
      this
    );

    return (

      <CellMeasurer
        key={rowProps.key}
        cache={this.cache}
        parent={rowProps.parent}
        columnIndex={0}
        rowIndex={rowProps.index}>

        <div style= { rowProps.style } >
          {renderRow}
        </div>
      </CellMeasurer>
    );
  }

  render() {
    return (

      <AutoSizer
      >
        {({ width, height }) => {
          return (
            <List
              {...this.props}
              style={{outline: 'none'}}
              ref={(r) => this.list = r}
              width={width}
              height={height}
              rowHeight={this.cache.rowHeight}
              rowRenderer={this.rowRenderer.bind(this)}
              deferredMeasurementCache={this.cache}
              rowCount={this.state.dataSource ? this.state.dataSource.length: 0}
              overscanRowCount={this.state.overscanRowCount}
              estimatedRowSize={this.state.estimatedRowSize}
              noRowsRenderer={this.props.noRowsRenderer ? this.props.noRowsRenderer : this.noRowsRenderer.bind(this)}
            />
          );
        }}
      </AutoSizer>
    );
  }
}

export default BVirtualizedList;
