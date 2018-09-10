import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import deepDiff from 'deep-diff';

// create a React component, that is a wrapper for a Kendo UI widget
class KendoGrid extends Component {

  constructor() {

    super();

    // diğerleri için eklenmeli https://github.com/telerik/kendo-ui-core/tree/master/src/cultures


    if (!window.kendo.ui.Grid.fn.fitColumns) {
      window.kendo.ui.Grid.fn.fitColumns = function (parentColumn) {
        var grid = this;
        var columns = grid.columns;
        if (parentColumn && parentColumn.columns)
          columns = parentColumn.columns;
        columns.forEach(function (col) {
          if (col.columns)
            return grid.fitColumns(col);
          if (!col.width)
            grid.autoFitColumn(col);
        });
        grid.expandToFit();
      };
      window.kendo.ui.Grid.fn.expandToFit = function () {
        var $gridHeaderTable = this.thead.closest('table');
        var gridDataWidth = $gridHeaderTable.width();
        var gridWrapperWidth = $gridHeaderTable.closest('.k-grid-header-wrap').innerWidth();
        // Since this is called after column auto-fit, reducing size
        // of columns would overflow data.

        if (gridDataWidth >= gridWrapperWidth) {
          return;
        }

        var $headerCols = $gridHeaderTable.find('colgroup > col');
        var $tableCols = this.table.find('colgroup > col');

        var sizeFactor = (gridWrapperWidth / gridDataWidth);
        $headerCols.add($tableCols).not('.k-group-col').each(function () {
          var currentWidth = $(this).width();
          var newWidth = (currentWidth * sizeFactor);
          $(this).css({
            width: newWidth
          });
        });
      };
    }
  }

  // component is in the DOM, so do stuff to it in this callback
  componentDidMount() {
    // get, child element node for this component
    var elementNode = ReactDOM.findDOMNode(this);

    // determine if a selector was passed on which to invoke the KUI widget
    if (this.props.selector) {
      elementNode = elementNode.querySelector(this.props.selector);
    }

    // instantiate and save reference to the Kendo UI widget on elementNode
    // note I am not using jQuery plugin to instantiate, don't want to wait for namespace on $.fn
    this.jQueryInstance = $(elementNode).kendoGrid(this.props.options);
    this.widgetInstance = $(elementNode).data('kendoGrid');
    // this.widgetInstance = new kuiGrid.ui.Grid(elementNode, this.props.options);

    // if props are avaliable for events, triggers, unbind events, or methods make it happen now
    this.props.events ? this.bindEventsToKendoWidget(this.props.events) : null;
    this.props.methods ? this.callKendoWidgetMethods(this.props.methods) : null;
    this.props.triggerEvents ? this.triggerKendoWidgetEvents(this.props.triggerEvents) : null;
  }

  // instance methods for updating widget
  triggerKendoWidgetEvents(events) {
    events.forEach(function (event) {// loop over events, and trigger
      this.widgetInstance.trigger(event);
    }, this);
  }

  bindEventsToKendoWidget(events) {
    Object.keys(events).forEach(function (event) {// loop over events and bind
      this.widgetInstance.bind(event, events[event]);
    }, this);
  }

  unbindEventsToKendoWidget(events) {
    events.forEach(function (event) {// loop ove revents and unbind
      this.widgetInstance.unbind(event);
    }, this);
  }

  callKendoWidgetMethods(methods) {
    Object.keys(methods).forEach(function (method) {// loop over methods and call
      this.widgetInstance[method](...methods[method]);
    }, this);
  }

  // not called on inital render, but whenever parent state changes this is called
  componentWillReceiveProps(nextProps) {
    // always update the widget with nextProp changes if avaliable
    if (nextProps.events) {
      this.bindEventsToKendoWidget(nextProps.events);
    }

    if (this.widgetInstance.setOptions) {
      if (nextProps.options) {
        this.widgetInstance.setOptions(nextProps.options);
      }
    }

    // try and determine if any of the nextProps have changed, and if so, update the widget
    if (nextProps.methods) {
      if (deepDiff(nextProps.methods, this.props.methods)) {
        this.callKendoWidgetMethods(nextProps.methods);
      }
    }

    if (nextProps.unbindEvents) {
      if (deepDiff(nextProps.unbindEvents, this.props.unbindEvents)) {
        this.unbindEventsToKendoWidget(nextProps.unbindEvents);
      }
    }

    if (nextProps.triggerEvents) {
      if (deepDiff(nextProps.triggerEvents, this.props.triggerEvents)) {
        this.triggerKendoWidgetEvents(nextProps.triggerEvents);
      }
    }
  }

  // don't run render again, create widget once, then leave it alone
  shouldComponentUpdate() { return false; }

  // destory it, when the component is unmouted
  componentWillUnmount() {
    // TODO:aşağıdaki kapatıldı ALP Bey e sorulacak. (perf) aliilhan
    // this.widgetInstance.destroy();
  }

  // use the passed in React nodes or a plain <div> if no React child nodes are defined
  render() {
    return this.props.children ? <div>this.props.children</div> : <div />;
  }
}

// export the wrapped component
export default KendoGrid;
