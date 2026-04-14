import axios from "axios";

export const BOOKING_LIST_REQUEST = "BOOKING_LIST_REQUEST";
export const BOOKING_LIST_SUCCESS = "BOOKING_LIST_SUCCESS";
export const BOOKING_LIST_FAIL = "BOOKING_LIST_FAIL";
export const BOOKING_CREATE_REQUEST = "BOOKING_CREATE_REQUEST";
export const BOOKING_CREATE_SUCCESS = "BOOKING_CREATE_SUCCESS";
export const BOOKING_CREATE_FAIL = "BOOKING_CREATE_FAIL";

export const listBookings = () => async (dispatch, getState) => {
  try {
    dispatch({ type: BOOKING_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/bookings", config);

    dispatch({ type: BOOKING_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BOOKING_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createBooking = (payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: BOOKING_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post("/api/bookings", payload, config);

    dispatch({ type: BOOKING_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: BOOKING_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
