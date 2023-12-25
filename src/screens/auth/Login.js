import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../../components/applayout/AppLayout";
import LoginForm from "../../components/forms/Login";
import usersData from "./users.json";

const Login = (props) => {
  const navigate = useNavigate();
  const [inValidCredential, setInValidCredential] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const postRequest = ({ email, password }) => {
    if (!email && !password) {
      return;
    }
    console.log(email,password)

    const user = usersData.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      try {
        localStorage.setItem("authToken", JSON.stringify(user));
        setInValidCredential("");
        navigate("/");
      } catch (error) {
        console.error("Error setting item in local storage:", error);
        // Handle the error, such as showing a user-friendly message
      }
    } else {
      // Handle invalid credentials, show error message, etc.
      setInValidCredential("Your email or password is incorrect.");
      console.log("Invalid credentials");
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
              {(errors?.email || errors?.password || inValidCredential) && (
                <div className="row mb-4 form-errors">
                  {inValidCredential
                    ? inValidCredential
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
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Login;
