import forEach from '../utils/foreach';
import getProp from '../utils/get-prop';
import { store } from '../store';
const SUBSCRIBE = '@@redux/subscribe';
const UNSUBSCRIBE = '@@redux/unsubscribe';

// eslint-disable-next-line
function subscribeMiddleware({dispatch, getState}) {
  const paths = [];
  const subscriptions = {};

  return next => action => {
    if (action) {
      switch (action.type) {
        case SUBSCRIBE: {
          const {path, key, fn} = action.payload;
          subscriptions[path] = subscriptions[path] || {};
          subscriptions[path][key] = fn;
          if (paths.indexOf(path) === -1) {
            paths.push(path);
          }
          break;
        }
        case UNSUBSCRIBE: {
          const {path, key} = action.payload;
          const subs = subscriptions[path];
          if (subs) {
            delete subs[key];
            if (Object.keys(subs).length === 0) {
              delete subscriptions[path];
              paths.splice(paths.indexOf(path), 1);
            }
          }
          break;
        }
        default: {
          const prevState = getState();
          const result = next(action);
          const nextState = getState();
          if (action.rpath) {
            const {rpath} = action;
            const prev = getProp(rpath, prevState);
            const next = getProp(rpath, nextState);
            if (prev !== next) {
              forEach(fn => fn({ path: rpath, prev: prev, next: next }), subscriptions[rpath]);
            }
          }
          else {
            forEach(path => {
              const prev = getProp(path, prevState);
              const next = getProp(path, nextState);
              if (prev !== next) {
                forEach(fn => fn({ path: path, prev: prev, next: next }), subscriptions[path]);
              }
            }, paths);
          }
          return result;
        }
      }
    } else {
      return next(action);
    }
  };
}

function subscribe(path, key, fn) {
  store.dispatch({
    type: SUBSCRIBE,
    payload: { path, key, fn }
  });
}

function unsubscribe(path, key) {
  store.dispatch({
    type: UNSUBSCRIBE,
    payload: { path, key }
  });
}

export default subscribeMiddleware;
export {
  subscribe,
  unsubscribe
};
