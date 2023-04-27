import React, { useContext, useState } from 'react';
import './Login.css';
import AxiosAdminJwt from '../../Axios/AxiosAdmin';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const AxiosAdmin = AxiosAdminJwt()
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
      const res = await AxiosAdmin.post('login', {email : email , password : password})
      setAdminAuth(prev => ({...prev,...res.data}));
      navigate('/admin')
    } catch (error) {
      console.log(error)
    }

    // if (form.checkValidity() === false) {
    //   event.stopPropagation();
    //   setValidated(true);
    // } else {
    //   setValidated(false);
    //   alert(`Email: ${email} Password: ${password}`);
    // }
  };

  return (
    <div className="login-container">
      <form className='adminForm' onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            name="email"
            id="email"
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
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
