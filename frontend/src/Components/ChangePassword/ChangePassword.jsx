import React  from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../../Components/Input/Input";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const schema = yup.object({
  password: yup.string().min(6, "Password must be atleast 6 charecters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password must be match"),
});

function ChangePassword ({mobile , setVerify}) {
  const redirect = () => {
    setVerify(false)
  }
  let resetPassword = async (data) => {
    await axios.post('http://localhost:8000/auth/reset_password', {...data, mobile: mobile}).then((result)=>{
      toast.success("password changed successfully" , {
        position: toast.POSITION.TOP_RIGHT,
        style: { top: '80px', right : '280px'},
      });
    }).catch((error)=>{
      console.log(error)
    })
  };
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
 
  return ( 
    <form onSubmit={handleSubmit(resetPassword)} className="loginBox">
      <ToastContainer />
      <h1>Reset Password</h1>
      <Input
        id="password"
        placeholder="New Password"
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

      <button className="loginButton" type="submit" >
        Reset Password
      </button>
      <button onClick={redirect} className="loginRegisterButton">
        Log into Account
      </button>
    </form>
  );
}
 
export default ChangePassword;
