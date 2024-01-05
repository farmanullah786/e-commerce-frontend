import React from "react";
import { Link } from "react-router-dom";
const Login = (props) => {
  return (
    <form onSubmit={props?.handleSubmit(props?.postRequest)}>
      <div className="row mb-4">
        <input
          {...props?.register("email", {
            required: {
              value: true,
              message: "Email field is required!",
            },
            pattern: {
              value:
                /^(?!.*\.\.)[a-zA-Z][^\s@]*@(?!.*\.\.)[^\s@]+(\.[^\s@]+)+[^\W\d_][^\W\s\d]*$/,
              message: "Email should be valid!",
            },
          })}
          type="email"
          className={`form-control ${props?.errors?.email && "invalid"}`}
          placeholder="Enter Email"
        />
      </div>
      <div className="row mb-4">
        <input
          {...props?.register("password", {
            required: {
              value: true,
              message: "Password field is required!",
            },
            minLength: {
              value: 5,
              message: "Password should be 5 characters long!",
            },
          })}
          type="password"
          className={`form-control ${props?.errors?.password && "invalid"}`}
          placeholder="Password"
        />
      </div>
      <div className="row mb-4 text-end">
        <p>
          <Link
            to="/forgot-password"
            style={{ color: "#007ea7" }}
            className="fw-bold"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
      <div className="grid">
        <button
          type={props?.isSubmitSuccessfull ? "button" : "submit"}
          className="btn fw-bold"
          disabled={props?.isSubmitSuccessfull ? true : false}
        >
          {props?.isSubmitSuccessfull ? "Loading..." : "Login"}
        </button>
      </div>
    </form>
  );
};

export default Login;
