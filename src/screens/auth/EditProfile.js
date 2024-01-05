import React, { useEffect, useState } from "react";
import AppLayout from "../../components/applayout/AppLayout";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import EditProfileForm from "../../components/forms/EditProfile";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actions/index";

const EditProfile = (props) => {
  const [userData, setUserData] = useState(props?.user);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  const [isServerError, setIsServerError] = useState("");

  const navigate = useNavigate();
  const storedAuthToken = localStorage.getItem("authToken");
  const isLogged = storedAuthToken ? jwtDecode(storedAuthToken) : null;

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const baseUrl = process.env.REACT_APP_BASE_URL_API;

  const hasError =
    errors?.email ||
    errors?.password ||
    errors?.confirm_password ||
    isServerError;
  const postRequest = async ({
    email,
    name,
    image,
    password,
    confirm_password,
  }) => {
    setIsServerError("");
    setIsSubmitSuccessfull(true);
    setIsSuccessMessage(false);
    if (!hasError && !storedAuthToken) {
      setIsSubmitSuccessfull(false);
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (imageFile !== null) {
      formData.append("image", imageFile);
    }
    if (password) {
      formData.append("password", password);
    }
    if (confirm_password) {
      formData.append("confirm_password", confirm_password);
    }

    try {
      const response = await fetch(`${baseUrl}/update-user`, {
        method: "PUT",
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
          props.getRequestToLoginUser(`${baseUrl}/login-user`, storedAuthToken);
          reset({ password: "", confirm_password: "", image: "" });
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
    if (props?.user !== userData) {
      reset({
        name: props?.user?.name,
        email: props?.user?.email,
      });
    }
  }, [props?.user]);

  return (
    <AppLayout>
      <div className="row grid">
        <div className="col-lg-5 col-md-5 col-sm-12 col-xl-5">
          <div className="card overflow-hidden">
            <div
              className="card-header grid fw-bold"
              style={{ color: "#007ea7" }}
            >
              Edit Your Profile
            </div>
            <div className="card-body">
              <div className="row mb-4 grid" style={{ marginTop: "-10px" }}>
                <img
                  style={{
                    width: "100px",
                    height: "80px",
                    borderRadius: "100%",
                    marginLeft: "-10px",
                  }}
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : props?.user?.image
                      ? process.env.REACT_APP_BASE_URL + props?.user?.image
                      : process.env.PUBLIC_URL + "/assets/images/profile-1.jpeg"
                  }
                  alt={"No Image"}
                />
              </div>
              {hasError && (
                <div
                  className={`row mb-4 form-errors ${
                    isSuccessMessage && "success"
                  }`}
                >
                  {isServerError
                    ? isServerError
                    : errors?.email
                    ? errors?.email?.message
                    : errors?.password
                    ? errors?.password?.message
                    : errors?.confirm_password
                    ? errors?.confirm_password?.message
                    : ""}
                </div>
              )}
              <EditProfileForm
                handleSubmit={handleSubmit}
                postRequest={postRequest}
                register={register}
                getValues={getValues}
                errors={errors}
                setImageFile={setImageFile}
                isSubmitSuccessfull={isSubmitSuccessfull}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRequestToLoginUser: (url, storedAuthToken) =>
      dispatch(actionCreators.getRequestToUserDispatch(url, storedAuthToken)),
  };
};
const mapStateToProps = (state) => {
  return {
    user: state.user.userData,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
