import {
  BOOKING_LIST_REQUEST,
  BOOKING_LIST_SUCCESS,
  BOOKING_LIST_FAIL,
  BOOKING_CREATE_REQUEST,
  BOOKING_CREATE_SUCCESS,
  BOOKING_CREATE_FAIL,
} from "../actions/bookingActions";

export const bookingListReducer = (state = { bookings: [] }, action) => {
  switch (action.type) {
    case BOOKING_LIST_REQUEST:
      return { loading: true, bookings: [] };
    case BOOKING_LIST_SUCCESS:
      return { loading: false, bookings: action.payload };
    case BOOKING_LIST_FAIL:
      return { loading: false, error: action.payload, bookings: [] };
    default:
      return state;
  }
};

export const bookingCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case BOOKING_CREATE_REQUEST:
      return { loading: true };
    case BOOKING_CREATE_SUCCESS:
      return { loading: false, success: true, booking: action.payload };
    case BOOKING_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
