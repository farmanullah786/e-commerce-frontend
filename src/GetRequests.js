import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import { connect } from "react-redux";
import * as actionCreators from "./store/actions/index";
import { useNavigate } from "react-router-dom";

const AllGetRequest = (props) => {
  const storedAuthToken = localStorage.getItem("authToken");
  const isLogged = storedAuthToken ? jwtDecode(storedAuthToken) : null;
  const BASE_URL = process.env.REACT_APP_BASE_URL_API;
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogged && isLogged.exp * 1000 < Date.now()) {
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  }, [isLogged]);
  useEffect(() => {
    // Dispatch the actions when the component mounts
    props.getRequestToLoginUser(
      `${BASE_URL}/login-user/${isLogged?.userId}`,
      storedAuthToken
    );
    props.getRequestToCarts(
      `${BASE_URL}/carts`,
      storedAuthToken
    );
    props.getRequestToOders(
      `${BASE_URL}/orders`,
      storedAuthToken
    );
    props.getRequestToProducts(`${BASE_URL}/products`);
  }, [props.getRequestToCategories, props.getRequestToPrompts]);

  return null; // or some JSX if needed
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRequestToLoginUser: (url, storedAuthToken) =>
      dispatch(actionCreators.getRequestToUserDispatch(url, storedAuthToken)),
    getRequestToProducts: (url) =>
      dispatch(actionCreators.getRequestToProductsDispatch(url)),
    getRequestToCarts: (url,storedAuthToken) =>
      dispatch(actionCreators.getRequestToCartsDispatch(url,storedAuthToken)),
    getRequestToOders: (url,storedAuthToken) =>
      dispatch(actionCreators.getRequestToOrdersDispatch(url,storedAuthToken)),
  };
};

export default connect(null, mapDispatchToProps)(AllGetRequest);
