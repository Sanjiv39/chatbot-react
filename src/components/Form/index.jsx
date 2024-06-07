import React, { useContext } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { IoCloseOutline } from "react-icons/io5";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { App } from "../Container";

const schema = new Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Please enter valid email"),
  phone_no: Yup.string()
    .required("Phone number is required")
    .test("isvalid", "Please enter a valid phone no", (val) => {
      const valid = isValidPhoneNumber(val);
      console.log(valid);
      return valid;
    }),
});

export default function ChatbotForm() {
  const context = useContext(App);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    reset,
    // getValues
  } = useForm({
    resolver: yupResolver(schema || schemas.formType || dummySchema),
  });

  const formAction = (data) => {
    console.log(data);
  };

  return (
    <>
      <h3 className="form-title">
        Fill up the form
        <button
          className="close-form-btn"
          onClick={() => {
            context.setForm(false);
          }}
        >
          <IoCloseOutline />
        </button>
      </h3>
      <form className="chatbot-user-form" onSubmit={handleSubmit(formAction)}>
        <div className="input-wrapper">
          <label className="form-label">Enter email</label>
          <input
            {...register("email")}
            type="email"
            className="form-input"
            required
            name="email"
            placeholder="user@gmail.com"
          />
          {<p className="form-err">{errors["email"]?.message || ""}</p>}
        </div>
        <div className="input-wrapper">
          <label className="form-label">Enter phone number</label>
          <Controller
            control={control}
            name={"phone_no"}
            rules={{ required: true }}
            // placeholder={"+1772XXXXX78"}
            render={({ field: { ref, ...field } }) => (
              <PhoneInput
                {...field}
                inputProps={ref}
                className="form-input"
                containerStyle={{ padding: "8px" }}
                country={"us"}
                // name="phone_no"
                placeholder="+1772XXXXX78"
                onChange={(val) => {
                  console.log(val);
                  field.onChange(`+${val}`);
                }}
              />
            )}
          />
          <p className="form-err">{errors["phone_no"]?.message || ""}</p>
        </div>
        <input type="submit" value="Submit" className="submit-btn" />
      </form>
    </>
  );
}
