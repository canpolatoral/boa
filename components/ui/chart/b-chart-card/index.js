import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardContent } from '@material-ui/core';
import KendoChart from './kendochart';
import { BBusinessComponent } from 'b-business-component';
import { BComponent, BComponentComposer } from 'b-component';
import { BButton } from 'b-button';
import { BLoading } from 'b-loading';
import { BDialogHelper } from 'b-dialog-box';
import { BShowHidePanel } from 'b-show-hide-panel';
import { Actions } from 'b-icon';
import Typography from '@material-ui/core/Typography';
import Fullscreen from '@material-ui/icons/Fullscreen';
import ReactDOM from 'react-dom';

@BComponentComposer
export class BChartCard extends BBusinessComponent {

  static propTypes = {
    ...BBusinessComponent.propTypes,
    containerStyle: PropTypes.string,
    title: PropTypes.string,
    fieldName: PropTypes.string,
    series: PropTypes.array,
    dataSource: PropTypes.array,
    widgetId: PropTypes.number,
    resourceCode: PropTypes.string,
    parameters: PropTypes.any,
    imageButtonVisibility: PropTypes.bool,
    refreshButtonVisibility: PropTypes.bool,
    enlargeButtonVisibility: PropTypes.bool,
    imageButtonOnClick: PropTypes.func,
    refreshButtonOnClick: PropTypes.func,
    enlargeButtonOnClick: PropTypes.func
  }

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    imageButtonVisibility: true,
    refreshButtonVisibility: true,
    enlargeButtonVisibility: true,
  }

  state = {
    title: this.props.title,
    fieldName: this.props.fieldName,
    series: this.props.series,
    dataSource: this.props.dataSource,
    widgetId: this.props.widgetId,
    parameters: this.props.parameters
  }

  constructor(props, context) {
    super(props, context);
  }

  getValue() {
    return this.state.value;
  }

  setValue(value) {
    this.setState({
      title: value.title,
      fieldName: value.fieldName,
      series: value.series,
      dataSource: value.dataSource,
      widgetId: value.widgetId,
      parameters: value.parameters
    });
  }

  componentDidMount() {
    super.componentDidMount();
    if (!this.state.dataSource) {
      this.getDataSource();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.widgetId != nextProps.widgetId || this.props.parameters != nextProps.parameters) {
      this.setState(
        {
          title: nextProps.title,
          widgetId: nextProps.widgetId,
          parameters: nextProps.parameters
        }, this.getDataSource
      );
    }
  }

  setParameters(params) {
    this.setState(
      {
        parameters: params
      }, this.getDataSource
    );
  }

  imageButtonClick() {
    if (this.props.imageButtonOnClick) this.props.imageButtonOnClick();
    else {
      var x = ReactDOM.findDOMNode(this.chart);
      var element = $(x).data('kendoChart');
      /* eslint-disable no-undef */
      element.exportSVG().done((data) => {
        // todo: bu kod ile grafik dataları çizilmiyor. this.chart.widgetInstance.exportImage().done((data) => {
        kendo.saveAs({
          dataURI: data,
          fileName: this.state.title
        });
      });
      /* eslint-enable no-undef */
    }
  }

  refreshButtonClick() {
    if (this.props.refreshButtonOnClick) this.props.refreshButtonOnClick();
    else this.getDataSource();
  }
  enlargeButtonClick() {
    if (this.props.enlargeButtonOnClick) {
      this.props.enlargeButtonOnClick();
    }
    else {
      let style = {
        width: '100%'
      };

      BDialogHelper.show(this.props.context,
        <KendoChart
          fieldName={this.state.fieldName}
          series={this.state.series}
          dataSource={this.state.dataSource}
          height={'570px'}
          context={this.props.context} 
        ></KendoChart>,
        BComponent.DialogType.QUESTION,
        BComponent.DialogResponseStyle.OK,
        this.state.title,
        null,
        style,
        null,
        null,
        false
      );
    }
  }
  showProgress() {
    this.progressPanel && this.progressPanel.show();
  }

  hideProgress() {
    this.progressPanel && this.progressPanel.hide();
  }

  getDataSource() {
    this.showProgress();
    let proxyRequest = {
      requestClass: 'BOA.Types.DynamicFormGenerator.DynamicFormExecuterRequest',
      requestBody: {
        body: {
          ResourceCode: this.props.resourceCode,
          WidgetId: this.state.widgetId,
          ComponentPropertyAndObjectString: JSON.stringify(this.state.parameters),
          MethodName: 'GetChartModel'
        },
        type: 'BOA.Types.DynamicFormGenerator.DynamicFormExecuterRequest'
      },
      key: 'GetChartModel',
      path: 'Public/Generic',
      proxyTimeout: 30 * 60 * 1000 // 30dk
    };
    this.proxyExecute(proxyRequest);
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    this.hideProgress();
    switch (key) {
      case 'GetChartModel':
        if (response.success) {
          if (response.value) {
            this.setState(
              {
                title: response.value.title,
                fieldName: response.value.fieldName,
                series: response.value.series,
                dataSource: response.value.dataSource,
              });
          }
        }
        break;
      default:
        break;
    }
  }

  getSnapshot() {
    return this.state;
  }

  setSnapshot(snapshot) {
    this.state = Object.assign({}, this.state, snapshot);
  }

  onMoreActionItemClick() {

  }

  render() {
    var imageButtonVisible = this.props.imageButtonVisibility && (this.props.context.deviceSize >= BComponent.Sizes.MEDIUM);
    var enlargeButtonVisible = this.props.enlargeButtonVisibility && (this.props.context.deviceSize >= BComponent.Sizes.MEDIUM);
    const progress = <BShowHidePanel ref={(r) => this.progressPanel = r}>
      <BLoading context={this.props.context} />
    </BShowHidePanel>;
    const { FileDownload, Refresh } = Actions;

    let cardContentStyles = {
      paddingLeft: '20px',
      paddingTop: '24px',
      paddingRight: '20px',
      paddingBottom: '24px'
    };
    let cardActionStyles = {
      display: 'flex',
      alignItems: 'baseline',
      direction: this.props.context.localization.isRightToLeft ? 'rtl' : 'ltr',
      padding: '0px',
    };

    let refreshButtonStyle = { color: this.props.context.theme.boaPalette.base300, width: '24px', height: '24px', marginRight: !this.props.context.localization.isRightToLeft && '12px', marginLeft: this.props.context.localization.isRightToLeft && '12px' };
    let downloadButtonStyle = { color: this.props.context.theme.boaPalette.base300, width: '24px', height: '24px' };
    let enlargeButtonStyle = { color: this.props.context.theme.boaPalette.base300, width: '24px', height: '24px', marginLeft: !this.props.context.localization.isRightToLeft && '12px', marginRight: this.props.context.localization.isRightToLeft && '12px' };

    return (
      <Card>
        <CardContent style={cardContentStyles}>
          <CardActions style={cardActionStyles}>
            <Typography style={{ fontSize: '16px', color: 'black', fontWeight: 'normal', flex: 1 }}>{this.state.title}</Typography>
            <div>
              {
                this.props.refreshButtonVisibility &&
                <BButton
                  context={this.props.context}
                  type="icon"
                  style={refreshButtonStyle}
                  iconStyle={{ width: 20, height: 20 }}
                  icon={<Refresh context={this.props.context} />}
                  onClick={this.refreshButtonClick.bind(this)}
                />
              }
              {
                imageButtonVisible &&
                <BButton
                  context={this.props.context}
                  type="icon"
                  style={downloadButtonStyle}
                  iconStyle={{ width: 20, height: 20 }}
                  icon={<FileDownload context={this.props.context} />}
                  onClick={this.imageButtonClick.bind(this)} />
              }
              {
                enlargeButtonVisible &&
                <BButton
                  context={this.props.context}
                  type="icon"
                  style={enlargeButtonStyle}
                  iconStyle={{ width: 20, height: 20 }}
                  icon={<Fullscreen context={this.props.context} />}
                  onClick={this.enlargeButtonClick.bind(this)} />
              }
            </div>
          </CardActions>
          {progress}
          <KendoChart
            ref={r => this.chart = r}
            fieldName={this.state.fieldName}
            series={this.state.series}
            dataSource={this.state.dataSource}
            context={this.props.context} >
          </KendoChart>
        </CardContent>
      </Card>
    );
  }

}

export default BChartCard;
