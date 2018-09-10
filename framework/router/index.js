import React from 'react';
import Router from 'react-router/lib/Router';
import useRouterHistory from 'react-router/lib/useRouterHistory';
import createHashHistory from 'history/lib/createHashHistory';
import { store } from '../store';

class RouteManager {
  constructor() {
    this.appHistory = useRouterHistory(createHashHistory)({ queryKey: false });
    this.autoIncrement = 0;
    this.isHashScrollActive = true;

    this.backListener = this.appHistory.listen(location => {
      if (window.isBOAStoreLogin && location.state && location.state.pageId) {
        this.setCurrentPageId(location.state.pageId);
      }
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    // Unbind listener
    this.backListener();
  }
  
  getHistory() {
    return this.appHistory;
  }
  generateRoutes(model) {
    return (
      <Router
        history={this.appHistory}
        routes={model.route}
        createElement={this.createElement.bind(this)}
        onUpdate={this.onRouteUpdate.bind(this)}>
      </Router>
    );
  }

  onRouteUpdate() {
    if (this.isHashScrollActive) {
      const { hash } = window.location;
      if (hash !== '') {
        this.hashLinkScroll(hash);
      }
    }
  }

  hashLinkScroll(hash) {
    if (hash.startsWith('#/')) { /* #/faq#apps */
      hash = hash.substring(2);
    }
    if (hash.indexOf('#') < 0) {
      return;
    }
    // Push onto callback queue so it runs after the DOM is updated,
    // this is required when navigating from a different page so that
    // the element is rendered on the page before trying to getElementById.
    setTimeout(() => {
      var hashArray = hash.split('#');
      const id = hashArray[hashArray.length - 1];
      const element = document.getElementById(id);
      if (element) element.scrollIntoView();
    }, 0);
  }

  createElement(Component, props) {
    let newProps = (props.route && props.route.noNeedReMount) ? props : Object.assign({}, props, { key: this.getCurrentPageId() });
    return <Component {...newProps} />;
  }

  getCurrentPageId() {
    return this.currentPageId;
  }
  setCurrentPageId(pageId) {
    this.currentPageId = pageId;
  }
  getCurrentDialogId() {
    return this.currentDialogId;
  }
  setCurrentDialogId(dialogPageId) {
    this.currentDialogId = dialogPageId;
  }
  getUnMountingPageId() {
    return this.unMountingPageId;
  }
  setUnMountingPageId(unMountingPageId) {
    this.unMountingPageId = unMountingPageId;
  }
  getPageParams() {
    return this.pageParams;
  }
  setPageParams(params) {
    this.pageParams = params;
  }
  getDialogParams() {
    return this.dialogParams;
  }
  setDialogParams(params) {
    this.dialogParams = params;
  }
}

let routeManager = new RouteManager();
export default routeManager;
export const TRANSITION = '@@router/TRANSITION';
export const UPDATE_LOCATION = '@@router/UPDATE_LOCATION';

const SELECT_LOCATION = state => state.routing.location;

function transition(method) {
  routeManager.setPageParams(null);
  return arg => {
    if (typeof arg === 'object') {
      if (arg.useDefaultRouting) { /* One.Office dışındakiler için */
        store.dispatch({
          type: TRANSITION,
          payload: { method, arg },
          rpath: 'routing'
        });
      } else {
        let { pageName, pageId, pageParams } = arg;
        routeManager.setUnMountingPageId(routeManager.getCurrentPageId());
        routeManager.setCurrentPageId(pageId);
        routeManager.setPageParams(pageParams);
        store.dispatch({
          type: TRANSITION,
          payload: { method, arg: pageName },
          rpath: 'routing'
        });
      }
    } else {
      store.dispatch({
        type: TRANSITION,
        payload: { method, arg },
        rpath: 'routing'
      });
    }
  };
}

export const push = transition('push');
export const replace = transition('replace');
export const go = transition('go');
export const goBack = transition('goBack');
export const goForward = transition('goForward');
export const routeActions = { push, replace, go, goBack, goForward };

function updateLocation(location) {
  return {
    type: UPDATE_LOCATION,
    payload: location
  };
}

const initialState = {
  location: undefined
};

export function routeReducer(state = initialState, { type, payload: location }) {
  if (type !== UPDATE_LOCATION) {
    return state;
  }
  return { ...state, location };
}

export function syncHistory(history) {
  let unsubscribeHistory, currentKey, unsubscribeStore;
  let connected = false, syncing = false;

  function middleware(store) {
    unsubscribeHistory = history.listen(location => {
      currentKey = location.key;
      if (syncing) {
        return;
      }
      store.dispatch(updateLocation(location));
    });
    connected = true;
    return next => action => {
      if (!action || action.type !== TRANSITION || !connected) {
        return next(action);
      }
      const { payload: { method, arg } } = action;
      history[method](arg);
    };
  }

  middleware.listenForReplays =
    (store, selectLocationState = SELECT_LOCATION) => {
      const getLocationState = () => selectLocationState(store.getState());
      const initialLocation = getLocationState();

      unsubscribeStore = store.subscribe(() => {
        const location = getLocationState();
        if (!location) {
          history.transitionTo(initialLocation);
          return;
        }
        if (location.key !== currentKey) {
          syncing = true;
          history.transitionTo(location);
          syncing = false;
        }
      });
    };

  middleware.unsubscribe = () => {
    unsubscribeHistory();
    if (unsubscribeStore) {
      unsubscribeStore();
    }
    connected = false;
  };
  return middleware;
}
