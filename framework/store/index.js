import { createStore, applyMiddleware } from '../redux';
import subscribeMiddleware from '../middleware';
import thunkMiddleware from 'redux-thunk';
import * as reducerRegistry from '../reducer';
import routeManager, { syncHistory } from '../router';

export let store = null;
export function configureStore(initialState, middlewares, devToolsComposition) {
  const reduxRouterMiddleware = syncHistory(routeManager.getHistory());
  let storeMiddleware = [thunkMiddleware, subscribeMiddleware, ...middlewares, reduxRouterMiddleware];
  let createStoreWithMiddleware;
  if (devToolsComposition) {
    createStoreWithMiddleware = devToolsComposition(applyMiddleware.apply(this, storeMiddleware))(createStore);
  } else {
    createStoreWithMiddleware = applyMiddleware.apply(this, storeMiddleware)(createStore);
  }
  var rootReducer = reducerRegistry.default.configureReducers(reducerRegistry.default.getReducers());
  store = createStoreWithMiddleware(rootReducer, initialState);
  reducerRegistry.default.setStore(store, initialState);
  reducerRegistry.default.setChangeListener((reducers) => {
    var newrootReducer = reducerRegistry.default.configureReducers(reducers);
    store.replaceReducer(newrootReducer);
  });
  return store;
}
export function setStore(external_store) {
  store = external_store;
  return store;
}
