import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import ComponentLibrary from './modules/ComponentLibrary';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('content')
  );
};
render(ComponentLibrary);
// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./modules/ComponentLibrary', () => {
    render(ComponentLibrary);
  });
}