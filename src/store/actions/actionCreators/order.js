import * as actionTypes from "../actionTypes";

const getRequestToOrders = (data) => ({
  type: actionTypes.GET_REQUEST_TO_ORDERS,
  data: data,
});

export const getRequestToOrdersDispatch = (url, token) => async (dispatch) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response?.status === 200) {
      const data = await response.json();
      dispatch(getRequestToOrders(data?.orders));
    }
  } catch (error) {
    console.error(error);
  }
};
