import React from "react";
import AppLayout from "../../components/applayout/AppLayout";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import SignUpForm from "../../components/forms/Signup";

const Register = (props) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const postRequest = ({ name, email, password, confirm_password }) => {
    if (!name || !email || !password || !confirm_password) {
      return;
    }
    console.log(name, email, password, confirm_password);
    navigate("/");
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
              {(errors?.name ||
                errors?.email ||
                errors?.password ||
                errors?.confirm_password) && (
                <div className="row mb-4 form-errors">
                  {errors?.name &&
                  errors?.email &&
                  errors?.password &&
                  errors?.confirm_password
                    ? "All fields are required!"
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
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Register;
