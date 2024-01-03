import * as actionTypes from "../actions/actionTypes";

const initialState = {
  cartsData: [],
  showSuccessModal: false,
};

const executeGetRequestOfCarts = (state, action) => {
  return {
    ...state,
    cartsData: action.data,
    showSuccessModal: true,
  };
};

const cart = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_REQUEST_TO_CARTS:
      return executeGetRequestOfCarts(state, action);

    default:
      return state;
  }
};

export default cart;
