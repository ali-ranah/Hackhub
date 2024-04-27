import React from 'react';
import { View, Text,StatusBar } from 'react-native';
import { name as appName } from './app.json';
import Navigation from './Navigation';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux'; // Import the Provider component
import Store from './State/Store.jsx';


const App=()=> {
  return (
    <Provider store={Store}>
              <StatusBar  />
      <Navigation/>
    </Provider>
  );
}


export default App;