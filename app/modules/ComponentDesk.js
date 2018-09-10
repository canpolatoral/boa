import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PanelAvailableComponents from './PanelAvailableComponents';
import { BAutoComplete } from '../../components/ui/inputs/b-auto-complete';
import { getTheme } from '../../components/b-theme';
import DeskPageFrame from './DeskPageFrame';
var context = [];
export default class ComponentDesk extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      componentType: null,
      theme: getTheme({ themeName: 'kt-green' }), // kt-green,violet,winter,spring,summer,night
      data: null,
      fullScreen: props.fullScreen,
      languageId: props.languageId,
      allrefs: [],
      snaps: []
      // ,
      // dataSource: []
    };
  }
  componentWillMount() {
    context.theme = this.state.theme;
    context.localization = [];
    context.localization.isRightToLeft = false;
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      fullScreen: nextProps.fullScreen,
      languageId: nextProps.languageId
    });
  }

  handleClick(type, data) {
    this.setState({
      componentType: type,
      data: data
    });
  }

  handleOnRequest(event, data) {
    ReactDOM.findDOMNode(this.state.snaps[data.suggestion.value]).click();
  }

  render() {

    const leftPanelInner = (<PanelAvailableComponents snaps={this.state.snaps} allrefs={this.state.allrefs} onClick={this.handleClick.bind(this)} />);
    const leftPanelStyle = {
      padding: '10px 0 30px',
      borderRight: '1px solid #d5d5d5'
    };/* ,
            minHeight: 500,
            height: $(window).height() - 60
        };*/
    const canvasStyle = {
      padding: 15
    }; /* ,
            minHeight: 500,
            height: $(window).height() - 60
        };*/
    const pageFrame = (
      <DeskPageFrame
        componentType={this.state.componentType}
        data={this.state.data}
        fullScreen={this.state.fullScreen}
        languageId={this.state.languageId} />
    );

    if (this.state.fullScreen) {
      return (
        <div className="container-fluid" style={{ padding: 0 }}>
          <div className="row">
            <div className="col-sm-12">
              {pageFrame}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-2" style={leftPanelStyle}>
              <div style={{ marginLeft: '20px', marginRight: '20px', backgroundColor:'#337ab71f' }}> <BAutoComplete animated='false' open='true' hintText='Search' floatingLabelText='' maxSearchResults='20' fullWidth='true'
                onNewRequest={this.handleOnRequest.bind(this)}
                dataSource={this.state.allrefs}
                context={context}

              />
              </div>
              {leftPanelInner}
            </div>
            <div className="col-sm-10" style={canvasStyle}>
              {pageFrame}
            </div>
          </div>
        </div>
      );
    }
  }
}

ComponentDesk.defaultProps = {
  fullScreen: false
};
