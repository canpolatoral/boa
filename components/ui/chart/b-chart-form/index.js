import React from 'react';
import PropTypes from 'prop-types';
import Container from './Container';
import Row from './Row';
import Col from './Col';
import Provider from './Provider';
import Filter from './Filter';

import { BComponentComposer } from 'b-component';
import { BBusinessComponent } from 'b-business-component';
import { BChartCard } from 'b-chart-card';
import { BScroll } from 'b-scroll';
let ElementResizeDetectorMaker = require('element-resize-detector');
@BComponentComposer
export class BChartForm extends BBusinessComponent {

  static propTypes = {
    ...BBusinessComponent.propTypes,
    resourceCode: PropTypes.string.isRequired,
    disableDefaultScroll: PropTypes.bool
  }

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    disableDefaultScroll: false
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      chartGroups: [],
      filterComponents: null,
      parameters: null,
      maxWidth: 1500,
      tags: []
    };

    this.columnCount = 3;
    this.selectedTagChanged = this.selectedTagChanged.bind(this);
    this.resizeDetector = ElementResizeDetectorMaker();
    this.updateFormWidth = this.updateFormWidth.bind(this);

    this.allCharts = [];
    this.currentChartIndex = [];
    this.snaps = [];
  }

  getValue() {
    return this.state;
  }

  setValue(value) {
    this.setState({ ...value });
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.formDiv) {
      this.resizeDetector.listenTo(this.formDiv, this.updateFormWidth);
    }
    this.getData();
  }

  updateFormWidth() {
    let formWidth = this.formDiv.offsetWidth;
    if (formWidth == this.oldWidth) return;
    if (formWidth < 1500) {
      // iki kolon
      this.setColumnCountAndMaxWidth(2, formWidth);
    } else {
      this.setColumnCountAndMaxWidth(3, formWidth);
    }
    this.oldWidth = formWidth;

    $('div[data-role="chart"]').each(function (index, element) {
      $(element).data('kendoChart').refresh();
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.formDiv) {
      this.resizeDetector.removeAllListeners(this.formDiv);
    }
  }

  getData() {

    let proxyRequest = {
      requestClass: 'BOA.Types.DynamicFormGenerator.DynamicFormExecuterRequest',
      requestBody: {
        body: {
          FormResourceCode: this.props.resourceCode,
          ResourceCode: this.props.resourceCode,
          MethodName: 'SelectModalByResourceCode'
        },
        type: 'BOA.Types.DynamicFormGenerator.DynamicFormExecuterRequest'
      },
      key: 'SelectModalByResourceCode',
      path: 'Public/Generic',
    };

    this.proxyExecute(proxyRequest);
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'SelectModalByResourceCode':
        if (response.success) {
          if (response.value) {
            this.model = JSON.parse(response.value);
            this.createTags();
            this.createChartGroupsAndFilterSection(this.model, this.columnCount);
          }
        }
        break;
      default:
        break;
    }
  }

  createTags() {
    var arr = [];
    var tempTags = [];
    for (var index = 0; index < this.model.components.length; index++) {
      var chart = this.model.components[index];
      if (chart.props.tag)
        arr.push(chart.props.tag);
    }

    for (var i = 0; i < arr.length; i++) {
      var tag = arr[i];
      if (tag.includes(', ')) {
        var splittedTag = tag.split(', ');
        for (var ind = 0; ind < splittedTag.length; ind++) {
          if (!tempTags.includes(splittedTag[ind])) {
            tempTags.push(splittedTag[ind]);
          }
        }
      }
      else {
        if (!tempTags.includes(tag)) {
          tempTags.push(tag);
        }
      }
    }

    if (tempTags && tempTags.length > 0) {
      this.setState({ tags: tempTags });
    }
  }

  createChartGroupsAndFilterSection(model: any, columnCount: any) {
    var defaultParameters = {};
    if (model.filterComponents) {
      model.filterComponents.forEach((item) => {
        if (item.props && item.props.defaultValue)
          defaultParameters[item.key] = item.props.defaultValue;
      });
    }
    for (var index = 0; index < model.components.length; index++) {
      var item = model.components[index];
      let chartProps = { ...item.props };
      var chart = <BChartCard
        {...chartProps}
        ref={(r: any) => this.snaps[chartProps.itemKey] = r}
        key={chartProps.itemKey}
        snapKey={this.getSnapKey(chartProps.itemKey)}
        context={this.props.context}
        parameters={defaultParameters || this.state.parameters}
      >
      </BChartCard>;
      this.allCharts.push(chart);
      this.currentChartIndex.push(index);
    }

    var allGroups = this.getGroups(model.components, columnCount);

    this.setState(
      {
        chartGroups: allGroups,
        filterComponents: model.filterComponents
      });
  }

  createChartGroups(components: any, columnCount: any) {
    var allGroups = this.getGroups(components, columnCount);
    this.setState(
      {
        chartGroups: allGroups
      });
  }

  getGroups(components: any, columnCount: any) {
    var allGroups = [];
    var group = [];

    for (var index = 0; index < components.length; index++) {
      if (group.length == columnCount) {
        allGroups.push(group);
        group = [];
      }
      group.push(components[index]);
    }
    if (group && group.length > 0)
      allGroups.push(group);

    return allGroups;
  }

  selectedTagChanged(selectedTags: any) {
    var tempModel = this.getTempModel(selectedTags);
    this.createChartGroups(tempModel, this.columnCount);
  }

  getTempModel(tags: any) {
    this.currentChartIndex = [];
    var tempModel = [];

    if (!this.model || !this.model.components)
      return tempModel;

    if (tags.length == this.state.tags.length) {
      tempModel = this.model.components;
      for (var index = 0; index < this.model.components.length; index++)
        this.currentChartIndex.push(index);
    }
    else {
      for (var compIndex = 0; compIndex < this.model.components.length; compIndex++) {
        var chart = this.model.components[compIndex];
        if (chart.props.tag.includes(', ')) {
          var splittedTag = chart.props.tag.split(', ');
          for (var indx = 0; indx < splittedTag.length; indx++) {
            if (tags.includes(splittedTag[indx]) && !tempModel.includes(chart)) {
              tempModel.push(chart);
              this.currentChartIndex.push(compIndex);
            }
          }
        }
        else {
          if (tags.includes(chart.props.tag) && !tempModel.includes(chart)) {
            tempModel.push(chart);
            this.currentChartIndex.push(compIndex);
          }
        }
      }
    }
    return tempModel;
  }

  onDynamicParameterChanged() {
    this.getDataWithParameter();
  }

  getDataWithParameter() {
    var parameters = this.chartFilter.getFilterValues();
    this.setState({ parameters: parameters }, () => {
      Object.keys(this.snaps).forEach((key: string) => {
        this.snaps[key].getInstance().setParameters(parameters);
      });
    });
  }

  setColumnCountAndMaxWidth(count: number, maxWidth: number) {
    this.columnCount = count;
    var selectedTags = this.chartFilter.getSelectedTags();
    var tempModel = this.getTempModel(selectedTags);

    var allGroups = this.getGroups(tempModel);
    this.setState(
      {
        maxWidth: maxWidth,
        chartGroups: allGroups
      });
  }

  getSnapshot() {
    return {
      state: this.state,
      columnCount: this.columnCount,
      allCharts: this.allCharts,
      currentChartIndex: this.currentChartIndex
    };
  }

  setSnapshot(snapshot) {
    let { state, columnCount, allCharts, currentChartIndex } = snapshot;
    this.setState({ ...state });
    this.columnCount = columnCount;
    this.allCharts = allCharts;
    this.currentChartIndex = currentChartIndex;
  }

  render() {
    let chartIndex = 0;
    let content = <div ref={r => this.formDiv = r} style={{ backgroundColor: this.props.context.theme.boaPalette.base100 }}>
      <Provider maxWidth={this.state.maxWidth}>
        <Container browserWidth={this.state.maxWidth}>
          <Row style={{ marginBottom: 20 }}>
            <Col xs={12} sm={12} md={12} lg={12} browserWidth={this.state.maxWidth}>
              <Filter
                context={this.props.context}
                ref={r => this.chartFilter = r}
                components={this.state.filterComponents}
                tags={this.state.tags}
                selectedTagChanged={this.selectedTagChanged}
                onDynamicParameterChanged={this.onDynamicParameterChanged.bind(this)} />
            </Col>
          </Row>
          {
            this.state.chartGroups.map((group: any) => {
              return (
                <Row >
                  {
                    group.map(() => {
                      return (
                        <Col xs={12} sm={6} md={4} lg={4} browserWidth={this.state.maxWidth} style={{ marginBottom: 24 }}>
                          {this.allCharts[this.currentChartIndex[chartIndex++]]}
                        </Col>
                      );
                    }
                    )
                  }
                </Row>
              );
            })
          }
        </Container>
      </Provider>
    </div>;

    if (this.props.disableDefaultScroll)
      return <div style={{ left: 0, right: 0, top: 0, bottom: 0, position: 'fixed', overflowY: 'auto', overflowX: 'hidden' }}>
        {content}
      </div>;
    else
      return <BScroll context={this.props.context} divStyle={{ overflowY: 'auto', overflowX: 'hidden' }} >
        {content}
      </BScroll>;
  }
}

export default BChartForm;

