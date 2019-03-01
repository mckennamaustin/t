import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducer';

const sagaMiddleware = createSagaMiddleware();
export const history = createBrowserHistory();
export const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(routerMiddleware(history), sagaMiddleware, createLogger())
  )
);
