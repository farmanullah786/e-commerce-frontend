import React from "react";

const AddEditProduct = (props) => {
  return (
    <form onSubmit={props?.handleSubmit(props?.postRequest)}>
      <div className="row mb-4">
        <input
          {...props?.register("title", {
            required: {
              value: true,
              message: "Title field is required!",
            },
            minLength: {
              value: 5,
              message: "Title should be 5 characters long!",
            },
          })}
          type="text"
          className={`form-control ${props?.errors?.title && "invalid"}`}
          placeholder="Enter Product Title"
        />
      </div>
      <div className="row mb-4">
        <input
          type="number"
          step="0.01" // Allow decimal numbers
          {...props?.register("price", {
            required: {
              value: true,
              message: "Price field is required!",
            },
            pattern: {
              value: /^\d+(\.\d{1,2})?$/, // Allow up to two decimal places
              message:
                "Please enter a valid positive numeric value for the price.",
            },
          })}
          className={`form-control ${props?.errors?.price && "invalid"}`}
          placeholder="Enter Product Price"
        />
      </div>
      <div className="row mb-4">
        <input
          {...props?.register("image", {
            required: {
              value: !props?.productId ? true : false,
              message: "Image field is required!",
            },
          })}
          type="file"
          className={`form-control ${props?.errors?.image && "invalid"}`}
          placeholder="Upload Product Image"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              props.setImageFile(selectedFile);
              props.setImageEditFile("");
            } else {
              props.setImageEditFile(props?.imageFile);
            }
          }}
        />
      </div>
      {(props?.imageFile || props?.imageEditFile) && (
        <div className="row mb-4">
          <img
            style={{
              width: "100px",
              height: "80px",
              borderRadius: "100%",
              marginLeft: "-10px",
            }}
            src={
              props?.imageFile
                ? URL.createObjectURL(props?.imageFile)
                : props?.imageEditFile
                ? props?.imageEditFile
                : ""
            }
            alt={"No Image"}
          />
        </div>
      )}

      <div className="row mb-4">
        <textarea
          rows={6}
          {...props?.register("description", {
            required: {
              value: true,
              message: "Description field is required!",
            },
            minLength: {
              value: 5,
              message: "Description should be 5 characters long!",
            },
          })}
          type="text"
          className={`form-control ${props?.errors?.description && "invalid"}`}
          placeholder="Enter Product Description"
        />
      </div>
      <div className="grid">
        <button
          type={props?.isSubmitSuccessfull ? "button" : "submit"}
          className="btn fw-bold"
          disabled={props?.isSubmitSuccessfull ? true : false}
        >
          {props?.isSubmitSuccessfull ? "Loading..." : props?.formText}
        </button>
      </div>
    </form>
  );
};

export default AddEditProduct;
