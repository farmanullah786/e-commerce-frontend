import React, { useState } from "react";
import AppLayout from "../../components/applayout/AppLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import ResetPasswordForm from "../../components/forms/ResetPassword";
const ResetPassword = () => {
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isServerError, setIsServerError] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const postRequest = async ({ password, confirm_password }) => {
    setIsSubmitSuccessfull(true);
    setIsSuccessMessage(false);
    setIsServerError("");
    if (!password || !confirm_password || params?.userId) {
      setTimeout(() => {
        setIsSubmitSuccessfull(false);
        return;
      }, 1000);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL_API}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: params?.userId,
            password: password,
            confirm_password: confirm_password,
          }),
        }
      );
      if (response?.status === 201 || response?.status === 200) {
        const data = await response.json();
        console.log(data);
        setTimeout(() => {
          setIsSubmitSuccessfull(false);
          setIsSuccessMessage(true);
          setIsServerError(data?.message);
          // navigate(`/reset-password/${data?.token}`);
          reset();
        }, 1000);
      } else {
        const data = await response.json();

        setTimeout(() => {
          setIsSubmitSuccessfull(false);
          setIsSuccessMessage(false);
          setIsServerError(data?.message);
        }, 2000);
      }
    } catch (err) {
      setTimeout(() => {
        setIsSubmitSuccessfull(false);
        setIsSuccessMessage(false);
        setIsServerError(err);
      }, 2000);
    }
  };

  return (
    <AppLayout>
      <div className="row grid">
        <div className="col-lg-5 col-md-5 col-sm-12 col-xl-5">
          <div className="card overflow-hidden">
            <div
              className="card-header grid fw-bold"
              style={{ color: "#007ea7" }}
            >
              <p className="text-dark mb-0 fw-bold">
                Reset Your Password?{" "}
                <Link to="/login" style={{ color: "#007ea7" }}>
                  Login
                </Link>
              </p>
            </div>
            <div className="card-body">
              {(isServerError ||
                errors?.password ||
                errors?.confirm_password) && (
                <div
                  className={`row mb-4 form-errors ${
                    isSuccessMessage && "success"
                  }`}
                >
                  {isServerError
                    ? isServerError
                    : errors?.password
                    ? errors?.password?.message
                    : errors?.confirm_password
                    ? errors?.confirm_password?.message
                    : "All fields are required!"}
                </div>
              )}
              <ResetPasswordForm
                handleSubmit={handleSubmit}
                postRequest={postRequest}
                register={register}
                getValues={getValues}
                errors={errors}
                isSubmitSuccessfull={isSubmitSuccessfull}
                isServerError={isServerError}
                isSuccessMessage={isSuccessMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResetPassword;
