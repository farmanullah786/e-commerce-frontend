import React, { useState } from "react";
import AppLayout from "../../components/applayout/AppLayout";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import SignUpForm from "../../components/forms/Signup";

const Register = (props) => {
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isServerError, setIsServerError] = useState("");

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const postRequest = async ({ name, email, password, confirm_password }) => {
    setIsSubmitSuccessfull(true);
    setIsSuccessMessage(false);
    console.log(
      "name, email, password, confirm_password",
      name,
      email,
      password,
      confirm_password
    );
    if (!name || !email || !password || !confirm_password) {
      setIsSubmitSuccessfull(false);
      return;
    }
    console.log("After", name, email, password, confirm_password);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL_API}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            confirm_password,
          }),
        }
      );
      let data;
      if (response?.status === 201 || response?.status === 200) {
        data = await response.json();
        setTimeout(() => {
          setIsSubmitSuccessfull(false);
          setIsSuccessMessage(true);
          setIsServerError(data?.message);
          reset();
        }, 2000);
      } else {
        setIsServerError(data?.message);
        setIsSubmitSuccessfull(false);
      }
    } catch (err) {
      setIsSubmitSuccessfull(false);
      setIsServerError(err);
    }
  };

  return (
    <AppLayout>
      <div className="row grid">
        <div className="col-lg-5 col-md-5 col-sm-12 col-xl-5">
          <div className="card overflow-hidden">
            <div className="card-header grid">
              <p className="text-dark mb-0 fw-bold">
                If you have already an account?{" "}
                <Link to="/login" style={{ color: "#007ea7" }}>
                  Login
                </Link>
              </p>
            </div>
            <div className="card-body">
              {(isServerError ||
                errors?.name ||
                errors?.email ||
                errors?.password ||
                errors?.confirm_password) && (
                <div
                  className={`row mb-4 form-errors ${
                    isSuccessMessage && "success"
                  }`}
                >
                  {errors?.name &&
                  errors?.email &&
                  errors?.password &&
                  errors?.confirm_password
                    ? "All fields are required!"
                    : isServerError
                    ? isServerError
                    : errors?.name
                    ? errors?.name?.message
                    : errors?.email
                    ? errors?.email?.message
                    : errors?.password
                    ? errors?.password?.message
                    : errors?.confirm_password
                    ? errors?.confirm_password?.message
                    : "All fields are required!"}
                </div>
              )}
              <SignUpForm
                handleSubmit={handleSubmit}
                postRequest={postRequest}
                register={register}
                getValues={getValues}
                errors={errors}
                isSubmitSuccessfull={isSubmitSuccessfull}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Register;
