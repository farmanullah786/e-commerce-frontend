import * as actionTypes from "../actions/actionTypes";

const initialState = {
  notificationsData: [],
  showSuccessModal: false,
};

const executeGetRequestOfNotifications = (state, action) => {
  return {
    ...state,
    notificationsData: action.data,
    showSuccessModal: true,
  };
};

const notification = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_REQUEST_TO_NOTIFICATIONS:
      return executeGetRequestOfNotifications(state, action);

    default:
      return state;
  }
};

export default notification;
