import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import cartData from "../screens/cart/cartData.json";
import { connect } from "react-redux";
import * as actionCreators from "../store/actions/index";

const Header = (props) => {
  const [notifications, setNotifications] = useState(props?.user?.notification);
  let path = window.location.pathname;

  path = path.split("/")[1] ? path.split("/")[1] : "/";

  const navigate = useNavigate();
  const storedAuthToken = localStorage.getItem("authToken");
  const isLogged = storedAuthToken ? jwtDecode(storedAuthToken) : null;
  const removeToken = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleDeleteNotification = async (notificationId) => {
    const URL = `${process.env.REACT_APP_BASE_URL_API}/delete-notification/${notificationId}`;
    const method = "DELETE";
    try {
      const response = await fetch(URL, {
        method: method,
        headers: {
          Authorization: `Bearer ${storedAuthToken}`,
        },
      });
      if (response?.status === 201 || response?.status === 200) {
        setTimeout(() => {
          props.getRequestToNotifications(
            `${process.env.REACT_APP_BASE_URL_API}/notifications`,
            storedAuthToken
          );
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (notifications !== props?.notification) {
      setNotifications(props?.notification);
    }
  }, [props?.notification]);
  return (
    <>
      <div className=" app-header header sticky bg-cyan">
        <div
          className="d-flex order-lg-2 ms-auto header-right-icons"
          style={{ width: "100%" }}
        >
          <button
            className="navbar-toggler navresponsive-toggler d-lg-none ms-auto"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent-4"
            aria-controls="navbarSupportedContent-4"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ width: "100%", textAlign: "end", paddingInline: "10px" }}
          >
            <span className="navbar-toggler-icon fe fe-more-vertical text-white"></span>
          </button>

          <div className="navbar navbar-collapse responsive-navbar p-0">
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent-4"
            >
              <div className="d-flex " id="header-right">
                <div className="left-menu">
                  <ul className="side-menu">
                    <li className="slide">
                      <Link
                        className="side-menu__item"
                        data-bs-toggle="slide"
                        to="/"
                      >
                        <span
                          className={`side-menu__label ${
                            path === "/" ? " active" : ""
                          }`}
                        >
                          Home
                        </span>
                      </Link>
                    </li>
                    <li className="slide">
                      <Link
                        className="side-menu__item"
                        data-bs-toggle="slide"
                        to="/products"
                      >
                        <span
                          className={`side-menu__label ${
                            path === "products" || path === "product-lists"
                              ? " active"
                              : ""
                          }`}
                        >
                          Products
                        </span>
                      </Link>
                    </li>
                    {isLogged && (
                      <>
                        {!isLogged?.is_staff && (
                          <li className="slide">
                            <Link
                              className="side-menu__item"
                              data-bs-toggle="slide"
                              to="/cart"
                            >
                              <span
                                className={`side-menu__label ${
                                  path === "cart" ? " active" : ""
                                }`}
                              >
                                Cart
                              </span>
                              {props?.carts.length > 0 && (
                                <span className="badge cart-badge">
                                  {props?.carts.length}
                                </span>
                              )}
                            </Link>
                          </li>
                        )}
                        <li className="slide">
                          <Link
                            className="side-menu__item"
                            data-bs-toggle="slide"
                            to="/orders"
                          >
                            <span
                              className={`side-menu__label ${
                                path === "orders" ? " active" : ""
                              }`}
                            >
                              Orders
                            </span>
                          </Link>
                        </li>
                        {isLogged?.is_staff && (
                          <li className="slide">
                            <Link
                              className="side-menu__item"
                              data-bs-toggle="slide"
                              to="/add-product"
                            >
                              <span
                                className={`side-menu__label ${
                                  path === "add-product" ? " active" : ""
                                }`}
                              >
                                Add Product
                              </span>
                            </Link>
                          </li>
                        )}
                      </>
                    )}
                  </ul>{" "}
                </div>
                <div className="right-menu">
                  <ul className="side-menu">
                    {!isLogged ? (
                      <>
                        <li className="slide auth">
                          <Link
                            className="side-menu__item"
                            data-bs-toggle="slide"
                            to="/login"
                          >
                            <span
                              className={`side-menu__label ${
                                path === "login" ||
                                path === "forgot-password" ||
                                path === "reset-password"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Login
                            </span>
                          </Link>
                        </li>
                        <li className="slide auth">
                          <Link
                            className="side-menu__item"
                            data-bs-toggle="slide"
                            to="/signup"
                          >
                            <span
                              className={`side-menu__label ${
                                path === "signup" ? " active" : ""
                              }`}
                            >
                              Signup
                            </span>
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        {!isLogged?.is_staff && (
                          <div className="dropdown  d-flex notifications slide">
                            <Link
                              className="nav-link icon side-menu__item notification-bell"
                              data-bs-toggle="dropdown"
                            >
                              <i className="fe fe-bell"></i>
                              {isLogged && notifications?.length > 0 && (
                                <span className="pulse"></span>
                              )}
                            </Link>

                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notification-dropdown">
                              <div className="drop-heading border-bottom">
                                <div className="d-flex">
                                  <h6 className="mt-1 mb-0 fs-16 fw-semibold text-dark">
                                    Notifications
                                  </h6>
                                </div>
                              </div>
                              <div className="notifications-menu">
                                {notifications?.length > 0 &&
                                  notifications?.map((notification) => (
                                    <div
                                      className="dropdown-item d-flex p-4"
                                      key={notification._id}
                                    >
                                      <div className="me-2 notifyimg  bg-primary brround box-shadow-primary">
                                        <i className={`fe fe-mail`}></i>
                                      </div>
                                      <div className="mt-1 wd-80p">
                                        <h5 className="notification-label mb-1">
                                          <Link
                                            to={`/products/${notification._id}`}
                                            className="mx-0 px-0"
                                          >
                                            {notification.title}
                                          </Link>
                                        </h5>
                                        <span className="notification-subtext">
                                          {notification.description}{" "}
                                        </span>
                                      </div>
                                      <div className="ms-auto text-end d-flex">
                                        <a
                                          href="javascript:void(0)"
                                          className="fs-16  p-0 "
                                          onClick={() =>
                                            handleDeleteNotification(
                                              notification._id
                                            )
                                          }
                                        >
                                          <i
                                            className="fe fe-trash-2 border brround d-block p-2 notification-trash"
                                            style={{ color: "#007ea7" }}
                                          ></i>
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                              <div className="dropdown-divider m-0"></div>
                              <Link
                                to=""
                                className="dropdown-item text-center p-3 text-muted"
                              >
                                View all Notification
                              </Link>
                            </div>
                          </div>
                        )}
                        <div
                          className="dropdown d-flex profile-1"
                          // style={{ paddingTop: "10px" }}
                        >
                          <Link
                            to="javascript:void(0)"
                            data-bs-toggle="dropdown"
                            className="nav-link leading-none d-flex"
                          >
                            <img
                              src={
                                isLogged && props?.user?.image
                                  ? process.env.REACT_APP_BASE_URL +
                                    props?.user?.image
                                  : process.env.PUBLIC_URL +
                                    "/assets/images/profile-1.jpeg"
                              }
                              alt="profile-user"
                              className="avatar  profile-user brround cover-image"
                            />
                          </Link>
                          <div className="__dropdown dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                            <div className="drop-heading">
                              <div className="text-center">
                                <h5 className="text-dark mb-0 fs-14 fw-semibold">
                                  {props?.user?.name}
                                </h5>
                                <small className="text-muted">
                                  {isLogged?.is_staff ? "Super Admin" : "Admin"}
                                </small>
                              </div>
                            </div>
                            <div className="dropdown-divider m-0"></div>
                            <Link className="dropdown-item" to="/profile">
                              <i className="dropdown-icon fe fe-user"></i>{" "}
                              Profile
                            </Link>
                            <Link className="dropdown-item" to="/edit-profile">
                              <i className="dropdown-icon fe fe-edit"></i> Edit
                              Profile
                            </Link>
                            <Link
                              className="dropdown-item"
                              to=""
                              onClick={removeToken}
                            >
                              <i className="dropdown-icon fa fa-sign-out"></i>{" "}
                              Sign out
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </ul>

                  {/* <!-- NOTIFICATIONS --> */}

                  {/* <!-- SIDE-MENU --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.userData,
    carts: state?.cart?.cartsData,
    notification: state?.notification?.notificationsData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRequestToNotifications: (url, storedAuthToken) =>
      dispatch(
        actionCreators.getRequestToNotificationsDispatch(url, storedAuthToken)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
