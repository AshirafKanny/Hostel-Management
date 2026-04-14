import {
  PAYMENT_LIST_REQUEST,
  PAYMENT_LIST_SUCCESS,
  PAYMENT_LIST_FAIL,
  PAYMENT_CREATE_REQUEST,
  PAYMENT_CREATE_SUCCESS,
  PAYMENT_CREATE_FAIL,
} from "../actions/paymentActions";

export const paymentListReducer = (state = { payments: [] }, action) => {
  switch (action.type) {
    case PAYMENT_LIST_REQUEST:
      return { loading: true, payments: [] };
    case PAYMENT_LIST_SUCCESS:
      return { loading: false, payments: action.payload };
    case PAYMENT_LIST_FAIL:
      return { loading: false, error: action.payload, payments: [] };
    default:
      return state;
  }
};

export const paymentCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PAYMENT_CREATE_REQUEST:
      return { loading: true };
    case PAYMENT_CREATE_SUCCESS:
      return { loading: false, success: true, payment: action.payload };
    case PAYMENT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
