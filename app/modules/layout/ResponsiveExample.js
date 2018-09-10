import React from 'react';
import ReactDOM from 'react-dom';
import BSidebar from '../../../components/ui/layout/b-side-bar';
import BAppBar from '../../../components/ui/toolbar/b-app-bar';
import BDrawerMenu from '../../../components/ui/menu/b-drawer-menu';
import { getTheme } from '../../../components/b-component/theme/basetheme';

const styles = {
  contentHeaderMenuLink: {
    textDecoration: 'none',
    color: 'white',
    padding: 8,
  },
  content: {
    padding: '16px',
  },
};

const App = React.createClass({
  getInitialState() {
    return { docked: false, open: false, theme: getTheme() };
  },

  componentWillMount() {
    const mql = window.matchMedia('(min-width: 800px)');
    mql.addListener(this.mediaQueryChanged);
    this.setState({ mql: mql, docked: mql.matches });
  },

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  },

  onSetOpen(open) {
    this.setState({ open: open });
  },

  mediaQueryChanged() {
    this.setState({ docked: this.state.mql.matches });
  },

  toggleOpen(ev) {
    this.setState({ open: !this.state.open });

    if (ev) {
      ev.preventDefault();
    }
  },

  render() {

    const context = { theme: this.state.theme, deviceSize: 1 };
    var bmenuprops = {
      'autoWidth': true,
      'disableAutoFocus': false,
      'initiallyKeyboardFocused': false,
      'maxHeight': null,
      'multiple': false,
      'items': [
        {
          'text': 'İstanbul',
          'value': '34',
          'rightIcon': {
            'className': 'muidocs-icon-action-home'
          }
        },
        {
          'text': 'Ankara',
          'value': '06',
          'items': [
            {
              'text': 'sincan',
              'value': '06_01'
            },
            {
              'text': 'kizilay',
              'value': '06_02',
              'items': [
                {
                  'text': 'mesut',
                  'value': '06_02_01'
                },
                {
                  'text': 'ismail',
                  'value': '06_02_02'
                }
              ]
            }
          ]
        },
        {
          'text': 'Kocaeli',
          'value': '41'
        }
      ]
    };

    const sidebar = <BDrawerMenu context={context} {...bmenuprops} />;

    const contentHeader = (
      <span>
        {!this.state.docked &&
          <a onClick={this.toggleOpen} href="#" style={styles.contentHeaderMenuLink}>=</a>}
        <span> Responsive React Sidebar</span>
      </span>);

    const sidebarProps = {
      sidebar: sidebar,
      docked: this.state.docked,
      open: this.state.open,
      onSetOpen: this.onSetOpen,
    };

    return (
      <BSidebar context={context} {...sidebarProps}>
        <BAppBar context={context} title={contentHeader}></BAppBar>
        <div style={styles.content}>
          <p>
            This example will automatically dock the sidebar if the page
              width is above 800px (which is currently {'' + this.state.docked}).
            </p>
          <p>
            This functionality should live in the component that renders the sidebar.
              This way you're able to modify the sidebar and main content based on the
              responsiveness data. For example, the menu button in the header of the
              content is now {this.state.docked ? 'hidden' : 'shown'} because the sidebar
              is {!this.state.docked && 'not'} visible.
            </p>
        </div>
      </BSidebar>
    );
  },
});

ReactDOM.render(<App />, document.getElementById('example'));
