import ReactDOM from 'react-dom';
import { mount as enzymeMount } from 'enzyme';
import { CHANNEL } from '@material-ui/core/styles/themeListener';
import appContext from './context';

// Generate an enhanced mount function.
export default function createMount(options1 = {}) {
  const { mount = enzymeMount, ...other1 } = options1;

  const attachTo = window.document.createElement('div');
  attachTo.className = 'app';
  attachTo.setAttribute('id', 'app');
  window.document.body.insertBefore(attachTo, window.document.body.firstChild);

  const mountWithContext = function mountWithContext(node, options2 = {}) {
    return mount(node, {
      attachTo,
      ...other1,
      ...options2,
      context: {
        ...other1.context,
        ...options2.context,
        [CHANNEL]: {
          getState: () => {
            return appContext.theme;
          },
          subscribe: () => {

          },
          unsubscribe: () => {

          },
        },
      },
    });
  };

  mountWithContext.attachTo = attachTo;
  mountWithContext.cleanUp = () => {
    ReactDOM.unmountComponentAtNode(attachTo);
    attachTo.parentNode.removeChild(attachTo);
  };

  return mountWithContext;
}
