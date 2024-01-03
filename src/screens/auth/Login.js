import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../../components/applayout/AppLayout";
import LoginForm from "../../components/forms/Login";
import usersData from "./users.json";

const Login = (props) => {
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

  const postRequest = async ({ email, password }) => {
    setIsServerError("");
    setIsSubmitSuccessfull(true);
    setIsSuccessMessage(false);

    if (!email || !password) {
      setIsSubmitSuccessfull(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL_API}/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      if (response?.status === 201 || response?.status === 200) {
        const data = await response.json();
        setTimeout(() => {
          localStorage.setItem("authToken", data?.access_token);
          setIsSubmitSuccessfull(false);
          setIsSuccessMessage(true);

          reset();
          navigate("/");
        }, 2000);
      } else {
        const data = await response.json();
        setTimeout(() => {
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

  return (
    <AppLayout>
      <div className="row grid">
        <div className="col-lg-5 col-md-5 col-sm-12 col-xl-5">
          <div className="card overflow-hidden">
            <div className="card-header grid">
              <p className="text-dark mb-0 fw-bold">
                If you are not a member?{" "}
                <Link
                  to="/signup"
                  className="mb-0"
                  style={{ color: "#007ea7" }}
                >
                  Signup
                </Link>
              </p>
            </div>
            <div className="card-body">
              {(errors?.email || errors?.password || isServerError) && (
                <div
                  className={`row mb-4 form-errors ${
                    isSuccessMessage && "success"
                  }`}
                >
                  {isServerError
                    ? isServerError
                    : errors?.email && errors?.password
                    ? "All fields are required!"
                    : errors?.email
                    ? errors?.email?.message
                    : errors?.password
                    ? errors?.password?.message
                    : ""}
                </div>
              )}
              <LoginForm
                handleSubmit={handleSubmit}
                postRequest={postRequest}
                register={register}
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

export default Login;
