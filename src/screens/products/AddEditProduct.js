import React, { useEffect, useState } from "react";
import AppLayout from "../../components/applayout/AppLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import AddEditProductForm from "../../components/forms/AddEditProduct";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/index";

const AddEditProduct = (props) => {
  const [formText, setFormText] = useState("Add Product");
  const [product, setProduct] = useState();

  const [imageFile, setImageFile] = useState(null);
  const [imageEditFile, setImageEditFile] = useState(null);
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isServerError, setIsServerError] = useState("");

  const params = useParams();
  const storedAuthToken = localStorage.getItem("authToken");
  const isLogged = storedAuthToken ? jwtDecode(storedAuthToken) : null;
  const BASE_URL = process.env.REACT_APP_BASE_URL_API;

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,

    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      price: "",
      description: "",
      image: "",
    },
  });

  const hasErrors =
    errors.title ||
    errors.price ||
    errors.image ||
    errors.description ||
    isServerError;

  const postRequest = async ({ title, price, image, description }) => {
    setIsServerError("");
    setIsSubmitSuccessfull(true);
    setIsSuccessMessage(false);
    if (!title || !price || !description || !storedAuthToken) {
      setIsSubmitSuccessfull(true);
      return;
    }

    if (!params?.productId && !imageFile) {
      setIsSubmitSuccessfull(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    if ((!params?.productId && imageFile) || (params?.productId && imageFile)) {
      formData.append("image", imageFile);
    }
    formData.append("description", description);

    let URL = `${BASE_URL}/add-product`;
    let method = "POST";

    if (params?.productId) {
      URL = `${BASE_URL}/edit-product/${params?.productId}`;
      method = "PUT";
    }

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
          setImageFile(null);
          setIsServerError(data?.message);
          setIsSuccessMessage(true);
          setIsSubmitSuccessfull(false);
          props.getRequestToProducts(`${BASE_URL}/products`);

          reset();
        }, 2000);
      } else {
        const data = await response.json();
        setTimeout(async () => {
          setIsServerError(data?.message);
          setIsSubmitSuccessfull(false);
        }, 1000);
      }
    } catch (err) {
      setTimeout(() => {
        setIsSubmitSuccessfull(false);
        setIsServerError(err);
      }, 1000);
    }
  };

  useEffect(() => {
    const selectedProduct = props?.products?.find(
      (prod) => prod?._id == params?.productId
    );

    if (params?.productId) {
      setFormText("Edit Product");
      setProduct(selectedProduct);

      if (selectedProduct) {
        setImageEditFile(
          process.env.REACT_APP_BASE_URL + selectedProduct?.image
        );
        reset({
          title: selectedProduct?.title,
          price: selectedProduct?.price,
          description: selectedProduct?.description,
        });
      }
    } else {
      reset({
        title: "",
        price: "",
        description: "",
        image: "",
      });
      setFormText("Add Product");
    }
  }, [params?.productId, reset, props?.products]);

  return (
    <AppLayout>
      <div className="row grid">
        <div className="col-lg-5 col-md-5 col-sm-12 col-xl-5">
          <div className="card overflow-hidden">
            <div className="card-header grid">
              <p className="fw-bold mb-0" style={{ color: "#007ea7" }}>
                {formText}
              </p>
            </div>
            <div className="card-body">
              {hasErrors && (
                <div
                  className={`row mb-4 form-errors ${
                    isSuccessMessage && "success"
                  }`}
                >
                  {errors?.title &&
                  errors?.price &&
                  errors?.image &&
                  errors?.description
                    ? "All fields are required!"
                    : isServerError
                    ? isServerError
                    : errors?.title
                    ? errors?.title?.message
                    : errors?.price
                    ? errors?.price?.message
                    : errors?.image
                    ? errors?.image?.message
                    : errors?.description
                    ? errors?.description?.message
                    : "All fields are required!"}
                </div>
              )}

              <AddEditProductForm
                handleSubmit={handleSubmit}
                postRequest={postRequest}
                register={register}
                errors={errors}
                formText={formText}
                product={product}
                productId={params?.productId}
                setImageFile={setImageFile}
                imageFile={imageFile}
                isSubmitSuccessfull={isSubmitSuccessfull}
                setImageEditFile={setImageEditFile}
                imageEditFile={imageEditFile}
              />
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
    getRequestToProducts: (url) =>
      dispatch(actionCreators.getRequestToProductsDispatch(url)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEditProduct);
