import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actionCreators from "./store/actions/index";

const AllGetRequest = (props) => {
  useEffect(() => {
    // Dispatch the actions when the component mounts
    // props.getRequestToCategories(`categories/`);
    // props.getRequestToPrompts(`prompts/`);
  }, [props.getRequestToCategories, props.getRequestToPrompts]);

  return null; // or some JSX if needed
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRequestToCategories: (url) =>
      dispatch(actionCreators.getRequestToCategoriesDispatch(url)),
    getRequestToPrompts: (url) =>
      dispatch(actionCreators.getRequestToPromptsDispatch(url)),
  };
};

export default connect(null, mapDispatchToProps)(AllGetRequest);
