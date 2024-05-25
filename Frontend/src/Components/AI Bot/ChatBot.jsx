import React, { useState } from 'react';
import { AxiosRequest } from '../Axios/AxiosRequest';
import { Button, Input } from '@material-tailwind/react';
import { MessageCircleMoreIcon } from 'lucide-react';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) {
      return;
    }

    try {
      const response = await AxiosRequest.post('/api/ask/', { message: input });
      const data = response.data;
      setMessages([...messages, { text: input, isUser: true }, { text: data.response, isUser: false }]);
      setInput('');
    } catch (error) {
      console.error('API Error:', error);
      // Handle error (e.g., display an error message to the user)
    }
  };

  return (
      <div className="flex flex-col w-full h-full  bg-[#14082c]">
        <div className="flex flex-col md:p-20 p-10 overflow-y-auto h-screen">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`rounded-lg px-4 py-2 max-w-xs ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4  flex w-screen items-center justify-center  border-t border-black">
          <div className="flex md:w-[88vw] w-[80vw]  space-x-6">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onClick={(e) => e.key === 'Enter' && sendMessage()}
              label="Type your message..."
              size="md"
              color='white'
              className="focus:ring-0 "
            />
            <Button onClick={sendMessage} color="white"  size="sm" >
              <MessageCircleMoreIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
  );
};

export default ChatBot;
