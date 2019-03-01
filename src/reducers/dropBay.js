import {
  DRAG_ENTER_FLOORPLAN,
  DRAG_LEAVE_FLOORPLAN,
  MOUSE_ENTER_FLOORPLAN,
  MOUSE_LEAVE_FLOORPLAN
} from '../constants/actionTypes';

const initialState = {
  orderedIds: [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o'
  ]
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MOUSE_ENTER_FLOORPLAN: {
      if (action.payload.isDragging) {
        return Object.assign({}, state, {
          orderedIds: state.orderedIds.filter(
            id => id !== action.payload.draggedId
          )
        });
      }

      return state;
    }
    case MOUSE_LEAVE_FLOORPLAN: {
      if (action.payload.isDragging) {
        return Object.assign({}, state, {
          orderedIds: state.orderedIds.concat([action.payload.draggedId])
        });
      }

      return state;
    }
  }

  return state;
};
