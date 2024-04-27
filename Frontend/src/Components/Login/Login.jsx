import React, { useState } from 'react';
import { Button, Input,Select,Typography } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { toast,ToastContainer } from 'react-toastify';
import { setEmailAction } from '../../State/Reducers/emailSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRole } from '../../State/Reducers/roleSlice'; 
import { setTokenAction } from '../../State/Reducers/tokenSlice';
import { setNameAction } from '../../State/Reducers/nameSlice';
import {  FaEye, FaEyeSlash } from 'react-icons/fa6';

const Login = ({ toggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      dispatch(setEmailAction(email)); // Set email in Redux store

      const response = await AxiosRequest.post('/api/auth/login', { email, password });
      
      // Handle response
      const token = response.data.body.token;
      const name = response.data.body.name;
      const role = response.data.body.role;
      console.log("role" , role);
      console.log("token" , token);
      console.log("Name",name);
      dispatch(setSelectedRole(role));
      dispatch(setTokenAction(token));
      dispatch(setNameAction(name));
      console.log('Login successful:', response.data);
      toast.success('Login successful');
       setTimeout(async () => {

        if (role === 'Organizer') {
          navigate('/organizer/Home');
        } else if (role === 'Participant') {
          navigate('/participant/home');
        } 
      }, 500);


      // Redirect or show success message
    } catch (error) {
      // Handle error
      console.error('Error during login:', error.message);
      if (error.response && error.response.status === 400) {
        toast.error('Invalid Email or Password');
      } else {
        toast.error('Login failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            type="email"
            value={email}
            label='Email Address'
            onChange={(e) => setEmail(e.target.value)}
            required   
            size="md"
            color='black'
            variant='outlined'
            className="focus:ring-0"
          />
 <div className="relative">
  <Input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    label="Password"
    required
    color="black"
    size="md"
    className="focus:ring-0 pr-10"
  />
  <div
    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </div>
</div>
 {/* <Select
variant="outlined"       
label="Select Role"
  value={role}
  onChange={(value) => dispatch(setSelectedRole(value))}
  size="md"
  className="focus:ring-0"
>
  {roleOptions.map((option) => (
    <Select.Option key={option} value={option}>
      {option}
    </Select.Option>
  ))}
</Select> */}
          <Button type="submit" color="black" size="lg">
            Sign in
          </Button>
        </form>
        <div className="text-center">
          <span className="text-gray-600">Don't have an account?</span>{' '}
          <a href="/signup" onClick={toggleForm} className="font-medium text-[#623fb1] hover:text-[#14082c]">
            Sign up instead
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
