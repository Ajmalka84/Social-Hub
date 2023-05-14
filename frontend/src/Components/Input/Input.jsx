import React from "react";
import "./Input.css";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
function Input({ id, placeholder, type, register, errorMessage, mobile }) {
  return (
    <div className="InputBox">
      {mobile ? (
        <PhoneInput
        country={'in'}
        inputStyle={{width : "500px" , height : "40px"}}
      />
      ) : (
        <input
          id={id}
          placeholder={placeholder}
          type={type}
          {...register}
          className="loginInput"
        />
      )}
      {}<span className="errorMessage">{errorMessage}</span>
    </div>
  );
}

export default Input;
