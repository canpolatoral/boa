// import/require dependencies
// import kuiCharts from 'kendo/js/kendo.dataviz.chart.js';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import deepDiff from 'deep-diff';
import { BLocalization } from 'b-localization';
// import {BComponent} from 'b-component';
// create a React component, that is a wrapper for a Kendo UI widget
export class KendoCharts extends Component {


  constructor(props, context) {
    super(props, context);
  }

  // component is in the DOM, so do stuff to it in this callback
  componentDidMount() {

    var options = this.createOptions(this.props);

    // get, child element node for this component
    var elementNode = ReactDOM.findDOMNode(this);

    $(elementNode).kendoChart(options);
    this.widgetInstance = $(elementNode).data('kendoChart');

    // if props are avaliable for events, triggers, unbind events, or methods make it happen now
    this.props.events ? this.bindEventsToKendoWidget(this.props.events) : null;
    this.props.methods ? this.callKendoWidgetMethods(this.props.methods) : null;
    this.props.triggerEvents ? this.triggerKendoWidgetEvents(this.props.triggerEvents) : null;
  }
  createOptions(nextProps: any) {
    var defaultSerieType = nextProps.series && nextProps.series.length > 0 ? nextProps.series[0].type : 'line';
    var isLineAndColumnSerieExist = nextProps.series && nextProps.series.length > 0 ? (nextProps.series.findIndex(s => s.type == 'line') > -1 && nextProps.series.findIndex(s => s.type == 'column') > -1) : undefined;
    var options = {};
    options.categoryAxis = {
      color: 'black',
      crosshair: {
        color: 'black',
        dashType: 'solid',
        opacity: 1,
        visible: true,
        width: 1
      },
      field: nextProps.fieldName,
      justified: true,
      labels: {
        rotation: {
          align: 'end',
          angle: ((defaultSerieType == 'area') ||
            (defaultSerieType == 'column') ||
            (defaultSerieType == 'line') ||
            (defaultSerieType == 'waterfall')) ? 270 : 0
        },
        template: this.shortLabels,
        visible: true
      },
      line: {
        color: 'gray',
        dashType: 'solid',
        visible: true,
        width: 1
      },
      majorGridLines: {
        visible: true
      },
      majorTicks: {
        visible: false
      },
      minorGridLines: {
        visible: false
      },
      minorTicks: {
        visible: false
      },
      type: 'category',
      visible: true
    };
    options.legend = {
      align: 'center',
      labels: {
        font: '12px Roboto,Helvetica,sans-serif'
      },
      position: 'top',
      visible: true,
      item: {
        visual: this.legendItemVisual
      }
    };

    options.series = [];

    for (var serieIndex in nextProps.series) {
      var serie = nextProps.series[serieIndex];
      options.series.push({
        color: serie.color || null,
        opacity: serie.type == 'area' ? 0.6 : null,
        categoryField: nextProps.fieldName,
        field: serie.field.name,
        name: serie.field.label,
        type: serie.type && serie.type.trim() != '' ? serie.type : defaultSerieType,
        zIndex: serie.sortOrder,
        dashType: 'solid',
        missingValues: 'interpolate'
      });
    }

    if (nextProps.series) {
      var lineSeries = nextProps.series.filter(s => s.type == 'line');  // birden fazla value axis çizilebilmesi için en az bir tane line tipinde seri olmalı. iki line olduğunda tek value axis olmalı
      if (nextProps.series.length > 1 && lineSeries.length == 1) {
        for (var serieLineIndex in nextProps.series) {
          var lineSerie = nextProps.series[serieLineIndex];
          options.series[serieLineIndex].axis = lineSerie.type == 'line' ? 'rate' : 'count';
          options.series[serieLineIndex].labels = {
            align: 'column',
            position: 'outsideEnd',
            visible: lineSerie.type == 'line' ? false : true,
            template: this.numberFormat,
            rotation: lineSerie.type == 'column' && isLineAndColumnSerieExist ? 270 : undefined
          };

          options.valueAxes = [
            {
              name: 'rate',
              labels: {
                template: this.numberFormat
              }
            },
            {
              name: 'count',
              labels: {
                template: this.numberFormat
              }
            }
          ];
        }
      }
    }
    options.seriesColors = this.getSeriesColors();

    options.seriesDefaults = {
      labels: {
        color: 'black',
        margin: 5,
        padding: 0,
        template: this.numberFormat,
        visible: true,
      },
      overlay: {
        gradient: 'none'
      },
      type: defaultSerieType
    };

    options.title = {
      visible: false
    };

    options.tooltip = {
      shared: true,
      visible: true,
      opacity: 1,
      template: (defaultSerieType == 'pie' || defaultSerieType == 'radarLine') ? this.toolTipTemplate : this.numberFormat,
      font: '12px Roboto,Helvetica,sans-serif'
    };

    options.transitions = true;// this.props.context.deviceSize > BComponent.Sizes.SMALL;

    options.valueAxis = {
      background: 'white',
      color: 'black',
      crosshair: {
        color: 'black',
        dashType: 'solid',
        opacity: 1,
        visible: false,
        width: 1
      },
      labels: {
        background: 'white',
        border: {
          color: 'black',
          dashType: 'solid',
          width: 0
        },
        color: 'black',
        margin: 0,
        padding: 0,
        rotation: {
          align: 'end',
          angle: ((defaultSerieType == 'bar') ||
            (defaultSerieType == 'horizontalWaterfall') ||
            (defaultSerieType == 'verticalArea') ||
            (defaultSerieType == 'verticalLine')) ? 270 : 0
        },
        skip: 0,
        step: 1,
        template: this.numberFormat,
        visible: true
      },
      title: {
        visible: false
      },
      type: 'numeric',
      visible: true
    };

    options.zoomable = {
      mousewheel: false,
      selection: false
    };

    options.dataSource = nextProps.dataSource;

    options.chartArea = {
      height: nextProps.height,
    };

    return options;
  }

  getSeriesColors() {
    return [
      '#6397D2',
      '#F76161',
      '#55805F',
      '#D4AAFF',
      '#ffa500',
      '#87ceeb',
      '#F59797',
      '#ffd700',
      '#ffc0cb',
      '#ED7A7A',
      '#add8e6',
      '#00ffff',
      '#FFFF00',
      '#f0e68c',
      '#9EBF9A',
      '#C0C0C0',
      '#808080',
      '#505050'
    ];
  }

  // instance methods for updating widget
  triggerKendoWidgetEvents(events) {
    events.forEach(function (event) { // loop over events, and trigger
      this.widgetInstance.trigger(event);
    }, this);
  }

  bindEventsToKendoWidget(events) {
    Object.keys(events).forEach(function (event) { // loop over events and bind
      this.widgetInstance.bind(event, events[event]);
    }, this);
  }

  unbindEventsToKendoWidget(events) {
    events.forEach(function (event) { // loop ove revents and unbind
      this.widgetInstance.unbind(event);
    }, this);
  }

  callKendoWidgetMethods(methods) {
    Object.keys(methods).forEach(function (method) { // loop over methods and call
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
      var nextOptions = this.createOptions(nextProps);
      this.widgetInstance.setOptions(nextOptions);
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

  componentWillUnmount() {
    if (this.widgetInstance) {
      this.widgetInstance.destroy();
    }
  }

  shortLabels(e) {
    if (typeof (e.value) === 'string' && e.value.length > 21) {
      return e.value.substring(0, 19) + '...';
    }
    return e.value;
  }


  toolTipTemplate(e) {
    var value = e.value;
    var tt = e.category + ': ' + (value % 1 != 0 ? BLocalization.formatCurrency(value) : BLocalization.formatCurrency(value, '0,0'));
    return tt;
  }

  numberFormat(e) {
    var value = e.value;
    return value % 1 != 0 ? BLocalization.formatCurrency(value) : BLocalization.formatCurrency(value, '0,0');
  }
  /* eslint-disable no-undef */
  legendItemVisual(e) {
    var color = e.options.markers.background;
    var labelColor = e.options.labels.color;
    var rect = new kendo.geometry.Rect([0, 0], [300, 50]);
    var layout = new kendo.drawing.Layout(rect, {
      spacing: 5,
      alignItems: 'center',
      cursor: 'pointer'
    });

    var marker = new kendo.drawing.Path({
      fill: {
        color: color
      }
    }).moveTo(0, 0).lineTo(0, 10).lineTo(10, 10).lineTo(10, 0).close();

    var legentLabel = e.series.name;
    if (e.series.type == 'pie') {
      var categoryField = e.series.categoryField;
      legentLabel = e.series.data[e.pointIndex][categoryField];
    }

    var label = new kendo.drawing.Text(legentLabel, [0, 0], {
      fill: {
        color: labelColor
      }
    });

    var ghostMarker = new kendo.drawing.Path({
      opacity: 0
    }).moveTo(0, 0).lineTo(8, 0).close();

    layout.append(marker, label, ghostMarker);
    layout.reflow();

    return layout;
  }
  /* eslint-enable no-undef */

  render() {
    return this.props.children ? this.props.children : <div />;
  }

}

export default KendoCharts;
