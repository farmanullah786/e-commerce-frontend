import * as actionTypes from "../actionTypes";

const getRequestToNotifications = (data) => ({
  type: actionTypes.GET_REQUEST_TO_NOTIFICATIONS,
  data: data,
});

export const getRequestToNotificationsDispatch = (url, token) => async (dispatch) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response?.status === 200) {
      const data = await response.json();
      dispatch(getRequestToNotifications(data?.notifications));
    }
  } catch (error) {
    console.error(error);
  }
};
