import { produce } from 'immer';

import {
  TYPE_CART_REQUEST,
  TYPE_CART_SUCCESS,
  TYPE_CART_FAILURE,
  TYPE_CART_LOADING
} from '../../../constants/types-reducers';

export const INITIAL_STATE = {
  loadingCart: false,
  cart: null
};

export function payments(state = INITIAL_STATE, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case TYPE_CART_REQUEST: {
        draft.loadingCart = true;
        break;
      }
      case TYPE_CART_SUCCESS: {
        draft.cart = action.payload;
        break;
      }
      case TYPE_CART_FAILURE: {
        draft.loadingCart = false;
        break;
      }
      case TYPE_CART_LOADING: {
        draft.loadingCart = action.payload;
        break;
      }
      default:
    }
  });
}