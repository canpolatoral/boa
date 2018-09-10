import { combineReducers } from '../redux';
import * as Actions from '../action';
import { routeReducer } from '../router';
import { BLocalization } from 'b-localization';

function ReducerBuffer(capacity) {
  if (typeof capacity != 'number' || capacity % 1 != 0 || capacity < 1) {
    throw new TypeError('Invalid capacity');
  }
  this._buffer = new Array(capacity);
  this._reducerDict = {};
  this._capacity = capacity;
  this._first = 0;
  this._size = 0;
  this._emitChange = null;
}

ReducerBuffer.prototype = {
  size: function () {
    return this._size;
  },
  setChangeListener: function (listener) {
    this._emitChange = listener;
  },
  enq: function (value, key) {
    if (this._first > 0) {
      this._first--;
    }
    else {
      this._first = this._capacity - 1;
    }
    this.emitChange();
    this._buffer[this._first] = { reducer: value, tag: key };
    this._reducerDict[key] = true;
    if (this._size < this._capacity) {
      this._size++;
    }
  },
  checkExists(key) {
    return this._reducerDict[key];
  },
  emitChange: function () {
    if (this._emitChange != null && this._buffer[this._first]) {
      this._reducerDict[this._buffer[this._first].tag] = null;
      this._emitChange(this._buffer[this._first]);
    }
  },
  get: function (start, end) {
    if (this._size == 0 && start == 0 && (end == undefined || end == 0)) {
      return [];
    }
    if (typeof start != 'number' || start % 1 != 0 || start < 0) {
      throw new TypeError('Invalid start');
    }
    if (start >= this._size) {
      throw new RangeError('Index past end of buffer: ' + start);
    }
    if (end == undefined) {
      return this._buffer[(this._first + start) % this._capacity];
    }
    if (typeof end != 'number' || end % 1 != 0 || end < 0) {
      throw new TypeError('Invalid end');
    }
    if (end >= this._size) {
      throw new RangeError('Index past end of buffer: ' + end);
    }
    if (this._first + start >= this._capacity) {
      start -= this._capacity;
      end -= this._capacity;
    }
    if (this._first + end < this._capacity)
      return this._buffer.slice(this._first + start, this._first + end + 1);
    else
      return this._buffer.slice(this._first + start, this._capacity).concat(this._buffer.slice(0, this._first + end + 1 - this._capacity));
  },
  toarray: function () {
    var newreducers = {};
    if (this._size == 0) {
      return newreducers;
    }
    var reducers = this.get(0, this._size - 1);
    for (var index = 0; index < reducers.length; index++) {
      newreducers[reducers[index].tag] = reducers[index].reducer;
    }
    return newreducers;
  }
};

let contextReducer = function (state = {}, action = { type: 'UNKNOWN', payload: { data: {} } }) {
  const { payload } = action;
  switch (action.type) {
    case Actions.UPDATE_DEVICE_SIZE:
      if (state.deviceSize != payload.deviceSize) {
        return Object.assign({}, state, { deviceSize: payload.deviceSize });
      } else {
        return state;
      }
    case Actions.UPDATE_THEME:
      return Object.assign({}, state, { theme: payload.theme });
    case Actions.UPDATE_PLATFORM:
      return Object.assign({}, state, { platform: payload.platform });
    case Actions.CHANGE_LANGUAGE:
      return Object.assign({}, state, { language: payload.language, messagingContext: {}, localization: BLocalization.createLocalizationContext(payload.language) });
    case Actions.CHANGE_MESSAGING_CONTEXT:
      return Object.assign({}, state, { messagingContext: payload.messagingContext });
    case Actions.CHANGE_APPLICATION_CONTEXT:
      return Object.assign({}, state, { applicationContext: payload.applicationContext });
    default:
      return state;
  }
};

let snapshotStoreReducer = function (state = {}, action = { type: 'UNKNOWN', payload: { data: {} } }) {
  switch (action.type) {
    case Actions.SAVE_SNAPSHOT:
      state[action.payload.pageId] = action.payload.data;
      return Object.assign({}, state);
    default:
      return state;
  }
};

let executerStoreReducer = function (state = {}, action = { type: 'UNKNOWN', payload: {} }) {
  if (!action || !action.payload) {
    return state;
  }

  const { pageId, requestKey, response } = action.payload;
  // const { requestClass, requestBody, key, pageId, requestKey, response } = action.payload;

  let newPageState = state[pageId] ? state[pageId] : { executionPool: {}, requestCounter: 0 };

  switch (action.type) {
    case Actions.EXECUTE_BEGIN:
      newPageState.executionPool[requestKey] = { ...action.payload, isPending: true, beginDate: new Date() };
      state[pageId] = newPageState;
      return Object.assign({}, state);
    case Actions.EXECUTE_END:
      newPageState.executionPool[requestKey] = Object.assign(newPageState.executionPool[requestKey], { response, isPending: false, endDate: new Date() });
      state[pageId] = newPageState;
      return Object.assign({}, state);
    default:
      return state;
  }
};

class ReducerCatalog {
  constructor() {
    this._emitChange = null;
    this._store = null;
    this._uniqueIncrement = 0;
    this.init = this.init.bind(this);
    this.register = this.register.bind(this);
  }
  init(initialreducers = {}, initialSize = 10) {
    var self = this;
    // this._initialreducers = {...initialreducers, ...{context: contextReducer, routing: routeReducer, user: userReducer, snapshotStore: snapshotStoreReducer }};
    this._initialSize = initialSize;
    this._initialreducers = { ...initialreducers, ...{ context: contextReducer, snapshotStore: snapshotStoreReducer, executerStore: executerStoreReducer } };
    this._reducers = { ...this._initialreducers };
    this._reducerBuffer = new ReducerBuffer(initialSize);
    this._reducerBuffer.setChangeListener((bufferObj) => {
      if (self._store) {
        var currentState = self._store.getState();
        if (currentState[bufferObj.tag]) {
          delete currentState[bufferObj.tag];
        }
      }
    });
  }
  register(newreducers) {
    if (this._reducerBuffer) {
      for (var key in newreducers) {
        if (!this._reducerBuffer.checkExists(key)) {
          if (newreducers.hasOwnProperty(key)) {
            var reducer = newreducers[key];
            this._reducerBuffer.enq(reducer, key);
          }
        }
      }
      this._reducers = { ...this._initialreducers, ...this._reducerBuffer.toarray() };
      if (this._emitChange != null) {
        this._emitChange(this.getReducers());
      }
    }
    else {
      throw 'Reducer Catalog is not initialized!';
    }
  }
  setStore(store, initialState) {
    this._store = store;
    this._initialState = Object.assign({}, initialState);
  }
  getStore() {
    return this._store;
  }
  getIncrement() {
    this._uniqueIncrement = this._uniqueIncrement + 1;
    return this._uniqueIncrement;
  }
  configureReducers(reducers) {
    var appReducers = combineReducers({ ...reducers });
    var rootReducer = (state, action) => {
      if (action.type == Actions.RESET_STORE) {
        state = this._initialState;
        // this.init(this._initialreducers, this._initialSize);
        // this.register();
        // var commonTags = this.getCommonReducers();
        // for (var rtag in state) {
        //   if (!commonTags.hasOwnProperty(rtag)) {
        //     state[rtag] = undefined;
        //   }
        // }
        // state['snapshotStore'] = undefined;
        // state['executerStore'] = undefined;
        // this.init(this._initialreducers, this._initialSize);
        // this.changeReducers(this._initialreducers);
        return state;
      }
      return appReducers(state, action);
    };
    return rootReducer;
  }
  getReducers() {
    return { ...this._reducers };
  }
  getCommonReducers() {
    return { ...this._initialreducers };
  }
  getStaticReducers() {
    return { context: contextReducer, routing: routeReducer, snapshotStore: snapshotStoreReducer, executerStore: executerStoreReducer };
  }
  setChangeListener(listener) {
    this._emitChange = listener;
  }
  changeReducers(reducers) {
    let newReducers = this.configureReducers(reducers);
    this._store.replaceReducer(newReducers);
  }
  createAction(type) {
    var store = this._store;
    return function (data) {
      store.dispatch({
        type: type,
        payload: {
          data: data
        }
      });
    };
  }
  createReducer(targetAction, initialState = null, matchingPropName, reducertag) {
    var newReducer = {};
    var pageReducer = function (state = initialState, action = { type: 'UNKNOWN' }) {
      if (action.type == targetAction) {
        var myState = {};
        myState[matchingPropName] = action.payload.data;
        return Object.assign({}, state, myState);
      }
      return state;
    };
    newReducer[reducertag] = pageReducer;
    return newReducer;
  }
  exists(key) {
    return this._reducerBuffer.checkExists(key);
  }

  resetStore() {
    this._store.dispatch({ type: Actions.RESET_STORE });
    this.init(this._initialreducers, this._initialSize);
    this.register();
  }
}

let reducerRegistry = new ReducerCatalog();
export default reducerRegistry;
