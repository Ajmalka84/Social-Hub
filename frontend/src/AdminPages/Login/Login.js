import React, { useContext, useState } from 'react';
import './Login.css';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
// import AxiosAdminJwt from '../../Axios/AxiosAdmin';
const AdminLogin = () => {
  // const axiosAdmin = AxiosAdminJwt()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()
  const {AdminAuth , setAdminAuth} = useContext(AuthContext)
  const handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  
  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/admin/login", {email : email , password : password})
      setAdminAuth(prev => ({...prev,...res.data}));
      localStorage.setItem('AdminAccessToken' , res.data.adminToken)
      navigate('/admin' , {replace : true})
    } catch (error) {
      console.log(error)
    }
  };
  
  return (
    <div className="login-container">
      <form className='adminForm' onSubmit={handleSubmit}>
        <h1 className='adminHeading'>Admin Login</h1>
        <div className="form-group">
          <label htmlFor="email" className='adminLabel'>Email address</label>
          <input
            type="email"
            name="email"
            id="email"
            className='inputEmail'
            placeholder="Enter email"
            value={email}
            onChange={handleInputChange}
            required
          />
          {/* {validated && !email && (
            <div className="invalid-feedback">Please enter an email</div>
          )} */}
        </div>
        <div className="form-group">
          <label htmlFor="password" className='adminLabel'>Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className='inputPassword'
            placeholder="Password"
            value={password}
            onChange={handleInputChange}
            required
          />
          {/* {validated && !password && (
            <div className="invalid-feedback">Please enter a password</div>
          )} */}
        </div>
        <button type="submit" className="adminSubmitButton">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
