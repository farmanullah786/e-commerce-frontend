import * as actionTypes from "../actionTypes";

const getRequestToCarts = (data) => ({
  type: actionTypes.GET_REQUEST_TO_CARTS,
  data: data,
});

export const getRequestToCartsDispatch = (url, token) => async (dispatch) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response?.status === 200) {
      const data = await response.json();
      dispatch(getRequestToCarts(data?.carts));
    }
  } catch (error) {
    console.error(error);
  }
};
