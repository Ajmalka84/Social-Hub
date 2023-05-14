import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";
import Input from "../../Components/Input/Input";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import OTPInput from "otp-input-react";
import { toast, Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const schema = yup.object({
  username: yup.string().required("Username required."),
  email: yup.string().required("Email required.").email("Email is not valid"),
  mobile: yup
    .string()
    .required("Mobile Number required")
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Mobile Number is not Valid"
    ),
  password: yup.string().min(6, "Password must be atleast 6 charecters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password must be match"),
});
function Register() {
  const [form, setForm] = useState(null);
  const [Error, setError] = useState("");
  const [verify, setVerify] = useState(false);
  const [otp, setOtp] = useState();
  const [userData, setUserData] = useState({});
  const Navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function onCaptchVerify(data) {
    console.log(data);
    // if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup(data);
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
  async function onSignup(data) {
   setUserData({...data})
   await axios
    .post("http://localhost:8000/auth/check-mobile", {
      email: userData.email,
      mobile: userData.mobile, 
    }).then((result)=>{
      console.log(result.data)
      if(!result.data.status){
        onCaptchVerify(data);
        const appVerifier = window.recaptchaVerifier;
        const formatPh = "+91" + data.mobile;
    
        signInWithPhoneNumber(auth, formatPh, appVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            setVerify(true);
            toast.success("OTP sended successfully!");
          })
          .catch((error) => {
            // toast.error("invalid mobile number");
            console.log(error);
          });
      }else{
        toast.error("Email or Mobile already Used.")
      }
    })
  }

  function onOTPVerify() {
    console.log(userData)
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        console.log("its confirmed");
        
        await axios
          .post("http://localhost:8000/auth/register", {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            mobile: userData.mobile,
          })
          .then((result) => {
            console.log(result.data);
            window.recaptchaVerifier.recaptcha.reset()
            setTimeout(() => {
              toast.success("Registration Success");
            }, 500);
            Navigate("/login");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        window.recaptchaVerifier.recaptcha.reset()
        toast.error("invalid otp");
        console.log(err);
      });
  }
  // const [counter, setCounter] = useState(60);
  // useEffect(() => {
  //   const timer =
  //     counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
  //   return () => clearInterval(timer);
  // }, [counter]);

  const formSubmit = async (data) => {
    console.log(data);
    await axios
      .post("http://localhost:8000/auth/sendOtp", { ...data })
      .then((result) => {
        setForm(data);
        setVerify(true);
      })
      .catch((result) => {
        setError(result.message);
      });
  };

  const navigate = useNavigate();
  const redirect = () => {
    navigate("/login");
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="logoRegister">Social Hub</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Social Hub.
          </span>
        </div>
        <div className="loginRight">
          {verify ? (
            <div className="loginBox">
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
              {/* {counter > 0 ? (
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
              )} */}
              <button className="loginButton" onClick={onOTPVerify}>
                Submit OTP
              </button>
              <button onClick={redirect} className="loginRegisterButton">
                Log into Account
              </button>
            </div>
          ) : (
            <>
              <Toaster toastOptions={{ duration: 4000 }} />
              <div id="recaptcha-container"></div>
              <form onSubmit={handleSubmit(onSignup)} className="loginBox">
                <Input
                  id="username"
                  placeholder="Username"
                  type="text"
                  register={{ ...register("username") }}
                  errorMessage={errors.username?.message}
                />
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  register={{ ...register("email") }}
                  errorMessage={errors.email?.message}
                />
                <Input
                  id="mobile"
                  placeholder="Mobile"
                  type="mobile"
                  register={{ ...register("mobile") }}
                  errorMessage={errors.mobile?.message}
                />
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  register={{ ...register("password") }}
                  errorMessage={errors.password?.message}
                />
                <Input
                  id="confirmPassword"
                  placeholder="confirm Password"
                  type="password"
                  register={{ ...register("confirmPassword") }}
                  errorMessage={errors.confirmPassword?.message}
                />

                <button className="loginButton" type="submit">
                  Sign Up
                </button>
                <button onClick={redirect} className="loginRegisterButton">
                  Log into Account
                </button>
                {Error && <p className="errorMessage">{Error}</p>}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;

