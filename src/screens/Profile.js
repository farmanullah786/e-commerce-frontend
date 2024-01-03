import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AppLayout from "../components/applayout/AppLayout";
import { connect } from "react-redux";

const Profile = (props) => {
  const storedAuthToken = localStorage.getItem("authToken");
  const isLogged = storedAuthToken ? jwtDecode(storedAuthToken) : null;

  return (
    <AppLayout>
      <div className="row products fw-bold">
        <div className="col-lg-3 col-md-4 col-sm-12 col-xl-3">
          <div className="card overflow-hidden">
            <header className="card__header">
              <h1 className="product__title">{props?.user.name}</h1>
            </header>
            <div className="card__image">
              <img
                src={process.env.REACT_APP_BASE_URL + props?.user?.image}
                alt={props?.user?.name}
              />
            </div>
            <div className="card__content">
              <h6 className="product__description">{props?.user?.email}</h6>
            </div>
            <div className="card__actions" style={{ marginTop: "-20px" }}>
              <Link to={`/edit-profile`} className="btn btn-edit">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.userData,
  };
};
export default connect(mapStateToProps)(Profile);
