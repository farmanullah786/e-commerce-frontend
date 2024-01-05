import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { useMediaQuery } from "react-responsive";
import AppLayout from "../../components/applayout/AppLayout";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/index";

const Products = (props) => {
  const [startIndex, setStartIndex] = useState(0);
  const [products, setProducts] = useState(props?.products);
  const [loadingStates, setLoadingStates] = useState({});
  const [displayedProducts, setDisplayedProducts] = useState([]);

  const navigate = useNavigate();

  const storedAuthToken = localStorage.getItem("authToken");
  const isLogged = storedAuthToken ? jwtDecode(storedAuthToken) : null;
  const BASE_URL = process.env.REACT_APP_BASE_URL_API;

  const isMediumScreen = useMediaQuery({
    query: "(max-width: 991px)",
  });
  const isSmallScreen = useMediaQuery({
    query: "(max-width: 700px)",
  });

  const handleNext = () => {
    const remainingItems = products.length - (startIndex + 4);
    if (remainingItems > 0) {
      setStartIndex((prevIndex) => prevIndex + 1);
    } else if (remainingItems <= 0 && startIndex < products.length - 4) {
      setStartIndex((prevIndex) => prevIndex + remainingItems);
    }
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => {
      if (prevIndex === 0) {
        return 0;
      } else {
        return prevIndex - 1;
      }
    });
  };
  const addToCart = async (productId, price) => {
    if (!storedAuthToken) {
      navigate("/login");
      return;
    }
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [productId]: true,
    }));
    if (!productId || !price || !isLogged?.userId || !storedAuthToken) {
      setTimeout(() => {
        setLoadingStates((prevLoadingStates) => ({
          ...prevLoadingStates,
          [productId]: false,
        }));
      }, 1000);
      return;
    }

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
  const deleteProduct = async (productId) => {
    const URL = `${BASE_URL}/delete-product/${productId}`;
    const method = "DELETE";
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [productId]: true,
    }));
    try {
      const response = await fetch(URL, {
        method: method,
        headers: {
          Authorization: `Bearer ${storedAuthToken}`,
        },
      });
      if (response?.status === 201 || response?.status === 200) {
        setTimeout(() => {
          props.getRequestToProducts(`${BASE_URL}/products`);

          const remainingItems = products.length - (startIndex + 4);
          setStartIndex((prevIndex) => {
            if (
              (prevIndex <= 0 || prevIndex + 1 >= 2) &&
              remainingItems !== 0
            ) {
              return prevIndex;
            }
            if (prevIndex <= 1) {
              return startIndex + 4;
            } else {
              return prevIndex - 1;
            }
          });
          // Remove the deleted product from the local state

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
      }, 2000);
      console.log(err);
    }
  };
  const updateDisplayedProducts = () => {
    setDisplayedProducts(
      products?.length > 4
        ? products?.slice(startIndex, startIndex + 4)
        : products
    );
  };
  useEffect(() => {
    // Update local state only if props.products has changed
    if (props.products !== products) {
      setProducts(props.products);
    }
    // Update displayedProducts when startIndex or products change
    updateDisplayedProducts();
  }, [props.products, startIndex, products]);
  return (
    <AppLayout>
      {displayedProducts?.length > 0 ? (
        <div className="row products">
          <div className="products-header">
            <h1 className="heading">Our Products</h1>
            <div className="heading-bottom"></div>
          </div>

          {displayedProducts.map((product) => {
            return (
              <div
                key={product._id}
                className={`col-lg-3 col-md-6 col-sm-6 col-xl-3 ${
                  isSmallScreen ? "d-none" : ""
                }`}
              >
                <div className="card overflow-hidden">
                  <header className="card__header">
                    <h1 className="product__title">{product.title}</h1>
                  </header>
                  <div className="card__image">
                    <img
                      src={process.env.REACT_APP_BASE_URL + product.image}
                      alt={product.title}
                    />
                  </div>
                  <div className="card__content">
                    <h2 className="product__price">${product.price}</h2>
                    <p className="product__description">
                      {product.description}
                    </p>
                  </div>
                  <div className="card__actions">
                    {isLogged?.is_staff ? (
                      <>
                        <Link
                          to={`/products/${product._id}`}
                          className="btn btn-view fw-bold"
                        >
                          View
                        </Link>
                        <Link
                          to={`/add-product/${product._id}`}
                          className="btn btn-edit fw-bold"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-delete fw-bold"
                          onClick={() =>
                            !loadingStates[product._id] &&
                            deleteProduct(product._id)
                          }
                        >
                          {loadingStates[product._id] ? "..." : "Delete"}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to={`/products/${product._id}`}
                          className="btn fw-bold"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() =>
                            !loadingStates[product._id] &&
                            addToCart(product._id, product.price)
                          }
                          className="btn"
                        >
                          {loadingStates[product._id]
                            ? "Loading..."
                            : "Add to cart"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isSmallScreen && (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xl-12">
              <div className="card overflow-hidden">
                <header className="card__header">
                  <h1 className="product__title">
                    {displayedProducts[0].title}
                  </h1>
                </header>
                <div className="card__image">
                  <img
                    src={
                      process.env.REACT_APP_BASE_URL +
                      displayedProducts[0].image
                    }
                    alt={displayedProducts[0].title}
                  />
                </div>
                <div className="card__content">
                  <h2 className="product__price">
                    ${displayedProducts[0].price}
                  </h2>
                  <p className="product__description">
                    {displayedProducts[0].description}
                  </p>
                </div>
                <div className="card__actions">
                  {isLogged?.is_staff ? (
                    <>
                      <Link
                        to={`/products/${displayedProducts[0]._id}`}
                        className="btn btn-view fw-bold"
                      >
                        View
                      </Link>
                      <Link
                        to={`/add-product/${displayedProducts[0]._id}`}
                        className="btn btn-edit fw-bold"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-delete fw-bold"
                        onClick={() =>
                          !loadingStates[displayedProducts[0]._id] &&
                          deleteProduct(displayedProducts[0]._id)
                        }
                      >
                        {loadingStates[displayedProducts[0]._id]
                          ? "..."
                          : "Delete"}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/products/${displayedProducts[0]._id}`}
                        className="btn fw-bold"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() =>
                          !loadingStates[displayedProducts[0]._id] &&
                          addToCart(
                            displayedProducts[0]._id,
                            displayedProducts[0].price
                          )
                        }
                        className="btn"
                      >
                        {loadingStates[displayedProducts[0]._id]
                          ? "Loading..."
                          : "Add to cart"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid">
            {products?.length > 4 && (
              <button
                onClick={handlePrev}
                className={`btn fw-bold ${
                  isSmallScreen || isMediumScreen ? "d-none" : ""
                }`}
              >
                Previous
              </button>
            )}

            <Link to={`/product-lists`} className="btn fw-bold">
              See All Products
            </Link>
            {products?.length > 4 && (
              <button
                onClick={handleNext}
                className={`btn fw-bold ${
                  isSmallScreen || isMediumScreen ? "d-none" : ""
                }`}
              >
                Next
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="row grid text-center">
          <h1 className="no-record">Products Not Found</h1>
        </div>
      )}
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
    getRequestToProducts: (url) =>
      dispatch(actionCreators.getRequestToProductsDispatch(url)),
    getRequestToCarts: (url, storedAuthToken) =>
      dispatch(actionCreators.getRequestToCartsDispatch(url, storedAuthToken)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Products);
