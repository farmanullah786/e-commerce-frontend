import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { Link } from "react-router-dom";
import AppLayout from "../../components/applayout/AppLayout";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/index";

const Orders = (props) => {
  const [ordersData, setOrders] = useState(props?.orders);
  const [loadingStates, setLoadingStates] = useState({});

  const storedAuthToken = localStorage.getItem("authToken");
  const isLogged = storedAuthToken ? jwtDecode(storedAuthToken) : null;

  const BASE_URL = process.env.REACT_APP_BASE_URL_API;
  const deleteOrder = async (orderId) => {
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [orderId]: true,
    }));
    if (!orderId || !isLogged?.userId || !storedAuthToken) {
      setTimeout(() => {
        setLoadingStates((prevLoadingStates) => ({
          ...prevLoadingStates,
          [orderId]: false,
        }));
        return;
      }, 1000);
    }

    let URL = `${BASE_URL}/delete-order/${orderId}`;
    let method = "DELETE";
    try {
      const response = await fetch(URL, {
        method: method,
        headers: {
          Authorization: `Bearer ${storedAuthToken}`,
        },
      });
      if (response?.status === 201 || response?.status === 200) {
        setTimeout(() => {
          props.getRequestToOders(
            `${BASE_URL}/orders`,
            storedAuthToken
          );
          setLoadingStates((prevLoadingStates) => ({
            ...prevLoadingStates,
            [orderId]: false,
          }));
        }, 1000);
      }
    } catch (err) {
      setTimeout(() => {
        setLoadingStates((prevLoadingStates) => ({
          ...prevLoadingStates,
          [orderId]: false,
        }));
      }, 1000);
      console.log(err);
    }
  };

  useEffect(() => {
    if (props?.orders !== ordersData) {
      setOrders(props?.orders);
    }
  }, [props?.orders]);
  return (
    <AppLayout>
      {ordersData?.length > 0 ? (
        <div className="row orders">
          <div
            className={`${
              isLogged?.is_staff
                ? "col-lg-4 col-md-6 col-sm-12 col-xl-4"
                : "col-lg-6 col-md-6 col-sm-12 col-xl-6"
            }`}
          >
            <div className="card overflow-hidden">
              <div className="card-header grid">
                <p className="fw-bold mb-0" style={{ color: "#007ea7" }}>
                  {isLogged?.is_staff ? "Customer Orders" : "Your Orders"}
                </p>
              </div>

              <ul className="list-group">
                {ordersData?.map((order) => (
                  <>
                    <li className="list-group-item justify-content-between align-items-center">
                      <Link
                        to={`/orders/${order._id}`}
                        style={{ color: "#007ea7" }}
                      >
                        {order?._id.toString().slice(0, 25)}

                        {!isLogged?.is_staff && (
                          <span className="badge rounded-pill mb-1 order-price">
                            ${order?.price}
                          </span>
                        )}
                      </Link>
                      <div className="badgetext">
                        {!isLogged?.is_staff && (
                          <Link
                            className="btn btn-delete fw-bold"
                            disabled={loadingStates[order._id] ? true : false}
                            onClick={() =>
                              !loadingStates[order._id] &&
                              deleteOrder(order._id)
                            }
                          >
                            {loadingStates[order._id] ? "Loading..." : "Delete"}
                          </Link>
                        )}
                      </div>
                    </li>
                  </>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="row grid text-center">
          <h1 className="no-record">You have no orders</h1>
        </div>
      )}
    </AppLayout>
  );
};
const mapStateToProps = (state) => {
  return {
    orders: state?.order?.ordersData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRequestToOders: (url, storedAuthToken) =>
      dispatch(actionCreators.getRequestToOrdersDispatch(url, storedAuthToken)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Orders);
