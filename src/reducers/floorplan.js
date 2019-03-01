import {
  DRAG_ENTER_FLOORPLAN,
  DRAG_LEAVE_FLOORPLAN,
  MOUSE_LEAVE_FLOORPLAN,
  MOUSE_ENTER_FLOORPLAN
} from '../constants/actionTypes';

const initialState = {
  capturedPanoramas: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MOUSE_ENTER_FLOORPLAN: {
      if (action.payload.isDragging) {
        return Object.assign({}, state, {
          capturedPanoramas: state.capturedPanoramas.concat([
            action.payload.draggedId
          ])
        });
      }

      return Object.assign({}, state);
    }
    case MOUSE_LEAVE_FLOORPLAN: {
      if (action.payload.isDragging) {
        return Object.assign({}, state, {
          capturedPanoramas: state.capturedPanoramas.filter(
            id => id !== action.payload.draggedId
          )
        });
      }
      return Object.assign({}, state);
    }
  }

  return state;
};
