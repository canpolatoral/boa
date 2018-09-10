import PropTypes from 'prop-types';
import React from 'react';
import { BComponent, BComponentComposer } from 'b-component';

// import GridLayout from 'react-grid-layout';
import { Responsive, WidthProvider } from 'react-grid-layout';
import './react-resizable.css';
import './react-grid-layout.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

@BComponentComposer
export class BGridLayout extends BComponent {

  static propTypes = {
    ...BComponent.propTypes,
    /**
     * This allows setting the initial width on the server side. This is required unless using the HOC <WidthProvider> or similar
     */
    width: PropTypes.number,
    /**
     * If true, the container height swells and contracts to fit contents
     */
    autoSize: PropTypes.bool,
    /**
     * Number of columns in this layout.
     */
    cols: PropTypes.number,
    /**
     * A CSS selector for tags that will not be draggable.
     * For example: draggableCancel:'.MyNonDraggableAreaClassName'
     * If you forget the leading . it will not work.
     */
    draggableCancel: PropTypes.string,
    /**
     * A CSS selector for tags that will act as the draggable handle.
     * For example: draggableHandle:'.MyDragHandleClassName'
     * If you forget the leading . it will not work.
     */
    draggableHandle: PropTypes.string,
    /**
     * If true, the layout will compact vertically
     */
    verticalCompact: PropTypes.bool,
    /**
     * Compaction type.
     */
    compactType: PropTypes.oneOf(['vertical', 'horizontal']),
    /**
     * Layout is an array of object with the format:
     * {x: number, y: number, w: number, h: number}
     * The index into the layout must match the key used on each item component.
     * If you choose to use custom keys, you can specify that key in the layout
     * array objects like so:
     * {i: string, x: number, y: number, w: number, h: number}
     */
    layout: PropTypes.array, // If not provided, use data-grid props on children
    /**
     * Margin between items [x, y] in px.
     */
    margin: PropTypes.arrayOf(PropTypes.number),
    /**
     * Padding inside the container [x, y] in px
     */
    containerPadding: PropTypes.arrayOf(PropTypes.number),
    /**
     * Rows have a static height, but you can change this based on breakpoints
     * if you like.
     */
    rowHeight: PropTypes.number,

    // Flags

    /**
     * Draggable flag.
     */
    isDraggable: PropTypes.bool,
    /**
     * Resizable flag.
     */
    isResizable: PropTypes.bool,

    /**
     * Uses CSS3 translate() instead of position top/left.
     * This makes about 6x faster paint performance
     */
    useCSSTransforms: PropTypes.bool,

    /**
     * If true, grid items won't change position when being
     * dragged over.
     */
    preventCollision: PropTypes.bool,

    // Callbacks

    /**
     * Callback so you can save the layout.
     * Calls back with (currentLayout) after every drag or resize stop.
     */
    onLayoutChange: PropTypes.func, // (layout: Layout) => void,

    //
    // All callbacks below have signature (layout, oldItem, newItem, placeholder, e, element).
    // 'start' and 'stop' callbacks pass `undefined` for 'placeholder'.
    //
    // type ItemCallback = PropTypes.func, // (layout: Layout, oldItem: LayoutItem, newItem: LayoutItem, placeholder: LayoutItem, e: MouseEvent, element: HTMLElement) => void;

    /**
     * Calls when drag starts.
     */
    onDragStart: PropTypes.func,
    /**
     * Calls on each drag movement.
     */
    onDrag: PropTypes.func,
    /**
     * Calls when drag is complete.
     */
    onDragStop: PropTypes.func,
    /**
     * Calls when resize starts.
     */
    onResizeStart: PropTypes.func,
    /**
     * Calls when resize movement happens.
     */
    onResize: PropTypes.func,
    /**
     * Calls when resize is complete.
     */
    onResizeStop: PropTypes.func
  };

  static defaultProps = {
    ...BComponent.defaultProps,
    autoSize: true,
    // cols: 12,
    // className: '',
    // style: {},
    // draggableHandle: '',
    // draggableCancel: '',
    // containerPadding: null,
    // rowHeight: 150,
    // maxRows: Infinity, // infinite vertical growth
    layout: [],
    margin: [12, 12],
    // isDraggable: true,
    // isResizable: true,
    // useCSSTransforms: true,
    // verticalCompact: true,
    // compactType: 'vertical',
    // preventCollision: false,

    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    layouts: {}
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { context, layout, children } = this.props;
    return (
      <div>
        <style type="text/css">{`.react-grid-item.react-grid-placeholder {background: ${context.theme.boaPalette.pri500};}`}</style>
        <ResponsiveGridLayout className="layout" {...this.props} layout={layout}>
          {/* <div key="a">a</div>
          <div key="b">b</div>
          <div key="c">c</div> */}
          {children}
        </ResponsiveGridLayout>
      </div>
    );
  }
}

export default BGridLayout;
