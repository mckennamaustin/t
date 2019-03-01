import { UPDATE_PANORAMA_POSITION } from '../constants/actionTypes';

const initialState = {
  byId: {
    a: {
      name: 'Kitchen',
      floorplanLocation: [0, 0]
    },
    b: {
      name: 'Patio',
      floorplanLocation: [0, 0]
    },
    c: {
      name: 'Cafe',
      floorplanLocation: [0, 0]
    },
    d: {
      name: 'Bedroom Window',
      floorplanLocation: [0, 0]
    },
    e: {
      name: 'Bedroom Balcony',
      floorplanLocation: [0, 0]
    },
    f: {
      name: 'TV Room',
      floorplanLocation: [0, 0]
    },
    g: {
      name: 'Dining Room',
      floorplanLocation: [0, 0]
    },
    h: {
      name: 'Lawn',
      floorplanLocation: [0, 0]
    },
    i: {
      name: 'Dungeon',
      floorplanLocation: [0, 0]
    },
    j: {
      name: 'Master Bathroom',
      floorplanLocation: [0, 0]
    },
    k: {
      name: 'Office',
      floorplanLocation: [0, 0]
    },
    l: {
      name: 'Play room',
      floorplanLocation: [0, 0]
    },
    m: {
      name: 'Workshop',
      floorplanLocation: [0, 0]
    },
    n: {
      name: 'Freezer',
      floorplanLocation: [0, 0]
    },
    o: {
      name: 'Pet Cemetary',
      floorplanLocation: [0, 0]
    }
  },
  allIds: [
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
    case UPDATE_PANORAMA_POSITION: {
      return Object.assign({}, state, {
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            floorplanLocation: action.payload.position
          }
        }
      });
    }
  }

  return state;
};
