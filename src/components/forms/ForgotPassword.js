import React from "react";

const ForgotPassword = (props) => {
  return (
    <form onSubmit={props?.handleSubmit(props?.postRequest)}>
      <div className="row mb-2 fw-bold" style={{ color: "#007ea7" }}>
        Please Enter Your Email
      </div>
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
      {(props?.isServerError || props?.errors?.email) && (
        <div
          className={`row mb-4 invalid p-1 ${
            props?.isSuccessMessage && !props?.errors?.email && "success"
          }`}
        >
          {props?.errors?.email
            ? props?.errors?.email?.message
            : props?.isServerError
            ? props?.isServerError
            : ""}
        </div>
      )}
      <div className="grid">
        <button
          type={props?.isSubmitSuccessfull ? "button" : "submit"}
          className="btn  fw-bold"
          disabled={props?.isSubmitSuccessfull ? true : false}
        >
          {props?.isSubmitSuccessfull ? "Loading..." : "Verify"}
        </button>
      </div>
    </form>
  );
};

export default ForgotPassword;
