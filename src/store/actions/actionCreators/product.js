import * as actionTypes from "../actionTypes";

const getRequestToProducts = (data) => ({
  type: actionTypes.GET_REQUEST_TO_PRODUCTS,
  data: data,
});

export const getRequestToProductsDispatch = (url) => async (dispatch) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": `application/json`,
      },
    });
    if (response?.status === 200) {
      const data = await response.json();
      dispatch(getRequestToProducts(data?.products));
    }
  } catch (error) {
    console.error(error);
  }
};
