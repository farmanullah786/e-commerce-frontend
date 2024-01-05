import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import AppLayout from "../../components/applayout/AppLayout";
import collect from "collect.js";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/index";

const Cart = (props) => {
  const [cartItems, setCartItems] = useState(props?.carts);
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState(false);

  const storedAuthToken = localStorage.getItem("authToken");
  const isLogged = storedAuthToken ? jwtDecode(storedAuthToken) : null;

  const BASE_URL = process.env.REACT_APP_BASE_URL_API;

  // Calculate the total price using collect.js
  const totalPrice = collect(cartItems).sum("price");
  const totalQuantity = collect(cartItems).sum("qty");
  const productIds = collect(cartItems)
    .map((item) => ({
      productId: item?.productId?._id, // Access property directly
      qty: item.qty,
    }))
    .all();

  const deleteCartItem = async (cartItemId) => {
    if (!cartItemId || !isLogged?.userId || !storedAuthToken) {
      
      return;
    }

    const formData = new FormData();
    formData.append("_id", cartItemId);
    formData.append("userId", isLogged?.userId);

    let URL = `${BASE_URL}/delete-cart`;
    let method = "DELETE";

    try {
      const response = await fetch(URL, {
        method: method,
        headers: {
          Authorization: `Bearer ${storedAuthToken}`,
        },
        body: formData,
      });

      console.log(response)
      if (response?.status === 201 || response?.status === 200) {
        const data = await response.json();
        props.getRequestToCarts(`${BASE_URL}/carts`, storedAuthToken);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const PostOrder = async () => {
    setIsSubmitSuccessfull(true);
    if (
      !isLogged?.userId ||
      !totalPrice ||
      !totalQuantity ||
      !storedAuthToken ||
      !productIds
    ) {
      setTimeout(() => {
        setIsSubmitSuccessfull(false);
        return;
      }, 1000);
    }

    const formData = new FormData();
    formData.append("cartItems", JSON.stringify(productIds));
    formData.append("userId", isLogged?.userId);
    formData.append("price", totalPrice);
    formData.append("qty", totalQuantity);

    let URL = `${BASE_URL}/order`;
    let method = "POST";

    try {
      const response = await fetch(URL, {
        method: method,
        headers: {
          Authorization: `Bearer ${storedAuthToken}`,
        },
        body: formData,
      });
      if (response?.status === 201 || response?.status === 200) {
        const data = await response.json();
        console.log("Data", data);
        setTimeout(() => {
          setIsSubmitSuccessfull(false);
          props.getRequestToCarts(`${BASE_URL}/carts`, storedAuthToken);
        }, 2000);
      } else {
        setTimeout(() => {
          setIsSubmitSuccessfull(false);
        }, 1000);
      }
    } catch (err) {
      setTimeout(() => {
        setIsSubmitSuccessfull(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (props?.carts !== cartItems) {
      setCartItems(props?.carts);
    }
    // setCartItems(cartItems.filter((cart) => cart?.user?.id === isLogged?.id));
  }, [isLogged, props?.carts]);
  return (
    <AppLayout>
      {cartItems?.length > 0 ? (
        <div className="row carts">
          <div className="col-lg-8 col-md-8 col-sm-12 col-xl-8">
            <div className="card overflow-hidden">
              <div className="card-header cart-header">
                <div>
                  <button
                    className="mb-0 text-white btn"
                    disabled={isSubmitSuccessfull ? true : false}
                    onClick={!isSubmitSuccessfull && PostOrder}
                  >
                    {isSubmitSuccessfull ? "Loading..." : "Order Now"}
                  </button>
                </div>
              </div>
              {cartItems?.map((cart) => (
                <div className="" key={cart?._id}>
                  <div className="d-flex p-4">
                    <img
                      className="avatar avatar-xl br-5 me-3 align-self-center cover-image"
                      src={
                        process.env.REACT_APP_BASE_URL + cart?.productId?.image
                      }
                      alt={cart?.productId?.title}
                    />
                    <div className="wd-50p cart-content">
                      <h5 className="">{cart?.productId?.title}</h5>
                      <p className="fs-13 text-muted mb-0">
                        Quantity: {cart?.qty < 10 ? "0" + cart?.qty : cart?.qty}
                      </p>
                    </div>
                    <div className="ms-auto text-end d-flex fs-16 grid">
                      <span className="fs-16 text-dark d-none d-sm-block px-4 py-1">
                        ${cart?.price?.toFixed(2)}
                      </span>
                      <a
                        href="javascript:void(0)"
                        className="fs-16 p-0 cart-trash"
                        onClick={() => deleteCartItem(cart?._id)}
                      >
                        <i className="fe fe-trash-2 border text-danger brround d-block p-2"></i>
                      </a>
                    </div>
                  </div>
                  <div className="dropdown-divider m-0"></div>
                </div>
              ))}
              <div className="dropdown-divider m-0"></div>

              <div className="no-record text-end px-5 py-2">
                <h5>Total ${totalPrice.toFixed(2)}</h5>{" "}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row grid text-center">
          <h1 className="no-record">Your Cart Is Empty</h1>
        </div>
      )}
    </AppLayout>
  );
};

const mapStateToProps = (state) => {
  return {
    carts: state?.cart?.cartsData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRequestToCarts: (url, storedAuthToken) =>
      dispatch(actionCreators.getRequestToCartsDispatch(url, storedAuthToken)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
