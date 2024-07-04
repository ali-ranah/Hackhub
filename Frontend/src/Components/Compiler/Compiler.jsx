import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { selectToken } from "../../State/Reducers/tokenSlice";
import { selectName } from "../../State/Reducers/nameSlice";
import { useParams } from "react-router-dom";
import { setEventIdAction } from "../../State/Reducers/eventIdSlice";
import { AxiosRequest } from "../Axios/AxiosRequest";
import { AiOutlineClockCircle } from "react-icons/ai";


const Compiler = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { eventId } = useParams();
  const [allowedTime, setAllowedTime] = useState(0); // Allowed time in seconds
  const [remainingTime, setRemainingTime] = useState(null); // Remaining time in seconds
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const storedToken = localStorage.getItem("token");
  const token = useSelector(selectToken) || storedToken;
  const storedName = localStorage.getItem("name");
  const name = useSelector(selectName) || storedName;
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Token',token);
    const fetchQuestion = async () => {
      try {
        const response = await AxiosRequest.get(
          `/api/events/participants/user/${eventId}`,
          {
            headers: {
              authorization: token,
            },
          }
        );
        const events = response.data.body;
        if (events.length > 0) {
          const event = events[0];
          setQuestion(event.question);
          setAllowedTime(parseTime(event.allowed_time));
          setRemainingTime(parseTime(event.allowed_time));
        }
      } catch (error) {
        console.error("Failed to fetch question:", error);
      }
    };

    fetchQuestion();
  }, [eventId, token]);
  
  useEffect(() => {
    let confirmationMessage = "Your project will be submitted. Are you sure you want to leave?";
  
    const handleBeforeUnload = async () => {
      event.preventDefault();
      return;
    };
  
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        document.title = "Submitting Project...";
        const result = window.confirm(confirmationMessage);
        if (result) {
          submitProject();
        } else {
          document.title = "Hackhub"; // Reset the title if confirmation is canceled
        }
      }
      else{
        document.title = "Submitting Project...";
        const result = window.confirm(confirmationMessage);
        if (result) {
          submitProject();
        }
        else {
          document.title = "Hackhub"
        }
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);


  useEffect(() => {
    if (remainingTime > 0) {
      const intervalId = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else if(remainingTime == 0) {
      submitProject();
    }
  }, [remainingTime]);

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60;
  };

const formatTime = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

  

  const compileCode = async () => {
    try {
      const response = await AxiosRequest.post("/api/compile/", {
        code,
        input,
        lang,
      });
      setOutput(response.data);
      setError("");
    } catch (err) {
      setError(err.response.data.error || "An error occurred");
      setOutput("");
    }
  };

  const handleCopyPaste = (e) => {
    e.preventDefault();
  };

  let submissionCount = 0;

  const submitProject = async () => {
    try {
      submissionCount++;

    // Check if submission count is more than one
    if (submissionCount > 1) {
      document.title = "Hackhub"
      return; // Exit function if already submitted more than once
    }

      const response = await AxiosRequest.post(
        `/api/events/${eventId}/projects`,
        {
          project_title: title,
          participant_or_team_name: name,
          project_writeups: code,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log("Response status:", response.data.success);
      console.log("Response message:", response.data.message);
      toast.success("Project submitted successfully");
      dispatch(setEventIdAction(null));
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message === "Project already submitted") {
          toast.error("Project already submitted");
        } else if (
          error.response.data.message ==="This event title already exists in the database, please pick a new event title!"
        ) {
          toast.error(
            "This event title already exists in the database, please pick a new event title!"
          );
        } else if (
          error.response.data.message ===
          "This event id cannot be found,please provide a valid event id"
        ) {
          toast.error(
            "This event id cannot be found,please provide a valid event id"
          );
        } else if (
          error.response.data.message === "You are not authorized to do this"
        ) {
          toast.error("You are not authorized to do this");
        } 
        else if (error.response.data.message.includes("ER_DUP_ENTRY")) {
          toast.error(error.response.data.message);
        } 
        else {
          console.error(error.response.data.error || "An error occurred");
          toast.error("Project Submission Failed");
        }
      } else {
        console.error("An error occurred:", error.message);
        toast.error("Project Submission Failed");
      }
    }
  };

  return (
    <div className="min-w-screen min-h-screen flex flex-col justify-center text-center items-center p-6 bg-[#14082c]">
      <ToastContainer />
      <div className="flex flex-col ">
      <div className="flex self-center items-center text-center gap-x-2 text-white text-lg mt-4">
            <AiOutlineClockCircle  size={22} />
            <span>{formatTime(remainingTime)}</span>
          </div>
        <p className="text-lg font-bold text-white mt-4">Question </p>
        <span className="text-lg text-start font-bold text-white mt-2 mb-2">
          {question}
        </span>
        <textarea
          onCopy={handleCopyPaste}
          onPaste={handleCopyPaste}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          size="md"
          color="black"
          placeholder="Enter Project Title"
          className="rounded-md resize-none focus:ring-0"
        ></textarea>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onCopy={handleCopyPaste}
          onPaste={handleCopyPaste}
          placeholder="Enter your code here"
          className="p-2 mt-4 bg-white border border-gray-300 rounded-md resize-none focus:ring-0 focus:border-black"
        ></textarea>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onCopy={handleCopyPaste}
          onPaste={handleCopyPaste}
          placeholder="Enter your input here (if more than one then use space in between inputs e.g. 5 10) or in next line"
          className="p-2 mt-4 bg-white border border-gray-300 rounded-md resize-none focus:ring-0 focus:border-black"
        ></textarea>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="p-2 mt-4 bg-white border border-gray-300 rounded-md"
        >
          <option value="">Select Language</option>
          <option value="C">C</option>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
        </select>
        <div className="flex flex-col items-center justify-center">
          <Button
            onClick={compileCode}
            size="lg"
            className="py-2 mt-4 text-white bg-black rounded-md hover:bg-gray-800"
          >
            Compile & Run
          </Button>
          <Button
            onClick={submitProject}
            size="lg"
            className="py-2 mt-4 text-white bg-black rounded-md hover:bg-gray-800"
          >
            Submit Project
          </Button>
        </div>
        <p className="mt-4 text-white">Output:</p>
        <div className="mt-4 w-[90vw] text-white flex flex-col items-center justify-center overflow-x-auto border-gray-300">
          {error && <div className="text-red-500">Error: {error}</div>}
          <pre className="p-2 min-w-screen rounded-md">{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default Compiler;


// import React, { useState, useEffect } from "react";
// import { Button } from "@material-tailwind/react";
// import { useDispatch, useSelector } from "react-redux";
// import { ToastContainer, toast } from "react-toastify";
// import { selectToken } from "../../State/Reducers/tokenSlice";
// import { selectName } from "../../State/Reducers/nameSlice";
// import { useParams } from "react-router-dom";
// import { setEventIdAction } from "../../State/Reducers/eventIdSlice";
// import { AxiosRequest } from "../Axios/AxiosRequest";
// import { MdTimer } from "react-icons/md";

// const Compiler = () => {
//   const [code, setCode] = useState("");
//   const [input, setInput] = useState("");
//   const [lang, setLang] = useState("");
//   const [output, setOutput] = useState("");
//   const [error, setError] = useState("");
//   const { eventId } = useParams();
//   const [title, setTitle] = useState("");
//   const [question, setQuestion] = useState("");
  // const [allowedTime, setAllowedTime] = useState("");
  // const [remainingTime, setRemainingTime] = useState(0); // Initialize remaining time in seconds
//   const storedToken = localStorage.getItem("token");
//   const token = useSelector(selectToken) || storedToken;
//   const storedName = localStorage.getItem("name");
//   const name = useSelector(selectName) || storedName;
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchQuestion = async () => {
//       try {
//         const response = await AxiosRequest.get(
//           `/api/events/participants/user/${eventId}`,
//           {
//             headers: {
//               authorization: token,
//             },
//           }
//         );
//         const events = response.data.body;
//         if (events.length > 0) {
//           setQuestion(events[0].question);
//           setAllowedTime(events[0].allowed_time);
//           const [hours, minutes] = events[0].allowed_time
//             .split(":")
//             .map(Number);
//           setRemainingTime(hours * 3600 + minutes * 60);
//         }
//       } catch (error) {
//         console.error("Failed to fetch question:", error);
//       }
//     };

//     fetchQuestion();
//   }, [eventId, token]);

//   useEffect(() => {
//     const handleBeforeUnload = (event) => {
      // const confirmationMessage =
      //   "Your project will be submitted. Are you sure you want to leave?";
      // event.preventDefault();
      // event.returnValue = confirmationMessage;
//     };

//     const handleVisibilityChange = async () => {
//       if (document.visibilityState === "hidden") {
//         const confirmationMessage =
//           "Your project will be submitted. Are you sure you want to switch tabs?";
//         document.title = "Submitting Project...";
//         await handleLeaveConfirmation(confirmationMessage);
//       } else {
//         document.title = "Your Application Title";
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   useEffect(() => {
//     let timer;
//     if (remainingTime > 0) {
//       timer = setInterval(() => {
//         setRemainingTime((prev) => prev - 1);
//       }, 1000);
//     } else if (remainingTime === 0) {
//       submitProject();
//     }

//     return () => clearInterval(timer);
//   }, [remainingTime]);

  // const formatTime = (seconds) => {
  //   const hours = Math.floor(seconds / 3600);
  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const remainingSeconds = seconds % 60;

  //   return `${hours.toString().padStart(2, "0")}:${minutes
  //     .toString()
  //     .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  // };

//   const compileCode = async () => {
//     try {
//       const response = await AxiosRequest.post("/api/compile/", {
//         code,
//         input,
//         lang,
//       });
//       setOutput(response.data);
//       setError("");
//     } catch (err) {
//       setError(err.response.data.error || "An error occurred");
//       setOutput("");
//     }
//   };

//   const handleCopyPaste = (e) => {
//     e.preventDefault();
//   };

//   const submitProject = async (e) => {
//     e && e.preventDefault(); // Prevent default form submission if called from UI
//     try {
//       // Check if title and code are empty but allow submission in special cases
//       if (!title && !code && remainingTime > 0) {
//         const confirmationMessage =
//           "Your project will be submitted. Are you sure you want to leave?";
//         const result = window.confirm(confirmationMessage);
//         if (!result) {
//           return;
//         }
//       } else if (!title || !code) {
//         toast.error("Please enter project title and code before submitting.");
//         return;
//       }

//       const response = await AxiosRequest.post(
//         `/api/events/${eventId}/projects`,
//         {
//           project_title: title,
//           participant_or_team_name: name,
//           project_writeups: code,
//         },
//         {
//           headers: {
//             authorization: token,
//           },
//         }
//       );
//       console.log("Response status:", response.data.success);
//       console.log("Response message:", response.data.message);
//       toast.success("Project submitted successfully");
//       dispatch(setEventIdAction(null));
//     } catch (error) {
//       if (error.response && error.response.data) {
//         if (error.response.data.message === "Project already submitted") {
//           toast.error("Project already submitted");
//         } else if (
//           error.response.data.message ===
//           "This event title already exists in the database, please pick a new event title!"
//         ) {
//           toast.error(
//             "This event title already exists in the database, please pick a new event title!"
//           );
//         } else if (
//           error.response.data.message ===
//           "This event id cannot be found,please provide a valid event id"
//         ) {
//           toast.error(
//             "This event id cannot be found,please provide a valid event id"
//           );
//         } else if (
//           error.response.data.message === "You are not authorized to do this"
//         ) {
//           toast.error("You are not authorized to do this");
//         } else if (error.response.data.message.includes("ER_DUP_ENTRY")) {
//           toast.error(error.response.data.message);
//         } else {
//           console.error(error.response.data.error || "An error occurred");
//           toast.error("Project Submission Failed");
//         }
//       } else {
//         console.error("An error occurred:", error.message);
//         toast.error("Project Submission Failed");
//       }
//     }
//   };

//   const handleLeaveConfirmation = async (confirmationMessage) => {
//     const result = window.confirm(confirmationMessage);
//     if (result) {
//       await submitProject();
//     }
//     return confirmationMessage;
//   };

//   return (
//     <div className="min-w-screen min-h-screen flex flex-col justify-center items-center p-6 bg-[#14082c]">
//       <ToastContainer />
//       <div className="flex flex-col items-center">
//         <div className="flex items-center text-white mb-4">
//           <MdTimer size={24} />
//           <span className="ml-2 text-lg font-bold">
//             {formatTime(remainingTime)}
//           </span>
//         </div>
//         <p className="text-lg font-bold text-white mt-4">Question</p>
//         <span className="text-lg text-start font-bold text-white mt-2 mb-2">
//           {question}
//         </span>
//         <textarea
//           onCopy={handleCopyPaste}
//           onPaste={handleCopyPaste}
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//           size="md"
//           color="black"
//           placeholder="Enter Project Title"
//           className="rounded-md resize-none focus:ring-0"
//         ></textarea>
//         <textarea
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           onCopy={handleCopyPaste}
//           onPaste={handleCopyPaste}
//           placeholder="Enter your code here"
//           className="p-2 mt-4 bg-white border border-gray-300 rounded-md resize-none focus:ring-0 focus:border-black"
//         ></textarea>
//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onCopy={handleCopyPaste}
//           onPaste={handleCopyPaste}
//           placeholder="Enter your input here (if more than one then use space in between inputs e.g. 5 10) or in next line"
//           className="p-2 mt-4 bg-white border border-gray-300 rounded-md resize-none focus:ring-0 focus:border-black"
//         ></textarea>
//         <select
//           value={lang}
//           onChange={(e) => setLang(e.target.value)}
//           className="p-2 mt-4 bg-white border border-gray-300 rounded-md"
//         >
//           <option value="">Select Language</option>
//           <option value="C">C</option>
//           <option value="C++">C++</option>
//           <option value="Java">Java</option>
//           <option value="Python">Python</option>
//         </select>
//         <Button
//           onClick={compileCode}
//           className="bg-white text-black rounded-md mt-4 py-2 px-4"
//         >
//           Compile
//         </Button>
//         <pre className="bg-white text-black mt-4 p-2 rounded-md w-full overflow-x-auto">
//           {output}
//           {error && <div className="text-red-600">{error}</div>}
//         </pre>
//         <Button
//           onClick={submitProject}
//           className="bg-white text-black rounded-md mt-4 py-2 px-4"
//         >
//           Submit Project
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Compiler;
