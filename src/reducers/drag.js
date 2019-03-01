import {
  BEGIN_PANORAMA_DRAG,
  END_PANORAMA_DRAG,
  DRAG_ENTER_FLOORPLAN,
  DRAG_LEAVE_FLOORPLAN,
  MOUSE_ENTER_FLOORPLAN,
  MOUSE_LEAVE_FLOORPLAN,
  UPDATE_MOUSE_POSITION
} from '../constants/actionTypes';

const initialState = {
  draggedId: undefined,
  isDragging: false,
  isMouseOverFloorplan: false,
  mousePosition: [0, 0]
};

function applyEndPanoramaDrag(state, action) {
  return Object.assign({}, state, {
    isDragging: false,
    draggedId: undefined
  });
}

export default (state = initialState, action) => {
  switch (action.type) {
    case BEGIN_PANORAMA_DRAG: {
      return Object.assign({}, state, {
        isDragging: true,
        draggedId: action.payload.id
      });
    }
    case END_PANORAMA_DRAG: {
      return applyEndPanoramaDrag(state, action);
    }
    case MOUSE_ENTER_FLOORPLAN: {
      if (state.isDragging) {
        return Object.assign({}, state, { isMouseOverFloorplan: true });
      }
      return Object.assign({}, state);
    }
    case MOUSE_LEAVE_FLOORPLAN: {
      if (state.isDragging) {
        return Object.assign({}, state, { isMouseOverFloorplan: false });
      }

      return Object.assign({}, state);
    }
  }

  return state;
};
