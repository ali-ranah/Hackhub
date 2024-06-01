import React, { useState, useEffect } from 'react';
import { Button, Input } from '@material-tailwind/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { useSelector } from 'react-redux'; // Import useSelector and useDispatch
import {selectSelectedRole} from "../../State/Reducers/roleSlice"
import { selectToken } from '../../State/Reducers/tokenSlice';
import { useNavigate } from 'react-router-dom';

const Update = () => {
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const storedRole = localStorage.getItem('selectedRole');
  const role = useSelector(selectSelectedRole) || storedRole; 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    image_url: '',
    country: '',
    mobile: '',
    region: '',
    dob: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === 'image_url') {
      const file = files[0];
      if (!file) return; // Exit early if no file is selected
      setLoading(true);
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'ml_default');
        data.append('cloud_name', 'dnircbhck');
        try {
          const response = await fetch('https://api.cloudinary.com/v1_1/dnircbhck/image/upload', {
            method: 'POST',
            body: data,
          });
          const imageData = await response.json();
          const secureUrl = imageData.secure_url; // Access the secure_url property
          console.log("Secure Url",secureUrl);
          setFormData({
            ...formData,
            image_url: secureUrl,
          });
          setLoading(false);
        } catch (error) {
          console.error('Error uploading image:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
        toast.error('Please select an image in JPEG or PNG format');
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Image Url',formData.image_url)
      if(loading) {
        toast.warning('Please Wait For Image to Upload.');
        return;
      }
      const response = await AxiosRequest.put('/api/users/profile', formData, {
        headers: {
          authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
         navigate(`/${role.toLowerCase()}/profile`);
        }, 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#14082c] py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Update Profile</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            type="file"
            name="image_url"
            onChange={handleChange}
            label="Profile Picture"
            color="black"
            size="md"
            className="focus:ring-0"
          />
          <Input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            label="Country"
            color="black"
            size="md"
            className="focus:ring-0"
          />
          <Input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            label="Mobile"
            color="black"
            size="md"
            className="focus:ring-0"
          />
          <Input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            label="Region"
            color="black"
            size="md"
            className="focus:ring-0"
          />
          <Input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            label="Date Of Birth"
            color="black"
            size="md"
            className="focus:ring-0"
          />
          <div className='flex items-center justify-center'>
          <Button type="submit">
            Save
          </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;