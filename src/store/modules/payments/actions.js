import {
  TYPE_CART_REQUEST,
  TYPE_CART_SUCCESS,
  TYPE_CART_FAILURE,
  TYPE_CART_LOADING
} from '../../../constants/types-reducers';

export function cartRequest() {
  return {
    type: TYPE_CART_REQUEST
  };
}

export function cartSuccess(data) {
  return {
    type: TYPE_CART_SUCCESS,
    payload: data
  };
}

export function cartFailure(error) {
  return {
    type: TYPE_CART_FAILURE,
    payload: { error }
  };
}

export function setCartLoading(boolean) {
  return {
    type: TYPE_CART_LOADING,
    payload: boolean
  };
}