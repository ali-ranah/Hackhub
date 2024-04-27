import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CloudinaryContext } from 'cloudinary-react'; // Import CloudinaryContext
import { Provider } from 'react-redux'; // Import the Provider component
import { ThemeProvider } from "@material-tailwind/react";
import Store from './State/Store.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={Store}>
      <ThemeProvider>
      <CloudinaryContext cloudName="dnircbhck"> 
        <App />
        </CloudinaryContext>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

