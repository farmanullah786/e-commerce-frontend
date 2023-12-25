import * as actionTypes from "../actionTypes";
import {
  badResponse,
  deleteRequest,
  getRequest,
  responseOk,
} from "../../../helpers/methods";

// Action creator for successful feedback retrieval
const getRequestToCategories = (data) => ({
  type: actionTypes.GET_REQUEST_TO_CATEGORIES,
  data: data,
});

// Dispatch function for retrieving feedback
export const getRequestToCategoriesDispatch = (url) => async (dispatch) => {
  try {
    const response = await getRequest(url);
    if (response?.data?.status === 200) {
      dispatch(getRequestToCategories(response?.data?.data));
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteRequestToCategories = () => ({
  type: actionTypes.DELETE_REQUEST_TO_CATEGORIES,
});

// Dispatch function for retrieving feedback
export const deleteRequestToCategoriesDispatch = (url) => async (dispatch) => {
  try {
    const response = await deleteRequest(url);
    if (response?.status === 200) {
        dispatch(deleteRequestToCategories());
        dispatch(getRequestToCategoriesDispatch("categories/"));
        responseOk(response?.data?.message);
    }
  } catch (error) {
    badResponse(error?.response?.data?.detail);
    console.error(error);
  }
};
