import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPInput, { ResendOTP } from "otp-input-react";
import axios from "axios";
import "./Otp.css";
import ChangePassword from "../ChangePassword/ChangePassword";
import { Toaster, toast } from "react-hot-toast";
function Otp({ user }) {
  const [otpMessage, setOtpMessage] = useState(
    `We have sent OTP to ${user.mobile}. Enter the OTP below`
  );
  const [verifier, setVerifier] = useState(false);
  const [otp, setOtp] = useState();
  const [counter, setCounter] = useState(60);
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);
  const navigate = useNavigate();
  const redirect = () => {
    navigate("/login");
  };
  const resendOtp = async () => {
    try {
      await axios.post("http://localhost:8000/auth/sendOtp", {
        mobile: user.mobile,
      });
      setOtpMessage(
        `We have resend the OTP to ${user.mobile}. Enter the OTP below;`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const RegisterAccount = async () => {
    try {
      if (user?.email == undefined) {
        await axios.post("http://localhost:8000/auth/forgot_password", {
          mobile: user.mobile,
          otp: otp,
        });
        setVerifier(true)
        return;
      }
      const userDetails = await axios.post(
        "http://localhost:8000/auth/register",
        {
          username: user.username,
          email: user.email,
          password: user.password,
          mobile: user.mobile,
          otp: otp,
        }
      );
      setTimeout(() => {
        toast.success("Registration Success")
      }, 500);
      navigate("/login");
    } catch (error) {
      console.log(error);
      // setError("something went wrong. Please try again")
    }
  };

  return (
    <>
      {verifier ? (
        <ChangePassword mobile={user.mobile} />
      ) : (
        <div className="loginBox">
          <p className="otpMessage">{otpMessage}</p>

          <OTPInput
            className="otpInput"
            value={otp}
            onChange={setOtp}
            autoFocus
            OTPLength={6}
            otpType="number"
            disabled={false}
            secure
          />

          {counter > 0 ? (
            <p className="otpMessage">resend OTP in 00:{counter}</p>
          ) : (
            ""
          )}
          {counter == 0 ? (
            <p className="resendOtp" onClick={resendOtp}>
              resend OTP
            </p>
          ) : (
            <p
              className="resendOtp"
              onClick={resendOtp}
              style={{ color: "lightblue" }}
              disabled
            >
              resend OTP
            </p>
          )}

          <button className="loginButton" onClick={RegisterAccount}>
            Submit OTP
          </button>
          <button onClick={redirect} className="loginRegisterButton">
            Log into Account
          </button>
          {Error && <p className="errorMessage">{Error}</p>}
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      )}
    </>
  );
}

export default Otp;
