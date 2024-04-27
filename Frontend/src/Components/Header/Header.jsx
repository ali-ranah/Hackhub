import React from "react";
import { Navbar, Collapse, Typography, Button, Input,IconButton,} from "@material-tailwind/react";
import logo from "../../assets/logo.jpg";
import {  useSelector } from 'react-redux';
import {selectSelectedRole} from "../../State/Reducers/roleSlice"

import Profile from "./Profile";

const Header = () => {
  const [openNav, setOpenNav] = React.useState(false);
  const storedRole = localStorage.getItem('selectedRole');
  const role = useSelector(selectSelectedRole) || storedRole; 

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 958 && setOpenNav(false)
    );
  }, []);



  const navList = (
    <ul className="mt-2 mb-4 flex flex-col  gap-2 lg:mb-0 lg:mt-0  lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        color="white"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <a href={`/${role.toLowerCase()}/home`}>Home</a>
      </Typography>
      <Typography
        as="li"
        color="white"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <a href={`/${role.toLowerCase()}/hackathons`}>Hackathons</a>
      </Typography>
      <Typography
        as="li"
        color="white"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <a href={`/${role.toLowerCase()}/ai-bot`}>Ai Bot</a>
      </Typography>
      {role === "Organizer" && (
        <Typography
          as="li"
          color="white"
          className="flex items-center gap-x-2 p-1 font-medium"
        >
          <a href="/organizer/organize-hackathons">Organize Hackathons</a>
        </Typography>
      )}

    </ul>
  );

  return (
    <div className="flex-grow w-full bg-[#14082c]">
    <Navbar className="w-full flex-1 2xl:border-0 border-2 !border-b-gray-600 border-black rounded-none px-2 py-2" style={{ backgroundColor: "#14082c" }}>
      <div className="flex flex-wrap w-full items-center justify-between text-white">
        {/* <Typography
          as="a"
          href="#"
          className="mr-4 cursor-pointer py-1.5 font-medium"
        > */}
          <img src={logo} alt="Logo" className="w-16 h-14" />
        {/* </Typography> */}
        <div className="hidden lg:flex">{navList}</div>
        <div className="hidden items-center gap-x-2 lg:flex">
          <div className="relative flex w-full md:w-max">
            <Input
              type="search"
              name="search"
              color="white"
              label="Search..."
              size="lg"
              variant="outlined"
              className="focus:ring-0"
            />
          </div>
          <Button size="md" className="rounded-none bg-[#29272d] ">
            <svg
              width="13"
              height="14"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.97811 7.95252C10.2126 7.38634 10.3333 6.7795 10.3333 6.16667C10.3333 4.92899 9.84167 3.742 8.9665 2.86683C8.09133 1.99167 6.90434 1.5 5.66667 1.5C4.42899 1.5 3.242 1.99167 2.36683 2.86683C1.49167 3.742 1 4.92899 1 6.16667C1 6.7795 1.12071 7.38634 1.35523 7.95252C1.58975 8.51871 1.93349 9.03316 2.36683 9.4665C2.80018 9.89984 3.31462 10.2436 3.88081 10.4781C4.447 10.7126 5.05383 10.8333 5.66667 10.8333C6.2795 10.8333 6.88634 10.7126 7.45252 10.4781C8.01871 10.2436 8.53316 9.89984 8.9665 9.4665C9.39984 9.03316 9.74358 8.51871 9.97811 7.95252Z"
              />
              <path
                d="M13 13.5L9 9.5M10.3333 6.16667C10.3333 6.7795 10.2126 7.38634 9.97811 7.95252C9.74358 8.51871 9.39984 9.03316 8.9665 9.4665C8.53316 9.89984 8.01871 10.2436 7.45252 10.4781C6.88634 10.7126 6.2795 10.8333 5.66667 10.8333C5.05383 10.8333 4.447 10.7126 3.88081 10.4781C3.31462 10.2436 2.80018 9.89984 2.36683 9.4665C1.93349 9.03316 1.58975 8.51871 1.35523 7.95252C1.12071 7.38634 1 6.7795 1 6.16667C1 4.92899 1.49167 3.742 2.36683 2.86683C3.242 1.99167 4.42899 1.5 5.66667 1.5C6.90434 1.5 8.09133 1.99167 8.9665 2.86683C9.84167 3.742 10.3333 4.92899 10.3333 6.16667Z"
                stroke="#CFD8DC"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <div className="flex items-center gap-2 ml-10">
            <Profile/>
          </div>
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
        <div className="flex items-center gap-2 ml-8 lg:hidden">
       <Profile/>
        </div>
      </div>
      <Collapse open={openNav}>
        <div className="flex flex-col mx-auto">
          {navList}
          <div className="flex  gap-x-2  md:flex-row md:items-center">
          <div className="relative flex w-full">
            <Input
              type="search"
              name="search"
              color="white"
              label="Search..."
              size="lg"
              variant="outlined"
              className="focus:ring-0"
            />
          </div>
          <Button size="md" className="rounded-none bg-[#29272d] ">
            <svg
              width="13"
              height="14"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.97811 7.95252C10.2126 7.38634 10.3333 6.7795 10.3333 6.16667C10.3333 4.92899 9.84167 3.742 8.9665 2.86683C8.09133 1.99167 6.90434 1.5 5.66667 1.5C4.42899 1.5 3.242 1.99167 2.36683 2.86683C1.49167 3.742 1 4.92899 1 6.16667C1 6.7795 1.12071 7.38634 1.35523 7.95252C1.58975 8.51871 1.93349 9.03316 2.36683 9.4665C2.80018 9.89984 3.31462 10.2436 3.88081 10.4781C4.447 10.7126 5.05383 10.8333 5.66667 10.8333C6.2795 10.8333 6.88634 10.7126 7.45252 10.4781C8.01871 10.2436 8.53316 9.89984 8.9665 9.4665C9.39984 9.03316 9.74358 8.51871 9.97811 7.95252Z"
              />
              <path
                d="M13 13.5L9 9.5M10.3333 6.16667C10.3333 6.7795 10.2126 7.38634 9.97811 7.95252C9.74358 8.51871 9.39984 9.03316 8.9665 9.4665C8.53316 9.89984 8.01871 10.2436 7.45252 10.4781C6.88634 10.7126 6.2795 10.8333 5.66667 10.8333C5.05383 10.8333 4.447 10.7126 3.88081 10.4781C3.31462 10.2436 2.80018 9.89984 2.36683 9.4665C1.93349 9.03316 1.58975 8.51871 1.35523 7.95252C1.12071 7.38634 1 6.7795 1 6.16667C1 4.92899 1.49167 3.742 2.36683 2.86683C3.242 1.99167 4.42899 1.5 5.66667 1.5C6.90434 1.5 8.09133 1.99167 8.9665 2.86683C9.84167 3.742 10.3333 4.92899 10.3333 6.16667Z"
                stroke="#CFD8DC"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          </div>
        </div>
      </Collapse>
    </Navbar>
    </div>
  );
};

export default Header;
