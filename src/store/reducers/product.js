import * as actionTypes from "../actions/actionTypes";

const initialState = {
  productsData: [],
  showSuccessModal: false,
};

const executeGetRequestOfProducts = (state, action) => {
  return {
    ...state,
    productsData: action.data,
    showSuccessModal: true,
  };
};


const product = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_REQUEST_TO_PRODUCTS:
      return executeGetRequestOfProducts(state, action);

    default:
      return state;
  }
};

export default product;
