import * as React from 'react';
import { Row, Button, Navbar } from 'react-bootstrap';
import ComponentDesk from './ComponentDesk';
import { getTheme } from '../../src/base/b-theme';
import Mousetrap from 'mousetrap';
import { BAppProvider } from '../../src/base/b-component';

export default class ComponentLibrary extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      theme: getTheme({ themeName: 'kt-green' }), // kt-green,violet,winter,spring,summer,night
      // theme: getTheme({ themeName: 'night', externalTheme: { centeredLayout: true } }),
      fullScreen: false,
      languageId: 1
    };

    this.makeFullScreen = this.makeFullScreen.bind(this);
    this.escapeFromFullScreen = this.escapeFromFullScreen.bind(this);

    Mousetrap.bind('esc', this.escapeFromFullScreen, 'keyup');
    Mousetrap.bind('ctrl+shift+f', this.makeFullScreen, 'keyup');
  }

  getContent() {
    this.state.languageId == 5 ? (this.state.theme.direction = 'rtl') : (this.state.theme.direction = 'ltr');
    return (
      <BAppProvider theme={this.state.theme}>
        <ComponentDesk fullScreen={this.state.fullScreen} languageId={this.state.languageId} />
      </BAppProvider>
    );
  }

  makeFullScreen() {
    this.setState({ fullScreen: true });
  }

  selectTheme(theme) {
    // alert(theme);
    this.setState({
      theme: getTheme({ themeName: theme || 'violet' })
    });
  }

  mirrorScreen() {
    let newlang = this.state.languageId == 1 ? 5 : 1;
    this.setState({ languageId: newlang });
  }

  escapeFromFullScreen() {
    // alert("escape")
    this.setState({ fullScreen: false });
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  render() {
    var displayValue = this.state.fullScreen ? 'none' : 'block';
    var langButtonBackgroud = this.state.languageId == 5 ? '#FF5233' : '#33A7FF';
    var buttonLabel = this.state.languageId == 5 ? 'It is RightToLeft' : 'It is LeftToRight';
    const { theme } = this.state;
    const mainColor = this.hexToRgb(theme.palette.primary.main);

    const navBar = (
      <Navbar inverse fluid style={{ background: theme ? `rgba(${mainColor.r},${mainColor.g},${mainColor.b},0.75)` : '#16A086', display: displayValue }}>
        <Row>
          <Navbar.Header>
            <Navbar.Brand>
              <h1 style={{ margin: 0, color: 'white' }}>BOA Components</h1>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Button bsStyle="primary" bsSize="xsmall" onClick={this.makeFullScreen} style={{ float: 'right', margin: 13, marginRight: -5 }}>  Full Screen</Button>
            <Button bsStyle="primary" bsSize="xsmall" onClick={this.mirrorScreen.bind(this)} style={{ background: langButtonBackgroud, float: 'right', margin: 13, marginRight: -5 }}>{buttonLabel}</Button>
            <Button bsStyle="primary" bsSize="xsmall" onClick={this.selectTheme.bind(this, 'winter')} style={{ background: '#1976D2', float: 'right', margin: '13px 2px' }}>Winter</Button>
            <Button bsStyle="primary" bsSize="xsmall" onClick={this.selectTheme.bind(this, 'violet')} style={{ background: '#B618CE', float: 'right', margin: '13px 2px' }}>Violet</Button>
            <Button bsStyle="primary" bsSize="xsmall" onClick={this.selectTheme.bind(this, 'summer')} style={{ background: '#D11919', float: 'right', margin: '13px 2px' }}>Summer</Button>
            <Button bsStyle="primary" bsSize="xsmall" onClick={this.selectTheme.bind(this, 'spring')} style={{ background: '#3F51B5', float: 'right', margin: '13px 2px' }}>Spring</Button>
            <Button bsStyle="primary" bsSize="xsmall" onClick={this.selectTheme.bind(this, 'night')} style={{ background: '#3F51B5', float: 'right', margin: '13px 2px' }}>Night</Button>
            <Button bsStyle="primary" bsSize="xsmall" onClick={this.selectTheme.bind(this, 'kt-green')} style={{ background: '#006754', float: 'right', margin: '13px 2px' }}>KT-Green</Button>
          </Navbar.Collapse>
        </Row>
      </Navbar>
    );
    const content = this.getContent();

    return (
      <div dir={this.state.theme.direction} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto' }}>
        {navBar}
        {content}
      </div>
    );

    // if(this.state.fullScreen){
    //     return (
    //         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto' }}>
    //             {content}
    //         </div>
    //     );
    // } else {
    //     return (
    //         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto' }}>
    //             {navBar}
    //             {content}
    //         </div>
    //     );
    // }
  }
}
