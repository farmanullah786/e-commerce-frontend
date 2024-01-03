import * as actionTypes from "../actions/actionTypes";

const initialState = {
  userData: [],
  showSuccessModal: false,
};

const executeGetRequestOfLoginUser = (state, action) => {
  return {
    ...state,
    userData: action.data,
    showSuccessModal: true,
  };
};


const user = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_REQUEST_TO_USER:
      return executeGetRequestOfLoginUser(state, action);

    default:
      return state;
  }
};

export default user;
