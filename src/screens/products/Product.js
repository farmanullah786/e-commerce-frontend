import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { connect } from "react-redux";

import AppLayout from "../../components/applayout/AppLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as actionCreators from "../../store/actions/index";

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [status, setStatus] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const params = useParams();
  const navigate= useNavigate()

  const storedAuthToken = localStorage.getItem("authToken");
  const isLogged = storedAuthToken ? jwtDecode(storedAuthToken) : null;
  const BASE_URL = process.env.REACT_APP_BASE_URL_API;

  const addToCart = async (productId, price) => {
    if (!storedAuthToken) {
      navigate("/login");
      return;
    }
    if (!productId || !price || !isLogged?.userId || !storedAuthToken) {
      return;
    }

    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [productId]: true,
    }));

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("userId", isLogged?.userId);
    formData.append("price", price);

    let URL = `${BASE_URL}/add-to-cart`;
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
        setTimeout(() => {
          setLoadingStates((prevLoadingStates) => ({
            ...prevLoadingStates,
            [productId]: false,
          }));
          props.getRequestToCarts(`${BASE_URL}/carts`, storedAuthToken);
        }, 2000);
      } else {
        setTimeout(async () => {
          setLoadingStates((prevLoadingStates) => ({
            ...prevLoadingStates,
            [productId]: false,
          }));
        }, 1000);
      }
    } catch (err) {
      setTimeout(() => {
        setLoadingStates((prevLoadingStates) => ({
          ...prevLoadingStates,
          [productId]: false,
        }));
      }, 1000);
    }
  };
  useEffect(() => {
    if (props.products) {
      const selectedProduct = props.products.find(
        (prod) => prod._id.toString() === params.productId.toString()
      );
      setProduct(selectedProduct || {});
    }
  }, [params.productId, props.products]);

  return (
    <AppLayout>
      <div className="row products">
        <div className="col-lg-3 col-md-4 col-sm-12 col-xl-3">
          <div className="card overflow-hidden">
            <header className="card__header">
              <h1 className="product__title">{product?.title}</h1>
            </header>
            <div className="card__image">
              <img
                src={process.env.REACT_APP_BASE_URL + product?.image}
                alt={product?.title}
              />
            </div>
            <div className="card__content">
              <h2 className="product__price">${product?.price}</h2>
              <p className="product__description">{product?.description}</p>
            </div>
            <div className="card__actions">
              {status ? (
                <>
                  <Link
                    to={`/add-product/${product._id}`}
                    className="btn btn-edit"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/products/${product._id}`}
                    className="btn btn-delete"
                  >
                    Delete
                  </Link>
                </>
              ) : (
                <button
                  onClick={() =>
                    !loadingStates[product._id] &&
                    addToCart(product._id, product.price)
                  }
                  className="btn"
                >
                  {loadingStates[product._id] ? "Loading..." : "Add to cart"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const mapStateToProps = (state) => {
  return {
    products: state?.product?.productsData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRequestToCarts: (url, storedAuthToken) =>
      dispatch(actionCreators.getRequestToCartsDispatch(url, storedAuthToken)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Product);
