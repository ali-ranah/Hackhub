import React, { useState,useEffect } from "react";
import {ChevronDown, ChevronUp, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Avatar } from "@material-tailwind/react";
import { useDispatch,useSelector } from "react-redux";
import {setSelectedRole,selectSelectedRole} from "../../State/Reducers/roleSlice"
import { selectToken } from '../../State/Reducers/tokenSlice';
import { selectEmail } from '../../State/Reducers/emailSlice';
import { setToken } from "../../State/Reducers/tokenSlice";
import { setEmail } from "../../State/Reducers/emailSlice";
import { setName } from "../../State/Reducers/nameSlice";
import { Link, useNavigate } from "react-router-dom";
import {toast,ToastContainer} from "react-toastify"
import { AxiosRequest } from "../Axios/AxiosRequest";

const Profile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const storedRole = localStorage.getItem('selectedRole');
  const role = useSelector(selectSelectedRole) || storedRole; 
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;
  const storedEmail = localStorage.getItem('email');
  const email = useSelector(selectEmail) || storedEmail;
  const [imagePath,setImagePath] = useState(null);
  const dispatch = useDispatch();
const navigate = useNavigate();
const [loading, setLoading] = useState(true); // Add loading state

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      toast.success("Logout successful");
      setTimeout(async () => {
        try {
          dispatch(setSelectedRole(null));
          dispatch(setToken(null));
          dispatch(setEmail(null));
          dispatch(setName(null));

          navigate("/login");
        } catch (error) {
          console.error("Failed to logout:", error);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // Start loading

      try {
        const response = await AxiosRequest.post('/api/users/search', { email }, {
          headers: {
            authorization: token
          }
        });
        const data = response.data.body.user;
        if (data) {
          setImagePath(data.image_url);
        } else {
          console.error('Failed to fetch user:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchUser();
  }, [token, email]);


  const HandleProfileScreen = ()=>{
    navigate(`/${role.toLowerCase()}/profile`);
  }


  const image_url = imagePath || 'https://randomuser.me/api/portraits/men/32.jpg';

  return (
    <>
      <ToastContainer />
      <div className="flex gap-2 items-center">
      <Link to={`/${role.toLowerCase()}/notification`}>
      <IoMdNotificationsOutline className="w-8 h-8" />
        </Link>
        {loading ? (
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        ) : (
          <Avatar
            src={image_url}
            size="md"
            color="amber"
            className="ml-2"
          />
        )}
      </div>

      <DropdownMenu onOpenChange={(isOpen) => setIsDropdownOpen(isOpen)}>
        <DropdownMenuTrigger asChild>
          {isDropdownOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" w-[10rem]">
          <DropdownMenuItem onClick={HandleProfileScreen}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Profile;