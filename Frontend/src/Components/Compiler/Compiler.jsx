import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { selectToken } from "../../State/Reducers/tokenSlice";
import { selectName } from "../../State/Reducers/nameSlice";
import { useParams } from "react-router-dom";
import { setEventIdAction } from "../../State/Reducers/eventIdSlice";
import { AxiosRequest } from "../Axios/AxiosRequest";

const Compiler = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { eventId } = useParams();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const storedToken = localStorage.getItem("token");
  const token = useSelector(selectToken) || storedToken;
  const storedName = localStorage.getItem("name");
  const name = useSelector(selectName) || storedName;
  const dispatch = useDispatch();

  useEffect(() => {
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
          setQuestion(events[0].question);
        }
      } catch (error) {
        console.error("Failed to fetch question:", error);
      }
    };

    fetchQuestion();
  }, [eventId, token]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = confirmationMessage; // Standard for most browsers
      submitProject();
      return confirmationMessage;
    };

    // Add beforeunload event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Prevent tab switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        document.title = "Submitting Project...";
        submitProject();
      } else {
        document.title = "Your Application Title"; // Reset the title if needed
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // Clean up event listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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

  const submitProject = async () => {
    try {
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
