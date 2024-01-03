import React from "react";

const EditProfile = (props) => {
  return (
    <form onSubmit={props.handleSubmit(props.postRequest)}>
      <div className="row mb-4">
        <input
          {...props.register("image")}
          type="file"
          className={`form-control`}
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              props.setImageFile(selectedFile);
            }
          }}
        />
      </div>
      <div className="row mb-4">
        <input
          {...props.register("email", {
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
          className={`form-control ${props.errors.email && "invalid"}`}
          placeholder="Enter Your New Email"
        />
      </div>

      <div className="row mb-4">
        <input
          {...props.register("name")}
          type="text"
          className={`form-control`}
          placeholder="Enter Your New Name"
        />
      </div>
      <div className="row mb-4">
        <input
          {...props.register("password", {
            minLength: {
              value: 5,
              message: "Password should be 5 characters long!",
            },
          })}
          type="password"
          className={`form-control ${props.errors.password && "invalid"}`}
          placeholder="Enter Your New Password"
        />
      </div>
      <div className="row mb-4">
        <input
          {...props.register("confirm_password", {
            minLength: {
              value: 5,
              message: "Password should be 5 characters long!",
            },
            validate: (value) => {
              const { password } = props.getValues();
              return (
                password === value ||
                "Password and Confirm password should match!"
              );
            },
          })}
          type="password"
          className={`form-control ${
            props.errors.confirm_password && "invalid"
          }`}
          placeholder="Confirm Password (again)"
        />
      </div>
      <div className="grid">
        <button
          type={props.isSubmitSuccessfull ? "button" : "submit"}
          className="btn w-25 fw-bold"
          disabled={props.isSubmitSuccessfull}
        >
          {props.isSubmitSuccessfull ? "Loading..." : "Edit"}
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
