import React from "react";
import AppLayout from "../components/applayout/AppLayout";
import { connect } from "react-redux";

const LandingPage = (props) => {

  return (
    <AppLayout>
      {/* <div className="app-content"> */}
      <div className="row">
        <div className="col-lg-3 col-md-3 col-sm-12 col-xl-3">
          <div className="card overflow-hidden">
            <div className="card-body">
              <div className="d-flex">
                <div className="mt-2">
                  <h6 className="">Total Customers</h6>
                  <h2 className="mb-2 number-font">44,278</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12 col-xl-3">
          <div className="card overflow-hidden">
            <div className="card-body">
              <div className="d-flex">
                <div className="mt-2">
                  <h6 className="">Total Orders</h6>
                  <h2 className="mb-2 number-font">44,278</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12 col-xl-3">
          <div className="card overflow-hidden">
            <div className="card-body">
              <div className="d-flex">
                <div className="mt-2">
                  <h6 className="">Total Products</h6>
                  <h2 className="mb-2 number-font">44,278</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12 col-xl-3">
          <div className="card overflow-hidden">
            <div className="card-body">
              <div className="d-flex">
                <div className="mt-2">
                  <h6 className="">Total Notifications</h6>
                  <h2 className="mb-2 number-font">44,278</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-12 col-xl-3">
          <div className="card overflow-hidden">
            <div className="card-body">
              <div className="d-flex">
                <div className="mt-2">
                  <h6 className="">Total Users</h6>
                  <h2 className="mb-2 number-font">44,278</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* </div> */}
    </AppLayout>
  );
};


const mapStateToProps = (state) => {
  return {
    products: state?.product?.productsData,
    carts: state?.cart?.cartsData,
    orders: state?.cart?.ordersData,
  };
};
export default connect(mapStateToProps)(LandingPage);
