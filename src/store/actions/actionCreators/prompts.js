import * as actionTypes from "../actionTypes";
import { badResponse, deleteRequest, getRequest, responseOk } from "../../../helpers/methods";

// Action creator for successful feedback retrieval
const getRequestToPrompts = (data) => ({
  type: actionTypes.GET_REQUEST_TO_PROMPTS,
  data: data,
});

// Dispatch function for retrieving feedback
export const getRequestToPromptsDispatch = (url) => async (dispatch) => {
  try {
    const response = await getRequest(url);
    if (response?.data?.status === 200) {
      dispatch(getRequestToPrompts(response?.data?.data));
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteRequestToPrompt = () => ({
  type: actionTypes.DELETE_REQUEST_TO_PROMPT,
});

// Dispatch function for retrieving feedback
export const deleteRequestToPromptDispatch = (url) => async (dispatch) => {
  try {
    const response = await deleteRequest(url);
    if (response?.status === 200) {
        dispatch(deleteRequestToPrompt());
        dispatch(getRequestToPromptsDispatch("prompts/"));
        responseOk(response?.data?.message);
    }
  } catch (error) {
    badResponse(error?.response?.data?.detail);
  }
};
