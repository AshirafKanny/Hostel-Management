import {
  NOTIFICATION_LIST_REQUEST,
  NOTIFICATION_LIST_SUCCESS,
  NOTIFICATION_LIST_FAIL,
  NOTIFICATION_CREATE_REQUEST,
  NOTIFICATION_CREATE_SUCCESS,
  NOTIFICATION_CREATE_FAIL,
} from "../actions/notificationActions";

export const notificationListReducer = (state = { notifications: [] }, action) => {
  switch (action.type) {
    case NOTIFICATION_LIST_REQUEST:
      return { loading: true, notifications: [] };
    case NOTIFICATION_LIST_SUCCESS:
      return { loading: false, notifications: action.payload };
    case NOTIFICATION_LIST_FAIL:
      return { loading: false, error: action.payload, notifications: [] };
    default:
      return state;
  }
};

export const notificationCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case NOTIFICATION_CREATE_REQUEST:
      return { loading: true };
    case NOTIFICATION_CREATE_SUCCESS:
      return { loading: false, success: true, notification: action.payload };
    case NOTIFICATION_CREATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
