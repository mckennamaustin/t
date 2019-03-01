import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import dragReducer from './reducers/drag';
import dropBayReducer from './reducers/dropBay';
import floorplanReducer from './reducers/floorplan';
import panoramasReducer from './reducers/panoramas';
import viewerReducer from './reducers/viewer';

export default combineReducers({
  router: connectRouter(history),
  drag: dragReducer,
  dropBay: dropBayReducer,
  floorplan: floorplanReducer,
  panoramas: panoramasReducer,
  viewer: viewerReducer
});
