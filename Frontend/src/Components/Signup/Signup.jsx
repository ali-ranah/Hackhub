import React, { useState } from 'react';
import { Button, Input,Typography,Select } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  FaEye, FaEyeSlash } from 'react-icons/fa6';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRole } from '../../State/Reducers/roleSlice'; 

const Signup = ({ toggleForm }) => {
  const [fullname, setfullName] = useState('');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [DOB, setDOB] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const storedRole = localStorage.getItem('selectedRole');
  const role = useSelector((state) => state.role.selectedRole) || storedRole || 'Participant';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const roleOptions = ['Participant', 'Organizer'];


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email address');
      return;
    }

    const fullnameRegex = /^[a-zA-Z ]*$/;
  if (!fullnameRegex.test(fullname)) {
    toast.error('Fullname should not contain numbers');
    return;
  }

    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit');
      return;
    }
  
    // Confirm password match
    if (confirmPassword !== password) {
      toast.error('Passwords do not match');
      return;
    }
  
    try {
      const response = await AxiosRequest.post('/api/auth/register', { fullname, username, email, mobile, country, region, DOB, password,role });
  
      // Handle response
      console.log('Registration successful:', response.data);
      toast.success('Registration successful');
      setTimeout(() => {
        navigate("/login")
  
      }, 1000);
    } catch (error) {
      // Handle error
      console.error('Error during registration:', error.message);
  
      if (error.response && error.response.status === 409) {
        toast.error('Account with this email already exists, try another email address');
      } else {
        toast.error('Registration failed');
      }
    }
  
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            type="text"
            value={fullname}
            onChange={(e) => setfullName(e.target.value)}
            label="Full Name"
            required
            color="black"
            size="md"
            className="focus:ring-0"

/>
<Input
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            label="Username"
            required
            color="black"
            size="md"
            className="focus:ring-0"

/>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email address"
            required
            color="black"
            size="md"
            className="focus:ring-0"
          />
          <Input
            type='tel'
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            label="Mobile"
            required
            color="black"
            size="md"
            className="focus:ring-0"

/>
<Input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            label="Country"
            required
            color="black"
            size="md"
            className="focus:ring-0"

/>
<Input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            label="Region"
            required
            color="black"
            size="md"
            className="focus:ring-0"

/>
<Input
            type='date'
            value={DOB}
            onChange={(e) => setDOB(e.target.value)}
            label="Date of Birth"
            required
            color="black"
            size="md"
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


          <Typography
        variant="small"
        color="gray"
        className="mt-2 flex items-center gap-1 font-normal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="-mt-px h-6 w-6"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
        Use at least 8 characters, one uppercase, one lowercase and one number.
      </Typography>
      <div className="relative">

          <Input
    type={showConfirmPassword ? "text" : "password"}
    value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Confirm Password"
            required
            color="black"
            size="md"
            className="focus:ring-0"
          />
           <div
    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
  </div>
</div>
          <Select
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
</Select>


          <Button type="submit" color="black" size="lg">
            Sign up
          </Button>
        </form>
        <div className="text-center">
          <span className="text-gray-600">Already have an account?</span>{' '}
          <a href="/login" onClick={toggleForm} className="font-medium text-[#623fb1] hover:text-[#14082c]">
            Sign in instead
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
