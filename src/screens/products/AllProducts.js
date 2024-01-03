import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { useMediaQuery } from "react-responsive";
import AppLayout from "../../components/applayout/AppLayout";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/index";
const itemsPerPage = 8;

const AllProducts = (props) => {
  const [products, setProducts] = useState([]);

  const [loadingStates, setLoadingStates] = useState({});

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchBy, setSearchBy] = useState("");

  const navigate = useNavigate()

  const [itemOffset, setItemOffset] = useState(0);
  const [endOffset, setEndOffset] = useState(itemsPerPage);
  const currentItems = filteredProducts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const storedAuthToken = localStorage.getItem("authToken");
  const isLogged = storedAuthToken ? jwtDecode(storedAuthToken) : null;

  const BASE_URL = process.env.REACT_APP_BASE_URL_API;

  const isSmallScreen = useMediaQuery({ query: "(max-width: 700px)" });

  const filterBy = (e) => {
    let value = e?.target?.value;
    setSearchBy(value);
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
        // props.getRequestToProducts(`${BASE_URL}/products`);

        setTimeout(() => {
          setLoadingStates((prevLoadingStates) => ({
            ...prevLoadingStates,
            [productId]: false,
          }));

          const updatedProducts = products.filter(
            (product) => product._id !== productId
          );

          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts);
          // If the current page becomes empty after deletion, adjust the page offset
          if (filteredProducts.length === 1 && itemOffset > 0) {
            setItemOffset(itemOffset - itemsPerPage);
            setEndOffset(itemOffset);
          }
        }, 1000);
        // If the product was deleted successfully, update the state
      }
    } catch (err) {
      setTimeout(() => {
        setLoadingStates((prevLoadingStates) => ({
          ...prevLoadingStates,
          [productId]: false,
        }));
      }, 1000);
      console.log(err);
    }
  };

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
    setEndOffset(Math.min(newOffset + itemsPerPage, filteredProducts.length));
  };

  useEffect(() => {
    // Update local state only if props.products has changed
    if (props.products !== products) {
      setProducts(props.products);
      setFilteredProducts(props.products);
      setItemOffset(0); // Reset page offset when products change
    }
  }, [props.products]);

  useEffect(() => {
    // Update filteredProducts whenever searchBy changes
    if (searchBy) {
      setFilteredProducts(
        products.filter(
          (prod) =>
            prod.title.toLowerCase().includes(searchBy.toLowerCase()) ||
            prod.description.toLowerCase().includes(searchBy.toLowerCase()) ||
            prod.price.toString().includes(searchBy)
        )
      );
    } else {
      setFilteredProducts([...products]);
    }
    setItemOffset(0); // Reset page offset when filter changes
  }, [searchBy, products]);
  return (
    <AppLayout>
      <div className="row products">
        <div className="products-header">
          <h1 className="heading">All Products</h1>
          <div className="heading-bottom"></div>
        </div>
        <div
          className="col-lg-12 col-md-12 col-sm-12 col-xl-12"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div
            className={`searching-container mb-4 ${
              isSmallScreen && "small-screen"
            }`}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Filter by......."
              onChange={filterBy}
            />
          </div>
        </div>
        {currentItems.length > 0 ? (
          currentItems.map((product) => (
            <div
              key={product.id}
              className={`col-lg-3 col-md-6 col-sm-12 col-xl-3 `}
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
                  <p className="product__description">{product.description}</p>
                </div>
                <div className="card__actions">
                  {isLogged?.is_staff ? (
                    <>
                      <Link
                        to={`/products/${product._id}`}
                        className="btn btn-view"
                      >
                        View
                      </Link>
                      <Link
                        to={`/add-product/${product._id}`}
                        className="btn btn-edit"
                      >
                        Edit
                      </Link>
                      <Link
                        className="btn btn-delete fw-bold"
                        onClick={() =>
                          !loadingStates[product._id] &&
                          deleteProduct(product._id)
                        }
                      >
                        {loadingStates[product._id] ? "..." : "Delete"}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to={`/products/${product._id}`} className="btn">
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
          ))
        ) : (
          <div className="row grid text-center">
            <h1 className="no-record">Products Not Found</h1>
          </div>
        )}
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="previous"
        renderOnZeroPageCount={null}
      />
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
export default connect(mapStateToProps, mapDispatchToProps)(AllProducts);
