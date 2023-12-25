import React from 'react'

const Signup = (props) => {
  return (
    <form onSubmit={props?.handleSubmit(props?.postRequest)}>
    <div className="row mb-4">
      <input
        {...props?.register("name", {
          required: {
            value: true,
            message: "Name field is required!",
          },
        })}
        type="text"
        className={`form-control ${props?.errors?.name && "invalid"}`}
        placeholder="Enter Name"
      />
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
    <div className="row mb-4">
      <input
        {...props?.register("confirm_password", {
          required: {
            value: true,
            message: "Confirm password field is required!",
          },
          minLength: {
            value: 5,
            message: "Password should be 5 characters long!",
          },
          validate: (value) => {
            const { password } = props?.getValues();
            return (
              password === value ||
              "Password and Confirm password should match!"
            );
          },
        })}
        type="password"
        className={`form-control ${
          props?.errors?.confirm_password && "invalid"
        }`}
        placeholder="Confirm Password"
      />
    </div>
    <div className="grid">
      <button type="submit" className="btn w-25 fw-bold">
        Register
      </button>
    </div>
  </form>  )
}

export default Signup