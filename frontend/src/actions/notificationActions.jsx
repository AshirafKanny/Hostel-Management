import axios from "axios";

export const NOTIFICATION_LIST_REQUEST = "NOTIFICATION_LIST_REQUEST";
export const NOTIFICATION_LIST_SUCCESS = "NOTIFICATION_LIST_SUCCESS";
export const NOTIFICATION_LIST_FAIL = "NOTIFICATION_LIST_FAIL";
export const NOTIFICATION_CREATE_REQUEST = "NOTIFICATION_CREATE_REQUEST";
export const NOTIFICATION_CREATE_SUCCESS = "NOTIFICATION_CREATE_SUCCESS";
export const NOTIFICATION_CREATE_FAIL = "NOTIFICATION_CREATE_FAIL";

export const listNotifications = () => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTIFICATION_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/notifications", config);

    dispatch({ type: NOTIFICATION_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createNotification = (payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTIFICATION_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post("/api/notifications", payload, config);

    dispatch({ type: NOTIFICATION_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
