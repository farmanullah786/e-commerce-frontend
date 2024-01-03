import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { useMediaQuery } from "react-responsive";
import AppLayout from "../../components/applayout/AppLayout";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";

const OrderItems = (props) => {
  const [orderData, setOrder] = useState(props?.orders);
  const params = useParams();

  const storedAuthToken = localStorage.getItem("authToken");
  const isLogged = storedAuthToken ? jwtDecode(storedAuthToken) : null;

  useEffect(() => {
    if (props?.orders !== orderData) {
      const order = props?.orders?.find(
        (order) => order?._id?.toString() === params?.orderId?.toString()
      );
      setOrder(order);
    }
  }, [params?.orderId, props?.orders]);
  console.log(orderData);
  return (
    <AppLayout>
      {orderData?.cartitems?.length > 0 ? (
        <div className="row orders">
          {orderData?.cartitems?.map((cartItem) => (
            <div
              key={cartItem?.productId?._id}
              className={`col-lg-3 col-md-6 col-sm-12 col-xl-3`}
            >
              <div className="card overflow-hidden">
                <header className="card__header">
                  <h1 className="order__title">{cartItem?.productId?.title}</h1>
                </header>
                <div className="card__image">
                  <img
                    src={process.env.REACT_APP_BASE_URL + cartItem?.productId?.image}
                    alt={cartItem?.productId?.title}
                  />
                </div>
                <div className="card__content">
                  {/* <h2 className="order__price">${cartItem?.productId?.price}</h2> */}
                  <h5
                    className="order__description"
                    style={{
                      color: "#f7b731",
                    }}
                  >
                    Quantity:
                    <span className="badge cart-badge mt-2">
                    {cartItem?.qty}
                    </span>
                    
                  </h5>
                  <p className="order__description">
                    {cartItem?.productId?.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="row grid text-center">
          <h1 className="no-record">You have no product in order</h1>
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

// const mapDispatchToProps = (dispatch) => {
//   return {
//     getRequestToOders: (url, storedAuthToken) =>
//       dispatch(actionCreators.getRequestToOrdersDispatch(url, storedAuthToken)),
//   };
// };
export default connect(mapStateToProps)(OrderItems);
