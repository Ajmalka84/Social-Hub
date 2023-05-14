import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Login.css";
import { AuthContext } from "../../context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../../Components/Input/Input";
import Mobile from "../../Components/EnterMobile/Mobile";
const schema = yup.object({
  email: yup.string().required("Email required.").email("Email is not valid"),
  password: yup.string().min(6, "Password must be atleast 6 charecters"),
});

function Login() {
  const [verify, setVerify] = useState(false);
  // const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const { Auth, setAuth, persist } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const formSubmit = async (data) => {
    await axios
      .post(
        "http://localhost:8000/auth/login",
        { ...data },
        {
          withCredentials: true,
        }
      )
      .then((result) => {
        // dispatch({ type: "LOGIN_SUCCESS", payload: result.data });
        setAuth((prevAuth) => ({ ...prevAuth , ...result.data}));
        navigate(from, { replace : true });
      })
      .catch((error) => {
        toast.error(`${error.response.data}`)
        console.log(error);
      });

    // if (user !== null) {
    //   // it is coming false when we first click on the submit button because user is taking time to get updated when it recieves value from the dispatch funtion from loginCall()
    // } else {
    //   console.log(error); // 28-03-2023 : when i login , first it shows a false and then only it goes to the home page , and i think the error is here
    // }

    // when i used the promise instead of callback the issue of false was solved
  };

  const redirect = () => {
    navigate("/register");
  };
  const loginForgot = () => {
    setVerify(true);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]); 

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="logoLogin">Social Hub</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Social Hub.
          </span>
        </div>
        <div className="loginRight">
          {verify ? (
            <Mobile setVerify={setVerify} />
          ) : (
            
            <form onSubmit={handleSubmit(formSubmit)} className="loginBox">
              
              <Input
                id="email"
                placeholder="Email"
                type="email"
                register={{ ...register("email") }}
                errorMessage={errors.email?.message}
              />
              <Input
                id="password"
                placeholder="Password"
                type="password"
                register={{ ...register("password") }}
                errorMessage={errors.password?.message}
              />
              <button className="loginButton" type="submit">
                Log In
              </button>
              <span className="loginForgot" onClick={loginForgot}>
                Forgot Password ?
              </span>
              <button onClick={redirect} className="loginRegisterButton">
                Create a New Account
              </button>
            </form>
          )}
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      </div>
    </div>
  );
}

export default Login;

// 25-03-2023 Note : when setVerify is given in place of onclick of the button automatically <Mobile> tag worked first.
