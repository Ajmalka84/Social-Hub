import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../../Components/Input/Input";
import axios from "axios";
import Otp from "../../Components/Otp/Otp";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const schema = yup.object({
  mobile: yup
    .string()
    .required("Mobile Number required")
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Mobile Number is not Valid"
    ),
});
function Mobile() {
  const [form, setForm] = useState(null);
  const [verified, setVerified] = useState(false);
  const [Error, setError] = useState("");
  const navigate = useNavigate();
  const redirect = () => {
    navigate("/login");
  };
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const formSubmit = async (data) => {
    await axios
      .post("http://localhost:8000/auth/sendOtp", { ...data })
      .then((result) => {
        setForm(data);
        setVerified(true);
      })
      .catch((result) => {
        setError(result.message);
      });
  };
  return (
    <>
      {verified ? (
        <Otp user={form} />
      ) : (
        <form onSubmit={handleSubmit(formSubmit)} className="loginBox">
          <Input
            id="mobile"
            placeholder="Mobile"
            type="mobile"
            register={{ ...register("mobile") }}
            errorMessage={errors.mobile?.message}
          />
          <button className="loginButton" type="submit">
            Send OTP
          </button>

          <button onClick={redirect} className="loginRegisterButton">
            Login
          </button>
          {Error && <p className="errorMessage">{Error}</p>}
        </form>
      )}
    </>
  );
}

export default Mobile;
