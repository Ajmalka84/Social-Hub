import React, { useEffect, useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import OTPInput, { ResendOTP } from "otp-input-react";
import { toast, Toaster } from "react-hot-toast";
import ChangePassword from "../ChangePassword/ChangePassword";
function Mobile({ setVerify }) {
  const [mobile, setMobile] = useState("");
  const [verified, setVerified] = useState(false);
  const [otp, setOtp] = useState();
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const redirect = () => {
    setVerify(false);
  };
  function onCaptchVerify() {
    // if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": (response) => {
            toast.error("something went wrong...try again");
            console.log(response);
          },
        },
        auth
      );
    // }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;
    console.log(appVerifier)
    const formatPh = "+" + mobile;
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        // toast.error('invalid mobile number')
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        console.log("its confirmed");
        await axios
          .post("http://localhost:8000/auth/forgot_password", {
            mobile: mobile,
          })
          .then((result) => {
            console.log(result.data);
            setVerified(true);
            window.recaptchaVerifier.recaptcha.reset()
          })
          .catch((error) => {
            window.recaptchaVerifier.recaptcha.reset()
            console.log(error);
          });
      })
      .catch((err) => {
        toast.error("invalid otp");
        console.log(err);
      });
  }
  const [counter, setCounter] = useState(60);
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <>
      {verified ? (
        <ChangePassword mobile={mobile} setVerify={setVerify} />
      ) : (
        <div className="loginBox">
          <Toaster toastOptions={{ duration: 4000 }} />
          <div id="recaptcha-container"></div>
          {!showOTP ? (
            <>
              <h1>Forgot Password?</h1>
              <p style={{ alignSelf: "center", marginBottom: "20px" }}>
                Enter your 10 digit Mobile Number and Send OTP
              </p>
              <PhoneInput
                country={"in"}
                value={mobile}
                onChange={(value) => setMobile(value)}
                inputStyle={{ width: "500px", height: "40px" }}
              />
              <button
                className="loginButton"
                onClick={onSignup}
                style={{ marginTop: "30px", marginBottom: "40px" }}
              >
                Send OTP
              </button>
              <button className="loginRegisterButton" onClick={redirect}>
                Login
              </button>{" "}
            </>
          ) : (
            <>
              {/* <p className="otpMessage">{otpMessage}</p> */}
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
                <p className="resendOtp">resend OTP</p>
              ) : (
                <p
                  className="resendOtp"
                  style={{ color: "lightblue" }}
                  disabled
                >
                  resend OTP
                </p>
              )}
              <button className="loginButton" onClick={onOTPVerify}>
                Submit OTP
              </button>
              <button onClick={redirect} className="loginRegisterButton">
                Log into Account
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Mobile;
