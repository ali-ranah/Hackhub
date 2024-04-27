import React, { useState, useEffect } from 'react';
import { Avatar, Button } from '@material-tailwind/react';
import { EditIcon} from 'lucide-react';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { useSelector } from 'react-redux'; // Import useSelector and useDispatch
import { selectToken } from '../../State/Reducers/tokenSlice';
import { selectEmail } from '../../State/Reducers/emailSlice';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const storedEmail = localStorage.getItem('email');
  const email = useSelector(selectEmail) || storedEmail;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await AxiosRequest.post('/api/users/search', { email }, {
          headers: {
            authorization: token
          }
        });
        const data = response.data.body.user;
        if (data) {
          setUser(data);
        } else {
          console.error('Failed to fetch user:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token, email]);

  const handleEdit = () => {
  navigate("update-profile")
  };


  const user_email = user?.email || 'demo@example.com';
  const country = user?.country || 'Demo Country';
  const mobile = user?.mobile || 'Demo Mobile';
  const region = user?.region || 'Demo Region';
  const dob = user?.DOB ? new Date(user.DOB).toLocaleDateString('en-GB') : 'Demo DOB';
  const image_url = user?.image_url || 'https://randomuser.me/api/portraits/men/32.jpg';

  return (
    <div className="min-h-screen bg-[#14082c]">
      <div className="flex flex-col items-center justify-center gap-6">
        {loading ?(
          <div>Loading...</div>

        ):(
          <>
        <div className="relative mt-6">
          <Avatar src={image_url} size="lg" className="w-36 h-36" />
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-bold text-white">Email:</span>
            <span className="text-white">{user_email}</span>
          </div>
          <div>
            <span className="font-bold text-white">Country:</span>
              <span className="text-white">{country}</span>
          </div>
          <div>
            <span className="font-bold text-white">Mobile:</span>
              <span className="text-white">{mobile}</span>
          </div>
          <div>
            <span className="font-bold text-white">Region:</span>
              <span className="text-white">{region}</span>
          </div>
          <div>
            <span className="font-bold text-white">Date of Birth:</span>
            
              <span className="text-white">{dob}</span>
          </div>
  

            <Button size="md" className="mt-4 flex items-center justify-center" onClick={handleEdit}>
              <EditIcon className="w-6 h-6 mr-2" />
              <p className="relative">Edit Profile</p>
            </Button>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
