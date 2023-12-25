import * as actionTypes from "../actions/actionTypes";

const initialState = {
  category_list: [],
  showSuccessModal: false,
};

const executeGetRequestOfCategories = (state, action) => {
  return {
    ...state,
    category_list: action.data,
    showSuccessModal: true,
  };
};

const executeDeleteRequestOfCategory = (state) => {
  return {
    ...state,
    showSuccessModal: true,
  };
};

const categories = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_REQUEST_TO_CATEGORIES:
      return executeGetRequestOfCategories(state, action);
    case actionTypes.DELETE_REQUEST_TO_CATEGORIES:
      return executeDeleteRequestOfCategory(state);

    default:
      return state;
  }
};

export default categories;
