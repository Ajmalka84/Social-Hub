import React from "react";
import "./Input.css";
function Input({id, placeholder, type, register, errorMessage }) {
  
  return (
    <div className="InputBox">
      <input
        id={id}
        placeholder={placeholder}
        type={type}
        {...register}
        className="loginInput"
      />
      <span className="errorMessage">{errorMessage}</span>
    </div>
  );
}

export default Input;
