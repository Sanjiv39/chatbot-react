import React, { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// import { isValidPhoneNumber } from "react-phone-number-input";
import { IoCloseOutline } from "react-icons/io5";
// import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ingestChatHistory } from "../apis/apis";
import { TailSpin } from "react-loader-spinner";
import { App } from "../Container";
import secureLocalStorage from "react-secure-storage";

const schema = new Yup.object({
  name: Yup.string()
    .required("Name is required")
    .trim("Name is required")
    .min(4, "Minimum 4 characters required")
    .test("isvalid", "Only enter alphabets", (val) => {
      return !val.trim().match(/[0-9]/g);
    }),
  email: Yup.string()
    .required("Email is required")
    .trim("Email is required")
    .email("Please enter valid email"),
  // company: Yup.string()
  //   .required("Company name is required")
  //   .trim("Company name is required")
  //   .min(4, "Please enter min 4 characters"),
  // phone_no: Yup.string()
  //   .required("Phone number is required")
  //   .test("isvalid", "Please enter a valid phone no", (val) => {
  //     const valid = isValidPhoneNumber(val);
  //     console.log(valid);
  //     return valid;
  //   }),
});

export default function ChatbotForm({ handleFormSubmissionMessage }) {
  const context = useContext(App);
  const lastRef = useRef();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
    // control,
    // reset,
    // getValues
  } = useForm({
    resolver: yupResolver(schema),
  });

  const formAction = async (data) => {
    try {
      setLoading(true);
      const payload = {
        name: data.name?.trim() || null,
        email: data.email?.trim() || null,
      };
      // console.log(payload, context);
      if (
        payload.name &&
        payload.email &&
        context.uuid &&
        context.botData.websiteUrl
      ) {
        let res = await ingestChatHistory(
          [],
          context.uuid,
          context.botData.websiteUrl,
          payload
        );
        // console.log(res.data);
        if (res.data && res.data.success) {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          context.setUserData(payload);
          handleFormSubmissionMessage();
          secureLocalStorage.setItem("__uD__", payload);
          return;
        }
        throw new Error("Error in ingest response");
      }
      throw new Error("Error sending form");
    } catch (err) {
      // console.log(err);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    lastRef.current?.scrollIntoView();
  }, [lastRef]);

  return (
    <>
      <form className="chatbot-user-form" onSubmit={handleSubmit(formAction)}>
        {!loading && (
          <>
            <button
              className="close-form-btn"
              onClick={() => {
                context.setForm(false);
                context.setFormClosed(true);
              }}
            >
              <IoCloseOutline />
            </button>
            <div className="input-wrapper">
              <label className="form-label">Name</label>
              <input
                {...register("name")}
                type="text"
                className="form-input"
                required
                name="name"
                placeholder="Shane"
              />
              <p className="form-err">{errors["name"]?.message || ""}</p>
            </div>
            <div className="input-wrapper">
              <label className="form-label">Email</label>
              <input
                {...register("email")}
                type="email"
                className="form-input"
                required
                name="email"
                placeholder="user@gmail.com"
              />
              <p className="form-err">{errors["email"]?.message || ""}</p>
            </div>
            {/* <div className="input-wrapper">
          <label className="form-label">Company : </label>
          <input
            {...register("company")}
            type="text"
            className="form-input"
            required
            name="company"
            placeholder="Humalogy"
          />
        </div> */}
            {/* <p className="form-err">{errors["company"]?.message || ""}</p> */}
            {/* <div className="input-wrapper">
          <label className="form-label">Enter phone number</label>
          <Controller
            control={control}
            name={"phone_no"}
            rules={{ required: true }}
            placeholder={"+1772XXXXX78"}
            defaultValue={""}
            render={({ field: { ref, ...field } }) => (
              <PhoneInput
                {...field}
                inputProps={ref}
                className="form-input"
                containerStyle={{ padding: "8px" }}
                country={"us"}
                enableSearch={true}
                inputStyle={{ textAlign: "left" }}
                // name="phone_no"
                placeholder={field.placeholder}
                onChange={(val) => {
                  console.log(val);
                  field.onChange(val.trim() ? `+${val}` : "");
                }}
              />
            )}
          />
          <p className="form-err">{errors["phone_no"]?.message || ""}</p>
        </div> */}
            <input
              ref={lastRef}
              type="submit"
              value="Submit"
              className="submit-btn"
            />
          </>
        )}
        {loading && (
          <TailSpin
            color="#587dff"
            height={"80px"}
            width={"80px"}
            wrapperClass="form-loader"
          />
        )}
      </form>
    </>
  );
}
