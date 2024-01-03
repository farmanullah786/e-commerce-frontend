import * as actionTypes from "../actionTypes";

const getRequestToUser = (data) => ({
  type: actionTypes.GET_REQUEST_TO_USER,
  data: data,
});

export const getRequestToUserDispatch = (url,token) => async (dispatch) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    if (response?.status === 200) {
      const data = await response.json();
      dispatch(getRequestToUser(data?.user));
    }
  } catch (error) {
    console.error(error);
  }
};
