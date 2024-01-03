import React, { useState } from "react";
import AppLayout from "../../components/applayout/AppLayout";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ForgotPasswordForm from "../../components/forms/ForgotPassword";

const ForgotPassword = () => {
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isServerError, setIsServerError] = useState("");

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const postRequest = async ({ email }) => {
    setIsSubmitSuccessfull(true);
    setIsSuccessMessage(false);
    setIsServerError("");
    if (!email) {
      setTimeout(() => {
        setIsSubmitSuccessfull(false);
        return;
      }, 1000);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL_API}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );
      if (response?.status === 201 || response?.status === 200) {
        const data = await response.json();
        setTimeout(() => {
          // setIsSubmitSuccessfull(false);
          // setIsSuccessMessage(true);
          // setIsServerError(data?.message);
          navigate(`/reset-password/${data?.token}`)
          reset();
        }, 2000);
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
      }, 1000);
    }
  };

  return (
    <AppLayout>
      <div className="row grid">
        <div className="col-lg-5 col-md-5 col-sm-12 col-xl-5">
          <div className="card overflow-hidden">
            <div className="card-body">
              <ForgotPasswordForm
                handleSubmit={handleSubmit}
                postRequest={postRequest}
                register={register}
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

export default ForgotPassword;
