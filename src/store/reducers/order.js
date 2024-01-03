import * as actionTypes from "../actions/actionTypes";

const initialState = {
  ordersData: [],
  showSuccessModal: false,
};

const executeGetRequestOfOrders = (state, action) => {
  return {
    ...state,
    ordersData: action.data,
    showSuccessModal: true,
  };
};

const order = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_REQUEST_TO_ORDERS:
      return executeGetRequestOfOrders(state, action);

    default:
      return state;
  }
};

export default order;
