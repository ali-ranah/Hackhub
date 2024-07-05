import React, { useState } from 'react';
import { Button, Input } from '@material-tailwind/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { useSelector } from 'react-redux';
import { selectSelectedRole } from '../../State/Reducers/roleSlice';
import { selectToken } from '../../State/Reducers/tokenSlice';
import { useNavigate } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

const Par_Update = () => {
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const storedRole = localStorage.getItem('selectedRole');
  const [loading, setLoading] = useState(false);
  const role = useSelector(selectSelectedRole) || storedRole;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    image_url: '',
    country: '',
    mobile: '',
    region: '',
    dob: '',
    C_skill: 0,
    Cpp_skill: 0,
    JAVA_skill: 0,
    PYTHON_skill: 0
  });


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
          const secureUrl = imageData.secure_url;
          console.log("Secure Url", secureUrl);
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

  const handleSliderChange = (language) => (event, newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [language]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullnameRegex = /^[a-zA-Z ]*$/;
    const mobileRegex = /^[0-9]+$/;
    if (formData.mobile && !mobileRegex.test(formData.mobile)) {
      toast.error('Mobile should only contain numbers');
      return;
    }
    
    if (formData.country && !fullnameRegex.test(formData.country)) {
      toast.error('Country should only contain alphabets');
      return;
    }

    if (formData.region && !fullnameRegex.test(formData.region)) {
      toast.error('Region should only contain alphabets');
      return;
    }
    try {
      console.log('Form Data', formData);
      if(loading) {
        toast.warning('Please Wait For Image to Upload.');
        return;
      }
      const filteredFormData = {
        ...formData,
        C_skill: formData.C_skill > 0 ? formData.C_skill : undefined,
        Cpp_skill: formData.Cpp_skill > 0 ? formData.Cpp_skill : undefined,
        JAVA_skill: formData.JAVA_skill > 0 ? formData.JAVA_skill : undefined,
        PYTHON_skill: formData.PYTHON_skill > 0 ? formData.PYTHON_skill : undefined,
      };
  
      // Remove undefined properties
      Object.keys(filteredFormData).forEach(key => {
        if (filteredFormData[key] === undefined) {
          delete filteredFormData[key];
        }
      });
      console.log('Filtered Form Data', filteredFormData);
      
      const response = await AxiosRequest.put('/api/users/profile', filteredFormData, {
        headers: {
          authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (response && response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate(`/${role.toLowerCase()}/profile`);
        }, 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response.status === 400 && error.response.data.message === 'No valid fields to update'){
        toast.warning(error.response.data.message);
       }
     else{ 
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
      }
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
          <Typography variant="h6" className="font-bold text-gray-900">Language Skills</Typography>
          {['C_skill', 'Cpp_skill', 'JAVA_skill', 'PYTHON_skill'].map((language) => (
            <div key={language} className="mt-2">
              <Typography className="text-gray-900">{language.replace('_skill', '')}</Typography>
              <Slider
                value={formData[language]}
                onChange={handleSliderChange(language)}
                aria-labelledby={`editable-slider-${language}`}
                valueLabelDisplay="auto"
                marks
                min={0}
                max={10}
              />
            </div>
          ))}
          <div className='flex justify-center items-center'>
          <Button type="submit">
            Save
          </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Par_Update;
