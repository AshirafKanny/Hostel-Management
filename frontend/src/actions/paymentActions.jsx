import axios from "axios";

export const PAYMENT_LIST_REQUEST = "PAYMENT_LIST_REQUEST";
export const PAYMENT_LIST_SUCCESS = "PAYMENT_LIST_SUCCESS";
export const PAYMENT_LIST_FAIL = "PAYMENT_LIST_FAIL";
export const PAYMENT_CREATE_REQUEST = "PAYMENT_CREATE_REQUEST";
export const PAYMENT_CREATE_SUCCESS = "PAYMENT_CREATE_SUCCESS";
export const PAYMENT_CREATE_FAIL = "PAYMENT_CREATE_FAIL";

export const listPayments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PAYMENT_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/payments", config);

    dispatch({ type: PAYMENT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PAYMENT_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createPayment = (payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: PAYMENT_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post("/api/payments", payload, config);

    dispatch({ type: PAYMENT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PAYMENT_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
