import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Spinner,
  Alert,
  IconButton,
} from '@material-tailwind/react';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { selectToken } from '../../State/Reducers/tokenSlice';
import { IoMdTrash } from 'react-icons/io';
import { toast, ToastContainer } from 'react-toastify';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const config = {
          headers: { authorization: token }
        };
        const response = await AxiosRequest.get('/api/notifications/get', config); // Replace with your API URL
        setNotifications(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      const config = {
        headers: { authorization: token }
      };
      await AxiosRequest.delete(`/api/notifications/delete/${id}`, config);
      toast.success('Notification deleted successfully');
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Failed to delete notification');
    }
  };

  if (loading) return(
    <div className="min-h-screen bg-[#14082c] flex flex-col justify-center items-center p-6">
    <Spinner className="text-white" />
    </div>
    );

  return (
    <div className="min-h-screen bg-[#14082c] flex flex-col items-center p-6">
        <ToastContainer/>
      <Typography variant="h2" className="mb-6 text-white">
        Notifications
      </Typography>
      <div className="grid grid-cols-1 gap-6 w-full max-w-7xl">
        {notifications.map((notification, index) => (
          <Card key={index} className="w-full shadow-lg hover:shadow-2xl transition-shadow duration-300 relative">
            <CardHeader  className="relative mt-[2vh]  bg-black h-16 flex items-center justify-between px-4">
              <Typography variant="h5" color="white">
               {index + 1}
              </Typography>
              <IconButton
                className="bg-red-700"
                onClick={() => handleDelete(notification.id)}
              >
                <IoMdTrash color='white' />
              </IconButton>
            </CardHeader>
            <CardBody>
              <Typography className="text-gray-800">
                {notification.message}
              </Typography>
              <div className="mt-4 text-right">
                <Typography className="text-gray-600 text-sm">
                  {new Date(notification.created_at).toLocaleString()}
                </Typography>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      {notifications.length === 0 &&(
        <div className='flex mt-[14vh] items-center justify-center text-center'>
            <Typography variant="subtitle" className='text-white'>No Notifications Found</Typography>
            </div>
        )}
    </div>
  );
};

export default Notification;
